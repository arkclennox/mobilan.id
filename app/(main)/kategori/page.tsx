import { Metadata } from 'next';
import Link from 'next/link';
import { getAllCategories } from '@/lib/queries/categories';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Kategori Wisata Indonesia — Mobilan.id',
  description: 'Jelajahi wisata Indonesia berdasarkan kategori: alam, pantai, keluarga, budaya, dan masih banyak lagi.',
};

export default async function KategoriPage() {
  const categories = await getAllCategories();

  return (
    <div className="min-h-screen pt-16">
      <section className="py-14 bg-gradient-to-br from-brand-50 to-brand-100 dark:from-brand-950/20 dark:to-brand-900/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Kategori Wisata</h1>
          <p className="text-muted-foreground text-lg">Temukan wisata Indonesia berdasarkan jenis yang Anda sukai</p>
        </div>
      </section>

      <section className="py-14">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <Link key={cat.slug} href={`/kategori/${cat.slug}`} className="group">
                <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg hover:border-brand-300 transition-all duration-300 hover:-translate-y-1 h-full">
                  <div className="text-4xl mb-3">{cat.icon || '🗺️'}</div>
                  <h2 className="text-lg font-bold mb-2 group-hover:text-brand-600 transition-colors">{cat.name}</h2>
                  {cat.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{cat.description}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
