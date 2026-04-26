import React from 'react';
import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Kontak Kami',
  description: 'Hubungi tim Mobilan.id untuk bantuan, saran, atau pertanyaan seputar layanan kami.',
};

const contactInfo = [
  {
    icon: Mail,
    title: 'Email',
    content: 'info@mobilan.id',
    description: 'Kirim email untuk pertanyaan umum'
  },
  {
    icon: Phone,
    title: 'Telepon',
    content: '+62 822 5122 0020',
    description: 'Hubungi kami di jam kerja'
  },
  {
    icon: MapPin,
    title: 'Alamat',
    content: 'Jember, Indonesia',
    description: 'Kantor pusat kami'
  },
  {
    icon: Clock,
    title: 'Jam Operasional',
    content: 'Senin - Jumat, 09:00 - 17:00',
    description: 'Waktu Indonesia Barat'
  }
];

export default function KontakPage() {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Hubungi Kami
            </h1>
            <p className="text-xl text-muted-foreground">
              Kami siap membantu Anda dengan pertanyaan, saran, atau masukan seputar layanan Mobilan.id
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Contact Information */}
              <div className="lg:col-span-1">
                <h2 className="text-2xl font-bold mb-6">Informasi Kontak</h2>
                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-brand-100 dark:bg-brand-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <info.icon className="h-6 w-6 text-brand-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{info.title}</h3>
                        <p className="text-muted-foreground mb-1">{info.content}</p>
                        <p className="text-sm text-muted-foreground">{info.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Kirim Pesan</CardTitle>
                    <CardDescription>
                      Isi formulir di bawah ini dan kami akan merespons sesegera mungkin
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">Nama Depan</Label>
                          <Input id="firstName" placeholder="Masukkan nama depan" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Nama Belakang</Label>
                          <Input id="lastName" placeholder="Masukkan nama belakang" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="email@example.com" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">Nomor Telepon</Label>
                        <Input id="phone" type="tel" placeholder="+62 812 3456 7890" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subjek</Label>
                        <Input id="subject" placeholder="Subjek pesan Anda" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="message">Pesan</Label>
                        <Textarea 
                          id="message" 
                          placeholder="Tulis pesan Anda di sini..."
                          className="min-h-[120px]"
                        />
                      </div>
                      
                      <Button type="submit" className="w-full bg-brand-600 hover:bg-brand-700">
                        Kirim Pesan
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
