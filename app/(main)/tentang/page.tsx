import React from 'react';
import { Metadata } from 'next';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Calculator, Users, Target } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Tentang Mobilan.id',
  description: 'Pelajari lebih lanjut tentang misi Mobilan.id dalam membantu perencanaan perjalanan yang efisien di Indonesia.',
};

const stats = [
  { number: '10+', label: 'Kota Besar', icon: MapPin },
  { number: '50+', label: 'Model Kendaraan', icon: Calculator },
  { number: '1000+', label: 'Pengguna Aktif', icon: Users },
  { number: '99%', label: 'Tingkat Akurasi', icon: Target },
];

export default function TentangPage() {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Tentang Mobilan.id
            </h1>
            <p className="text-xl text-muted-foreground">
              Platform inovatif untuk perencanaan perjalanan yang efisien dan hemat biaya di Indonesia
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-brand-100 dark:bg-brand-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-8 w-8 text-brand-600" />
                </div>
                <div className="text-3xl font-bold text-brand-600 mb-2">{stat.number}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Misi Kami</h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Mobilan.id hadir untuk membantu masyarakat Indonesia merencanakan perjalanan yang lebih efisien dan hemat biaya. 
                  Kami percaya bahwa setiap perjalanan harus dimulai dengan perencanaan yang matang.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Dengan teknologi canggih dan data yang akurat, kami menyediakan kalkulator BBM yang dapat diandalkan 
                  untuk berbagai jenis kendaraan dan rute perjalanan di seluruh Indonesia.
                </p>
              </div>
              <div>
                <img
                  src="https://images.pexels.com/photos/2480072/pexels-photo-2480072.jpeg"
                  alt="Indonesian landscape"
                  className="rounded-lg shadow-lg w-full h-64 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Nilai-Nilai Kami</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Prinsip yang memandu setiap langkah pengembangan platform kami
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-brand-100 dark:bg-brand-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-brand-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Akurasi</h3>
                <p className="text-muted-foreground">
                  Memberikan estimasi biaya perjalanan yang akurat berdasarkan data real dan terpercaya
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-brand-100 dark:bg-brand-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-brand-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Kemudahan</h3>
                <p className="text-muted-foreground">
                  Interface yang sederhana dan mudah digunakan untuk semua kalangan
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-brand-100 dark:bg-brand-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calculator className="h-8 w-8 text-brand-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Inovasi</h3>
                <p className="text-muted-foreground">
                  Terus mengembangkan fitur-fitur baru untuk mendukung perjalanan yang lebih baik
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}