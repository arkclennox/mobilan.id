# PRD — Pengembangan Fitur Directory Wisata di Mobilan.id dengan Tiket Atraksi & Rekomendasi Penginapan Affiliate

## 1. Ringkasan Produk

### Nama produk / modul
Mobilan.id — Fitur Directory Wisata

### Visi produk
Mengembangkan Mobilan.id dari platform kalkulator perjalanan dan destinasi menjadi platform eksplor wisata Indonesia yang membantu pengguna menemukan tempat wisata, memahami info kunjungan, lalu menuju partner booking untuk tiket atraksi serta penginapan terdekat melalui link affiliate.

### Posisi produk
Fitur ini adalah pengembangan di dalam ekosistem Mobilan.id, bukan produk terpisah.

Mobilan.id tetap diposisikan sebagai:
- platform perencanaan perjalanan darat / road trip ringan
- kalkulator estimasi biaya perjalanan
- discovery engine untuk destinasi dan wisata Indonesia
- media monetisasi affiliate untuk tiket atraksi dan penginapan

Fitur directory wisata menjadi lapisan konten dan monetisasi baru yang memperkuat core Mobilan.id, bukan mengganti identitas utamanya.

### Tujuan bisnis
- Menambah cabang monetisasi Mobilan.id melalui affiliate tiket atraksi dan penginapan.
- Memperkuat positioning Mobilan.id sebagai platform road trip, destinasi, dan eksplor wisata Indonesia.
- Membangun aset SEO jangka panjang berbasis kota, kategori wisata, dan intent perjalanan domestik.
- Meningkatkan kedalaman konten, page views, dan internal linking di dalam Mobilan.id.

### Tujuan pengguna
- Menghitung perjalanan seperti fungsi utama Mobilan.id.
- Menemukan tempat wisata yang relevan dengan cepat.
- Mendapatkan info penting sebelum berkunjung.
- Melihat opsi pesan tiket online jika tersedia.
- Melihat penginapan di sekitar lokasi wisata.
- Menentukan tujuan road trip dan eksplorasi destinasi dengan lebih mudah.

### Target deployment
- Existing platform: Mobilan.id
- Frontend: Next.js di Vercel
- Database: Supabase
- Monetisasi: affiliate links ke tiket atraksi dan hotel/penginapan

---

## 2. Masalah yang Ingin Diselesaikan

Banyak pengguna Indonesia mencari tempat wisata melalui kombinasi keyword seperti:
- wisata di Batu
- tempat wisata keluarga di Bandung
- wisata dekat Malioboro
- tiket Jatim Park online
- hotel dekat Kawah Ijen

Namun informasi yang mereka temukan sering tersebar:
- deskripsi tempat di satu situs
- tiket di situs lain
- penginapan di situs lain
- rute dan estimasi perjalanan di situs lain

Fitur ini menyatukan discovery layer tersebut ke dalam pengalaman Mobilan.id yang sederhana, sehingga user tidak hanya menghitung biaya perjalanan tetapi juga menemukan tujuan wisatanya.

---

## 3. Opportunity / Peluang

### Mengapa niche ini menarik
- Sangat cocok dengan positioning Mobilan.id yang sudah berhubungan dengan perjalanan darat dan destinasi.
- Pencarian wisata Indonesia sangat besar dan berulang.
- Banyak destinasi bisa dimonetisasi lewat tiket atraksi.
- Banyak destinasi juga punya intent lanjutan berupa penginapan terdekat.
- Konten wisata sangat cocok untuk SEO long-tail dan halaman programmatic.
- Directory wisata bisa diperluas secara natural ke itinerary, kuliner, dan road trip planning.

### Keunggulan dibanding directory hotel penuh
- Tidak perlu memelihara harga hotel secara real-time.
- Tidak perlu membangun engine perbandingan hotel.
- Fokus utama tetap wisata, hotel hanya monetization layer.
- Tiket atraksi jauh lebih dekat dengan intent utama pengguna halaman wisata.

