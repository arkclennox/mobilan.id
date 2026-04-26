import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { getBlogPostBySlug } from '@/lib/queries/blog';

export const revalidate = 60;

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) return { title: 'Artikel Tidak Ditemukan' };

  const title = post.seo_title || `${post.title} | Blog Mobilan.id`;
  const description = post.seo_description || post.excerpt || '';

  return {
    title,
    description,
    alternates: { canonical: `https://mobilan.id/blog/${post.slug}` },
    openGraph: {
      title,
      description,
      images: post.featured_image_url ? [post.featured_image_url] : [],
      type: 'article',
      publishedTime: post.published_at || post.created_at,
      url: `https://mobilan.id/blog/${post.slug}`,
      siteName: 'Mobilan.id',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: post.featured_image_url ? [post.featured_image_url] : [],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) notFound();

  const publishDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
    : null;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    author: { '@type': 'Person', name: post.author_name || 'Admin' },
    datePublished: post.published_at,
    dateModified: post.updated_at,
    image: post.featured_image_url || 'https://mobilan.id/og-image.jpg',
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://mobilan.id/blog/${post.slug}` },
    publisher: { '@type': 'Organization', name: 'Mobilan.id', logo: { '@type': 'ImageObject', url: 'https://mobilan.id/logo.png' } },
  };

  return (
    <div className="min-h-screen pt-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      {/* Hero */}
      <section className="relative">
        {post.featured_image_url ? (
          <div className="relative h-96">
            <Image src={post.featured_image_url} alt={post.title} fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white max-w-4xl mx-auto px-4">
                <h1 className="text-3xl md:text-5xl font-bold">{post.title}</h1>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-16 bg-muted/30">
            <div className="container mx-auto px-4 text-center max-w-4xl">
              <h1 className="text-3xl md:text-5xl font-bold">{post.title}</h1>
            </div>
          </div>
        )}
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Breadcrumb className="mb-8">
              <BreadcrumbList>
                <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem><BreadcrumbLink href="/blog">Blog</BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem><BreadcrumbPage className="line-clamp-1 max-w-[200px]">{post.title}</BreadcrumbPage></BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="flex flex-wrap items-center gap-6 mb-8 text-muted-foreground">
              {publishDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <time dateTime={post.published_at || ''}>{publishDate}</time>
                </div>
              )}
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{post.author_name || 'Admin'}</span>
              </div>
            </div>

            {post.excerpt && (
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed border-l-4 border-brand-500 pl-4 italic">
                {post.excerpt}
              </p>
            )}

            <article className="prose prose-lg max-w-none dark:prose-invert">
              {post.content_html ? (
                <div dangerouslySetInnerHTML={{ __html: post.content_html }} />
              ) : (
                <p className="text-muted-foreground">Konten tidak tersedia.</p>
              )}
            </article>

            <div className="mt-12 pt-8 border-t border-border text-center">
              <h3 className="text-xl font-semibold mb-4">Baca Artikel Lainnya</h3>
              <div className="flex gap-3 justify-center">
                <Button asChild variant="outline">
                  <Link href="/blog">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Semua Artikel
                  </Link>
                </Button>
                <Button asChild className="bg-brand-600 hover:bg-brand-700">
                  <Link href="/wisata">Jelajahi Wisata</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
