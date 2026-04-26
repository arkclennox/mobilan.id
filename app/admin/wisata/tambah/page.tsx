'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';

type City = { id: string; name: string; slug: string };
type Category = { id: string; name: string; slug: string; icon: string | null };

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function TambahWisataPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cities, setCities] = useState<City[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const [form, setForm] = useState({
    name: '', slug: '', city_id: '', short_description: '', full_description: '',
    address: '', opening_hours: '', ticket_price_text: '', best_time_to_visit: '',
    suitable_for: '', tips: '', hero_image_url: '', latitude: '', longitude: '',
    is_featured: false, is_published: false, seo_title: '', seo_description: '',
  });

  useEffect(() => {
    fetch('/api/admin/data').then((r) => r.json()).then((d) => {
      setCities(d.cities || []);
      setCategories(d.categories || []);
    });
  }, []);

  function handleChange(field: string, value: string | boolean) {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === 'name' && !prev.slug) updated.slug = slugify(value as string);
      return updated;
    });
  }

  function toggleCategory(id: string) {
    setSelectedCategories((prev) => prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/admin/wisata', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        latitude: form.latitude ? parseFloat(form.latitude) : null,
        longitude: form.longitude ? parseFloat(form.longitude) : null,
        city_id: form.city_id || null,
        category_ids: selectedCategories,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      router.push(`/admin/wisata/${data.id}`);
    } else {
      const data = await res.json();
      setError(data.error || 'Terjadi kesalahan');
    }
    setLoading(false);
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/wisata"><Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4 mr-1" /> Kembali</Button></Link>
        <h1 className="text-2xl font-bold">Tambah Wisata</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Info Dasar */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Info Dasar</h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label>Nama Wisata *</Label>
              <Input value={form.name} onChange={(e) => handleChange('name', e.target.value)} placeholder="Contoh: Kawah Ijen" required className="mt-1" />
            </div>
            <div className="col-span-2">
              <Label>Slug *</Label>
              <Input value={form.slug} onChange={(e) => handleChange('slug', e.target.value)} placeholder="kawah-ijen" required className="mt-1" />
            </div>
          </div>

          <div>
            <Label>Kota</Label>
            <Select onValueChange={(v) => handleChange('city_id', v)}>
              <SelectTrigger className="mt-1"><SelectValue placeholder="Pilih kota..." /></SelectTrigger>
              <SelectContent>
                {cities.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Deskripsi Singkat</Label>
            <Textarea value={form.short_description} onChange={(e) => handleChange('short_description', e.target.value)} placeholder="1-2 kalimat ringkasan" rows={2} className="mt-1" />
          </div>

          <div>
            <Label>Deskripsi Lengkap</Label>
            <Textarea value={form.full_description} onChange={(e) => handleChange('full_description', e.target.value)} placeholder="Deskripsi panjang tentang wisata ini..." rows={5} className="mt-1" />
          </div>
        </div>

        {/* Kategori */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-3">Kategori</h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={selectedCategories.includes(cat.id)}
                  onCheckedChange={() => toggleCategory(cat.id)}
                />
                <span className="text-sm">{cat.icon} {cat.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Detail Kunjungan */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Detail Kunjungan</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Alamat</Label>
              <Input value={form.address} onChange={(e) => handleChange('address', e.target.value)} placeholder="Jl. ..." className="mt-1" />
            </div>
            <div>
              <Label>Jam Buka</Label>
              <Input value={form.opening_hours} onChange={(e) => handleChange('opening_hours', e.target.value)} placeholder="08.00 - 17.00 WIB" className="mt-1" />
            </div>
            <div>
              <Label>Harga Tiket</Label>
              <Input value={form.ticket_price_text} onChange={(e) => handleChange('ticket_price_text', e.target.value)} placeholder="Rp 25.000 - Rp 50.000" className="mt-1" />
            </div>
            <div>
              <Label>Waktu Terbaik</Label>
              <Input value={form.best_time_to_visit} onChange={(e) => handleChange('best_time_to_visit', e.target.value)} placeholder="April - Oktober (musim kemarau)" className="mt-1" />
            </div>
            <div>
              <Label>Cocok Untuk</Label>
              <Input value={form.suitable_for} onChange={(e) => handleChange('suitable_for', e.target.value)} placeholder="Keluarga, pasangan, solo traveler" className="mt-1" />
            </div>
            <div>
              <Label>Foto Utama (URL)</Label>
              <Input value={form.hero_image_url} onChange={(e) => handleChange('hero_image_url', e.target.value)} placeholder="https://..." className="mt-1" />
            </div>
            <div>
              <Label>Latitude</Label>
              <Input type="number" step="any" value={form.latitude} onChange={(e) => handleChange('latitude', e.target.value)} placeholder="-8.0629" className="mt-1" />
            </div>
            <div>
              <Label>Longitude</Label>
              <Input type="number" step="any" value={form.longitude} onChange={(e) => handleChange('longitude', e.target.value)} placeholder="114.2417" className="mt-1" />
            </div>
          </div>
          <div>
            <Label>Tips Berkunjung</Label>
            <Textarea value={form.tips} onChange={(e) => handleChange('tips', e.target.value)} placeholder="Tips penting untuk pengunjung..." rows={3} className="mt-1" />
          </div>
        </div>

        {/* SEO */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">SEO (Opsional)</h2>
          <div>
            <Label>SEO Title</Label>
            <Input value={form.seo_title} onChange={(e) => handleChange('seo_title', e.target.value)} placeholder="Biarkan kosong untuk auto-generate" className="mt-1" />
          </div>
          <div>
            <Label>SEO Description</Label>
            <Textarea value={form.seo_description} onChange={(e) => handleChange('seo_description', e.target.value)} rows={2} placeholder="Maksimal 160 karakter" className="mt-1" />
          </div>
        </div>

        {/* Publish */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Status</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Wisata Unggulan</p>
              <p className="text-xs text-muted-foreground">Ditampilkan di homepage</p>
            </div>
            <Switch checked={form.is_featured} onCheckedChange={(v) => handleChange('is_featured', v)} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Publikasikan</p>
              <p className="text-xs text-muted-foreground">Tampilkan ke publik</p>
            </div>
            <Switch checked={form.is_published} onCheckedChange={(v) => handleChange('is_published', v)} />
          </div>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex gap-3">
          <Button type="submit" className="bg-brand-600 hover:bg-brand-700" disabled={loading}>
            <Save className="h-4 w-4 mr-2" /> {loading ? 'Menyimpan...' : 'Simpan Wisata'}
          </Button>
          <Link href="/admin/wisata"><Button type="button" variant="outline">Batal</Button></Link>
        </div>
      </form>
    </div>
  );
}
