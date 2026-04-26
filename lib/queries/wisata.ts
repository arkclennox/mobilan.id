import { supabase, supabaseAdmin } from '@/lib/supabase';
import type { WisataPlace } from '@/types/database';

export async function getWisataPlaces({
  citySlug,
  categorySlug,
  featured,
  limit = 12,
  offset = 0,
  search,
}: {
  citySlug?: string;
  categorySlug?: string;
  featured?: boolean;
  limit?: number;
  offset?: number;
  search?: string;
} = {}) {
  let query = supabase
    .from('wisata_places')
    .select(`
      *,
      city:cities(id, name, slug, province),
      categories:wisata_place_categories(
        wisata_category:wisata_categories(id, name, slug, icon)
      )
    `, { count: 'exact' })
    .eq('is_published', true)
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (featured) query = query.eq('is_featured', true);
  if (search) query = query.ilike('name', `%${search}%`);

  if (citySlug) {
    const { data: city } = await supabase.from('cities').select('id').eq('slug', citySlug).single();
    if (city) query = query.eq('city_id', city.id);
    else return { data: [], count: 0 };
  }

  if (categorySlug) {
    const { data: category } = await supabase.from('wisata_categories').select('id').eq('slug', categorySlug).single();
    if (category) {
      const { data: placeIds } = await supabase
        .from('wisata_place_categories')
        .select('wisata_place_id')
        .eq('wisata_category_id', category.id);
      const ids = (placeIds || []).map((r: { wisata_place_id: string }) => r.wisata_place_id);
      if (ids.length === 0) return { data: [], count: 0 };
      query = query.in('id', ids);
    }
  }

  const { data, error, count } = await query;
  if (error) { console.error('getWisataPlaces:', error); return { data: [], count: 0 }; }

  type RawPlace = Omit<WisataPlace, 'categories'> & {
    categories: { wisata_category: { id: string; name: string; slug: string; icon: string | null } }[];
  };
  const normalized = (data || []).map((p: RawPlace) => ({
    ...p,
    categories: (p.categories || []).map((c) => c.wisata_category),
  }));

  return { data: normalized, count: count ?? 0 };
}

export async function getWisataBySlug(slug: string): Promise<WisataPlace | null> {
  const { data, error } = await supabase
    .from('wisata_places')
    .select(`
      *,
      city:cities(id, name, slug, province),
      categories:wisata_place_categories(
        wisata_category:wisata_categories(id, name, slug, icon)
      ),
      images:wisata_images(id, image_url, alt_text, sort_order),
      activity_offers(id, provider, title, affiliate_url, image_url, price_text, note, sort_order),
      accommodations:wisata_accommodations(
        id, distance_text, sort_order,
        accommodation:accommodations(id, name, slug, area, short_description, image_url, provider, affiliate_url, property_type, price_label)
      )
    `)
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (error || !data) return null;

  return {
    ...data,
    categories: (data.categories || []).map((c: { wisata_category: { id: string; name: string; slug: string; icon: string | null } }) => c.wisata_category),
    images: (data.images || []).sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order),
    activity_offers: (data.activity_offers || []).sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order),
    accommodations: (data.accommodations || []).sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order),
  };
}

export async function getNearbyWisata(cityId: string, excludeSlug: string, limit = 4) {
  const { data } = await supabase
    .from('wisata_places')
    .select('id, name, slug, short_description, hero_image_url, opening_hours, ticket_price_text, is_featured, city:cities(name, slug)')
    .eq('is_published', true)
    .eq('city_id', cityId)
    .neq('slug', excludeSlug)
    .limit(limit);
  return (data || []).map((w) => ({
    ...w,
    city: Array.isArray(w.city) ? (w.city[0] ?? null) : (w.city ?? null),
  }));
}

// Admin queries — pakai supabaseAdmin (service role, bypass RLS)
export async function getAllWisataAdmin(page = 1, limit = 20) {
  const offset = (page - 1) * limit;
  const { data, error, count } = await supabaseAdmin
    .from('wisata_places')
    .select('*, city:cities(name, slug)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) return { data: [], count: 0 };
  return { data: data || [], count: count ?? 0 };
}

export async function getWisataByIdAdmin(id: string) {
  const { data } = await supabaseAdmin
    .from('wisata_places')
    .select(`
      *,
      categories:wisata_place_categories(wisata_category_id),
      images:wisata_images(*),
      activity_offers(*),
      accommodations:wisata_accommodations(*, accommodation:accommodations(*))
    `)
    .eq('id', id)
    .single();
  return data;
}

export async function createWisata(payload: Partial<WisataPlace>) {
  const { data, error } = await supabaseAdmin.from('wisata_places').insert(payload).select().single();
  if (error) throw error;
  return data;
}

export async function updateWisata(id: string, payload: Partial<WisataPlace>) {
  const { data, error } = await supabaseAdmin
    .from('wisata_places')
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteWisata(id: string) {
  const { error } = await supabaseAdmin.from('wisata_places').delete().eq('id', id);
  if (error) throw error;
}

export async function setWisataCategories(wisataId: string, categoryIds: string[]) {
  await supabaseAdmin.from('wisata_place_categories').delete().eq('wisata_place_id', wisataId);
  if (categoryIds.length > 0) {
    await supabaseAdmin.from('wisata_place_categories').insert(
      categoryIds.map((id) => ({ wisata_place_id: wisataId, wisata_category_id: id }))
    );
  }
}

export async function createActivityOffer(payload: {
  wisata_place_id: string;
  provider: string;
  title: string;
  affiliate_url: string;
  image_url?: string;
  price_text?: string;
  note?: string;
  sort_order?: number;
}) {
  const { data, error } = await supabaseAdmin.from('activity_offers').insert(payload).select().single();
  if (error) throw error;
  return data;
}

export async function updateActivityOffer(id: string, payload: Record<string, unknown>) {
  const { data, error } = await supabaseAdmin.from('activity_offers').update(payload).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteActivityOffer(id: string) {
  const { error } = await supabaseAdmin.from('activity_offers').delete().eq('id', id);
  if (error) throw error;
}
