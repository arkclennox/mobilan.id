import { supabase, supabaseAdmin } from '@/lib/supabase';
import type { BlogPost } from '@/types/database';

export async function getBlogPosts({ page = 1, limit = 6 }: { page?: number; limit?: number } = {}) {
  const offset = (page - 1) * limit;
  const { data, error, count } = await supabase
    .from('blog_posts')
    .select('*', { count: 'exact' })
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) return { posts: [], totalPages: 0, total: 0 };
  const total = count ?? 0;
  return { posts: (data || []) as BlogPost[], totalPages: Math.ceil(total / limit), total };
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();
  return data;
}

export async function getRecentBlogPosts(limit = 3) {
  const { data } = await supabase
    .from('blog_posts')
    .select('id, title, slug, excerpt, featured_image_url, published_at, author_name')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(limit);
  return (data || []) as Partial<BlogPost>[];
}

// Admin
export async function getAllBlogPostsAdmin(page = 1, limit = 20) {
  const offset = (page - 1) * limit;
  const { data, error, count } = await supabaseAdmin
    .from('blog_posts')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);
  if (error) return { data: [], count: 0 };
  return { data: (data || []) as BlogPost[], count: count ?? 0 };
}

export async function getBlogPostByIdAdmin(id: string): Promise<BlogPost | null> {
  const { data } = await supabaseAdmin.from('blog_posts').select('*').eq('id', id).single();
  return data;
}

export async function createBlogPost(payload: Partial<BlogPost>) {
  const now = new Date().toISOString();
  const { data, error } = await supabaseAdmin
    .from('blog_posts')
    .insert({
      ...payload,
      published_at: payload.is_published ? (payload.published_at || now) : null,
    })
    .select()
    .single();
  if (error) throw error;
  return data as BlogPost;
}

export async function updateBlogPost(id: string, payload: Partial<BlogPost>) {
  const now = new Date().toISOString();
  const { data, error } = await supabaseAdmin
    .from('blog_posts')
    .update({
      ...payload,
      published_at: payload.is_published ? (payload.published_at || now) : null,
      updated_at: now,
    })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as BlogPost;
}

export async function deleteBlogPost(id: string) {
  const { error } = await supabaseAdmin.from('blog_posts').delete().eq('id', id);
  if (error) throw error;
}
