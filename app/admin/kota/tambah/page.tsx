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

const ISLANDS = ['Jawa', 'Sumatra', 'Kalimantan', 'Sulawesi', 'Bali & Nusa Tenggara', 'Maluku', 'Papua'];

export default function TambahKotaPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    slug: '',
    province: '',
    island: '',
    description: '',
    hero_image_url: '',
    latitude: '',
    longitude: '',
    is_featured: false,
    seo_title: '',
    seo_description: '',
  });

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
    setError('');

    const payload = {
      ...form,
      latitude: form.latitude ? parseFloat(form.latitude) : null,
      longitude: form.longitude ? parseFloat(form.longitude) : null,
      province: form.province || null,
      island: form.island || null,
      description: form.description || null,
      hero_image_url: form.hero_image_url || null,
      seo_title: form.seo_title || null,
      seo_description: form.seo_description || null,
    };

    const res = await fetch('/api/admin/kota', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      router.push('/admin/kota');
    } else {
      const d = await res.json();
      setError(d.error || 'Terjadi kesalahan');
    }
    setSaving(false);
  }

  return (
    <div className="max-w-xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/kota">
          <Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4 mr-1" /> Kembali</Button>
        </Link>
        <h1 className="text-2xl font-bold">Tambah Kota / Daerah</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 bg-card border border-border rounded-xl p-5">
        <div>
          <Label>Nama Kota *</Label>
          <Input value={form.name} onChange={(e) => handleChange('name', e.target.value)} required className="mt-1" placeholder="Yogyakarta" />
        </div>

        <div>
          <Label>Slug *</Label>
          <Input value={form.slug} onChange={(e) => handleChange('slug', e.target.value)} required className="mt-1" placeholder="yogyakarta" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Provinsi</Label>
            <Input value={form.province} onChange={(e) => handleChange('province', e.target.value)} className="mt-1" placeholder="DI Yogyakarta" />
          </div>
          <div>
            <Label>Pulau</Label>
            <select
              value={form.island}
              onChange={(e) => handleChange('island', e.target.value)}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">— Pilih Pulau —</option>
              {ISLANDS.map((isl) => <option key={isl} value={isl}>{isl}</option>)}
            </select>
          </div>
        </div>

        <div>
          <Label>Deskripsi</Label>
          <Textarea value={form.description} onChange={(e) => handleChange('description', e.target.value)} rows={3} className="mt-1" placeholder="Kota budaya dengan beragam destinasi wisata..." />
        </div>

        <div>
          <Label>URL Foto Utama</Label>
          <Input value={form.hero_image_url} onChange={(e) => handleChange('hero_image_url', e.target.value)} className="mt-1" placeholder="https://..." />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Latitude</Label>
            <Input type="number" step="any" value={form.latitude} onChange={(e) => handleChange('latitude', e.target.value)} className="mt-1" placeholder="-7.7956" />
          </div>
          <div>
            <Label>Longitude</Label>
            <Input type="number" step="any" value={form.longitude} onChange={(e) => handleChange('longitude', e.target.value)} className="mt-1" placeholder="110.3695" />
          </div>
        </div>

        <div>
          <Label>SEO Title</Label>
          <Input value={form.seo_title} onChange={(e) => handleChange('seo_title', e.target.value)} className="mt-1" />
        </div>

        <div>
          <Label>SEO Description</Label>
          <Textarea value={form.seo_description} onChange={(e) => handleChange('seo_description', e.target.value)} rows={2} className="mt-1" />
        </div>

        <div className="flex items-center justify-between">
          <Label>Tampil di Beranda (Featured)</Label>
          <Switch checked={form.is_featured} onCheckedChange={(v) => handleChange('is_featured', v)} />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <Button type="submit" className="bg-brand-600 hover:bg-brand-700 w-full" disabled={saving}>
          <Save className="h-4 w-4 mr-2" /> {saving ? 'Menyimpan...' : 'Simpan Kota'}
        </Button>
      </form>
    </div>
  );
}
