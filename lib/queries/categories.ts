import { supabase, supabaseAdmin } from '@/lib/supabase';
import type { WisataCategory } from '@/types/database';

export async function getAllCategories() {
  // Ambil hanya kategori yang punya minimal 1 wisata terhubung
  const { data: links } = await supabase
    .from('wisata_place_categories')
    .select('wisata_category_id');

  const activeIds = Array.from(new Set((links || []).map((r) => r.wisata_category_id)));
  if (activeIds.length === 0) return [];

  const { data } = await supabase
    .from('wisata_categories')
    .select('*')
    .in('id', activeIds)
    .order('is_featured', { ascending: false })
    .order('name');
  return (data || []) as WisataCategory[];
}

export async function getFeaturedCategories(limit = 8) {
  const { data } = await supabase
    .from('wisata_categories')
    .select('*')
    .eq('is_featured', true)
    .order('name')
    .limit(limit);
  return (data || []) as WisataCategory[];
}

export async function getCategoryBySlug(slug: string): Promise<WisataCategory | null> {
  const { data } = await supabase.from('wisata_categories').select('*').eq('slug', slug).single();
  return data;
}

export async function getAllCategoriesAdmin() {
  const { data } = await supabaseAdmin.from('wisata_categories').select('*').order('name');
  return (data || []) as WisataCategory[];
}

export async function createCategory(payload: Partial<WisataCategory>) {
  const { data, error } = await supabaseAdmin.from('wisata_categories').insert(payload).select().single();
  if (error) throw error;
  return data;
}

export async function updateCategory(id: string, payload: Partial<WisataCategory>) {
  const { data, error } = await supabaseAdmin
    .from('wisata_categories')
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteCategory(id: string) {
  const { error } = await supabaseAdmin.from('wisata_categories').delete().eq('id', id);
  if (error) throw error;
}
