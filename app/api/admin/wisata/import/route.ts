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
      supabaseAdmin.from('wisata_places').select('slug'),
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

      let base = String(r.slug || slugify(String(r.name)));
      let slug = base;
      let n = 2;
      while (usedSlugs.has(slug)) slug = `${base}-${n++}`;
      usedSlugs.add(slug);

      const cityKey = String(r.city_slug || '').toLowerCase();
      const cityId = cityBySlug.get(cityKey) || cityByName.get(cityKey) || null;

      const lat = r.latitude ? parseFloat(String(r.latitude)) : null;
      const lng = r.longitude ? parseFloat(String(r.longitude)) : null;

      toInsert.push({
        name: String(r.name),
        slug,
        city_id: cityId,
        short_description: r.short_description ? String(r.short_description) : null,
        full_description: r.full_description ? String(r.full_description) : null,
        address: r.address ? String(r.address) : null,
        latitude: isNaN(lat!) ? null : lat,
        longitude: isNaN(lng!) ? null : lng,
        opening_hours: r.opening_hours ? String(r.opening_hours) : null,
        ticket_price_text: r.ticket_price_text ? String(r.ticket_price_text) : null,
        best_time_to_visit: r.best_time_to_visit ? String(r.best_time_to_visit) : null,
        suitable_for: r.suitable_for ? String(r.suitable_for) : null,
        tips: r.tips ? String(r.tips) : null,
        hero_image_url: r.hero_image_url ? String(r.hero_image_url) : null,
        is_published: parseBool(r.is_published, true),
        is_featured: parseBool(r.is_featured, false),
      });
    }

    let inserted = 0;
    const insertErrors: { row: number; error: string }[] = [];

    // Batch insert in chunks of 100
    for (let i = 0; i < toInsert.length; i += 100) {
      const chunk = toInsert.slice(i, i + 100);
      const { data, error } = await supabaseAdmin.from('wisata_places').insert(chunk).select('id');
      if (error) insertErrors.push({ row: i + 2, error: error.message });
      else inserted += data?.length || 0;
    }

    return NextResponse.json({ inserted, errors: [...errors, ...insertErrors], total: rows.length });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Error' }, { status: 500 });
  }
}
