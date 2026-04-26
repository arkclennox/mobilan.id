'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

export default function EditKategoriPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({ name: '', slug: '', description: '', icon: '', is_featured: false });

  useEffect(() => {
    fetch(`/api/admin/kategori/${id}`).then((r) => r.json()).then((cat) => {
      if (cat) setForm({ name: cat.name || '', slug: cat.slug || '', description: cat.description || '', icon: cat.icon || '', is_featured: cat.is_featured || false });
      setLoading(false);
    });
  }, [id]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);
    const res = await fetch(`/api/admin/kategori/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        slug: form.slug,
        icon: form.icon.trim() || null,
        description: form.description.trim() || null,
        is_featured: form.is_featured,
      }),
    });
    if (res.ok) {
      setSuccess(true);
    } else {
      const d = await res.json();
      setError(d.error || 'Terjadi kesalahan');
    }
    setSaving(false);
  }

  async function handleDelete() {
    if (!confirm('Hapus kategori ini?')) return;
    await fetch(`/api/admin/kategori/${id}`, { method: 'DELETE' });
    router.push('/admin/kategori');
  }

  if (loading) return <div className="p-8 text-muted-foreground text-sm">Memuat...</div>;

  return (
    <div className="max-w-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/kategori"><Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4 mr-1" /> Kembali</Button></Link>
          <h1 className="text-2xl font-bold">Edit Kategori</h1>
        </div>
        <Button variant="destructive" size="sm" onClick={handleDelete}><Trash2 className="h-3.5 w-3.5 mr-1" /> Hapus</Button>
      </div>
      <form onSubmit={handleSave} className="space-y-5 bg-card border border-border rounded-xl p-5">
        <div><Label>Nama *</Label><Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required className="mt-1" /></div>
        <div><Label>Slug *</Label><Input value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} required className="mt-1" /></div>
        <div><Label>Ikon (Emoji)</Label><Input value={form.icon} onChange={(e) => setForm((p) => ({ ...p, icon: e.target.value }))} className="mt-1" /></div>
        <div><Label>Deskripsi</Label><Textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={2} className="mt-1" /></div>
        <div className="flex items-center justify-between"><Label>Tampil di Beranda</Label><Switch checked={form.is_featured} onCheckedChange={(v) => setForm((p) => ({ ...p, is_featured: v }))} /></div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        {success && <p className="text-sm text-green-600">Perubahan berhasil disimpan.</p>}
        <Button type="submit" className="bg-brand-600 hover:bg-brand-700 w-full" disabled={saving}>
          <Save className="h-4 w-4 mr-2" /> {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
        </Button>
      </form>
    </div>
  );
}
