'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Trash2, Plus, X, ExternalLink, BedDouble } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

type City = { id: string; name: string; slug: string };
type Category = { id: string; name: string; slug: string; icon: string | null };
type Offer = { id: string; provider: string; title: string; affiliate_url: string; price_text: string | null; is_active: boolean };
type AccommodationOption = { id: string; name: string; slug: string; city_id: string | null };
type LinkedAccommodation = {
  id: string; // wisata_accommodations.id
  accommodation_id: string;
  distance_text: string | null;
  sort_order: number;
  accommodation: { id: string; name: string; provider: string; property_type: string | null };
};

export default function EditWisataPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [cities, setCities] = useState<City[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [allAccommodations, setAllAccommodations] = useState<AccommodationOption[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [linkedAccommodations, setLinkedAccommodations] = useState<LinkedAccommodation[]>([]);
  const [newOffer, setNewOffer] = useState({ provider: '', title: '', affiliate_url: '', price_text: '' });
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [newAccomId, setNewAccomId] = useState('');
  const [newAccomDistance, setNewAccomDistance] = useState('');
  const [showAccomForm, setShowAccomForm] = useState(false);

  const [form, setForm] = useState({
    name: '', slug: '', city_id: '', short_description: '', full_description: '',
    address: '', opening_hours: '', ticket_price_text: '', best_time_to_visit: '',
    suitable_for: '', tips: '', hero_image_url: '', latitude: '', longitude: '',
    is_featured: false, is_published: false, seo_title: '', seo_description: '',
  });

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch('/api/admin/data').then((r) => r.json()),
      fetch(`/api/admin/wisata/${id}`).then((r) => r.json()),
    ]).then(([meta, wisata]) => {
      setCities(meta.cities || []);
      setCategories(meta.categories || []);
      setAllAccommodations(meta.accommodations || []);
      if (wisata) {
        setForm({
          name: wisata.name || '', slug: wisata.slug || '',
          city_id: wisata.city_id || '', short_description: wisata.short_description || '',
          full_description: wisata.full_description || '', address: wisata.address || '',
          opening_hours: wisata.opening_hours || '', ticket_price_text: wisata.ticket_price_text || '',
          best_time_to_visit: wisata.best_time_to_visit || '', suitable_for: wisata.suitable_for || '',
          tips: wisata.tips || '', hero_image_url: wisata.hero_image_url || '',
          latitude: wisata.latitude ? String(wisata.latitude) : '',
          longitude: wisata.longitude ? String(wisata.longitude) : '',
          is_featured: wisata.is_featured || false, is_published: wisata.is_published || false,
          seo_title: wisata.seo_title || '', seo_description: wisata.seo_description || '',
        });
        setSelectedCategories((wisata.categories || []).map((c: { wisata_category_id: string }) => c.wisata_category_id));
        setOffers(wisata.activity_offers || []);
        setLinkedAccommodations(wisata.linked_accommodations || []);
      }
      setLoading(false);
    });
  }, [id]);

  function handleChange(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function toggleCategory(catId: string) {
    setSelectedCategories((prev) => prev.includes(catId) ? prev.filter((c) => c !== catId) : [...prev, catId]);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);

    const nullify = (v: string) => v.trim() || null;
    const res = await fetch(`/api/admin/wisata/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name, slug: form.slug, city_id: form.city_id || null,
        short_description: nullify(form.short_description), full_description: nullify(form.full_description),
        address: nullify(form.address), opening_hours: nullify(form.opening_hours),
        ticket_price_text: nullify(form.ticket_price_text), best_time_to_visit: nullify(form.best_time_to_visit),
        suitable_for: nullify(form.suitable_for), tips: nullify(form.tips),
        hero_image_url: nullify(form.hero_image_url), seo_title: nullify(form.seo_title),
        seo_description: nullify(form.seo_description),
        latitude: form.latitude ? parseFloat(form.latitude) : null,
        longitude: form.longitude ? parseFloat(form.longitude) : null,
        is_featured: form.is_featured, is_published: form.is_published,
        category_ids: selectedCategories,
      }),
    });
    if (res.ok) { setSuccess(true); } else { const d = await res.json(); setError(d.error || 'Terjadi kesalahan'); }
    setSaving(false);
  }

  async function handleDelete() {
    if (!confirm('Hapus wisata ini? Semua data terkait akan ikut terhapus.')) return;
    await fetch(`/api/admin/wisata/${id}`, { method: 'DELETE' });
    router.push('/admin/wisata');
  }

  async function addOffer() {
    if (!newOffer.provider || !newOffer.title || !newOffer.affiliate_url) return;
    const res = await fetch('/api/admin/offers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newOffer, wisata_place_id: id, is_active: true, sort_order: offers.length }),
    });
    if (res.ok) {
      const offer = await res.json();
      setOffers((prev) => [...prev, offer]);
      setNewOffer({ provider: '', title: '', affiliate_url: '', price_text: '' });
      setShowOfferForm(false);
    }
  }

  async function deleteOffer(offerId: string) {
    await fetch(`/api/admin/offers/${offerId}`, { method: 'DELETE' });
    setOffers((prev) => prev.filter((o) => o.id !== offerId));
  }

  async function addAccommodation() {
    if (!newAccomId) return;
    const alreadyLinked = linkedAccommodations.some((a) => a.accommodation_id === newAccomId);
    if (alreadyLinked) return;
    const res = await fetch('/api/admin/wisata-accommodations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        wisata_place_id: id,
        accommodation_id: newAccomId,
        distance_text: newAccomDistance.trim() || null,
        sort_order: linkedAccommodations.length,
      }),
    });
    if (res.ok) {
      const linked = await res.json();
      setLinkedAccommodations((prev) => [...prev, linked]);
      setNewAccomId('');
      setNewAccomDistance('');
      setShowAccomForm(false);
    }
  }

  async function removeAccommodation(linkId: string) {
    await fetch(`/api/admin/wisata-accommodations/${linkId}`, { method: 'DELETE' });
    setLinkedAccommodations((prev) => prev.filter((a) => a.id !== linkId));
  }

  if (loading) return <div className="p-8 text-muted-foreground text-sm">Memuat data...</div>;

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/wisata"><Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4 mr-1" /> Kembali</Button></Link>
          <h1 className="text-2xl font-bold">Edit Wisata</h1>
        </div>
        <div className="flex gap-2">
          <Link href={`/wisata/${form.slug}`} target="_blank">
            <Button variant="outline" size="sm"><ExternalLink className="h-3.5 w-3.5 mr-1" /> Preview</Button>
          </Link>
          <Button variant="destructive" size="sm" onClick={handleDelete}><Trash2 className="h-3.5 w-3.5 mr-1" /> Hapus</Button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Info Dasar */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Info Dasar</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label>Nama Wisata *</Label>
              <Input value={form.name} onChange={(e) => handleChange('name', e.target.value)} required className="mt-1" />
            </div>
            <div className="col-span-2">
              <Label>Slug *</Label>
              <Input value={form.slug} onChange={(e) => handleChange('slug', e.target.value)} required className="mt-1" />
            </div>
          </div>
          <div>
            <Label>Kota</Label>
            <Select value={form.city_id} onValueChange={(v) => handleChange('city_id', v)}>
              <SelectTrigger className="mt-1"><SelectValue placeholder="Pilih kota..." /></SelectTrigger>
              <SelectContent>
                {cities.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Deskripsi Singkat</Label>
            <Textarea value={form.short_description} onChange={(e) => handleChange('short_description', e.target.value)} rows={2} className="mt-1" />
          </div>
          <div>
            <Label>Deskripsi Lengkap</Label>
            <Textarea value={form.full_description} onChange={(e) => handleChange('full_description', e.target.value)} rows={5} className="mt-1" />
          </div>
        </div>

        {/* Kategori */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-3">Kategori</h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                <Checkbox checked={selectedCategories.includes(cat.id)} onCheckedChange={() => toggleCategory(cat.id)} />
                <span className="text-sm">{cat.icon} {cat.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Detail Kunjungan */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Detail Kunjungan</h2>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Alamat</Label><Input value={form.address} onChange={(e) => handleChange('address', e.target.value)} className="mt-1" /></div>
            <div><Label>Jam Buka</Label><Input value={form.opening_hours} onChange={(e) => handleChange('opening_hours', e.target.value)} className="mt-1" /></div>
            <div><Label>Harga Tiket</Label><Input value={form.ticket_price_text} onChange={(e) => handleChange('ticket_price_text', e.target.value)} className="mt-1" /></div>
            <div><Label>Waktu Terbaik</Label><Input value={form.best_time_to_visit} onChange={(e) => handleChange('best_time_to_visit', e.target.value)} className="mt-1" /></div>
            <div><Label>Cocok Untuk</Label><Input value={form.suitable_for} onChange={(e) => handleChange('suitable_for', e.target.value)} className="mt-1" /></div>
            <div><Label>Foto Utama (URL)</Label><Input value={form.hero_image_url} onChange={(e) => handleChange('hero_image_url', e.target.value)} className="mt-1" /></div>
            <div><Label>Latitude</Label><Input type="number" step="any" value={form.latitude} onChange={(e) => handleChange('latitude', e.target.value)} className="mt-1" /></div>
            <div><Label>Longitude</Label><Input type="number" step="any" value={form.longitude} onChange={(e) => handleChange('longitude', e.target.value)} className="mt-1" /></div>
          </div>
          <div><Label>Tips Berkunjung</Label><Textarea value={form.tips} onChange={(e) => handleChange('tips', e.target.value)} rows={3} className="mt-1" /></div>
        </div>

        {/* Ticket Offers */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Tiket & Aktivitas Affiliate</h2>
            <Button type="button" size="sm" variant="outline" onClick={() => setShowOfferForm(true)}>
              <Plus className="h-3.5 w-3.5 mr-1" /> Tambah Offer
            </Button>
          </div>
          <div className="space-y-2">
            {offers.map((offer) => (
              <div key={offer.id} className="flex items-center justify-between p-3 bg-muted/40 rounded-lg">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">{offer.provider}</Badge>
                    <span className="text-sm font-medium">{offer.title}</span>
                    {!offer.is_active && <Badge variant="secondary" className="text-xs">Nonaktif</Badge>}
                  </div>
                  {offer.price_text && <p className="text-xs text-muted-foreground mt-0.5">{offer.price_text}</p>}
                </div>
                <Button type="button" variant="ghost" size="sm" onClick={() => deleteOffer(offer.id)} className="text-red-500 hover:text-red-600 h-7 w-7 p-0">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {offers.length === 0 && !showOfferForm && (
              <p className="text-sm text-muted-foreground">Belum ada ticket offer.</p>
            )}
          </div>
          {showOfferForm && (
            <div className="mt-3 p-4 border border-dashed border-brand-300 rounded-lg space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Provider *</Label>
                  <Input value={newOffer.provider} onChange={(e) => setNewOffer((p) => ({ ...p, provider: e.target.value }))} placeholder="Traveloka, tiket.com, Klook" className="mt-1 h-8 text-sm" />
                </div>
                <div>
                  <Label className="text-xs">Harga (opsional)</Label>
                  <Input value={newOffer.price_text} onChange={(e) => setNewOffer((p) => ({ ...p, price_text: e.target.value }))} placeholder="Mulai Rp 25.000" className="mt-1 h-8 text-sm" />
                </div>
                <div className="col-span-2">
                  <Label className="text-xs">Judul Offer *</Label>
                  <Input value={newOffer.title} onChange={(e) => setNewOffer((p) => ({ ...p, title: e.target.value }))} placeholder="Tiket Kawah Ijen" className="mt-1 h-8 text-sm" />
                </div>
                <div className="col-span-2">
                  <Label className="text-xs">Affiliate URL *</Label>
                  <Input value={newOffer.affiliate_url} onChange={(e) => setNewOffer((p) => ({ ...p, affiliate_url: e.target.value }))} placeholder="https://..." className="mt-1 h-8 text-sm" />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="button" size="sm" className="bg-brand-600 hover:bg-brand-700 h-7 text-xs" onClick={addOffer}>Simpan Offer</Button>
                <Button type="button" size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setShowOfferForm(false)}>Batal</Button>
              </div>
            </div>
          )}
        </div>

        {/* Penginapan Terdekat */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <BedDouble className="h-4 w-4 text-muted-foreground" />
              <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Penginapan Terdekat</h2>
            </div>
            <Button type="button" size="sm" variant="outline" onClick={() => setShowAccomForm(true)}>
              <Plus className="h-3.5 w-3.5 mr-1" /> Hubungkan
            </Button>
          </div>
          <div className="space-y-2">
            {linkedAccommodations.map((link) => (
              <div key={link.id} className="flex items-center justify-between p-3 bg-muted/40 rounded-lg">
                <div>
                  <p className="text-sm font-medium">{link.accommodation?.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {link.accommodation?.property_type && (
                      <Badge variant="outline" className="text-xs">{link.accommodation.property_type}</Badge>
                    )}
                    {link.distance_text && (
                      <span className="text-xs text-muted-foreground">{link.distance_text}</span>
                    )}
                  </div>
                </div>
                <Button type="button" variant="ghost" size="sm" onClick={() => removeAccommodation(link.id)} className="text-red-500 hover:text-red-600 h-7 w-7 p-0">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {linkedAccommodations.length === 0 && !showAccomForm && (
              <p className="text-sm text-muted-foreground">Belum ada penginapan terhubung. Klik "Hubungkan" untuk menambahkan.</p>
            )}
          </div>
          {showAccomForm && (
            <div className="mt-3 p-4 border border-dashed border-brand-300 rounded-lg space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <Label className="text-xs">Pilih Penginapan *</Label>
                  <Select value={newAccomId} onValueChange={setNewAccomId}>
                    <SelectTrigger className="mt-1 h-8 text-sm"><SelectValue placeholder="Pilih penginapan..." /></SelectTrigger>
                    <SelectContent>
                      {allAccommodations
                        .filter((a) => !linkedAccommodations.some((l) => l.accommodation_id === a.id))
                        .map((a) => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label className="text-xs">Jarak / Keterangan (opsional)</Label>
                  <Input value={newAccomDistance} onChange={(e) => setNewAccomDistance(e.target.value)} placeholder="±500m dari pintu masuk" className="mt-1 h-8 text-sm" />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="button" size="sm" className="bg-brand-600 hover:bg-brand-700 h-7 text-xs" onClick={addAccommodation} disabled={!newAccomId}>Simpan</Button>
                <Button type="button" size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setShowAccomForm(false)}>Batal</Button>
              </div>
            </div>
          )}
        </div>

        {/* SEO */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">SEO</h2>
          <div><Label>SEO Title</Label><Input value={form.seo_title} onChange={(e) => handleChange('seo_title', e.target.value)} className="mt-1" /></div>
          <div><Label>SEO Description</Label><Textarea value={form.seo_description} onChange={(e) => handleChange('seo_description', e.target.value)} rows={2} className="mt-1" /></div>
        </div>

        {/* Status */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Status</h2>
          <div className="flex items-center justify-between">
            <div><p className="font-medium text-sm">Wisata Unggulan</p><p className="text-xs text-muted-foreground">Tampil di homepage</p></div>
            <Switch checked={form.is_featured} onCheckedChange={(v) => handleChange('is_featured', v)} />
          </div>
          <div className="flex items-center justify-between">
            <div><p className="font-medium text-sm">Publikasikan</p><p className="text-xs text-muted-foreground">Tampilkan ke publik</p></div>
            <Switch checked={form.is_published} onCheckedChange={(v) => handleChange('is_published', v)} />
          </div>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}
        {success && <p className="text-sm text-green-600">Perubahan berhasil disimpan.</p>}

        <div className="flex gap-3">
          <Button type="submit" className="bg-brand-600 hover:bg-brand-700" disabled={saving}>
            <Save className="h-4 w-4 mr-2" /> {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </Button>
          <Link href="/admin/wisata"><Button type="button" variant="outline">Batal</Button></Link>
        </div>
      </form>
    </div>
  );
}
