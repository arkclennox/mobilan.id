import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kebijakan Privasi',
  description: 'Kebijakan privasi Mobilan.id mengenai pengumpulan, penggunaan, dan perlindungan data pengguna.',
};

export default function KebijakanPrivasiPage() {
  return (
    <div className="min-h-screen pt-16">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Kebijakan Privasi</h1>
          
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <p className="text-muted-foreground mb-8">
              Terakhir diperbarui: 1 Januari 2024
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Informasi yang Kami Kumpulkan</h2>
              <p className="mb-4">
                Mobilan.id mengumpulkan informasi yang Anda berikan secara langsung kepada kami, seperti:
              </p>
              <ul className="list-disc list-inside mb-4 space-y-2">
                <li>Data perhitungan perjalanan (kota asal, tujuan, jenis kendaraan)</li>
                <li>Informasi kontak jika Anda menghubungi kami</li>
                <li>Data penggunaan website untuk analisis dan peningkatan layanan</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Penggunaan Informasi</h2>
              <p className="mb-4">
                Kami menggunakan informasi yang dikumpulkan untuk:
              </p>
              <ul className="list-disc list-inside mb-4 space-y-2">
                <li>Menyediakan layanan kalkulator BBM perjalanan</li>
                <li>Meningkatkan kualitas layanan dan pengalaman pengguna</li>
                <li>Mengirimkan informasi penting terkait layanan</li>
                <li>Melakukan analisis untuk pengembangan fitur</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Perlindungan Data</h2>
              <p className="mb-4">
                Kami berkomitmen melindungi data pribadi Anda dengan:
              </p>
              <ul className="list-disc list-inside mb-4 space-y-2">
                <li>Enkripsi data saat transmisi</li>
                <li>Akses terbatas pada data pengguna</li>
                <li>Pemantauan keamanan sistem secara berkala</li>
                <li>Tidak membagikan data kepada pihak ketiga tanpa persetujuan</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Cookies</h2>
              <p className="mb-4">
                Website ini menggunakan cookies untuk meningkatkan pengalaman browsing Anda. 
                Cookies membantu kami memahami preferensi Anda dan memberikan layanan yang lebih personal.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Hak Pengguna</h2>
              <p className="mb-4">
                Anda memiliki hak untuk:
              </p>
              <ul className="list-disc list-inside mb-4 space-y-2">
                <li>Mengakses data pribadi yang kami miliki</li>
                <li>Meminta koreksi data yang tidak akurat</li>
                <li>Meminta penghapusan data pribadi</li>
                <li>Menarik persetujuan penggunaan data</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Kontak</h2>
              <p className="mb-4">
                Jika Anda memiliki pertanyaan tentang kebijakan privasi ini, silakan hubungi kami di:
              </p>
              <ul className="list-disc list-inside mb-4">
                <li>Email: privacy@mobilan.id</li>
                <li>Telepon: +62 21 1234 5678</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}