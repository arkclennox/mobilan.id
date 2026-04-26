import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, User, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getBlogPosts } from '@/lib/queries/blog';

export const revalidate = 60;

type Props = { searchParams: { page?: string } };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const page = parseInt(searchParams?.page || '1');
  const title = page > 1
    ? `Blog Perjalanan — Halaman ${page} | Mobilan.id`
    : 'Blog Perjalanan — Tips & Panduan Wisata Indonesia';
  const canonical = page > 1 ? `https://mobilan.id/blog?page=${page}` : 'https://mobilan.id/blog';
  return {
    title,
    description: 'Tips perjalanan, panduan wisata, dan informasi terbaru untuk petualangan Anda di Indonesia.',
    alternates: { canonical },
    openGraph: { title, url: canonical, type: 'website', siteName: 'Mobilan.id' },
  };
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default async function BlogPage({ searchParams }: Props) {
  const page = parseInt(searchParams?.page || '1');
  const { posts, totalPages } = await getBlogPosts({ page });

  return (
    <div className="min-h-screen pt-16">
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Blog Perjalanan</h1>
          <p className="text-xl text-muted-foreground">
            Tips perjalanan, panduan wisata, dan informasi terbaru untuk petualangan Anda
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {posts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {posts.map((post) => (
                    <article key={post.id} className="group bg-card rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                      {post.featured_image_url && (
                        <div className="relative overflow-hidden h-48">
                          <Image
                            src={post.featured_image_url}
                            alt={post.title}
                            width={400}
                            height={192}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        </div>
                      )}
                      <div className="p-6">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          {post.published_at && (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
                            </div>
                          )}
                          {post.author_name && (
                            <div className="flex items-center gap-1">
                              <User className="h-3.5 w-3.5" />
                              <span>{post.author_name}</span>
                            </div>
                          )}
                        </div>
                        <h2 className="text-xl font-bold mb-3 group-hover:text-brand-600 transition-colors">
                          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                        </h2>
                        {post.excerpt && (
                          <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">{post.excerpt}</p>
                        )}
                        <Link href={`/blog/${post.slug}`}>
                          <Button variant="outline" className="w-full group-hover:bg-brand-600 group-hover:text-white group-hover:border-brand-600 transition-colors">
                            Baca Selengkapnya
                          </Button>
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-4 mt-12">
                    {page > 1 && (
                      <Link href={page - 1 === 1 ? '/blog' : `/blog?page=${page - 1}`}>
                        <Button variant="outline" className="flex items-center gap-2">
                          <ArrowLeft className="h-4 w-4" /> Sebelumnya
                        </Button>
                      </Link>
                    )}
                    <span className="text-muted-foreground text-sm">Halaman {page} dari {totalPages}</span>
                    {page < totalPages && (
                      <Link href={`/blog?page=${page + 1}`}>
                        <Button variant="outline" className="flex items-center gap-2">
                          Selanjutnya <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <p className="text-muted-foreground text-lg mb-4">Belum ada artikel yang dipublikasikan.</p>
                <Link href="/wisata">
                  <Button variant="outline">Jelajahi Wisata</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
