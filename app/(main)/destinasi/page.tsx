import React from 'react';
import { Metadata } from 'next';
import { DestinationCard } from '@/components/destination-card';
import { MapPin, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import citiesData from '@/data/cities.json';

export const metadata: Metadata = {
  title: 'Destinasi Wisata Indonesia',
  description: 'Jelajahi destinasi wisata populer di Indonesia dengan estimasi biaya perjalanan yang akurat.',
};

export default function DestinasiPage() {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Destinasi Wisata Indonesia
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Temukan destinasi wisata terbaik di Indonesia dengan estimasi biaya perjalanan yang akurat
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Cari destinasi..."
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {citiesData.map((city) => (
              <DestinationCard
                key={city.id}
                id={city.id}
                name={city.name}
                description={city.description}
                image={city.image}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}