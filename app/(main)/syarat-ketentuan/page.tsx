import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Syarat dan Ketentuan',
  description: 'Syarat dan ketentuan penggunaan layanan Mobilan.id.',
};

export default function SyaratKetentuanPage() {
  return (
    <div className="min-h-screen pt-16">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Syarat dan Ketentuan</h1>
          
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <p className="text-muted-foreground mb-8">
              Terakhir diperbarui: 1 Januari 2024
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Penerimaan Syarat</h2>
              <p className="mb-4">
                Dengan menggunakan layanan Mobilan.id, Anda menyetujui untuk terikat dengan syarat dan ketentuan ini. 
                Jika Anda tidak setuju dengan syarat ini, mohon untuk tidak menggunakan layanan kami.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Layanan</h2>
              <p className="mb-4">
                Mobilan.id menyediakan layanan kalkulator BBM perjalanan yang memberikan estimasi biaya perjalanan 
                berdasarkan data yang tersedia. Layanan ini bersifat informatif dan estimatif.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Akurasi Informasi</h2>
              <p className="mb-4">
                Meskipun kami berusaha memberikan informasi yang akurat, hasil perhitungan yang diberikan 
                hanyalah estimasi. Biaya aktual dapat berbeda tergantung pada berbagai faktor seperti:
              </p>
              <ul className="list-disc list-inside mb-4 space-y-2">
                <li>Kondisi lalu lintas</li>
                <li>Gaya berkendara</li>
                <li>Kondisi kendaraan</li>
                <li>Rute yang dipilih</li>
                <li>Fluktuasi harga BBM</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Penggunaan yang Dilarang</h2>
              <p className="mb-4">
                Anda dilarang untuk:
              </p>
              <ul className="list-disc list-inside mb-4 space-y-2">
                <li>Menggunakan layanan untuk tujuan ilegal</li>
                <li>Mengganggu atau merusak sistem kami</li>
                <li>Menyalin atau mendistribusikan konten tanpa izin</li>
                <li>Menggunakan layanan untuk spam atau aktivitas merugikan</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Batasan Tanggung Jawab</h2>
              <p className="mb-4">
                Mobilan.id tidak bertanggung jawab atas kerugian langsung atau tidak langsung yang timbul 
                dari penggunaan layanan kami, termasuk namun tidak terbatas pada:
              </p>
              <ul className="list-disc list-inside mb-4 space-y-2">
                <li>Ketidakakuratan estimasi biaya</li>
                <li>Keputusan perjalanan yang dibuat berdasarkan informasi kami</li>
                <li>Gangguan layanan atau downtime</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Perubahan Syarat</h2>
              <p className="mb-4">
                Kami berhak mengubah syarat dan ketentuan ini kapan saja. Perubahan akan berlaku efektif 
                setelah dipublikasikan di website. Penggunaan layanan yang berkelanjutan menandakan 
                persetujuan Anda terhadap perubahan tersebut.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Hukum yang Berlaku</h2>
              <p className="mb-4">
                Syarat dan ketentuan ini diatur oleh hukum Republik Indonesia. Setiap sengketa yang timbul 
                akan diselesaikan melalui pengadilan yang berwenang di Jakarta.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Kontak</h2>
              <p className="mb-4">
                Untuk pertanyaan mengenai syarat dan ketentuan ini, hubungi kami di:
              </p>
              <ul className="list-disc list-inside mb-4">
                <li>Email: legal@mobilan.id</li>
                <li>Telepon: +62 21 1234 5678</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}