---

## 4. Cakupan Pengembangan V1 di Mobilan.id

### In scope
- Homepage destinasi / wisata
- Halaman detail wisata
- Halaman kota/destinasi
- Halaman kategori wisata
- Search wisata
- Filter dasar
- Section tiket atraksi affiliate pada halaman wisata
- Section penginapan terdekat affiliate pada halaman wisata
- Blog / artikel pendukung SEO
- Admin sederhana untuk CRUD wisata, ticket offers, dan penginapan affiliate snippets
- Sitemap, robots, metadata SEO, schema dasar

### Out of scope untuk V1
- Booking engine internal
- Login user publik
- Saved trip / trip planner kompleks
- Review pengguna langsung di situs
- Harga real-time tiket dan hotel
- Sinkronisasi API OTA secara live
- Map interaksi kompleks ala travel app
- Kolaborasi grup ala Wanderlog

---

## 5. Persona Pengguna

### Persona 1 — Keluarga pencari wisata
- Usia 28–45
- Mencari wisata ramah anak dan nyaman untuk keluarga
- Perlu info tiket, akses, jam buka, dan hotel terdekat

### Persona 2 — Pelancong road trip
- Usia 22–45
- Menggunakan kendaraan pribadi
- Perlu referensi destinasi, rute, estimasi perjalanan, dan area menginap

### Persona 3 — Wisatawan spontan
- Usia 18–35
- Mencari ide destinasi cepat lewat Google
- Perlu info visual, ringkas, dan langsung bisa pesan tiket

### Persona 4 — Pemburu staycation + wisata
- Usia 20–40
- Ingin kombinasi aktivitas + penginapan dekat lokasi
- Sensitif terhadap inspirasi visual dan kenyamanan trip

---

## 6. Value Proposition

### Nilai utama produk
- Menemukan wisata dengan cepat
- Memahami info kunjungan dengan ringkas
- Bisa langsung menuju penawaran tiket aktivitas
- Bisa melihat penginapan terdekat tanpa harus masuk ke portal hotel penuh
- Relevan untuk road trip dan eksplor perjalanan domestik

### Diferensiasi
- Fokus pada wisata Indonesia
- Hotel/penginapan hanya sebagai pelengkap, jadi UX tetap ringan
- Cocok dikaitkan dengan fitur estimasi perjalanan Mobilan.id
- Bisa berkembang menjadi platform eksplor perjalanan domestik yang unik

---

## 7. Struktur Informasi Fitur di Mobilan.id

### Pilar konten utama
1. Wisata
2. Kota / Destinasi
3. Kategori wisata
4. Ticket offers / aktivitas
5. Penginapan terdekat
6. Blog / panduan perjalanan

### Struktur menu utama
- Home
- Destinasi
- Kategori Wisata
- Blog
- Tentang
- Kontak
- Privacy Policy
- Terms
- Disclaimer Affiliate

Catatan:
Fitur directory wisata harus menyatu dengan struktur existing Mobilan.id dan memperkuat menu Destinasi/Blog yang sudah ada, bukan membuat identitas brand baru.

### Struktur URL yang disarankan
- `/`
- `/wisata`
- `/wisata/[slug]`
- `/destinasi`
- `/destinasi/[city-slug]`
- `/kategori`
- `/kategori/[category-slug]`
- `/blog`
- `/blog/[slug]`

### Struktur URL programmatic SEO yang disarankan
- `/destinasi/[city-slug]/wisata`
- `/destinasi/[city-slug]/wisata-keluarga`
- `/destinasi/[city-slug]/wisata-alam`
- `/destinasi/[city-slug]/wisata-anak`
- `/destinasi/[city-slug]/tempat-wisata-populer`

---

## 8. Kategori Utama Wisata

