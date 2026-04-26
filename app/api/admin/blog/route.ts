import { NextRequest, NextResponse } from 'next/server';
import { createBlogPost, getAllBlogPostsAdmin } from '@/lib/queries/blog';

export async function GET(req: NextRequest) {
  const page = parseInt(req.nextUrl.searchParams.get('page') || '1');
  const limit = parseInt(req.nextUrl.searchParams.get('limit') || '20');
  const { data, count } = await getAllBlogPostsAdmin(page, limit);
  return NextResponse.json({ data, count, page, totalPages: Math.ceil((count || 0) / limit) });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const post = await createBlogPost(body);
    return NextResponse.json(post);
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Error' }, { status: 500 });
  }
}
