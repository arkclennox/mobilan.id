import { NextRequest, NextResponse } from 'next/server';
import { updateBlogPost, deleteBlogPost, getBlogPostByIdAdmin } from '@/lib/queries/blog';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const post = await getBlogPostByIdAdmin(params.id);
  if (!post) return NextResponse.json(null, { status: 404 });
  return NextResponse.json(post);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const post = await updateBlogPost(params.id, body);
    return NextResponse.json(post);
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Error' }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await deleteBlogPost(params.id);
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Error' }, { status: 500 });
  }
}
