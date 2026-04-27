'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { Plus, Search, Eye, EyeOff, Star, Pencil, Trash2, ExternalLink, ChevronUp, ChevronDown, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

type City = { id: string; name: string };

type WisataRow = {
  id: string;
  name: string;
  slug: string;
  is_published: boolean;
  is_featured: boolean;
  created_at: string;
  city: City | null;
  offers: { count: number }[] | null;
};

type ListResponse = {
  data: WisataRow[];
  count: number;
  page: number;
  totalPages: number;
};

export default function AdminWisataPage() {
  const [rows, setRows] = useState<WisataRow[]>([]);
  const [count, setCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [q, setQ] = useState('');
  const [debouncedQ, setDebouncedQ] = useState('');
  const [status, setStatus] = useState('all');
  const [featured, setFeatured] = useState('all');
  const [kota, setKota] = useState('');
  const [sort, setSort] = useState('created_at');
  const [dir, setDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [cities, setCities] = useState<City[]>([]);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedQ(q);
      setPage(1);
    }, 400);
  }, [q]);

  // Load cities once
  useEffect(() => {
    fetch('/api/admin/data').then(r => r.json()).then(d => setCities(d.cities || []));
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ q: debouncedQ, status, featured, kota, sort, dir, page: String(page), limit: '50' });
    const res = await fetch(`/api/admin/wisata?${params}`);
    if (res.ok) {
      const json: ListResponse = await res.json();
      setRows(json.data);
      setCount(json.count);
      setTotalPages(json.totalPages);
    }
    setLoading(false);
  }, [debouncedQ, status, featured, kota, sort, dir, page]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Reset page when filters change
  useEffect(() => { setPage(1); }, [status, featured, kota, sort, dir]);

  const toggleSort = (col: string) => {
    if (sort === col) setDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSort(col); setDir('desc'); }
  };

  const SortIcon = ({ col }: { col: string }) => {
    if (sort !== col) return <ChevronUp className="h-3 w-3 opacity-20" />;
    return dir === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />;
  };

  const togglePublished = async (row: WisataRow) => {
    const newVal = !row.is_published;
    setRows(prev => prev.map(r => r.id === row.id ? { ...r, is_published: newVal } : r));
    const res = await fetch(`/api/admin/wisata/${row.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_published: newVal }),
    });
    if (!res.ok) {
      setRows(prev => prev.map(r => r.id === row.id ? { ...r, is_published: row.is_published } : r));
      alert('Gagal mengubah status');
    }
  };

  const toggleFeatured = async (row: WisataRow) => {
    const newVal = !row.is_featured;
    setRows(prev => prev.map(r => r.id === row.id ? { ...r, is_featured: newVal } : r));
    const res = await fetch(`/api/admin/wisata/${row.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_featured: newVal }),
    });
    if (!res.ok) {
      setRows(prev => prev.map(r => r.id === row.id ? { ...r, is_featured: row.is_featured } : r));
      alert('Gagal mengubah featured');
    }
  };

  const deleteRow = async (row: WisataRow) => {
    if (!confirm(`Hapus wisata "${row.name}"? Semua tiket affiliate dan data terkait akan ikut terhapus.`)) return;
    const res = await fetch(`/api/admin/wisata/${row.id}`, { method: 'DELETE' });
    if (res.ok) setRows(prev => prev.filter(r => r.id !== row.id));
    else alert('Gagal menghapus wisata');
  };

  const offerCount = (row: WisataRow) => (row.offers as unknown as { count: number }[])?.[0]?.count ?? 0;

  const publishedCount = rows.filter(r => r.is_published).length;
  const featuredCount = rows.filter(r => r.is_featured).length;

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

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama wisata..."
            value={q}
            onChange={e => setQ(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="all">Semua Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
        <select
          value={featured}
          onChange={e => setFeatured(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="all">Semua Featured</option>
          <option value="yes">Featured ⭐</option>
          <option value="no">Tidak Featured</option>
        </select>
        <select
          value={kota}
          onChange={e => setKota(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="">Semua Kota</option>
          {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {/* Stats */}
      <div className="flex gap-4 mb-4 text-xs text-muted-foreground">
        <span>Halaman ini: <strong className="text-foreground">{rows.length}</strong> item</span>
        <span>Published: <strong className="text-green-600">{publishedCount}</strong></span>
        <span>Featured: <strong className="text-brand-600">{featuredCount}</strong></span>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 font-medium">
                  <button onClick={() => toggleSort('name')} className="flex items-center gap-1 hover:text-brand-600">
                    Nama <SortIcon col="name" />
                  </button>
                </th>
                <th className="text-left px-4 py-3 font-medium">Kota</th>
                <th className="text-left px-4 py-3 font-medium">Tiket</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium">Featured</th>
                <th className="text-left px-4 py-3 font-medium">
                  <button onClick={() => toggleSort('created_at')} className="flex items-center gap-1 hover:text-brand-600">
                    Dibuat <SortIcon col="created_at" />
                  </button>
                </th>
                <th className="text-right px-4 py-3 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading && (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">Memuat...</td></tr>
              )}
              {!loading && rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
                    Tidak ada wisata ditemukan. <Link href="/admin/wisata/tambah" className="text-brand-600 underline">Tambah sekarang</Link>
                  </td>
                </tr>
              )}
              {!loading && rows.map(row => {
                const offers = offerCount(row);
                return (
                  <tr key={row.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium max-w-[220px]">
                      <Link href={`/admin/wisata/${row.id}`} className="hover:text-brand-600 truncate block">
                        {row.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{row.city?.name || '-'}</td>
                    <td className="px-4 py-3">
                      {offers > 0
                        ? <Badge className="bg-green-100 text-green-700 border-0 text-xs gap-1"><Ticket className="h-3 w-3" />{offers}</Badge>
                        : <span className="text-muted-foreground text-xs">-</span>
                      }
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => togglePublished(row)} title="Klik untuk toggle status">
                        {row.is_published
                          ? <Badge className="bg-green-100 text-green-700 border-0 text-xs cursor-pointer hover:bg-green-200"><Eye className="h-3 w-3 mr-1" />Publish</Badge>
                          : <Badge variant="secondary" className="text-xs cursor-pointer hover:bg-muted"><EyeOff className="h-3 w-3 mr-1" />Draft</Badge>
                        }
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleFeatured(row)}
                        title="Klik untuk toggle featured"
                        className={`text-lg transition-transform hover:scale-125 ${row.is_featured ? 'text-yellow-500' : 'text-muted-foreground opacity-30'}`}
                      >
                        ⭐
                      </button>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {new Date(row.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <a href={`/wisata/${row.slug}`} target="_blank" rel="noopener noreferrer" title="Lihat halaman publik">
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0"><ExternalLink className="h-3.5 w-3.5" /></Button>
                        </a>
                        <Link href={`/admin/wisata/${row.id}`} title="Edit">
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0"><Pencil className="h-3.5 w-3.5" /></Button>
                        </Link>
                        <Button
                          variant="ghost" size="sm"
                          className="h-7 w-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => deleteRow(row)}
                          title="Hapus"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>← Sebelumnya</Button>
          <span className="text-sm text-muted-foreground px-3">Hal. {page} / {totalPages}</span>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Selanjutnya →</Button>
        </div>
      )}
    </div>
  );
}
