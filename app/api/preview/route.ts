import { NextRequest, NextResponse } from 'next/server';
import { getPostPreview } from '@/lib/wp';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  if (!slug) {
    return NextResponse.json({ error: 'Slug parameter is required' }, { status: 400 });
  }

  try {
    const post = await getPostPreview(slug);

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Redirect to the blog post with preview parameter
    const previewUrl = `/blog/${slug}?preview=true`;
    return NextResponse.redirect(new URL(previewUrl, request.url));
  } catch (error) {
    console.error('Preview error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Handle POST requests for preview webhook (optional)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const slug = body.slug;

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    // You can add additional logic here if needed
    // For example, clearing cache for the specific post

    return NextResponse.json({ 
      message: 'Preview webhook received',
      previewUrl: `/blog/${slug}?preview=true`
    });
  } catch (error) {
    console.error('Preview webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}