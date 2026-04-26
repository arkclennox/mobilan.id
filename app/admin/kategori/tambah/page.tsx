'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function TambahKategoriPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', slug: '', description: '', icon: '', is_featured: false });

  function handleChange(field: string, value: string | boolean) {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === 'name' && !prev.slug) updated.slug = slugify(value as string);
      return updated;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch('/api/admin/kategori', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      router.push('/admin/kategori');
    } else {
      const d = await res.json();
      setError(d.error || 'Error');
    }
    setSaving(false);
  }

  return (
    <div className="max-w-lg">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/kategori"><Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4 mr-1" /> Kembali</Button></Link>
        <h1 className="text-2xl font-bold">Tambah Kategori</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5 bg-card border border-border rounded-xl p-5">
        <div><Label>Nama *</Label><Input value={form.name} onChange={(e) => handleChange('name', e.target.value)} required className="mt-1" placeholder="Wisata Alam" /></div>
        <div><Label>Slug *</Label><Input value={form.slug} onChange={(e) => handleChange('slug', e.target.value)} required className="mt-1" /></div>
        <div><Label>Ikon (Emoji)</Label><Input value={form.icon} onChange={(e) => handleChange('icon', e.target.value)} className="mt-1" placeholder="🏔️" /></div>
        <div><Label>Deskripsi</Label><Textarea value={form.description} onChange={(e) => handleChange('description', e.target.value)} rows={2} className="mt-1" /></div>
        <div className="flex items-center justify-between">
          <Label>Tampil di Beranda</Label>
          <Switch checked={form.is_featured} onCheckedChange={(v) => handleChange('is_featured', v)} />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button type="submit" className="bg-brand-600 hover:bg-brand-700 w-full" disabled={saving}>
          <Save className="h-4 w-4 mr-2" /> {saving ? 'Menyimpan...' : 'Simpan'}
        </Button>
      </form>
    </div>
  );
}