### Berdasarkan tipe wisata
- Wisata alam
- Wisata keluarga
- Wisata anak
- Wisata budaya
- Wisata sejarah
- Wisata religi
- Wisata pantai
- Wisata gunung
- Wisata air terjun
- Wisata taman hiburan
- Wisata edukasi
- Wisata malam
- Wisata kuliner area
- Hidden gem

### Berdasarkan kebutuhan pengguna
- Wisata untuk keluarga
- Wisata untuk road trip
- Wisata hemat
- Wisata romantis
- Wisata akhir pekan
- Wisata 1 hari
- Wisata dekat pusat kota

---

## 9. Fitur Produk V1

## 9.1 Homepage / integrasi beranda Mobilan.id
### Tujuan
Menjadikan homepage Mobilan.id sebagai gerbang discovery perjalanan dan wisata, bukan hanya kalkulator.

### Komponen
- Hero section
- Search bar utama
- Kalkulator perjalanan existing Mobilan.id tetap dipertahankan
- Pilihan kota/destinasi populer
- Shortcut kategori wisata populer
- Section wisata unggulan
- Section destinasi populer
- Section artikel terbaru
- CTA silang antara kalkulator perjalanan dan halaman wisata

### Kebutuhan fungsional
- User bisa mencari wisata berdasarkan nama, kota, atau kategori.
- Homepage harus ringan dan mudah dirender SSR/ISR.

---

## 9.2 Halaman listing wisata
### Tujuan
Menampilkan kumpulan wisata berdasarkan kota, kategori, atau kombinasi keduanya.

### Komponen
- H1 SEO
- Intro singkat halaman
- Filter bar
- Sort dropdown
- Grid card wisata
- Breadcrumb
- FAQ SEO ringan
- Internal links ke halaman terkait

### Filter minimum v1
- Kota
- Kategori
- Tipe wisata
- Range harga tiket (opsional text-based)
- Family-friendly / kids-friendly
- Indoor / outdoor

### Sort minimum v1
- Terpopuler
- Terbaru ditambahkan
- Cocok untuk keluarga
- Paling sering dicari

---

## 9.3 Halaman detail wisata
### Tujuan
Menjadi halaman utama SEO dan monetisasi affiliate.

### Komponen wajib
- Nama wisata
- Breadcrumb
- Foto utama / galeri
- Deskripsi singkat
- Ringkasan info penting
- Lokasi / alamat
- Jam buka
- Kisaran harga tiket
- Kategori
- Tips berkunjung
- Peta / lokasi singkat
- Section tiket atraksi affiliate
- Section penginapan terdekat affiliate
- Section wisata terdekat
- Artikel terkait
- FAQ SEO
- Schema markup

### Ringkasan info penting minimum
- Kota
- Alamat
- Jam buka
- Harga tiket text-based
- Cocok untuk siapa
- Best time to visit

---

## 9.4 Search
### Kebutuhan
- Search berdasarkan nama wisata, kota, kategori
- Search sederhana dan cepat
- Bisa mengarahkan ke hasil listing atau detail wisata
- Autocomplete opsional untuk fase lanjutan

---

## 9.5 Section tiket atraksi affiliate
### Tujuan
Monetisasi utama pada halaman wisata.

### Komponen card offer
- Gambar / thumbnail
- Nama penawaran / label aktivitas
- Provider (Traveloka / tiket.com / Agoda / partner lain)
- Price text opsional
- Tombol CTA

### CTA examples
- Pesan tiket di Traveloka
- Cek di tiket.com
- Lihat penawaran di Agoda

### Prinsip implementasi
- Tidak menampilkan harga live sebagai sumber kebenaran utama
- Jika tidak ada offer, section bisa disembunyikan
- Bisa menampilkan 1–3 offer per wisata

---

## 9.6 Section penginapan terdekat affiliate
### Tujuan
Monetisasi pendamping dan pelengkap pengalaman pengguna.

