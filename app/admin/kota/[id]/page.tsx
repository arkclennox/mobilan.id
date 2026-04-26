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

const ISLANDS = ['Jawa', 'Sumatra', 'Kalimantan', 'Sulawesi', 'Bali & Nusa Tenggara', 'Maluku', 'Papua'];

type FormState = {
  name: string;
  slug: string;
  province: string;
  island: string;
  description: string;
  hero_image_url: string;
  latitude: string;
  longitude: string;
  is_featured: boolean;
  seo_title: string;
  seo_description: string;
};

export default function EditKotaPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState<FormState>({
    name: '', slug: '', province: '', island: '', description: '',
    hero_image_url: '', latitude: '', longitude: '',
    is_featured: false, seo_title: '', seo_description: '',
  });

  useEffect(() => {
    fetch(`/api/admin/kota/${id}`)
      .then((r) => r.json())
      .then((city) => {
        if (city) {
          setForm({
            name: city.name || '',
            slug: city.slug || '',
            province: city.province || '',
            island: city.island || '',
            description: city.description || '',
            hero_image_url: city.hero_image_url || '',
            latitude: city.latitude != null ? String(city.latitude) : '',
            longitude: city.longitude != null ? String(city.longitude) : '',
            is_featured: city.is_featured || false,
            seo_title: city.seo_title || '',
            seo_description: city.seo_description || '',
          });
        }
        setLoading(false);
      });
  }, [id]);

  function handleChange(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);

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

    const res = await fetch(`/api/admin/kota/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
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
    if (!confirm(`Hapus kota "${form.name}"? Aksi ini tidak bisa dibatalkan.`)) return;
    await fetch(`/api/admin/kota/${id}`, { method: 'DELETE' });
    router.push('/admin/kota');
  }

  if (loading) return <div className="p-8 text-muted-foreground text-sm">Memuat...</div>;

  return (
    <div className="max-w-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/kota">
            <Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4 mr-1" /> Kembali</Button>
          </Link>
          <h1 className="text-2xl font-bold">Edit Kota</h1>
        </div>
        <Button variant="destructive" size="sm" onClick={handleDelete}>
          <Trash2 className="h-3.5 w-3.5 mr-1" /> Hapus
        </Button>
      </div>

      <form onSubmit={handleSave} className="space-y-5 bg-card border border-border rounded-xl p-5">
        <div>
          <Label>Nama Kota *</Label>
          <Input value={form.name} onChange={(e) => handleChange('name', e.target.value)} required className="mt-1" />
        </div>

        <div>
          <Label>Slug *</Label>
          <Input value={form.slug} onChange={(e) => handleChange('slug', e.target.value)} required className="mt-1" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Provinsi</Label>
            <Input value={form.province} onChange={(e) => handleChange('province', e.target.value)} className="mt-1" />
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
          <Textarea value={form.description} onChange={(e) => handleChange('description', e.target.value)} rows={3} className="mt-1" />
        </div>

        <div>
          <Label>URL Foto Utama</Label>
          <Input value={form.hero_image_url} onChange={(e) => handleChange('hero_image_url', e.target.value)} className="mt-1" placeholder="https://..." />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Latitude</Label>
            <Input type="number" step="any" value={form.latitude} onChange={(e) => handleChange('latitude', e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label>Longitude</Label>
            <Input type="number" step="any" value={form.longitude} onChange={(e) => handleChange('longitude', e.target.value)} className="mt-1" />
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
        {success && <p className="text-sm text-green-600">Perubahan berhasil disimpan.</p>}

        <Button type="submit" className="bg-brand-600 hover:bg-brand-700 w-full" disabled={saving}>
          <Save className="h-4 w-4 mr-2" /> {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
        </Button>
      </form>
    </div>
  );
}
