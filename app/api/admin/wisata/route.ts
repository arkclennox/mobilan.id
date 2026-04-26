import { NextRequest, NextResponse } from 'next/server';
import { createWisata, setWisataCategories, getAllWisataAdmin } from '@/lib/queries/wisata';

export async function GET(req: NextRequest) {
  const page = parseInt(req.nextUrl.searchParams.get('page') || '1');
  const limit = parseInt(req.nextUrl.searchParams.get('limit') || '20');
  const { data, count } = await getAllWisataAdmin(page, limit);
  return NextResponse.json({ data, count, page, totalPages: Math.ceil((count || 0) / limit) });
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