### Komponen card penginapan
- Foto utama
- Nama penginapan
- Area / distance text
- Deskripsi singkat 1 kalimat
- Tombol affiliate

### CTA examples
- Lihat di Traveloka
- Booking via Agoda
- Cek di tiket.com

### Prinsip implementasi
- Penginapan bukan fokus utama situs
- Tidak perlu menampilkan harga real-time
- Tidak perlu detail hotel panjang
- Cukup 3–5 card per halaman wisata

---

## 9.7 Halaman kota / destinasi di Mobilan.id
### Tujuan
Menjadi hub SEO utama per daerah.

### Komponen
- Hero kota
- Deskripsi singkat kota
- Wisata populer
- Wisata berdasarkan kategori
- Itinerary / artikel terkait
- Penginapan populer ringan
- Link ke kalkulator perjalanan Mobilan.id bila relevan

### Contoh halaman
- `/destinasi/yogyakarta`
- `/destinasi/batu`
- `/destinasi/banyuwangi`

---

## 9.8 Blog pendukung SEO
### Tujuan
Membangun topical authority dan internal link.

### Jenis artikel
- 10 tempat wisata terbaik di X
- wisata keluarga di X
- itinerary 1 hari di X
- tips road trip ke X
- area menginap dekat wisata X
- waktu terbaik mengunjungi X

---

## 9.9 Admin internal sederhana
### Tujuan
Memudahkan pengelolaan data wisata dan affiliate offers.

### Kapabilitas minimum
- Tambah/edit wisata
- Tambah/edit kota
- Tambah/edit kategori
- Tambah/edit ticket offers
- Tambah/edit penginapan affiliate snippets
- Publish/unpublish content
- Upload atau tempel image URL

---

## 10. User Flow

### Flow A — User mencari tempat wisata
1. User masuk homepage
2. User cari nama wisata atau pilih kota
3. User masuk listing wisata
4. User klik detail wisata
5. User membaca informasi
6. User klik tombol tiket affiliate atau penginapan affiliate

### Flow B — User datang dari Google
1. User search “wisata keluarga di Batu”
2. User masuk halaman kategori / destinasi
3. User buka detail wisata
4. User klik tiket atau penginapan

### Flow C — User butuh trip inspiration
1. User masuk halaman destinasi
2. User melihat wisata populer
3. User buka salah satu wisata
4. User melihat penginapan dekat lokasi
5. User klik partner booking

---

## 11. Kebutuhan Data

### Entitas utama
- cities
- wisata_categories
- wisata_places
- wisata_images
- activity_offers
- accommodations
- wisata_accommodations
- blog_posts

### Relasi utama
- Satu kota memiliki banyak wisata
- Satu wisata punya satu atau lebih kategori
- Satu wisata punya banyak gambar
- Satu wisata bisa punya banyak ticket offers
- Satu wisata bisa punya banyak penginapan terkait
- Satu penginapan bisa dipasang di banyak wisata

---

## 12. Spesifikasi Database Supabase

## Table: cities
Kolom:
- id
- name
- slug
- province
- island
- description
- hero_image_url
- latitude
- longitude
- is_featured
- seo_title
- seo_description
- created_at
- updated_at

## Table: wisata_categories
Kolom:
- id
- name
- slug
- description
- icon
- is_featured
- seo_title
- seo_description
- created_at
- updated_at

## Table: wisata_places
Kolom:
- id
- name
- slug
- city_id
- short_description
- full_description
- address
- latitude
- longitude
- opening_hours
- ticket_price_text
- best_time_to_visit
- suitable_for
- tips
- hero_image_url
- is_featured
- is_published
- seo_title
- seo_description
- created_at
- updated_at

## Table: wisata_place_categories
Kolom:
- id
- wisata_place_id
- wisata_category_id
- created_at

## Table: wisata_images
Kolom:
- id
- wisata_place_id
- image_url
- alt_text
- sort_order
- created_at

