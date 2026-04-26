import { supabase, supabaseAdmin } from '@/lib/supabase';
import type { City } from '@/types/database';

export async function getAllCitiesFromDB() {
  const { data } = await supabase.from('cities').select('*').order('name');
  return (data || []) as City[];
}

export async function getFeaturedCities(limit = 6) {
  const { data } = await supabase
    .from('cities')
    .select('*')
    .eq('is_featured', true)
    .order('name')
    .limit(limit);
  return (data || []) as City[];
}

export async function getCityBySlug(slug: string): Promise<City | null> {
  const { data } = await supabase.from('cities').select('*').eq('slug', slug).single();
  return data;
}

export async function updateCity(id: string, payload: Partial<City>) {
  const { data, error } = await supabaseAdmin
    .from('cities')
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}
