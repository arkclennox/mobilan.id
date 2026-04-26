"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calculator, MapPin, Clock, Fuel } from 'lucide-react';
import citiesData from '@/data/cities.json';
import carsData from '@/data/cars.json';

interface CalculationResult {
  distance: number;
  fuelNeeded: number;
  totalCost: number;
  estimatedTime: number;
}

// Haversine formula to calculate distance between two coordinates
function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const toRad = (deg: number) => deg * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

// Format currency in Indonesian Rupiah
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}

// Format time in hours and minutes
function formatTime(hours: number): string {
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);
  
  if (wholeHours === 0) {
    return `${minutes} menit`;
  } else if (minutes === 0) {
    return `${wholeHours} jam`;
  } else {
    return `${wholeHours} jam ${minutes} menit`;
  }
}
export function TravelCalculator() {
  const [selectedCar, setSelectedCar] = useState<string>('');
  const [originCity, setOriginCity] = useState<string>('');
  const [destinationCity, setDestinationCity] = useState<string>('');
  const [fuelPrice, setFuelPrice] = useState<string>('10000');
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculate = async () => {
    if (!selectedCar || !originCity || !destinationCity || !fuelPrice) {
      alert('Mohon lengkapi semua field terlebih dahulu');
      return;
    }

    if (originCity === destinationCity) {
      alert('Kota asal dan tujuan tidak boleh sama');
      return;
    }

    setIsCalculating(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Find car data or use default consumption
    const car = carsData.find(c => c.id === selectedCar);
    const fuelConsumption = car ? car.fuelEfficiency : 10; // Default 10 km/L if car not found
    
    const origin = citiesData.find(c => c.id === originCity);
    const destination = citiesData.find(c => c.id === destinationCity);

    if (!origin || !destination) {
      alert('Data kota tidak valid');
      setIsCalculating(false);
      return;
    }

    // Calculate distance using Haversine formula
    const distance = Math.round(haversineDistance(
      origin.coordinates.lat,
      origin.coordinates.lng,
      destination.coordinates.lat,
      destination.coordinates.lng
    ));

    // Calculate fuel needed and total cost
    const fuelNeeded = Math.round((distance / fuelConsumption) * 10) / 10;
    const totalCost = Math.round(fuelNeeded * parseFloat(fuelPrice));
    const estimatedTime = Math.round((distance / 60) * 10) / 10; // Assuming average speed of 60 km/h

    setResult({
      distance,
      fuelNeeded,
      totalCost,
      estimatedTime,
    });

    setIsCalculating(false);
  };

  return (
    <section id="calculator" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Kalkulator BBM Perjalanan
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Hitung estimasi jarak, konsumsi BBM, dan biaya perjalanan Anda
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calculator className="h-6 w-6 text-brand-600" />
                <span>Kalkulator Biaya BBM</span>
              </CardTitle>
              <CardDescription>
                Masukkan detail perjalanan Anda untuk mendapatkan estimasi biaya yang akurat
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Vehicle Selection */}
                <div className="space-y-2">
                  <Label htmlFor="vehicle">Jenis Kendaraan</Label>
                  <Select value={selectedCar} onValueChange={setSelectedCar}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kendaraan" />
                    </SelectTrigger>
                    <SelectContent>
                      {carsData.map((car) => (
                        <SelectItem key={car.id} value={car.id}>
                          {car.brand} {car.model} ({car.fuelEfficiency} km/L)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Fuel Price */}
                <div className="space-y-2">
                  <Label htmlFor="fuel-price">Harga BBM (Rp/L)</Label>
                  <Input
                    id="fuel-price"
                    type="number"
                    value={fuelPrice}
                    onChange={(e) => setFuelPrice(e.target.value)}
                    placeholder="10000"
                    min="1000"
                    max="50000"
                  />
                </div>

                {/* Origin City */}
                <div className="space-y-2">
                  <Label htmlFor="origin">Kota Asal</Label>
                  <Select value={originCity} onValueChange={setOriginCity}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kota asal" />
                    </SelectTrigger>
                    <SelectContent>
                      {citiesData.map((city) => (
                        <SelectItem key={city.id} value={city.id}>
                          {city.name}, {city.province}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Destination City */}
                <div className="space-y-2">
                  <Label htmlFor="destination">Kota Tujuan</Label>
                  <Select value={destinationCity} onValueChange={setDestinationCity}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kota tujuan" />
                    </SelectTrigger>
                    <SelectContent>
                      {citiesData.map((city) => (
                        <SelectItem key={city.id} value={city.id}>
                          {city.name}, {city.province}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                onClick={handleCalculate}
                className="w-full bg-brand-600 hover:bg-brand-700 text-white h-12 text-lg"
                disabled={isCalculating}
              >
                {isCalculating ? 'Menghitung...' : 'Hitung Biaya Perjalanan'}
              </Button>

              {/* Results */}
              {result && (
                <div className="mt-8 p-6 bg-brand-50 dark:bg-brand-900/20 rounded-lg border border-brand-200 dark:border-brand-800">
                  <h3 className="text-xl font-semibold mb-4 text-brand-900 dark:text-brand-100">
                    Hasil Perhitungan
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-brand-100 dark:bg-brand-800 rounded-lg">
                        <MapPin className="h-5 w-5 text-brand-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Jarak</p>
                        <p className="font-semibold">{result.distance} km</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-brand-100 dark:bg-brand-800 rounded-lg">
                        <Fuel className="h-5 w-5 text-brand-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">BBM Dibutuhkan</p>
                        <p className="font-semibold">{result.fuelNeeded} L</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-brand-100 dark:bg-brand-800 rounded-lg">
                        <Clock className="h-5 w-5 text-brand-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Estimasi Waktu</p>
                        <p className="font-semibold">{formatTime(result.estimatedTime)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-brand-100 dark:bg-brand-800 rounded-lg">
                        <Calculator className="h-5 w-5 text-brand-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Biaya</p>
                        <p className="font-semibold text-brand-600">{formatCurrency(result.totalCost)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      <strong>Disclaimer:</strong> Estimasi dihitung berdasarkan jarak koordinat. 
                      Aplikasi ini masih dalam tahap pengembangan dan hasil mungkin berbeda dengan kondisi sebenarnya.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}