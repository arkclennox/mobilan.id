import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Clock, Tag, Users, Sun, Lightbulb, Ticket, BedDouble } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { WisataCard } from '@/components/wisata/wisata-card';
import { OfferCard } from '@/components/wisata/offer-card';
import { AccommodationCard } from '@/components/wisata/accommodation-card';
import { FAQSection } from '@/components/wisata/faq-section';
import { getWisataBySlug, getNearbyWisata } from '@/lib/queries/wisata';

export const revalidate = 60;

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const wisata = await getWisataBySlug(params.slug);
  if (!wisata) return { title: 'Wisata Tidak Ditemukan' };

  const title = wisata.seo_title || `${wisata.name} — Info Tiket, Jam Buka & Penginapan Terdekat`;
  const description = wisata.seo_description || wisata.short_description || `Temukan info lengkap ${wisata.name}: lokasi, jam buka, tiket, dan penginapan terdekat.`;

  return {
    title,
    description,
    alternates: { canonical: `https://mobilan.id/wisata/${wisata.slug}` },
    openGraph: {
      title,
      description,
      images: wisata.hero_image_url ? [wisata.hero_image_url] : [],
      url: `https://mobilan.id/wisata/${wisata.slug}`,
      type: 'article',
    },
  };
}

export default async function WisataDetailPage({ params }: Props) {
  const wisata = await getWisataBySlug(params.slug);
  if (!wisata) notFound();

  const nearbyWisata = wisata.city_id
    ? await getNearbyWisata(wisata.city_id, wisata.slug, 4)
    : [];

  const allImages = [
    ...(wisata.hero_image_url ? [{ image_url: wisata.hero_image_url, alt_text: wisata.name }] : []),
    ...(wisata.images || []).filter((img) => img.image_url !== wisata.hero_image_url),
  ];

  const faqItems = [
    wisata.opening_hours && { question: `Jam buka ${wisata.name}?`, answer: wisata.opening_hours },
    wisata.ticket_price_text && { question: `Berapa harga tiket masuk ${wisata.name}?`, answer: wisata.ticket_price_text },
    wisata.address && { question: `Di mana lokasi ${wisata.name}?`, answer: wisata.address },
    wisata.best_time_to_visit && { question: `Kapan waktu terbaik mengunjungi ${wisata.name}?`, answer: wisata.best_time_to_visit },
    wisata.suitable_for && { question: `${wisata.name} cocok untuk siapa?`, answer: wisata.suitable_for },
    wisata.tips && { question: `Tips berkunjung ke ${wisata.name}?`, answer: wisata.tips },
  ].filter(Boolean) as { question: string; answer: string }[];

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name: wisata.name,
    description: wisata.short_description || wisata.full_description,
    image: wisata.hero_image_url,
    address: wisata.address ? { '@type': 'PostalAddress', streetAddress: wisata.address, addressLocality: wisata.city?.name, addressCountry: 'ID' } : undefined,
    ...(wisata.latitude && wisata.longitude ? { geo: { '@type': 'GeoCoordinates', latitude: wisata.latitude, longitude: wisata.longitude } } : {}),
    url: `https://mobilan.id/wisata/${wisata.slug}`,
  };

  const activeOffers = (wisata.activity_offers || []).filter((o) => o.is_active);
  const accommodations = (wisata.accommodations || []).filter((a) => a.accommodation != null);

  return (
    <div className="min-h-screen pt-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      {/* Hero */}
      <section className="relative h-72 md:h-96">
        {allImages[0] ? (
          <Image
            src={allImages[0].image_url}
            alt={allImages[0].alt_text || wisata.name}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-muted" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="container mx-auto">
            {wisata.categories && wisata.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {wisata.categories.map((cat) => (
                  <Link key={cat.slug} href={`/wisata?kategori=${cat.slug}`}>
                    <Badge className="bg-white/20 hover:bg-white/30 border-0 text-white text-xs">
                      {cat.icon} {cat.name}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}
            <h1 className="text-3xl md:text-4xl font-bold">{wisata.name}</h1>
            {wisata.city && (
              <p className="mt-1 text-white/80 flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <Link href={`/destinasi/${wisata.city.slug}`} className="hover:underline">
                  {wisata.city.name}{wisata.city.province ? `, ${wisata.city.province}` : ''}
                </Link>
              </p>
            )}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbLink href="/wisata">Wisata</BreadcrumbLink></BreadcrumbItem>
            {wisata.city && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem><BreadcrumbLink href={`/wisata?kota=${wisata.city.slug}`}>{wisata.city.name}</BreadcrumbLink></BreadcrumbItem>
              </>
            )}
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>{wisata.name}</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Short description */}
            {wisata.short_description && (
              <p className="text-lg text-muted-foreground leading-relaxed">{wisata.short_description}</p>
            )}

            {/* Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {wisata.opening_hours && (
                <InfoItem icon={<Clock className="h-5 w-5 text-brand-600" />} label="Jam Buka" value={wisata.opening_hours} />
              )}
              {wisata.ticket_price_text && (
                <InfoItem icon={<Tag className="h-5 w-5 text-brand-600" />} label="Harga Tiket" value={wisata.ticket_price_text} />
              )}
              {wisata.suitable_for && (
                <InfoItem icon={<Users className="h-5 w-5 text-brand-600" />} label="Cocok Untuk" value={wisata.suitable_for} />
              )}
              {wisata.best_time_to_visit && (
                <InfoItem icon={<Sun className="h-5 w-5 text-brand-600" />} label="Waktu Terbaik" value={wisata.best_time_to_visit} />
              )}
              {wisata.address && (
                <InfoItem icon={<MapPin className="h-5 w-5 text-brand-600" />} label="Alamat" value={wisata.address} className="col-span-2" />
              )}
            </div>

            {/* Full Description */}
            {wisata.full_description && (
              <div>
                <h2 className="text-xl font-bold mb-3">Tentang {wisata.name}</h2>
                <div className="prose prose-sm max-w-none dark:prose-invert text-muted-foreground leading-relaxed">
                  {wisata.full_description.split('\n').map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Tips */}
            {wisata.tips && (
              <div className="bg-brand-50 dark:bg-brand-950/20 rounded-xl p-5 border border-brand-100 dark:border-brand-900/30">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="h-5 w-5 text-brand-600" />
                  <h3 className="font-semibold text-brand-800 dark:text-brand-200">Tips Berkunjung</h3>
                </div>
                <p className="text-sm text-brand-700 dark:text-brand-300 leading-relaxed">{wisata.tips}</p>
              </div>
            )}

            {/* Galeri */}
            {allImages.length > 1 && (
              <div>
                <h2 className="text-xl font-bold mb-3">Galeri Foto</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {allImages.slice(1, 7).map((img, i) => (
                    <div key={i} className="relative h-36 rounded-lg overflow-hidden">
                      <Image src={img.image_url} alt={img.alt_text || wisata.name} fill className="object-cover hover:scale-105 transition-transform duration-300" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ticket Offers */}
            {activeOffers.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Ticket className="h-5 w-5 text-brand-600" />
                  <h2 className="text-xl font-bold">Pesan Tiket Online</h2>
                </div>
                <p className="text-sm text-muted-foreground mb-4">Beli tiket lebih mudah lewat partner resmi kami</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {activeOffers.map((offer) => (
                    <OfferCard key={offer.id} offer={offer} wisataName={wisata.name} wisataSlug={wisata.slug} />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  * Link di atas mengandung tautan afiliasi. Kami mendapat komisi kecil tanpa biaya tambahan untuk Anda.{' '}
                  <Link href="/disclaimer-afiliasi" className="underline">Baca selengkapnya</Link>
                </p>
              </div>
            )}

            {/* FAQ */}
            <FAQSection items={faqItems} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Penginapan Terdekat */}
            {accommodations.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <BedDouble className="h-5 w-5 text-brand-600" />
                  <h2 className="text-lg font-bold">Penginapan Terdekat</h2>
                </div>
                <div className="space-y-4">
                  {accommodations.map((item) => (
                    <AccommodationCard key={item.id} item={item} wisataName={wisata.name} wisataSlug={wisata.slug} />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  * Link penginapan di atas adalah tautan afiliasi.
                </p>
              </div>
            )}

            {/* Map */}
            {wisata.latitude && wisata.longitude && (
              <div>
                <h3 className="font-semibold mb-3">Lokasi</h3>
                <div className="rounded-xl overflow-hidden border border-border">
                  <iframe
                    title={`Peta lokasi ${wisata.name}`}
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${wisata.longitude - 0.01},${wisata.latitude - 0.01},${wisata.longitude + 0.01},${wisata.latitude + 0.01}&layer=mapnik&marker=${wisata.latitude},${wisata.longitude}`}
                    width="100%"
                    height="220"
                    style={{ border: 0, display: 'block' }}
                    loading="lazy"
                    allowFullScreen
                  />
                </div>
                <a
                  href={`https://maps.google.com/?q=${wisata.latitude},${wisata.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-brand-600 transition-colors"
                >
                  <MapPin className="h-3.5 w-3.5" />
                  Buka di Google Maps
                </a>
              </div>
            )}

            {/* Kalkulator link */}
            <div className="bg-brand-50 dark:bg-brand-950/20 rounded-xl p-5 border border-brand-100 dark:border-brand-900/30">
              <h3 className="font-semibold mb-2 text-brand-800 dark:text-brand-200">Rencanakan Perjalanan</h3>
              <p className="text-sm text-brand-600 dark:text-brand-300 mb-4">
                Hitung estimasi biaya BBM menuju {wisata.city?.name || 'destinasi ini'}
              </p>
              <Button asChild className="w-full bg-brand-600 hover:bg-brand-700 text-white">
                <Link href="/kalkulator">Hitung Biaya Perjalanan</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Wisata Terdekat */}
        {nearbyWisata.length > 0 && (
          <section className="mt-16 pt-8 border-t border-border">
            <h2 className="text-2xl font-bold mb-6">
              Wisata Lain di {wisata.city?.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {nearbyWisata.map((w) => (
                <WisataCard key={w.id} wisata={w} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value, className = '' }: { icon: React.ReactNode; label: string; value: string; className?: string }) {
  return (
    <div className={`bg-muted/50 rounded-lg p-3 ${className}`}>
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}
