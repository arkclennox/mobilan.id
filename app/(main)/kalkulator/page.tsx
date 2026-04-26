import React from 'react';
import { Metadata } from 'next';
import { TravelCalculator } from '@/components/calculator/travel-calculator';

export const metadata: Metadata = {
  title: 'Kalkulator BBM Perjalanan',
  description: 'Hitung estimasi biaya BBM, jarak, dan waktu tempuh untuk perjalanan antar kota di Indonesia.',
};

export default function KalkulatorPage() {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Kalkulator BBM Perjalanan
            </h1>
            <p className="text-xl text-muted-foreground">
              Rencanakan perjalanan Anda dengan perhitungan biaya BBM yang akurat berdasarkan jenis kendaraan dan rute perjalanan
            </p>
          </div>
        </div>
      </section>

      {/* Calculator */}
      <TravelCalculator />
    </div>
  );
}