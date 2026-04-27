'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { Plus, Search, Eye, EyeOff, Pencil, Trash2, ExternalLink, ChevronUp, ChevronDown, Ticket, Upload, CheckSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ImportModal } from '@/components/admin/import-modal';

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

const WISATA_COLUMN_MAP: Record<string, string> = {
  name: 'name', nama: 'name', nama_wisata: 'name', 'nama wisata': 'name',
  slug: 'slug',
  city_slug: 'city_slug', kota: 'city_slug', city: 'city_slug', kota_slug: 'city_slug',
  short_description: 'short_description', deskripsi: 'short_description', deskripsi_singkat: 'short_description',
  full_description: 'full_description', deskripsi_lengkap: 'full_description', konten: 'full_description',
  address: 'address', alamat: 'address',
  latitude: 'latitude', lat: 'latitude',
  longitude: 'longitude', lng: 'longitude', lon: 'longitude',
  opening_hours: 'opening_hours', jam_buka: 'opening_hours', 'jam buka': 'opening_hours',
  ticket_price_text: 'ticket_price_text', harga_tiket: 'ticket_price_text', 'harga tiket': 'ticket_price_text', tiket: 'ticket_price_text',
  best_time_to_visit: 'best_time_to_visit', waktu_terbaik: 'best_time_to_visit',
  suitable_for: 'suitable_for', cocok_untuk: 'suitable_for',
  tips: 'tips',
  hero_image_url: 'hero_image_url', foto: 'hero_image_url', gambar: 'hero_image_url', image: 'hero_image_url', image_url: 'hero_image_url',
  is_published: 'is_published', published: 'is_published', aktif: 'is_published',
  is_featured: 'is_featured', featured: 'is_featured', unggulan: 'is_featured',
};

const WISATA_PREVIEW_FIELDS = [
  { key: 'name', label: 'Nama' },
  { key: 'city_slug', label: 'Kota' },
  { key: 'short_description', label: 'Deskripsi' },
  { key: 'latitude', label: 'Lat' },
  { key: 'longitude', label: 'Lng' },
];

