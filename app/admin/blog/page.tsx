'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { Plus, Search, Eye, EyeOff, Pencil, Trash2, ChevronUp, ChevronDown, CheckSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

type BlogRow = {
  id: string;
  title: string;
  slug: string;
  author_name: string;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
};

export default function AdminBlogPage() {
  const [rows, setRows] = useState<BlogRow[]>([]);
  const [count, setCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [q, setQ] = useState('');
  const [debouncedQ, setDebouncedQ] = useState('');
  const [status, setStatus] = useState('all');
  const [sort, setSort] = useState('created_at');
  const [dir, setDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => { setDebouncedQ(q); setPage(1); }, 400);
  }, [q]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const p = new URLSearchParams({ q: debouncedQ, status, sort, dir, page: String(page), limit: '50' });
    const res = await fetch(`/api/admin/blog?${p}`);
    if (res.ok) {
      const json = await res.json();
      setRows(json.data || []);
      setCount(json.count ?? 0);
      setTotalPages(json.totalPages ?? 1);
    }
    setLoading(false);
    setSelectedIds(new Set());
  }, [debouncedQ, status, sort, dir, page]);

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => { setPage(1); }, [status, sort, dir]);

  const toggleSort = (col: string) => {
    if (sort === col) setDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSort(col); setDir('desc'); }
  };

  const SortIcon = ({ col }: { col: string }) =>
    sort !== col ? <ChevronUp className="h-3 w-3 opacity-20" /> :
    dir === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />;

  const togglePublished = async (row: BlogRow) => {
    const newVal = !row.is_published;
    setRows(prev => prev.map(r => r.id === row.id ? { ...r, is_published: newVal } : r));
    const res = await fetch(`/api/admin/blog/${row.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_published: newVal, published_at: newVal ? new Date().toISOString() : null }),
    });
    if (!res.ok) setRows(prev => prev.map(r => r.id === row.id ? { ...r, is_published: row.is_published } : r));
  };

  const confirmDelete = async (id: string) => {
    const res = await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' });
    if (res.ok) { setRows(prev => prev.filter(r => r.id !== id)); setCount(c => c - 1); }
    else alert('Gagal menghapus artikel');
    setDeletingId(null);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  const toggleSelectAll = () => {
    setSelectedIds(selectedIds.size === rows.length ? new Set() : new Set(rows.map(r => r.id)));
  };

  const bulkDelete = async () => {
    if (!confirm(`Hapus ${selectedIds.size} artikel yang dipilih?`)) return;
    await Promise.all(Array.from(selectedIds).map(id => fetch(`/api/admin/blog/${id}`, { method: 'DELETE' })));
    setRows(prev => prev.filter(r => !selectedIds.has(r.id)));
    setCount(c => c - selectedIds.size);
    setSelectedIds(new Set());
  };

  const bulkPublish = async (val: boolean) => {
    await Promise.all(Array.from(selectedIds).map(id =>
      fetch(`/api/admin/blog/${id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_published: val, published_at: val ? new Date().toISOString() : null }),
      })
    ));
    setRows(prev => prev.map(r => selectedIds.has(r.id) ? { ...r, is_published: val } : r));
    setSelectedIds(new Set());
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Blog</h1>
          <p className="text-sm text-muted-foreground">{count} artikel</p>
        </div>
        <Link href="/admin/blog/tambah">
          <Button className="bg-brand-600 hover:bg-brand-700"><Plus className="h-4 w-4 mr-2" /> Tulis Artikel</Button>
        </Link>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Cari judul artikel..." value={q} onChange={e => setQ(e.target.value)} className="pl-9 h-9" />
        </div>
        {(['all', 'published', 'draft'] as const).map(v => (
          <button key={v} onClick={() => setStatus(v)}
            className={`px-3 h-9 rounded-md text-sm border transition-colors ${status === v ? 'bg-brand-600 text-white border-brand-600' : 'border-input hover:bg-muted'}`}>
            {v === 'all' ? 'Semua' : v === 'published' ? 'Published' : 'Draft'}
          </button>
        ))}
        <select value={sort} onChange={e => { setSort(e.target.value); setPage(1); }}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm">
          <option value="created_at">Dibuat</option>
          <option value="published_at">Dipublish</option>
          <option value="title">Judul A-Z</option>
        </select>
        <button onClick={() => setDir(d => d === 'asc' ? 'desc' : 'asc')}
          className="h-9 px-3 rounded-md border border-input bg-background text-sm flex items-center gap-1 hover:bg-muted">
          {dir === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          {dir === 'asc' ? 'Lama→Baru' : 'Baru→Lama'}
        </button>
      </div>

      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 mb-4 p-3 bg-brand-50 border border-brand-200 rounded-lg">
          <CheckSquare className="h-4 w-4 text-brand-600" />
          <span className="text-sm font-medium">{selectedIds.size} dipilih</span>
          <div className="flex gap-2 ml-auto">
            <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => bulkPublish(true)}>✅ Publish</Button>
            <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => bulkPublish(false)}>📝 Draft</Button>
            <Button size="sm" variant="destructive" className="h-7 text-xs" onClick={bulkDelete}>
              <Trash2 className="h-3 w-3 mr-1" /> Hapus {selectedIds.size}
            </Button>
          </div>
        </div>
      )}

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-3 py-3 w-10">
                  <input type="checkbox" checked={rows.length > 0 && selectedIds.size === rows.length} onChange={toggleSelectAll} className="rounded" />
                </th>
                <th className="text-left px-4 py-3 font-medium">
                  <button onClick={() => toggleSort('title')} className="flex items-center gap-1 hover:text-brand-600">Judul <SortIcon col="title" /></button>
                </th>
                <th className="text-left px-4 py-3 font-medium">Penulis</th>
                <th className="text-left px-4 py-3 font-medium">
                  <button onClick={() => toggleSort('published_at')} className="flex items-center gap-1 hover:text-brand-600">Tanggal <SortIcon col="published_at" /></button>
                </th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-right px-4 py-3 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading && <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">Memuat...</td></tr>}
              {!loading && rows.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                  Belum ada artikel. <Link href="/admin/blog/tambah" className="text-brand-600 underline">Tulis sekarang</Link>
                </td></tr>
              )}
              {!loading && rows.map(row => {
                const isDeleting = deletingId === row.id;
                return (
                  <tr key={row.id} className={`hover:bg-muted/30 transition-colors ${selectedIds.has(row.id) ? 'bg-brand-50/50' : ''}`}>
                    <td className="px-3 py-3">
                      <input type="checkbox" checked={selectedIds.has(row.id)} onChange={() => toggleSelect(row.id)} className="rounded" />
                    </td>
                    <td className="px-4 py-3 font-medium max-w-[280px]">
                      <Link href={`/admin/blog/${row.id}`} className="hover:text-brand-600 truncate block">{row.title}</Link>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{row.author_name}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {row.published_at ? formatDate(row.published_at) : formatDate(row.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => togglePublished(row)}>
                        {row.is_published
                          ? <Badge className="bg-green-100 text-green-700 border-0 text-xs cursor-pointer hover:bg-green-200"><Eye className="h-3 w-3 mr-1" />Publish</Badge>
                          : <Badge variant="secondary" className="text-xs cursor-pointer hover:bg-muted"><EyeOff className="h-3 w-3 mr-1" />Draft</Badge>}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {isDeleting ? (
                        <div className="flex items-center justify-end gap-1">
                          <span className="text-xs text-red-600 mr-1">Hapus?</span>
                          <Button variant="destructive" size="sm" className="h-7 px-2 text-xs" onClick={() => confirmDelete(row.id)}>Ya</Button>
                          <Button variant="outline" size="sm" className="h-7 px-2 text-xs" onClick={() => setDeletingId(null)}>Batal</Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/admin/blog/${row.id}`}>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0"><Pencil className="h-3.5 w-3.5" /></Button>
                          </Link>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => setDeletingId(row.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      )}
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