## Table: activity_offers
Kolom:
- id
- wisata_place_id
- provider
- title
- affiliate_url
- image_url
- price_text
- note
- is_active
- sort_order
- created_at
- updated_at

## Table: accommodations
Kolom:
- id
- name
- slug
- city_id
- area
- short_description
- image_url
- provider
- affiliate_url
- property_type
- price_label
- address_short
- is_published
- created_at
- updated_at

## Table: wisata_accommodations
Kolom:
- id
- wisata_place_id
- accommodation_id
- distance_text
- sort_order
- created_at

## Table: blog_posts
Kolom:
- id
- title
- slug
- excerpt
- content_html
- featured_image_url
- author_name
- is_published
- published_at
- seo_title
- seo_description
- created_at
- updated_at

---

## 13. Kebutuhan Minimum Data per Wisata

Setiap wisata minimal wajib punya:
- nama wisata
- slug
- kota
- deskripsi singkat
- alamat atau area
- 1 gambar utama
- minimal 1 kategori
- status publish

Sangat disarankan juga punya:
- jam buka
- kisaran tiket text-based
- tips berkunjung
- lat/lng
- 1–3 ticket offers affiliate bila tersedia
- 1–3 penginapan dekat lokasi
- metadata SEO

---

## 14. Arsitektur Teknologi

### Stack utama
- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase
- Vercel

### Library yang disarankan
- shadcn/ui
- lucide-react
- zod
- react-hook-form
- @supabase/supabase-js

### Rendering strategy
- Server components untuk fetch utama
- ISR untuk halaman destinasi, kategori, dan detail wisata
- Client components hanya untuk search/filter interaktif

---

## 15. Arsitektur Frontend

### Prinsip UI
- Mobile-first
- Visual bersih dan travel-oriented
- Fokus pada hero image, info cepat, dan CTA
- Tidak terlalu ramai seperti marketplace

### Komponen reusable minimum
- Navbar
- Footer
- SearchBar
- DestinationCard
- WisataCard
- OfferCard
- AccommodationCard
- Breadcrumbs
- FilterPanel
- SortDropdown
- FAQSection
- EmptyState
- Pagination

### Design guidelines
- Font: Geist
- Layout: clean, airy, card-based
- Hero image kuat
- CTA affiliate jelas tapi tidak spammy
- Visual destinasi harus lebih dominan daripada monetisasi

---

## 16. Halaman Wajib V1

### Core pages
- Homepage
- Destinasi index
- Destinasi detail
- Kategori wisata index
- Kategori wisata detail
- Wisata detail
- Search results
- Blog index
- Blog detail

### Legal / trust pages
- About
- Contact
- Privacy Policy
- Terms & Conditions
- Affiliate Disclaimer

### Technical pages
- Sitemap XML
- Robots.txt
- 404 page

---

## 17. SEO Requirements

### On-page SEO
- Title unik
- Meta description unik
- H1 tunggal
- Breadcrumb
- Internal linking kuat
- FAQ schema bila relevan
- Article schema untuk blog
- TouristAttraction schema / LocalBusiness-like structured data bila relevan dan aman

### Programmatic SEO strategy
Target halaman:
- kota
- kategori wisata
- kota + kategori
- wisata detail

### Contoh template SEO title
- Tempat Wisata di {City} — Rekomendasi Liburan & Tiket Online
- {Wisata Name} — Info Tiket, Jam Buka, dan Penginapan Terdekat
- Wisata Keluarga di {City} — Pilihan Tempat Liburan Terbaik

### Contoh meta description
- Temukan info lengkap {Wisata Name}, mulai dari lokasi, jam buka, tips kunjungan, hingga tiket online dan penginapan dekat lokasi.

### Internal linking strategy
- Dari homepage ke kota unggulan
- Dari kota ke kategori wisata
- Dari kategori ke detail wisata
- Dari detail wisata ke wisata terkait dan artikel terkait
- Dari blog ke destinasi dan detail wisata

