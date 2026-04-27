import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

function slugify(str: string) {
  return str.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function parseBool(v: unknown, fallback: boolean): boolean {
  if (v === true || v === 'true' || v === '1' || v === 'ya' || v === 'yes') return true;
  if (v === false || v === 'false' || v === '0' || v === 'tidak' || v === 'no') return false;
  return fallback;
}

export async function POST(req: NextRequest) {
  try {
    const { rows } = await req.json() as { rows: Record<string, unknown>[] };

    const [{ data: cities }, { data: existingSlugs }] = await Promise.all([
      supabaseAdmin.from('cities').select('id, name, slug'),
      supabaseAdmin.from('accommodations').select('slug'),
    ]);

    const cityBySlug = new Map<string, string>();
    const cityByName = new Map<string, string>();
    (cities || []).forEach(c => {
      cityBySlug.set(c.slug, c.id);
      cityByName.set(c.name.toLowerCase(), c.id);
    });

    const usedSlugs = new Set((existingSlugs || []).map(r => r.slug));

    const toInsert: Record<string, unknown>[] = [];
    const errors: { row: number; error: string }[] = [];

    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      if (!r.name) { errors.push({ row: i + 2, error: 'Kolom "name" wajib diisi' }); continue; }
      if (!r.provider) { errors.push({ row: i + 2, error: 'Kolom "provider" wajib diisi' }); continue; }
      if (!r.affiliate_url) { errors.push({ row: i + 2, error: 'Kolom "affiliate_url" wajib diisi' }); continue; }

      let base = String(r.slug || slugify(String(r.name)));
      let slug = base;
      let n = 2;
      while (usedSlugs.has(slug)) slug = `${base}-${n++}`;
      usedSlugs.add(slug);

      const cityKey = String(r.city_slug || '').toLowerCase();
      const cityId = cityBySlug.get(cityKey) || cityByName.get(cityKey) || null;

      toInsert.push({
        name: String(r.name),
        slug,
        city_id: cityId,
        provider: String(r.provider),
        affiliate_url: String(r.affiliate_url),
        area: r.area ? String(r.area) : null,
        short_description: r.short_description ? String(r.short_description) : null,
        image_url: r.image_url ? String(r.image_url) : null,
        property_type: r.property_type ? String(r.property_type) : null,
        price_label: r.price_label ? String(r.price_label) : null,
        address_short: r.address_short ? String(r.address_short) : null,
        is_published: parseBool(r.is_published, true),
      });
    }

    let inserted = 0;
    const insertErrors: { row: number; error: string }[] = [];

    for (let i = 0; i < toInsert.length; i += 100) {
      const chunk = toInsert.slice(i, i + 100);
      const { data, error } = await supabaseAdmin.from('accommodations').insert(chunk).select('id');
      if (error) insertErrors.push({ row: i + 2, error: error.message });
      else inserted += data?.length || 0;
    }

    return NextResponse.json({ inserted, errors: [...errors, ...insertErrors], total: rows.length });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Error' }, { status: 500 });
  }
}
