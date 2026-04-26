import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCategoryBySlug } from '@/lib/queries/categories';
import { getWisataPlaces } from '@/lib/queries/wisata';
import { WisataCard } from '@/components/wisata/wisata-card';
import { Button } from '@/components/ui/button';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

export const revalidate = 60;

type Props = { params: { slug: string }; searchParams: { page?: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = await getCategoryBySlug(params.slug);
  if (!category) return { title: 'Kategori Tidak Ditemukan' };

  const title = category.seo_title || `${category.name} di Indonesia — Temukan Wisata Terbaik`;
  const description = category.seo_description || category.description || `Jelajahi semua wisata kategori ${category.name} di Indonesia.`;
  return {
    title,
    description,
    alternates: { canonical: `https://mobilan.id/kategori/${category.slug}` },
  };
}

const LIMIT = 12;

export default async function KategoriDetailPage({ params, searchParams }: Props) {
  const page = parseInt(searchParams.page || '1');
  const category = await getCategoryBySlug(params.slug);
  if (!category) notFound();

  const { data: wisataList, count } = await getWisataPlaces({
    categorySlug: params.slug,
    limit: LIMIT,
    offset: (page - 1) * LIMIT,
  });

  const totalPages = Math.ceil((count || 0) / LIMIT);
  const baseUrl = `/kategori/${params.slug}`;

  return (
    <div className="min-h-screen pt-16">
      <section className="py-14 bg-gradient-to-br from-brand-50 to-brand-100 dark:from-brand-950/20 dark:to-brand-900/10">
        <div className="container mx-auto px-4 text-center">
          <div className="text-5xl mb-4">{category.icon || '🗺️'}</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{category.name}</h1>
          {category.description && (
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{category.description}</p>
          )}
        </div>
      </section>

      <section className="py-10">
        <div className="container mx-auto px-4">
          <Breadcrumb className="mb-8">
            <BreadcrumbList>
              <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbLink href="/kategori">Kategori</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbPage>{category.name}</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">{count} wisata ditemukan</p>
          </div>

          {wisataList.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {wisataList.map((wisata) => (
                  <WisataCard key={wisata.id} wisata={wisata} />
                ))}
              </div>
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-3 mt-12">
                  {page > 1 && (
                    <Link href={`${baseUrl}?page=${page - 1}`}>
                      <Button variant="outline">← Sebelumnya</Button>
                    </Link>
                  )}
                  <span className="text-sm text-muted-foreground">Halaman {page} dari {totalPages}</span>
                  {page < totalPages && (
                    <Link href={`${baseUrl}?page=${page + 1}`}>
                      <Button variant="outline">Selanjutnya →</Button>
                    </Link>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 text-muted-foreground">
              <p className="text-lg font-medium mb-2">Belum ada wisata dalam kategori ini</p>
              <Link href="/wisata" className="mt-4 inline-block">
                <Button variant="outline" size="sm">Lihat Semua Wisata</Button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
