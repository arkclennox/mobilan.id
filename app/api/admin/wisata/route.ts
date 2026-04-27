import { NextRequest, NextResponse } from 'next/server';
import { createWisata, setWisataCategories } from '@/lib/queries/wisata';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const page = parseInt(sp.get('page') || '1');
  const limit = parseInt(sp.get('limit') || '50');
  const offset = (page - 1) * limit;
  const q = sp.get('q') || '';
  const status = sp.get('status') || 'all';
  const featured = sp.get('featured') || 'all';
  const kota = sp.get('kota') || '';
  const sort = sp.get('sort') || 'created_at';
  const dir = sp.get('dir') || 'desc';

  const validSort = ['name', 'created_at'].includes(sort) ? sort : 'created_at';
  const ascending = dir === 'asc';

  let query = supabaseAdmin
    .from('wisata_places')
    .select('id, name, slug, is_published, is_featured, created_at, city:cities(id, name), offers:activity_offers(count)', { count: 'exact' });

  if (q) query = query.ilike('name', `%${q}%`);
  if (status === 'published') query = query.eq('is_published', true);
  else if (status === 'draft') query = query.eq('is_published', false);
  if (featured === 'yes') query = query.eq('is_featured', true);
  else if (featured === 'no') query = query.eq('is_featured', false);
  if (kota) query = query.eq('city_id', kota);

  query = query.order(validSort, { ascending }).range(offset, offset + limit - 1);

  const { data, error, count } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data: data || [], count, page, totalPages: Math.ceil((count || 0) / limit) });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { category_ids, ...payload } = body;

    const wisata = await createWisata(payload);
    if (category_ids?.length) {
      await setWisataCategories(wisata.id, category_ids);
    }
    return NextResponse.json(wisata);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
