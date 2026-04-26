import Link from 'next/link';
import { Plus, Pencil, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getAllWisataAdmin } from '@/lib/queries/wisata';

type Props = { searchParams: { page?: string } };

export default async function AdminWisataPage({ searchParams }: Props) {
  const page = parseInt(searchParams.page || '1');
  const { data, count } = await getAllWisataAdmin(page);
  const totalPages = Math.ceil((count || 0) / 20);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Wisata</h1>
          <p className="text-sm text-muted-foreground">{count} tempat wisata</p>
        </div>
        <Link href="/admin/wisata/tambah">
          <Button className="bg-brand-600 hover:bg-brand-700">
            <Plus className="h-4 w-4 mr-2" /> Tambah Wisata
          </Button>
        </Link>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Nama</th>
              <th className="text-left px-4 py-3 font-medium">Kota</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-left px-4 py-3 font-medium">Featured</th>
              <th className="text-right px-4 py-3 font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((w) => (
              <tr key={w.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-medium max-w-[200px] truncate">{w.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{(w.city as { name: string } | null)?.name || '-'}</td>
                <td className="px-4 py-3">
                  {w.is_published ? (
                    <Badge className="bg-green-100 text-green-700 border-0 text-xs">
                      <Eye className="h-3 w-3 mr-1" /> Publish
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-xs">
                      <EyeOff className="h-3 w-3 mr-1" /> Draft
                    </Badge>
                  )}
                </td>
                <td className="px-4 py-3">
                  {w.is_featured ? <Badge className="bg-brand-100 text-brand-700 border-0 text-xs">⭐ Ya</Badge> : <span className="text-muted-foreground text-xs">-</span>}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/wisata/${w.id}`}>
                    <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                      <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">
                  Belum ada wisata. <Link href="/admin/wisata/tambah" className="text-brand-600 underline">Tambah sekarang</Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {page > 1 && <Link href={`/admin/wisata?page=${page - 1}`}><Button variant="outline" size="sm">← Sebelumnya</Button></Link>}
          <span className="text-sm text-muted-foreground flex items-center px-3">Hal. {page}/{totalPages}</span>
          {page < totalPages && <Link href={`/admin/wisata?page=${page + 1}`}><Button variant="outline" size="sm">Selanjutnya →</Button></Link>}
        </div>
      )}
    </div>
  );
}
