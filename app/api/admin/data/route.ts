import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  const [cities, categories] = await Promise.all([
    supabaseAdmin.from('cities').select('id, name, slug').order('name'),
    supabaseAdmin.from('wisata_categories').select('id, name, slug, icon').order('name'),
  ]);
  return NextResponse.json({ cities: cities.data || [], categories: categories.data || [] });
}
