'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

type City = { id: string; name: string };

export default function EditPenginapanPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [cities, setCities] = useState<City[]>([]);
  const [form, setForm] = useState({
    name: '', slug: '', city_id: '', area: '', short_description: '', image_url: '',
    provider: '', affiliate_url: '', property_type: '', price_label: '', address_short: '', is_published: true,
  });

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/data').then((r) => r.json()),
      fetch(`/api/admin/penginapan/${id}`).then((r) => r.json()),
    ]).then(([meta, p]) => {
      setCities(meta.cities || []);
      if (p) setForm({ name: p.name || '', slug: p.slug || '', city_id: p.city_id || '', area: p.area || '', short_description: p.short_description || '', image_url: p.image_url || '', provider: p.provider || '', affiliate_url: p.affiliate_url || '', property_type: p.property_type || '', price_label: p.price_label || '', address_short: p.address_short || '', is_published: p.is_published ?? true });
      setLoading(false);
    });
  }, [id]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);

    const nullify = (v: string) => v.trim() || null;
    const res = await fetch(`/api/admin/penginapan/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        slug: form.slug,
        city_id: form.city_id || null,
        area: nullify(form.area),
        provider: form.provider,
        affiliate_url: form.affiliate_url,
        property_type: nullify(form.property_type),
        price_label: nullify(form.price_label),
        image_url: nullify(form.image_url),
        address_short: nullify(form.address_short),
        short_description: nullify(form.short_description),
        is_published: form.is_published,
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
    if (!confirm('Hapus penginapan ini?')) return;
    await fetch(`/api/admin/penginapan/${id}`, { method: 'DELETE' });
    router.push('/admin/penginapan');
  }

  if (loading) return <div className="p-8 text-muted-foreground text-sm">Memuat...</div>;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/penginapan"><Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4 mr-1" /> Kembali</Button></Link>
          <h1 className="text-2xl font-bold">Edit Penginapan</h1>
        </div>
        <Button variant="destructive" size="sm" onClick={handleDelete}><Trash2 className="h-3.5 w-3.5 mr-1" /> Hapus</Button>
      </div>
      <form onSubmit={handleSave} className="space-y-5 bg-card border border-border rounded-xl p-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2"><Label>Nama *</Label><Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required className="mt-1" /></div>
          <div className="col-span-2"><Label>Slug *</Label><Input value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} required className="mt-1" /></div>
          <div>
            <Label>Kota</Label>
            <Select value={form.city_id} onValueChange={(v) => setForm((p) => ({ ...p, city_id: v }))}>
              <SelectTrigger className="mt-1"><SelectValue placeholder="Pilih kota..." /></SelectTrigger>
              <SelectContent>{cities.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><Label>Area</Label><Input value={form.area} onChange={(e) => setForm((p) => ({ ...p, area: e.target.value }))} className="mt-1" /></div>
          <div><Label>Provider *</Label><Input value={form.provider} onChange={(e) => setForm((p) => ({ ...p, provider: e.target.value }))} required className="mt-1" /></div>
          <div><Label>Tipe Properti</Label><Input value={form.property_type} onChange={(e) => setForm((p) => ({ ...p, property_type: e.target.value }))} className="mt-1" /></div>
          <div><Label>Label Harga</Label><Input value={form.price_label} onChange={(e) => setForm((p) => ({ ...p, price_label: e.target.value }))} className="mt-1" /></div>
          <div><Label>Foto (URL)</Label><Input value={form.image_url} onChange={(e) => setForm((p) => ({ ...p, image_url: e.target.value }))} className="mt-1" /></div>
          <div className="col-span-2"><Label>Affiliate URL *</Label><Input value={form.affiliate_url} onChange={(e) => setForm((p) => ({ ...p, affiliate_url: e.target.value }))} required className="mt-1" /></div>
          <div className="col-span-2"><Label>Deskripsi Singkat</Label><Textarea value={form.short_description} onChange={(e) => setForm((p) => ({ ...p, short_description: e.target.value }))} rows={2} className="mt-1" /></div>
        </div>
        <div className="flex items-center justify-between"><Label>Aktifkan</Label><Switch checked={form.is_published} onCheckedChange={(v) => setForm((p) => ({ ...p, is_published: v }))} /></div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        {success && <p className="text-sm text-green-600">Perubahan berhasil disimpan.</p>}
        <Button type="submit" className="bg-brand-600 hover:bg-brand-700 w-full" disabled={saving}>
          <Save className="h-4 w-4 mr-2" /> {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
        </Button>
      </form>
    </div>
  );
}
