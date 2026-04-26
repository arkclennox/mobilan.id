import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { TravelCalculator } from '@/components/calculator/travel-calculator';
import { DestinationCard } from '@/components/destination-card';
import { WisataCard } from '@/components/wisata/wisata-card';
import { ArrowRight, MapPin, Calculator, Clock, Shield, BookOpen, Calendar, User } from 'lucide-react';
import { getFeaturedCategories } from '@/lib/queries/categories';
import { getWisataPlaces } from '@/lib/queries/wisata';
import { getRecentBlogPosts } from '@/lib/queries/blog';
import citiesData from '@/data/cities.json';

export const revalidate = 60;

const popularDestinations = citiesData
  .filter((c) => ['jakarta', 'yogyakarta', 'denpasar', 'bandung'].includes(c.id))
  .map((c) => ({
    id: c.id,
    name: c.name,
    description: c.description,
    image: c.image,
  }));

const features = [
  { icon: Calculator, title: 'Kalkulator Akurat', description: 'Perhitungan biaya BBM berdasarkan jarak real dan konsumsi kendaraan' },
  { icon: MapPin, title: 'Directory Wisata', description: 'Ribuan tempat wisata Indonesia dengan info tiket dan penginapan' },
  { icon: Clock, title: 'Estimasi Waktu', description: 'Perkiraan waktu tempuh untuk merencanakan perjalanan Anda' },
  { icon: Shield, title: 'Info Terpercaya', description: 'Data wisata terkurasi dengan penawaran tiket affiliate terpilih' },
];

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default async function HomePage() {
  const [categories, { data: featuredWisata }, recentPosts] = await Promise.all([
    getFeaturedCategories(8),
    getWisataPlaces({ featured: true, limit: 6 }),
    getRecentBlogPosts(3),
  ]);

  return (
    <>
      {/* Hero */}
      <section
        className="relative h-screen flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.6) 100%), url('https://images.pexels.com/photos/1118448/pexels-photo-1118448.jpeg')` }}
      >
        <div className="text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Eksplor Wisata Indonesia
            <br />
            <span className="text-brand-400">Hitung Biaya Perjalanan</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            Temukan destinasi wisata terbaik, info tiket, penginapan, dan
            <br className="hidden md:block" /> hitung estimasi biaya perjalanan Anda.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-brand-600 hover:bg-brand-700 text-white px-8 py-4 text-lg">
              <Link href="/wisata">Temukan Wisata <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/20 px-8 py-4 text-lg bg-transparent">
              <Link href="#calculator">Hitung BBM</Link>
            </Button>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Mengapa Memilih Mobilan.id?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Platform perencanaan perjalanan dan eksplor wisata Indonesia</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <div key={i} className="text-center group">
                <div className="w-16 h-16 bg-brand-100 dark:bg-brand-900/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-600 transition-colors">
                  <feature.icon className="h-8 w-8 text-brand-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wisata Unggulan */}
      {featuredWisata.length > 0 && (
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-3">Wisata Unggulan</h2>
              <p className="text-muted-foreground">Destinasi terpopuler pilihan editorial Mobilan.id</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {featuredWisata.map((wisata) => (
                <WisataCard key={wisata.id} wisata={wisata} />
              ))}
            </div>
            <div className="text-center">
              <Button asChild variant="outline" size="lg">
                <Link href="/wisata">Jelajahi Semua Wisata <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Kalkulator */}
      <div id="calculator">
        <TravelCalculator />
      </div>

      {/* Destinasi Populer */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Destinasi Populer</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Jelajahi kota-kota favorit dengan estimasi biaya perjalanan</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {popularDestinations.map((destination) => (
              <DestinationCard
                key={destination.id}
                id={destination.id}
                name={destination.name}
                description={destination.description}
                image={destination.image}
              />
            ))}
          </div>
          <div className="text-center">
            <Button asChild variant="outline" size="lg">
              <Link href="/destinasi">Lihat Semua Destinasi <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Kategori Wisata */}
      {categories.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-3">Kategori Wisata</h2>
              <p className="text-muted-foreground">Temukan wisata sesuai minat Anda</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
              {categories.map((cat) => (
                <Link key={cat.slug} href={`/kategori/${cat.slug}`} className="group">
                  <div className="bg-card border border-border rounded-xl p-4 text-center hover:shadow-md hover:border-brand-300 transition-all hover:-translate-y-0.5">
                    <div className="text-3xl mb-2">{cat.icon || '🗺️'}</div>
                    <p className="text-sm font-medium group-hover:text-brand-600 transition-colors">{cat.name}</p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center">
              <Button asChild variant="outline" size="lg">
                <Link href="/kategori">Semua Kategori <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Blog */}
      {recentPosts.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-3">Artikel Terbaru</h2>
              <p className="text-muted-foreground">Tips dan panduan perjalanan wisata Indonesia</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {recentPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                  <article className="bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    {post.featured_image_url && (
                      <div className="relative h-44 overflow-hidden">
                        <Image src={post.featured_image_url} alt={post.title || ''} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                    )}
                    <div className="p-5">
                      {post.published_at && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(post.published_at)}</span>
                          {post.author_name && (
                            <>
                              <span>·</span>
                              <User className="h-3 w-3" />
                              <span>{post.author_name}</span>
                            </>
                          )}
                        </div>
                      )}
                      <h3 className="font-bold text-base mb-2 group-hover:text-brand-600 transition-colors line-clamp-2">{post.title}</h3>
                      {post.excerpt && (
                        <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                      )}
                    </div>
                  </article>
                </Link>
              ))}
            </div>
            <div className="text-center">
              <Button asChild variant="outline" size="lg">
                <Link href="/blog"><BookOpen className="mr-2 h-5 w-5" /> Lihat Semua Artikel</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 bg-brand-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Siap Memulai Perjalanan?</h2>
          <p className="text-xl mb-8 text-brand-100">Temukan wisata impian dan hitung biaya perjalanan sekarang</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" variant="secondary" className="bg-white text-brand-600 hover:bg-gray-100">
              <Link href="/wisata">Cari Wisata <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/20 bg-transparent">
              <Link href="#calculator">Hitung BBM</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
