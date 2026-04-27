'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { Plus, Search, Eye, EyeOff, Pencil, Trash2, ExternalLink, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

type AccommodationRow = {
  id: string;
  name: string;
  slug: string;
  provider: string;
  affiliate_url: string;
  is_published: boolean;
  property_type: string | null;
  price_label: string | null;
  created_at: string;
  city: { name: string; slug: string } | null;
};

type ListResponse = {
  data: AccommodationRow[];
  count: number;
  page: number;
  totalPages: number;
};

export default function AdminPenginapanPage() {
  const [rows, setRows] = useState<AccommodationRow[]>([]);
  const [count, setCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [providers, setProviders] = useState<string[]>([]);

  const [q, setQ] = useState('');
  const [debouncedQ, setDebouncedQ] = useState('');
  const [status, setStatus] = useState('all');
  const [provider, setProvider] = useState('');
  const [sort, setSort] = useState('created_at');
  const [dir, setDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => { setDebouncedQ(q); setPage(1); }, 400);
  }, [q]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ q: debouncedQ, status, provider, sort, dir, page: String(page), limit: '50' });
    const res = await fetch(`/api/admin/penginapan?${params}`);
    if (res.ok) {
      const json: ListResponse = await res.json();
      setRows(json.data);
      setCount(json.count ?? 0);
      setTotalPages(json.totalPages);
      // Build unique providers list from data
      const unique = Array.from(new Set(json.data.map(r => r.provider).filter(Boolean)));
      if (unique.length > 0) setProviders(prev => Array.from(new Set([...prev, ...unique])));
    }
    setLoading(false);
  }, [debouncedQ, status, provider, sort, dir, page]);

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => { setPage(1); }, [status, provider, sort, dir]);

  const toggleSort = (col: string) => {
    if (sort === col) setDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSort(col); setDir('desc'); }
  };

  const SortIcon = ({ col }: { col: string }) =>
    sort !== col ? <ChevronUp className="h-3 w-3 opacity-20" /> :
    dir === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />;

  const togglePublished = async (row: AccommodationRow) => {
    const newVal = !row.is_published;
    setRows(prev => prev.map(r => r.id === row.id ? { ...r, is_published: newVal } : r));
    const res = await fetch(`/api/admin/penginapan/${row.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_published: newVal }),
    });
    if (!res.ok) {
      setRows(prev => prev.map(r => r.id === row.id ? { ...r, is_published: row.is_published } : r));
      alert('Gagal mengubah status');
    }
  };

  const deleteRow = async (row: AccommodationRow) => {
    if (!confirm(`Hapus penginapan "${row.name}"?`)) return;
    const res = await fetch(`/api/admin/penginapan/${row.id}`, { method: 'DELETE' });
    if (res.ok) setRows(prev => prev.filter(r => r.id !== row.id));
    else alert('Gagal menghapus penginapan');
  };

  const truncateUrl = (url: string) => {
    try { return new URL(url).hostname.replace('www.', ''); } catch { return url.slice(0, 30); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Penginapan Affiliate</h1>
          <p className="text-sm text-muted-foreground">{count} penginapan</p>
        </div>
        <Link href="/admin/penginapan/tambah">
          <Button className="bg-brand-600 hover:bg-brand-700">
            <Plus className="h-4 w-4 mr-2" /> Tambah Penginapan
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama penginapan..."
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
          <option value="published">Aktif</option>
          <option value="draft">Non-aktif</option>
        </select>
        <select
          value={provider}
          onChange={e => setProvider(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="">Semua Provider</option>
          {providers.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
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
                <th className="text-left px-4 py-3 font-medium">Provider</th>
                <th className="text-left px-4 py-3 font-medium">Affiliate URL</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-right px-4 py-3 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">Memuat...</td></tr>
              )}
              {!loading && rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                    Belum ada penginapan. <Link href="/admin/penginapan/tambah" className="text-brand-600 underline">Tambah sekarang</Link>
                  </td>
                </tr>
              )}
              {!loading && rows.map(row => (
                <tr key={row.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium max-w-[200px]">
                    <Link href={`/admin/penginapan/${row.id}`} className="hover:text-brand-600 truncate block">
                      {row.name}
                    </Link>
                    {row.property_type && <span className="text-xs text-muted-foreground">{row.property_type}</span>}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{row.city?.name || '-'}</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className="text-xs">{row.provider}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={row.affiliate_url}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="flex items-center gap-1 text-xs text-brand-600 hover:underline"
                    >
                      <ExternalLink className="h-3 w-3 shrink-0" />
                      <span className="truncate max-w-[140px]">{truncateUrl(row.affiliate_url)}</span>
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => togglePublished(row)} title="Klik untuk toggle status">
                      {row.is_published
                        ? <Badge className="bg-green-100 text-green-700 border-0 text-xs cursor-pointer hover:bg-green-200"><Eye className="h-3 w-3 mr-1" />Aktif</Badge>
                        : <Badge variant="secondary" className="text-xs cursor-pointer hover:bg-muted"><EyeOff className="h-3 w-3 mr-1" />Non-aktif</Badge>
                      }
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/admin/penginapan/${row.id}`} title="Edit">
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
              ))}
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
