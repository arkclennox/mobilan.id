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

type City = { id: string; name: string };

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function TambahPenginapanPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [cities, setCities] = useState<City[]>([]);
  const [form, setForm] = useState({
    name: '', slug: '', city_id: '', area: '', short_description: '', image_url: '',
    provider: '', affiliate_url: '', property_type: '', price_label: '', address_short: '', is_published: true,
  });

  useEffect(() => {
    fetch('/api/admin/data').then((r) => r.json()).then((d) => setCities(d.cities || []));
  }, []);

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
    const res = await fetch('/api/admin/penginapan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, city_id: form.city_id || null }),
    });
    if (res.ok) {
      router.push('/admin/penginapan');
    } else {
      const d = await res.json();
      setError(d.error || 'Error');
    }
    setSaving(false);
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/penginapan"><Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4 mr-1" /> Kembali</Button></Link>
        <h1 className="text-2xl font-bold">Tambah Penginapan</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5 bg-card border border-border rounded-xl p-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2"><Label>Nama *</Label><Input value={form.name} onChange={(e) => handleChange('name', e.target.value)} required className="mt-1" /></div>
          <div className="col-span-2"><Label>Slug *</Label><Input value={form.slug} onChange={(e) => handleChange('slug', e.target.value)} required className="mt-1" /></div>
          <div>
            <Label>Kota</Label>
            <Select onValueChange={(v) => handleChange('city_id', v)}>
              <SelectTrigger className="mt-1"><SelectValue placeholder="Pilih kota..." /></SelectTrigger>
              <SelectContent>{cities.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><Label>Area / Kawasan</Label><Input value={form.area} onChange={(e) => handleChange('area', e.target.value)} placeholder="Dekat Alun-alun" className="mt-1" /></div>
          <div><Label>Provider *</Label><Input value={form.provider} onChange={(e) => handleChange('provider', e.target.value)} required placeholder="Traveloka, Agoda" className="mt-1" /></div>
          <div><Label>Tipe Properti</Label><Input value={form.property_type} onChange={(e) => handleChange('property_type', e.target.value)} placeholder="Hotel, Villa, Homestay" className="mt-1" /></div>
          <div><Label>Label Harga</Label><Input value={form.price_label} onChange={(e) => handleChange('price_label', e.target.value)} placeholder="Mulai Rp 200.000/malam" className="mt-1" /></div>
          <div><Label>Foto (URL)</Label><Input value={form.image_url} onChange={(e) => handleChange('image_url', e.target.value)} className="mt-1" /></div>
          <div className="col-span-2"><Label>Affiliate URL *</Label><Input value={form.affiliate_url} onChange={(e) => handleChange('affiliate_url', e.target.value)} required placeholder="https://..." className="mt-1" /></div>
          <div className="col-span-2"><Label>Deskripsi Singkat</Label><Textarea value={form.short_description} onChange={(e) => handleChange('short_description', e.target.value)} rows={2} className="mt-1" /></div>
        </div>
        <div className="flex items-center justify-between"><Label>Aktifkan</Label><Switch checked={form.is_published} onCheckedChange={(v) => handleChange('is_published', v)} /></div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button type="submit" className="bg-brand-600 hover:bg-brand-700 w-full" disabled={saving}>
          <Save className="h-4 w-4 mr-2" /> {saving ? 'Menyimpan...' : 'Simpan'}
        </Button>
      </form>
    </div>
  );
}
