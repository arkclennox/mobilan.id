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

export default function TambahBlogPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '', slug: '', excerpt: '', content_html: '', featured_image_url: '',
    author_name: 'Admin', is_published: false, seo_title: '', seo_description: '',
  });

  function handleChange(field: string, value: string | boolean) {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === 'title' && !prev.slug) updated.slug = slugify(value as string);
      return updated;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    const res = await fetch('/api/admin/blog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const data = await res.json();
      router.push(`/admin/blog/${data.id}`);
    } else {
      const data = await res.json();
      setError(data.error || 'Terjadi kesalahan');
    }
    setSaving(false);
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/blog"><Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4 mr-1" /> Kembali</Button></Link>
        <h1 className="text-2xl font-bold">Tulis Artikel</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Info Artikel</h2>
          <div>
            <Label>Judul *</Label>
            <Input value={form.title} onChange={(e) => handleChange('title', e.target.value)} required placeholder="Judul artikel" className="mt-1" />
          </div>
          <div>
            <Label>Slug *</Label>
            <Input value={form.slug} onChange={(e) => handleChange('slug', e.target.value)} required className="mt-1" />
          </div>
          <div>
            <Label>Penulis</Label>
            <Input value={form.author_name} onChange={(e) => handleChange('author_name', e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label>Gambar Utama (URL)</Label>
            <Input value={form.featured_image_url} onChange={(e) => handleChange('featured_image_url', e.target.value)} placeholder="https://..." className="mt-1" />
          </div>
          <div>
            <Label>Ringkasan (Excerpt)</Label>
            <Textarea value={form.excerpt} onChange={(e) => handleChange('excerpt', e.target.value)} rows={2} placeholder="Ringkasan singkat artikel..." className="mt-1" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-3">Konten (HTML)</h2>
          <Textarea
            value={form.content_html}
            onChange={(e) => handleChange('content_html', e.target.value)}
            rows={20}
            placeholder="<p>Tulis konten artikel di sini dengan HTML...</p>"
            className="font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground mt-2">Masukkan konten dalam format HTML. Gunakan tag &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;img&gt;, dsb.</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">SEO</h2>
          <div>
            <Label>SEO Title</Label>
            <Input value={form.seo_title} onChange={(e) => handleChange('seo_title', e.target.value)} placeholder="Kosongkan untuk gunakan judul artikel" className="mt-1" />
          </div>
          <div>
            <Label>SEO Description</Label>
            <Textarea value={form.seo_description} onChange={(e) => handleChange('seo_description', e.target.value)} rows={2} placeholder="Maks 160 karakter" className="mt-1" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Publikasikan</p>
              <p className="text-xs text-muted-foreground">Tampilkan artikel ke publik</p>
            </div>
            <Switch checked={form.is_published} onCheckedChange={(v) => handleChange('is_published', v)} />
          </div>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex gap-3">
          <Button type="submit" className="bg-brand-600 hover:bg-brand-700" disabled={saving}>
            <Save className="h-4 w-4 mr-2" /> {saving ? 'Menyimpan...' : 'Simpan Artikel'}
          </Button>
          <Link href="/admin/blog"><Button type="button" variant="outline">Batal</Button></Link>
        </div>
      </form>
    </div>
  );
}
