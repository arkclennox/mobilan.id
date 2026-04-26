import Link from 'next/link';
import { Plus, Pencil, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabaseAdmin } from '@/lib/supabase';
import type { City } from '@/types/database';

async function getAllCities(): Promise<City[]> {
  const { data } = await supabaseAdmin.from('cities').select('*').order('name');
  return (data || []) as City[];
}

export default async function AdminKotaPage() {
  const cities = await getAllCities();

  const byProvince = cities.reduce<Record<string, City[]>>((acc, city) => {
    const key = city.province || 'Lainnya';
    if (!acc[key]) acc[key] = [];
    acc[key].push(city);
    return acc;
  }, {});

  const provinces = Object.keys(byProvince).sort();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Kota / Daerah</h1>
          <p className="text-sm text-muted-foreground">{cities.length} kota terdaftar</p>
        </div>
        <Link href="/admin/kota/tambah">
          <Button className="bg-brand-600 hover:bg-brand-700">
            <Plus className="h-4 w-4 mr-2" /> Tambah Kota
          </Button>
        </Link>
      </div>

      {cities.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          Belum ada kota.{' '}
          <Link href="/admin/kota/tambah" className="text-brand-600 underline">
            Tambah sekarang
          </Link>
        </div>
      )}

      <div className="space-y-6">
        {provinces.map((province) => (
          <div key={province}>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              {province}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {byProvince[province].map((city) => (
                <div
                  key={city.id}
                  className="bg-card border border-border rounded-xl p-4 flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{city.name}</p>
                      {city.is_featured && (
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{city.slug}</p>
                    {city.island && (
                      <Badge variant="outline" className="text-xs mt-1">
                        {city.island}
                      </Badge>
                    )}
                  </div>
                  <Link href={`/admin/kota/${city.id}`}>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
