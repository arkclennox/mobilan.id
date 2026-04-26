import Link from 'next/link';
import { MapPin, BookOpen, Tag, Building2, ArrowRight, Plus, Map } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabaseAdmin } from '@/lib/supabase';

async function getStats() {
  const [wisata, blog, kategori, penginapan, kota] = await Promise.all([
    supabaseAdmin.from('wisata_places').select('id', { count: 'exact', head: true }),
    supabaseAdmin.from('blog_posts').select('id', { count: 'exact', head: true }),
    supabaseAdmin.from('wisata_categories').select('id', { count: 'exact', head: true }),
    supabaseAdmin.from('accommodations').select('id', { count: 'exact', head: true }),
    supabaseAdmin.from('cities').select('id', { count: 'exact', head: true }),
  ]);
  return {
    wisata: wisata.count ?? 0,
    blog: blog.count ?? 0,
    kategori: kategori.count ?? 0,
    penginapan: penginapan.count ?? 0,
    kota: kota.count ?? 0,
  };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const cards = [
    { title: 'Wisata', count: stats.wisata, icon: MapPin, href: '/admin/wisata', addHref: '/admin/wisata/tambah', color: 'text-blue-600 bg-blue-100' },
    { title: 'Kota / Daerah', count: stats.kota, icon: Map, href: '/admin/kota', addHref: '/admin/kota/tambah', color: 'text-teal-600 bg-teal-100' },
    { title: 'Blog Post', count: stats.blog, icon: BookOpen, href: '/admin/blog', addHref: '/admin/blog/tambah', color: 'text-green-600 bg-green-100' },
    { title: 'Kategori', count: stats.kategori, icon: Tag, href: '/admin/kategori', addHref: '/admin/kategori/tambah', color: 'text-purple-600 bg-purple-100' },
    { title: 'Penginapan', count: stats.penginapan, icon: Building2, href: '/admin/penginapan', addHref: '/admin/penginapan/tambah', color: 'text-orange-600 bg-orange-100' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Ringkasan konten Mobilan.id</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <Card key={card.href}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2.5 rounded-lg ${card.color}`}>
                  <card.icon className="h-5 w-5" />
                </div>
                <Link href={card.addHref}>
                  <Button size="sm" variant="ghost" className="h-7 w-7 p-0 rounded-full">
                    <Plus className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <p className="text-3xl font-bold">{card.count}</p>
              <p className="text-sm text-muted-foreground mt-0.5">{card.title}</p>
              <Link href={card.href} className="flex items-center gap-1 text-xs text-brand-600 mt-3 hover:underline">
                Kelola <ArrowRight className="h-3 w-3" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-5">
            <h2 className="font-semibold mb-3">Aksi Cepat</h2>
            <div className="space-y-2">
              <Link href="/admin/wisata/tambah"><Button variant="outline" size="sm" className="w-full justify-start"><Plus className="h-4 w-4 mr-2" /> Tambah Wisata Baru</Button></Link>
              <Link href="/admin/blog/tambah"><Button variant="outline" size="sm" className="w-full justify-start"><Plus className="h-4 w-4 mr-2" /> Tulis Artikel Blog</Button></Link>
              <Link href="/admin/kategori/tambah"><Button variant="outline" size="sm" className="w-full justify-start"><Plus className="h-4 w-4 mr-2" /> Tambah Kategori</Button></Link>
              <Link href="/admin/penginapan/tambah"><Button variant="outline" size="sm" className="w-full justify-start"><Plus className="h-4 w-4 mr-2" /> Tambah Penginapan</Button></Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <h2 className="font-semibold mb-3">Panduan Pengisian Data</h2>
            <ol className="text-sm text-muted-foreground space-y-1.5 list-decimal list-inside">
              <li>Pastikan tabel Supabase sudah dibuat via <code className="text-xs bg-muted px-1 rounded">schema.sql</code></li>
              <li>Tambah Kategori Wisata terlebih dahulu</li>
              <li>Tambah data Wisata, pilih kota dan kategori</li>
              <li>Tambah Ticket Offers pada halaman edit wisata</li>
              <li>Tambah Penginapan, lalu hubungkan ke wisata</li>
              <li>Publish wisata ketika siap ditampilkan</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
