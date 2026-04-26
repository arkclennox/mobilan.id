import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { data, error } = await supabaseAdmin
      .from('wisata_accommodations')
      .insert(body)
      .select('id, accommodation_id, distance_text, sort_order, accommodation:accommodations(*)')
      .single();
    if (error) throw error;
    return NextResponse.json(data);
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Error' }, { status: 500 });
  }
}