---

## 18. Affiliate Monetization Requirements untuk Mobilan.id

### Sumber monetisasi utama
- Tiket atraksi / aktivitas
- Penginapan / hotel terdekat

### Prinsip monetisasi
- Monetisasi harus terasa membantu user, bukan sekadar iklan
- CTA muncul hanya ketika relevan
- Offer hanya ditampilkan jika memang tersedia
- Setiap affiliate link harus punya provider label yang jelas

### Tracking minimum
- event klik affiliate
- provider
- type (ticket / accommodation)
- wisata_place_id
- page_path
- timestamp

### Disclosure
- Wajib ada disclaimer affiliate pada footer dan/atau dekat blok affiliate bila perlu

---

## 19. Analytics Requirements

### Metrics utama
- Organic traffic
- Top destinations
- Top wisata pages
- CTR ke ticket offers
- CTR ke penginapan offers
- Search usage
- Page engagement

### Event minimum
- search_submitted
- destination_card_clicked
- wisata_card_clicked
- affiliate_offer_clicked
- accommodation_offer_clicked
- blog_internal_link_clicked

### Tools
- Google Analytics 4
- Google Search Console
- Vercel Analytics opsional

---

## 20. Admin & Operasional

### Workflow data wisata
1. Tambah kota
2. Tambah kategori wisata
3. Tambah wisata
4. Tambah gambar
5. Tambah ticket offers affiliate
6. Tambah penginapan affiliate snippets
7. Publish

### Workflow blog
1. Tentukan keyword / cluster
2. Generate outline dengan AI
3. Tulis draft
4. Review manual
5. Tambahkan internal links
6. Publish

---

## 21. AI-Assisted Development Requirements

Karena coding dibantu AI, sistem harus dibuat modular.

### Prinsip pengembangan
- TypeScript strict
- Komponen reusable
- Pisahkan data layer dan presentation layer
- Semua form tervalidasi
- Naming konsisten
- File tidak terlalu besar
- Utility terpisah untuk slug, metadata, tracking, schema

### Modul coding yang cocok dikerjakan bertahap
1. setup project
2. setup Supabase
3. schema & types
4. homepage
5. wisata listing
6. wisata detail
7. ticket offer block
8. accommodation block
9. destination pages
10. blog
11. admin CRUD sederhana
12. SEO routes

---

## 22. Non-Functional Requirements

### Performance
- LCP cepat pada homepage dan page wisata utama
- Image optimization wajib
- Hindari fetch berat di client

### Security
- RLS aktif untuk admin data
- Environment variables aman
- Affiliate links tervalidasi sebelum publish

### Reliability
- Slug unik
- Fallback image
- Offer yang tidak aktif tidak muncul
- Empty state jelas jika belum ada affiliate blocks

### Scalability
- Mendukung ribuan wisata
- Mendukung ratusan kota dan kategori
- Mudah menambah itinerary, kuliner, dan planner di masa depan

### Maintainability
- Struktur proyek rapi
- Dokumentasi query/data model jelas
- Mudah diteruskan oleh AI/developer lain

---

## 23. Definisi MVP

MVP harus sudah memungkinkan:
- user menemukan wisata berdasarkan kota/kategori
- user membaca detail wisata
- user melihat tiket atraksi jika tersedia
- user melihat penginapan dekat lokasi
- owner bisa mengelola data wisata dan affiliate blocks
- halaman terindex dengan baik di Google

### MVP pages minimum
- Home
- 1 template destinasi
- 1 template kategori
- 1 template detail wisata
- Blog
- Legal pages

### MVP data minimum
- 10 destinasi/kota
- 50–100 wisata
- 8–10 kategori wisata
- 30–50 ticket offers
- 50–100 penginapan affiliate snippets
- 15–20 artikel blog dasar

