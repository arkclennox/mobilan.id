import { Metadata } from 'next';
import Link from 'next/link';
import { Search, SlidersHorizontal } from 'lucide-react';
import { WisataCard } from '@/components/wisata/wisata-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getWisataPlaces } from '@/lib/queries/wisata';
import { getAllCategories } from '@/lib/queries/categories';
import { getAllCitiesFromDB } from '@/lib/queries/cities';

export const revalidate = 60;

type Props = {
  searchParams: {
    kota?: string;
    kategori?: string;
    q?: string;
    page?: string;
  };
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const kota = searchParams.kota;
  const kategori = searchParams.kategori;
  let title = 'Temukan Tempat Wisata Indonesia — Mobilan.id';
  let description = 'Jelajahi ribuan tempat wisata terbaik di Indonesia. Temukan info tiket, jam buka, dan penginapan terdekat.';
  if (kota) title = `Wisata di ${kota.charAt(0).toUpperCase() + kota.slice(1)} — Mobilan.id`;
  if (kategori) title = `Wisata ${kategori.replace(/-/g, ' ')} di Indonesia — Mobilan.id`;
  return { title, description };
}

const LIMIT = 12;

export default async function WisataListPage({ searchParams }: Props) {
  const page = parseInt(searchParams.page || '1');
  const offset = (page - 1) * LIMIT;

  const [{ data: wisataList, count }, categories, cities] = await Promise.all([
    getWisataPlaces({
      citySlug: searchParams.kota,
      categorySlug: searchParams.kategori,
      search: searchParams.q,
      limit: LIMIT,
      offset,
    }),
    getAllCategories(),
    getAllCitiesFromDB(),
  ]);

  const totalPages = Math.ceil((count || 0) / LIMIT);
  const activeKota = searchParams.kota || '';
  const activeKategori = searchParams.kategori || '';

  function buildUrl(params: Record<string, string>) {
    const base = new URLSearchParams();
    if (params.kota) base.set('kota', params.kota);
    if (params.kategori) base.set('kategori', params.kategori);
    if (params.q) base.set('q', params.q);
    if (params.page && params.page !== '1') base.set('page', params.page);
    const qs = base.toString();
    return `/wisata${qs ? '?' + qs : ''}`;
  }

  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="py-14 bg-gradient-to-br from-brand-50 to-brand-100 dark:from-brand-950/20 dark:to-brand-900/10">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {activeKota
              ? `Wisata di ${cities.find((c) => c.slug === activeKota)?.name || activeKota}`
              : activeKategori
              ? `Wisata ${categories.find((c) => c.slug === activeKategori)?.name || activeKategori}`
              : 'Temukan Tempat Wisata Indonesia'}
          </h1>
          <p className="text-muted-foreground text-lg mb-8">
            Info tiket, jam buka, penginapan terdekat, dan banyak lagi
          </p>
          <form method="get" action="/wisata" className="flex gap-2 max-w-lg mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                name="q"
                defaultValue={searchParams.q || ''}
                placeholder="Cari wisata, kota, atau kategori..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <Button type="submit" className="bg-brand-600 hover:bg-brand-700 text-white">
              Cari
            </Button>
          </form>
        </div>
      </section>

      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filter */}
            <aside className="lg:w-56 shrink-0">
              <div className="sticky top-20 space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-3 font-semibold text-sm">
                    <SlidersHorizontal className="h-4 w-4" />
                    Filter Kota
                  </div>
                  <div className="space-y-1 max-h-60 overflow-y-auto">
                    <Link
                      href={buildUrl({ kategori: activeKategori })}
                      className={`block text-sm px-2 py-1.5 rounded-md hover:bg-muted transition-colors ${!activeKota ? 'bg-brand-100 text-brand-700 font-medium' : ''}`}
                    >
                      Semua Kota
                    </Link>
                    {cities.map((city) => (
                      <Link
                        key={city.slug}
                        href={buildUrl({ kota: city.slug, kategori: activeKategori })}
                        className={`block text-sm px-2 py-1.5 rounded-md hover:bg-muted transition-colors ${activeKota === city.slug ? 'bg-brand-100 text-brand-700 font-medium' : ''}`}
                      >
                        {city.name}
                      </Link>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="font-semibold text-sm mb-3">Filter Kategori</div>
                  <div className="flex flex-wrap gap-1.5">
                    <Link href={buildUrl({ kota: activeKota })}>
                      <Badge variant={!activeKategori ? 'default' : 'outline'} className={`cursor-pointer ${!activeKategori ? 'bg-brand-600' : ''}`}>
                        Semua
                      </Badge>
                    </Link>
                    {categories.map((cat) => (
                      <Link key={cat.slug} href={buildUrl({ kota: activeKota, kategori: cat.slug })}>
                        <Badge
                          variant={activeKategori === cat.slug ? 'default' : 'outline'}
                          className={`cursor-pointer text-xs ${activeKategori === cat.slug ? 'bg-brand-600 border-brand-600' : ''}`}
                        >
                          {cat.icon} {cat.name}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-muted-foreground">
                  {count} tempat wisata ditemukan
                  {activeKota && ` di ${cities.find((c) => c.slug === activeKota)?.name || activeKota}`}
                  {activeKategori && ` — kategori ${categories.find((c) => c.slug === activeKategori)?.name || activeKategori}`}
                </p>
                {(activeKota || activeKategori || searchParams.q) && (
                  <Link href="/wisata">
                    <Button variant="ghost" size="sm" className="text-xs">Reset Filter</Button>
                  </Link>
                )}
              </div>

              {wisataList.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {wisataList.map((wisata) => (
                      <WisataCard key={wisata.id} wisata={wisata} />
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-3 mt-12">
                      {page > 1 && (
                        <Link href={buildUrl({ kota: activeKota, kategori: activeKategori, q: searchParams.q || '', page: String(page - 1) })}>
                          <Button variant="outline">← Sebelumnya</Button>
                        </Link>
                      )}
                      <span className="text-sm text-muted-foreground">Halaman {page} dari {totalPages}</span>
                      {page < totalPages && (
                        <Link href={buildUrl({ kota: activeKota, kategori: activeKategori, q: searchParams.q || '', page: String(page + 1) })}>
                          <Button variant="outline">Selanjutnya →</Button>
                        </Link>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-20 text-muted-foreground">
                  <p className="text-lg font-medium mb-2">Belum ada wisata ditemukan</p>
                  <p className="text-sm">Coba ubah filter atau kata kunci pencarian</p>
                  <Link href="/wisata" className="mt-4 inline-block">
                    <Button variant="outline" size="sm">Reset Semua Filter</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
