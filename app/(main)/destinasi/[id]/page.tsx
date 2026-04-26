import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { WisataCard } from '@/components/wisata/wisata-card';
import { ArrowLeft, MapPin, Clock, Car, Mountain } from 'lucide-react';
import { getCityBySlug } from '@/lib/queries/cities';
import { getWisataPlaces } from '@/lib/queries/wisata';
import citiesData from '@/data/cities.json';

export const revalidate = 60;

export async function generateStaticParams() {
  return citiesData.map((city) => ({ id: city.id }));
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const cityJson = citiesData.find((c) => c.id === params.id);
  if (!cityJson) return { title: 'Destinasi Tidak Ditemukan' };

  return {
    title: `Wisata di ${cityJson.name} — Rekomendasi Liburan & Tiket Online`,
    description: `Temukan tempat wisata terbaik di ${cityJson.name}, ${cityJson.province}. Info tiket, jam buka, dan penginapan terdekat.`,
    openGraph: {
      title: `Wisata di ${cityJson.name}`,
      description: cityJson.description,
      images: [cityJson.image],
    },
  };
}

export default async function DestinationDetailPage({ params }: { params: { id: string } }) {
  const cityJson = citiesData.find((c) => c.id === params.id);
  if (!cityJson) notFound();

  // Fetch wisata dari Supabase (city slug = params.id dari cities.json)
  const { data: wisataList } = await getWisataPlaces({ citySlug: params.id, limit: 8 });

  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="relative h-80 md:h-96">
        <Image
          src={cityJson.image}
          alt={cityJson.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="container mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold">{cityJson.name}</h1>
            <p className="mt-1 text-white/80">{cityJson.province}</p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbLink href="/destinasi">Destinasi</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>{cityJson.name}</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">Tentang {cityJson.name}</h2>
                <p className="text-muted-foreground leading-relaxed mb-6">{cityJson.description}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-brand-600 shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Provinsi</p>
                      <p className="text-sm text-muted-foreground">{cityJson.province}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-brand-600 shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Koordinat</p>
                      <p className="text-sm text-muted-foreground">
                        {cityJson.coordinates.lat.toFixed(4)}, {cityJson.coordinates.lng.toFixed(4)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Wisata dari Supabase */}
            {wisataList.length > 0 ? (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">Wisata di {cityJson.name}</h2>
                  <Link href={`/wisata?kota=${params.id}`}>
                    <Button variant="outline" size="sm">Lihat Semua</Button>
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {wisataList.map((wisata) => (
                    <WisataCard key={wisata.id} wisata={wisata} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-muted/30 rounded-xl p-8 text-center">
                <Mountain className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Wisata segera hadir</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Data wisata untuk {cityJson.name} sedang kami persiapkan.
                </p>
                <Link href="/wisata">
                  <Button variant="outline" size="sm">Jelajahi Wisata Lainnya</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Rencanakan Perjalanan</h3>
                <p className="text-muted-foreground text-sm mb-6">
                  Hitung estimasi biaya BBM ke {cityJson.name} dengan kalkulator kami.
                </p>
                <div className="space-y-3 mb-6 text-sm">
                  <div className="flex items-center gap-3">
                    <Car className="h-4 w-4 text-brand-600" />
                    <span>Berbagai pilihan kendaraan</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-brand-600" />
                    <span>Estimasi waktu tempuh</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-brand-600" />
                    <span>Jarak akurat</span>
                  </div>
                </div>
                <Button asChild className="w-full bg-brand-600 hover:bg-brand-700">
                  <Link href="/kalkulator">Hitung Biaya Perjalanan</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Tips Perjalanan</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Periksa kondisi kendaraan sebelum berangkat</li>
                  <li>• Cek cuaca dan kondisi jalan terkini</li>
                  <li>• Bawa perlengkapan darurat kendaraan</li>
                  <li>• Istirahat setiap 2 jam sekali</li>
                  <li>• Pesan tiket dan penginapan lebih awal</li>
                </ul>
              </CardContent>
            </Card>

            <Link href="/destinasi">
              <Button variant="ghost" className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali ke Semua Destinasi
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
