import React from 'react';
import Link from 'next/link';
import { Car, Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Car className="h-8 w-8 text-brand-500" />
              <span className="text-xl font-bold">Mobilan.id</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Platform terpercaya untuk menghitung biaya perjalanan dan menemukan destinasi terbaik di Indonesia.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-brand-500 transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-brand-500 transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-brand-500 transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Fitur Utama */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Fitur Utama</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/kalkulator" className="text-gray-400 hover:text-white transition-colors">
                  Kalkulator BBM
                </Link>
              </li>
              <li>
                <Link href="/destinasi" className="text-gray-400 hover:text-white transition-colors">
                  Destinasi Populer
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-white transition-colors">
                  Tips Perjalanan
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  Rute Optimal
                </Link>
              </li>
            </ul>
          </div>

          {/* Hubungi Kami */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Hubungi Kami</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-brand-500" />
                <span className="text-gray-400">info@mobilan.id</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-brand-500" />
                <span className="text-gray-400">+62 822 5122 0020</span>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-brand-500 mt-0.5" />
                <span className="text-gray-400">Jember, Indonesia</span>
              </li>
            </ul>
          </div>

          {/* Halaman Penting */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Halaman</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/tentang" className="text-gray-400 hover:text-white transition-colors">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="/kontak" className="text-gray-400 hover:text-white transition-colors">
                  Kontak
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/kebijakan-privasi" className="text-gray-400 hover:text-white transition-colors">
                  Kebijakan Privasi
                </Link>
              </li>
              <li>
                <Link href="/syarat-ketentuan" className="text-gray-400 hover:text-white transition-colors">
                  Syarat & Ketentuan
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2024 Mobilan.id. Semua hak dilindungi undang-undang.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link href="/kebijakan-privasi" className="text-gray-400 hover:text-white transition-colors">
                Privasi
              </Link>
              <Link href="/syarat-ketentuan" className="text-gray-400 hover:text-white transition-colors">
                Ketentuan
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
