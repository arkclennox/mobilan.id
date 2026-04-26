'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Trash2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    title: '', slug: '', excerpt: '', content_html: '', featured_image_url: '',
    author_name: 'Admin', is_published: false, seo_title: '', seo_description: '',
  });

  useEffect(() => {
    fetch(`/api/admin/blog/${id}`).then((r) => r.json()).then((post) => {
      if (post) {
        setForm({
          title: post.title || '',
          slug: post.slug || '',
          excerpt: post.excerpt || '',
          content_html: post.content_html || '',
          featured_image_url: post.featured_image_url || '',
          author_name: post.author_name || 'Admin',
          is_published: post.is_published || false,
          seo_title: post.seo_title || '',
          seo_description: post.seo_description || '',
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

    const nullify = (v: string) => v.trim() || null;
    const res = await fetch(`/api/admin/blog/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: form.title,
        slug: form.slug,
        author_name: form.author_name,
        featured_image_url: nullify(form.featured_image_url),
        excerpt: nullify(form.excerpt),
        content_html: nullify(form.content_html),
        seo_title: nullify(form.seo_title),
        seo_description: nullify(form.seo_description),
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
    if (!confirm('Hapus artikel ini?')) return;
    await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' });
    router.push('/admin/blog');
  }

  if (loading) return <div className="p-8 text-muted-foreground text-sm">Memuat data...</div>;

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/blog"><Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4 mr-1" /> Kembali</Button></Link>
          <h1 className="text-2xl font-bold">Edit Artikel</h1>
        </div>
        <div className="flex gap-2">
          <Link href={`/blog/${form.slug}`} target="_blank">
            <Button variant="outline" size="sm"><ExternalLink className="h-3.5 w-3.5 mr-1" /> Preview</Button>
          </Link>
          <Button variant="destructive" size="sm" onClick={handleDelete}><Trash2 className="h-3.5 w-3.5 mr-1" /> Hapus</Button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Info Artikel</h2>
          <div>
            <Label>Judul *</Label>
            <Input value={form.title} onChange={(e) => handleChange('title', e.target.value)} required className="mt-1" />
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
            <Input value={form.featured_image_url} onChange={(e) => handleChange('featured_image_url', e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label>Ringkasan (Excerpt)</Label>
            <Textarea value={form.excerpt} onChange={(e) => handleChange('excerpt', e.target.value)} rows={2} className="mt-1" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-3">Konten (HTML)</h2>
          <Textarea
            value={form.content_html}
            onChange={(e) => handleChange('content_html', e.target.value)}
            rows={20}
            className="font-mono text-sm"
          />
        </div>

        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">SEO</h2>
          <div><Label>SEO Title</Label><Input value={form.seo_title} onChange={(e) => handleChange('seo_title', e.target.value)} className="mt-1" /></div>
          <div><Label>SEO Description</Label><Textarea value={form.seo_description} onChange={(e) => handleChange('seo_description', e.target.value)} rows={2} className="mt-1" /></div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Publikasikan</p>
              <p className="text-xs text-muted-foreground">Tampilkan ke publik</p>
            </div>
            <Switch checked={form.is_published} onCheckedChange={(v) => handleChange('is_published', v)} />
          </div>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}
        {success && <p className="text-sm text-green-600">Artikel berhasil disimpan.</p>}

        <div className="flex gap-3">
          <Button type="submit" className="bg-brand-600 hover:bg-brand-700" disabled={saving}>
            <Save className="h-4 w-4 mr-2" /> {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </Button>
          <Link href="/admin/blog"><Button type="button" variant="outline">Batal</Button></Link>
        </div>
      </form>
    </div>
  );
}
