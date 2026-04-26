"use client";

import React, { useState, useEffect } from 'react';
import { Combobox } from '@/components/ui/combobox';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calculator, MapPin, Fuel, Clock } from 'lucide-react';

interface Car {
  name: string;
  consumption: number;
}

interface City {
  name: string;
  latitude: number;
  longitude: number;
}

interface CalculationResult {
  distance: number;
  fuelNeeded: number;
  totalCost: number;
  estimatedTime: number;
}

export function FuelCalculator() {
  const [cars, setCars] = useState<Car[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCar, setSelectedCar] = useState('');
  const [originCity, setOriginCity] = useState('');
  const [destinationCity, setDestinationCity] = useState('');
  const [fuelPrice, setFuelPrice] = useState('10000');
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [carsResponse, citiesResponse] = await Promise.all([
          fetch('/data/cars.json'),
          fetch('/data/cities.json')
        ]);
        
        const carsData = await carsResponse.json();
        const citiesData = await citiesResponse.json();
        
        setCars(carsData);
        setCities(citiesData);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, []);

  // Calculate distance using Haversine formula
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLng = toRadians(lng2 - lng1);
    
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  };

  const toRadians = (degrees: number): number => {
    return degrees * (Math.PI / 180);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatTime = (hours: number): string => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    
    if (wholeHours === 0) {
      return `${minutes} menit`;
    } else if (minutes === 0) {
      return `${wholeHours} jam`;
    } else {
      return `${wholeHours} jam ${minutes} menit`;
    }
  };

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

    const car = cars.find(c => c.name === selectedCar);
    const origin = cities.find(c => c.name === originCity);
    const destination = cities.find(c => c.name === destinationCity);

    if (!car || !origin || !destination) {
      alert('Data tidak valid');
      setIsCalculating(false);
      return;
    }

    const distance = calculateDistance(
      origin.latitude,
      origin.longitude,
      destination.latitude,
      destination.longitude
    );

    const fuelNeeded = distance / car.consumption;
    const totalCost = fuelNeeded * parseFloat(fuelPrice);
    const estimatedTime = distance / 60; // Assuming average speed of 60 km/h

    setResult({
      distance,
      fuelNeeded: Math.round(fuelNeeded * 10) / 10,
      totalCost: Math.round(totalCost),
      estimatedTime: Math.round(estimatedTime * 10) / 10,
    });

    setIsCalculating(false);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Kalkulator BBM Perjalanan
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Hitung estimasi jarak, konsumsi BBM, dan biaya perjalanan Anda
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calculator className="h-6 w-6 text-blue-600" />
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
                  <Combobox
                    options={cars}
                    value={selectedCar}
                    onChange={setSelectedCar}
                    placeholder="Pilih atau ketik nama kendaraan"
                    className="w-full"
                  />
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
                  <Combobox
                    options={cities}
                    value={originCity}
                    onChange={setOriginCity}
                    placeholder="Pilih atau ketik nama kota asal"
                    className="w-full"
                  />
                </div>

                {/* Destination City */}
                <div className="space-y-2">
                  <Label htmlFor="destination">Kota Tujuan</Label>
                  <Combobox
                    options={cities}
                    value={destinationCity}
                    onChange={setDestinationCity}
                    placeholder="Pilih atau ketik nama kota tujuan"
                    className="w-full"
                  />
                </div>
              </div>

              <Button 
                onClick={handleCalculate}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-lg"
                disabled={isCalculating}
              >
                {isCalculating ? 'Menghitung...' : 'Hitung Biaya Perjalanan'}
              </Button>

              {/* Results */}
              {result && (
                <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="text-xl font-semibold mb-4 text-blue-900">
                    Hasil Perhitungan
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <MapPin className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Jarak</p>
                        <p className="font-semibold">{result.distance} km</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Fuel className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">BBM Dibutuhkan</p>
                        <p className="font-semibold">{result.fuelNeeded} L</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Clock className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Estimasi Waktu</p>
                        <p className="font-semibold">{formatTime(result.estimatedTime)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Calculator className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total Biaya</p>
                        <p className="font-semibold text-blue-600">{formatCurrency(result.totalCost)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>Disclaimer:</strong> Estimasi dihitung berdasarkan jarak koordinat. 
                      Hasil mungkin berbeda dengan kondisi sebenarnya.
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