export default function AdminWisataPage() {
  const [rows, setRows] = useState<WisataRow[]>([]);
  const [count, setCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [cities, setCities] = useState<City[]>([]);
  const [showImport, setShowImport] = useState(false);

  // Filters
  const [q, setQ] = useState('');
  const [debouncedQ, setDebouncedQ] = useState('');
  const [status, setStatus] = useState('all');
  const [featured, setFeatured] = useState('all');
  const [kota, setKota] = useState('');
  const [sort, setSort] = useState('created_at');
  const [dir, setDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);

  // Selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [bulkAction, setBulkAction] = useState('');

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => { setDebouncedQ(q); setPage(1); }, 400);
  }, [q]);

  useEffect(() => {
    fetch('/api/admin/data').then(r => r.json()).then(d => setCities(d.cities || []));
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const p = new URLSearchParams({ q: debouncedQ, status, featured, kota, sort, dir, page: String(page), limit: '50' });
    const res = await fetch(`/api/admin/wisata?${p}`);
    if (res.ok) {
      const json = await res.json();
      setRows(json.data || []);
      setCount(json.count ?? 0);
      setTotalPages(json.totalPages ?? 1);
    }
    setLoading(false);
    setSelectedIds(new Set());
  }, [debouncedQ, status, featured, kota, sort, dir, page]);

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => { setPage(1); }, [status, featured, kota, sort, dir]);

  const toggleSort = (col: string) => {
    if (sort === col) setDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSort(col); setDir('desc'); }
  };

  const SortIcon = ({ col }: { col: string }) =>
    sort !== col ? <ChevronUp className="h-3 w-3 opacity-20" /> :
    dir === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />;

  const patchRow = async (id: string, patch: Record<string, unknown>) => {
    const res = await fetch(`/api/admin/wisata/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    });
    return res.ok;
  };

  const togglePublished = async (row: WisataRow) => {
    const newVal = !row.is_published;
    setRows(prev => prev.map(r => r.id === row.id ? { ...r, is_published: newVal } : r));
    if (!await patchRow(row.id, { is_published: newVal })) {
      setRows(prev => prev.map(r => r.id === row.id ? { ...r, is_published: row.is_published } : r));
    }
  };

  const toggleFeatured = async (row: WisataRow) => {
    const newVal = !row.is_featured;
    setRows(prev => prev.map(r => r.id === row.id ? { ...r, is_featured: newVal } : r));
    if (!await patchRow(row.id, { is_featured: newVal })) {
      setRows(prev => prev.map(r => r.id === row.id ? { ...r, is_featured: row.is_featured } : r));
    }
  };

  const confirmDelete = async (id: string) => {
    const res = await fetch(`/api/admin/wisata/${id}`, { method: 'DELETE' });
    if (res.ok) { setRows(prev => prev.filter(r => r.id !== id)); setCount(c => c - 1); }
    else alert('Gagal menghapus wisata');
    setDeletingId(null);
  };

  // Bulk operations
  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === rows.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(rows.map(r => r.id)));
  };

  const executeBulkAction = async () => {
    if (!bulkAction || selectedIds.size === 0) return;
    const ids = Array.from(selectedIds);

    if (bulkAction === 'delete') {
      if (!confirm(`Hapus ${ids.length} wisata yang dipilih?`)) return;
      await Promise.all(ids.map(id => fetch(`/api/admin/wisata/${id}`, { method: 'DELETE' })));
      setRows(prev => prev.filter(r => !selectedIds.has(r.id)));
      setCount(c => c - ids.length);
      setSelectedIds(new Set());
    } else if (bulkAction === 'publish' || bulkAction === 'draft') {
      const newVal = bulkAction === 'publish';
      await Promise.all(ids.map(id => patchRow(id, { is_published: newVal })));
      setRows(prev => prev.map(r => selectedIds.has(r.id) ? { ...r, is_published: newVal } : r));
      setSelectedIds(new Set());
    } else if (bulkAction === 'featured' || bulkAction === 'unfeatured') {
      const newVal = bulkAction === 'featured';
      await Promise.all(ids.map(id => patchRow(id, { is_featured: newVal })));
      setRows(prev => prev.map(r => selectedIds.has(r.id) ? { ...r, is_featured: newVal } : r));
      setSelectedIds(new Set());
    }
    setBulkAction('');
  };

  const offerCount = (row: WisataRow) => (row.offers as unknown as { count: number }[])?.[0]?.count ?? 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Wisata</h1>
          <p className="text-sm text-muted-foreground">{count} tempat wisata</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowImport(true)}>
            <Upload className="h-4 w-4 mr-2" /> Import CSV/XLSX
          </Button>
          <Link href="/admin/wisata/tambah">
            <Button className="bg-brand-600 hover:bg-brand-700">
              <Plus className="h-4 w-4 mr-2" /> Tambah
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Cari nama wisata..." value={q} onChange={e => setQ(e.target.value)} className="pl-9 h-9" />
        </div>
        {(['all', 'published', 'draft'] as const).map(v => (
          <button key={v} onClick={() => setStatus(v)}
            className={`px-3 h-9 rounded-md text-sm border transition-colors ${status === v ? 'bg-brand-600 text-white border-brand-600' : 'border-input hover:bg-muted'}`}>
            {v === 'all' ? 'Semua' : v === 'published' ? 'Published' : 'Draft'}
          </button>
        ))}
        <select value={featured} onChange={e => setFeatured(e.target.value)} className="h-9 rounded-md border border-input bg-background px-3 text-sm">
          <option value="all">Semua Featured</option>
          <option value="yes">Featured ⭐</option>
          <option value="no">Tidak Featured</option>
        </select>
        <select value={kota} onChange={e => setKota(e.target.value)} className="h-9 rounded-md border border-input bg-background px-3 text-sm">
          <option value="">Semua Kota</option>
          {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {/* Bulk action bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 mb-4 p-3 bg-brand-50 border border-brand-200 rounded-lg">
          <CheckSquare className="h-4 w-4 text-brand-600" />
          <span className="text-sm font-medium">{selectedIds.size} dipilih</span>
          <div className="flex gap-2 ml-auto flex-wrap">
            <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => { setBulkAction('publish'); executeBulkAction(); }}>✅ Publish</Button>
            <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => { setBulkAction('draft'); executeBulkAction(); }}>📝 Draft</Button>
            <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => { setBulkAction('featured'); executeBulkAction(); }}>⭐ Featured</Button>
            <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => { setBulkAction('unfeatured'); executeBulkAction(); }}>☆ Unfeatured</Button>
            <Button size="sm" variant="destructive" className="h-7 text-xs" onClick={() => { setBulkAction('delete'); executeBulkAction(); }}>
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
                  <input type="checkbox" checked={rows.length > 0 && selectedIds.size === rows.length}
                    onChange={toggleSelectAll} className="rounded" />
                </th>
                <th className="text-left px-4 py-3 font-medium">
                  <button onClick={() => toggleSort('name')} className="flex items-center gap-1 hover:text-brand-600">Nama <SortIcon col="name" /></button>
                </th>
                <th className="text-left px-4 py-3 font-medium">Kota</th>
                <th className="text-left px-4 py-3 font-medium">Tiket</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium">Featured</th>
                <th className="text-left px-4 py-3 font-medium">
                  <button onClick={() => toggleSort('created_at')} className="flex items-center gap-1 hover:text-brand-600">Dibuat <SortIcon col="created_at" /></button>
                </th>
                <th className="text-right px-4 py-3 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading && <tr><td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">Memuat...</td></tr>}
              {!loading && rows.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-10 text-center text-muted-foreground">
                  Tidak ada wisata. <Link href="/admin/wisata/tambah" className="text-brand-600 underline">Tambah sekarang</Link>
                </td></tr>
              )}
              {!loading && rows.map(row => {
                const offers = offerCount(row);
                const isDeleting = deletingId === row.id;
                return (
                  <tr key={row.id} className={`hover:bg-muted/30 transition-colors ${selectedIds.has(row.id) ? 'bg-brand-50/50' : ''}`}>
                    <td className="px-3 py-3">
                      <input type="checkbox" checked={selectedIds.has(row.id)} onChange={() => toggleSelect(row.id)} className="rounded" />
                    </td>
                    <td className="px-4 py-3 font-medium max-w-[200px]">
                      <Link href={`/admin/wisata/${row.id}`} className="hover:text-brand-600 truncate block">{row.name}</Link>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{row.city?.name || '-'}</td>
                    <td className="px-4 py-3">
                      {offers > 0
                        ? <Badge className="bg-green-100 text-green-700 border-0 text-xs gap-1"><Ticket className="h-3 w-3" />{offers}</Badge>
                        : <span className="text-muted-foreground text-xs">-</span>}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => togglePublished(row)}>
                        {row.is_published
                          ? <Badge className="bg-green-100 text-green-700 border-0 text-xs cursor-pointer hover:bg-green-200"><Eye className="h-3 w-3 mr-1" />Publish</Badge>
                          : <Badge variant="secondary" className="text-xs cursor-pointer hover:bg-muted"><EyeOff className="h-3 w-3 mr-1" />Draft</Badge>}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleFeatured(row)} title="Toggle featured"
                        className={`text-lg transition-transform hover:scale-125 ${row.is_featured ? 'text-yellow-500' : 'opacity-20'}`}>⭐</button>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {new Date(row.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
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
                          <a href={`/wisata/${row.slug}`} target="_blank" rel="noopener noreferrer" title="Lihat publik">
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0"><ExternalLink className="h-3.5 w-3.5" /></Button>
                          </a>
                          <Link href={`/admin/wisata/${row.id}`}>
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
          <span className="text-sm text-muted-foreground px-3">Hal. {page} / {totalPages} ({count} total)</span>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Selanjutnya →</Button>
        </div>
      )}

      <ImportModal
        isOpen={showImport}
        onClose={() => setShowImport(false)}
        title="Import Wisata dari CSV/XLSX"
        columnMap={WISATA_COLUMN_MAP}
        previewFields={WISATA_PREVIEW_FIELDS}
        importEndpoint="/api/admin/wisata/import"
        onSuccess={fetchData}
      />
    </div>
  );
}
