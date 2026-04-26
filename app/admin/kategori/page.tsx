import Link from 'next/link';
import { Plus, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getAllCategoriesAdmin } from '@/lib/queries/categories';

export default async function AdminKategoriPage() {
  const categories = await getAllCategoriesAdmin();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Kategori Wisata</h1>
          <p className="text-sm text-muted-foreground">{categories.length} kategori</p>
        </div>
        <Link href="/admin/kategori/tambah">
          <Button className="bg-brand-600 hover:bg-brand-700">
            <Plus className="h-4 w-4 mr-2" /> Tambah Kategori
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{cat.icon || '🗺️'}</span>
              <div>
                <p className="font-medium text-sm">{cat.name}</p>
                <p className="text-xs text-muted-foreground">{cat.slug}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {cat.is_featured && <Badge className="text-xs bg-brand-100 text-brand-700 border-0">Featured</Badge>}
              <Link href={`/admin/kategori/${cat.id}`}>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        ))}
        {categories.length === 0 && (
          <div className="col-span-3 text-center py-10 text-muted-foreground">
            Belum ada kategori. <Link href="/admin/kategori/tambah" className="text-brand-600 underline">Tambah sekarang</Link>
          </div>
        )}
      </div>
    </div>
  );
}
