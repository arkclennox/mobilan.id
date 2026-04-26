# Mobilan.id — Agent API Guide

Panduan ini ditujukan untuk AI Agent yang mengelola konten Mobilan.id melalui API.

## Autentikasi

Semua request ke `/api/admin/*` wajib menyertakan header:

```
X-API-Key: <ADMIN_API_KEY dari .env.local>
```

Jika tidak ada header ini, server akan mengembalikan `401 Unauthorized`.

**Base URL (lokal):** `http://localhost:3000`
**Base URL (produksi):** `https://mobilan.id`

---

## Referensi Data

Sebelum membuat atau mengedit wisata/penginapan, ambil daftar ID yang tersedia:

```
GET /api/admin/data
```

Response:
```json
{
  "cities": [{ "id": "uuid", "name": "Yogyakarta", "slug": "yogyakarta" }],
  "categories": [{ "id": "uuid", "name": "Air Terjun", "slug": "air-terjun", "icon": "💧" }]
}
```

---

## Wisata Places

### List semua wisata
```
GET /api/admin/wisata?page=1&limit=20
```

Response:
```json
{
  "data": [...],
  "count": 1061,
  "page": 1,
  "totalPages": 54
}
```

### Ambil satu wisata
```
GET /api/admin/wisata/{id}
```

Response: objek wisata lengkap beserta `categories` (array `wisata_category_id`) dan `activity_offers`.

### Buat wisata baru
```
POST /api/admin/wisata
Content-Type: application/json
```

Body:
```json
{
  "name": "Kawah Ijen",
  "slug": "kawah-ijen",
  "city_id": "uuid-kota",
  "short_description": "Kawah vulkanik dengan fenomena api biru.",
  "full_description": "...",
  "address": "Banyuwangi, Jawa Timur",
  "latitude": -8.0580,
  "longitude": 114.2417,
  "opening_hours": "02.00 - 12.00 WIB",
  "ticket_price_text": "Rp 5.000 - Rp 100.000",
  "best_time_to_visit": "April - Oktober",
  "suitable_for": "Pecinta alam, fotografer",
  "tips": "Bawa masker gas, pakai jaket tebal.",
  "hero_image_url": "https://...",
  "is_featured": false,
  "is_published": true,
  "seo_title": null,
  "seo_description": null,
  "category_ids": ["uuid-kategori-1", "uuid-kategori-2"]
}
```

Semua field selain `name`, `slug`, dan `is_published` boleh `null`.

### Edit wisata
```
PATCH /api/admin/wisata/{id}
Content-Type: application/json
```

Body: field yang ingin diubah saja (partial). Sertakan `category_ids` untuk update kategori.

```json
{
  "short_description": "Deskripsi baru.",
  "is_published": true,
  "category_ids": ["uuid-kategori-1"]
}
```

### Hapus wisata
```
DELETE /api/admin/wisata/{id}
```

---

## Kategori Wisata

### List semua kategori
```
GET /api/admin/kategori?page=1&limit=100
```

### Ambil satu kategori
```
GET /api/admin/kategori/{id}
```

### Buat kategori baru
```
POST /api/admin/kategori
Content-Type: application/json
```

Body:
```json
{
  "name": "Air Terjun",
  "slug": "air-terjun",
  "icon": "💧",
  "description": "Wisata air terjun alam Indonesia.",
  "is_featured": false
}
```

`slug` harus unik. Gunakan format lowercase dengan tanda hubung.

### Edit kategori
```
PATCH /api/admin/kategori/{id}
Content-Type: application/json
```

### Hapus kategori
```
DELETE /api/admin/kategori/{id}
```

---

## Kota / Daerah

### List semua kota
```
GET /api/admin/kota
```

### Ambil satu kota
```
GET /api/admin/kota/{id}
```

### Buat kota baru
```
POST /api/admin/kota
Content-Type: application/json
```

Body:
```json
{
  "name": "Yogyakarta",
  "slug": "yogyakarta",
  "province": "DI Yogyakarta",
  "island": "Jawa",
  "description": null,
  "hero_image_url": null,
  "latitude": -7.7956,
  "longitude": 110.3695,
  "is_featured": true,
  "seo_title": null,
  "seo_description": null
}
```

`island` valid: `Jawa`, `Sumatra`, `Kalimantan`, `Sulawesi`, `Bali & Nusa Tenggara`, `Maluku`, `Papua`.

### Edit kota
```
PATCH /api/admin/kota/{id}
Content-Type: application/json
```

### Hapus kota
```
DELETE /api/admin/kota/{id}
```

---

## Blog

### List semua artikel
```
GET /api/admin/blog?page=1&limit=20
```

### Ambil satu artikel
```
GET /api/admin/blog/{id}
```

### Buat artikel baru
```
POST /api/admin/blog
Content-Type: application/json
```

