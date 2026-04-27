import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const page = parseInt(sp.get('page') || '1');
  const limit = parseInt(sp.get('limit') || '50');
  const offset = (page - 1) * limit;
  const q = sp.get('q') || '';
  const status = sp.get('status') || 'all';
  const provider = sp.get('provider') || '';
  const sort = sp.get('sort') || 'created_at';
  const dir = sp.get('dir') || 'desc';

  const validSort = ['name', 'created_at'].includes(sort) ? sort : 'created_at';
  const ascending = dir === 'asc';

  let query = supabaseAdmin
    .from('accommodations')
    .select('*, city:cities(name, slug)', { count: 'exact' });

  if (q) query = query.ilike('name', `%${q}%`);
  if (status === 'published') query = query.eq('is_published', true);
  else if (status === 'draft') query = query.eq('is_published', false);
  if (provider) query = query.eq('provider', provider);

  query = query.order(validSort, { ascending }).range(offset, offset + limit - 1);

  const { data, error, count } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data: data || [], count, page, totalPages: Math.ceil((count || 0) / limit) });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { data, error } = await supabaseAdmin.from('accommodations').insert(body).select().single();
    if (error) throw error;
    return NextResponse.json(data);
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Error' }, { status: 500 });
  }
}