---

## 24. Roadmap Setelah V1

### V1.1
- related wisata yang lebih pintar
- nearby wisata berdasarkan lokasi
- filter lebih lengkap
- FAQ generator untuk detail wisata

### V1.2
- import bulk via CSV
- bulk linking wisata ke penginapan
- bulk affiliate offer manager

### V1.3
- itinerary ringan per kota
- section kuliner dekat wisata
- route-based discovery

### V2
- save destination
- trip planner sederhana
- map explorer lebih interaktif
- user preferences

---

## 25. Risiko dan Mitigasi

### Risiko 1 — Data wisata tipis / tidak konsisten
Mitigasi:
- field minimum wajib
- validasi admin
- jangan publish tanpa deskripsi & image

### Risiko 2 — Affiliate offer cepat usang
Mitigasi:
- jangan jadikan harga sebagai sumber kebenaran utama
- tampilkan label umum dan CTA
- simpan is_active dan review berkala

### Risiko 3 — Monetisasi terlalu agresif
Mitigasi:
- tetap fokus pada informasi wisata
- batasi jumlah blok affiliate
- prioritaskan UX

### Risiko 4 — Halaman programmatic terlalu tipis
Mitigasi:
- intro unik
- FAQ
- internal links
- block wisata populer / article links

### Risiko 5 — Build AI-generated berantakan
Mitigasi:
- build modular
- satu prompt satu modul
- gunakan PRD ini sebagai acuan tunggal

---

## 26. Checklist Implementasi Awal

### Setup
- Setup Next.js App Router + TypeScript
- Setup Tailwind + Geist
- Setup GitHub + Vercel
- Setup Supabase

### Data layer
- Buat schema tabel
- Setup RLS
- Generate types
- Buat helper query functions

### Frontend layer
- Layout global
- Homepage
- Listing wisata
- Detail wisata
- Ticket offer section
- Accommodation section
- Destination page

### SEO layer
- metadata dinamis
- sitemap
- robots
- schema JSON-LD

### Content layer
- isi 10 kota awal
- isi 50–100 wisata awal
- tambahkan offer affiliate
- tambahkan penginapan snippets
- publish artikel pendukung

---

## 27. Prompting Guidelines untuk AI Coding Assistant

Agar AI coding assistant efektif:
- sebutkan stack secara eksplisit
- sebutkan file yang harus dibuat/diubah
- sebutkan bentuk data dari Supabase
- sebutkan requirement UI dan UX
- minta code siap deploy ke Vercel
- minta type-safe dan reusable

### Contoh struktur prompt
- Tujuan fitur
- File target
- Data schema
- UI requirement
- Logic requirement
- SEO requirement
- Error handling requirement

---

## 28. Kesimpulan

Pengembangan ini harus dipahami sebagai evolusi Mobilan.id, bukan pembuatan website baru.

Mobilan.id tetap mempertahankan kekuatan utamanya sebagai platform estimasi perjalanan dan road trip ringan, lalu diperluas dengan fitur directory wisata yang fokus pada:
- discovery destinasi
- informasi kunjungan
- monetisasi tiket atraksi affiliate
- rekomendasi penginapan terdekat sebagai pelengkap

Versi awal harus menekankan:
- integrasi yang natural dengan identitas Mobilan.id
- data wisata yang rapi
- halaman detail wisata yang kuat
- monetisasi affiliate yang relevan
- struktur SEO yang scalable
- implementasi teknis modular untuk AI-assisted development

---

## 29. Prioritas Build Order

### Prioritas 1
- schema database
- homepage
- listing wisata
- detail wisata

### Prioritas 2
- destination pages
- ticket offers block
- accommodation block
- blog

### Prioritas 3
- admin CRUD sederhana
- analytics events
- internal linking enhancements

### Prioritas 4
- bulk import
- programmatic SEO pages
- itinerary ringan

