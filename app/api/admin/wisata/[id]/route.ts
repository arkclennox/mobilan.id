import { NextRequest, NextResponse } from 'next/server';
import { updateWisata, deleteWisata, setWisataCategories } from '@/lib/queries/wisata';
import { supabaseAdmin } from '@/lib/supabase';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { category_ids, ...payload } = body;

    const wisata = await updateWisata(params.id, payload);
    if (category_ids !== undefined) {
      await setWisataCategories(params.id, category_ids);
    }
    return NextResponse.json(wisata);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await deleteWisata(params.id);
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const { data } = await supabaseAdmin
    .from('wisata_places')
    .select(`*, categories:wisata_place_categories(wisata_category_id), activity_offers(*)`)
    .eq('id', params.id)
    .single();
  return NextResponse.json(data);
}
