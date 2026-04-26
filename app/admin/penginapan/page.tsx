import Link from 'next/link';
import { Plus, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabaseAdmin } from '@/lib/supabase';

export default async function AdminPenginapanPage() {
  const { data, count } = await supabaseAdmin
    .from('accommodations')
    .select('*, city:cities(name)', { count: 'exact' })
    .order('created_at', { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Penginapan Affiliate</h1>
          <p className="text-sm text-muted-foreground">{count ?? 0} penginapan</p>
        </div>
        <Link href="/admin/penginapan/tambah">
          <Button className="bg-brand-600 hover:bg-brand-700">
            <Plus className="h-4 w-4 mr-2" /> Tambah Penginapan
          </Button>
        </Link>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Nama</th>
              <th className="text-left px-4 py-3 font-medium">Kota</th>
              <th className="text-left px-4 py-3 font-medium">Provider</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-right px-4 py-3 font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {(data || []).map((p) => (
              <tr key={p.id} className="hover:bg-muted/30">
                <td className="px-4 py-3 font-medium max-w-[200px] truncate">{p.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{(p.city as { name: string } | null)?.name || '-'}</td>
                <td className="px-4 py-3"><Badge variant="outline" className="text-xs">{p.provider}</Badge></td>
                <td className="px-4 py-3">
                  {p.is_published
                    ? <Badge className="bg-green-100 text-green-700 border-0 text-xs">Aktif</Badge>
                    : <Badge variant="secondary" className="text-xs">Non-aktif</Badge>}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/penginapan/${p.id}`}>
                    <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                      <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
            {(!data || data.length === 0) && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">
                  Belum ada penginapan. <Link href="/admin/penginapan/tambah" className="text-brand-600 underline">Tambah sekarang</Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