Body:
```json
{
  "title": "10 Wisata Terbaik di Bali",
  "slug": "10-wisata-terbaik-di-bali",
  "author_name": "Admin",
  "excerpt": "Panduan lengkap wisata Bali untuk liburan keluarga.",
  "content_html": "<p>Isi artikel dalam format HTML...</p>",
  "featured_image_url": "https://...",
  "is_published": true,
  "seo_title": null,
  "seo_description": null
}
```

`published_at` di-set otomatis ke waktu sekarang saat `is_published: true`.

### Edit artikel
```
PATCH /api/admin/blog/{id}
Content-Type: application/json
```

### Hapus artikel
```
DELETE /api/admin/blog/{id}
```

---

## Penginapan (Accommodations)

### List semua penginapan
```
GET /api/admin/penginapan?page=1&limit=20
```

### Ambil satu penginapan
```
GET /api/admin/penginapan/{id}
```

### Buat penginapan baru
```
POST /api/admin/penginapan
Content-Type: application/json
```

Body:
```json
{
  "name": "Hotel Malioboro",
  "slug": "hotel-malioboro",
  "city_id": "uuid-kota",
  "area": "Malioboro",
  "provider": "Traveloka",
  "affiliate_url": "https://traveloka.com/...",
  "property_type": "Hotel",
  "price_label": "Mulai Rp 350.000/malam",
  "short_description": "Hotel strategis di jantung Malioboro.",
  "image_url": "https://...",
  "address_short": "Jl. Malioboro No.52",
  "is_published": true
}
```

### Edit penginapan
```
PATCH /api/admin/penginapan/{id}
Content-Type: application/json
```

### Hapus penginapan
```
DELETE /api/admin/penginapan/{id}
```

---

## Ticket Offers (Affiliate)

Ticket offer terhubung ke wisata tertentu via `wisata_place_id`.

### Buat offer baru
```
POST /api/admin/offers
Content-Type: application/json
```

Body:
```json
{
  "wisata_place_id": "uuid-wisata",
  "provider": "Traveloka",
  "title": "Tiket Kawah Ijen",
  "affiliate_url": "https://traveloka.com/...",
  "price_text": "Mulai Rp 25.000",
  "image_url": null,
  "note": null,
  "sort_order": 0
}
```

### Edit offer
```
PATCH /api/admin/offers/{id}
Content-Type: application/json
```

### Hapus offer
```
DELETE /api/admin/offers/{id}
```

---

## Aturan Penting

1. **Slug selalu unik** — gunakan format `lowercase-dengan-tanda-hubung`. Jika slug sudah ada, tambahkan suffix: `nama-tempat-2`.
2. **Field nullable** — kirim `null` untuk field kosong, bukan string kosong `""`.
3. **`is_published: false`** — wisata/blog dengan status draft tidak tampil di halaman publik.
4. **`category_ids`** — saat PATCH wisata, sertakan `category_ids` (array UUID) untuk update kategori. Array kosong `[]` akan menghapus semua kategori.
5. **Validasi `city_id`** — pastikan UUID kota ada di database sebelum digunakan. Gunakan `GET /api/admin/data` untuk daftar valid.

---

## Contoh Alur Lengkap: Tambah Wisata Baru

```bash
# 1. Ambil daftar kota dan kategori
curl -H "X-API-Key: <ADMIN_API_KEY>" \
  http://localhost:3000/api/admin/data

# 2. Buat wisata
curl -X POST \
  -H "X-API-Key: <ADMIN_API_KEY>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Pantai Kuta",
    "slug": "pantai-kuta",
    "city_id": "<uuid-dari-step-1>",
    "short_description": "Pantai ikonik Bali dengan sunset terbaik.",
    "is_published": true,
    "category_ids": ["<uuid-kategori-pantai>"]
  }' \
  http://localhost:3000/api/admin/wisata

# 3. Tambah ticket offer
curl -X POST \
  -H "X-API-Key: <ADMIN_API_KEY>" \
  -H "Content-Type: application/json" \
  -d '{
    "wisata_place_id": "<id-dari-step-2>",
    "provider": "Klook",
    "title": "Paket Sunset Kuta Beach",
    "affiliate_url": "https://klook.com/..."
  }' \
  http://localhost:3000/api/admin/offers
```

---

## Skema Database Ringkas

| Tabel | Deskripsi |
|---|---|
| `cities` | Kota/daerah di Indonesia |
| `wisata_categories` | Kategori wisata (air terjun, pantai, dll) |
| `wisata_places` | Data utama tempat wisata |
| `wisata_place_categories` | Junction: wisata ↔ kategori |
| `wisata_images` | Galeri foto per wisata |
| `activity_offers` | Ticket/aktivitas affiliate per wisata |
| `accommodations` | Data penginapan affiliate |
| `blog_posts` | Artikel blog |
