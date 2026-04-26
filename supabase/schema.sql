-- ============================================================
-- Mobilan.id — Directory Wisata Schema
-- Jalankan file ini di Supabase SQL Editor
-- ============================================================

-- Enable UUID
create extension if not exists "pgcrypto";

-- ============================================================
-- TABLES
-- ============================================================

create table public.cities (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text not null unique,
  province text,
  island text,
  description text,
  hero_image_url text,
  latitude float,
  longitude float,
  is_featured boolean default false,
  seo_title text,
  seo_description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.wisata_categories (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text not null unique,
  description text,
  icon text,
  is_featured boolean default false,
  seo_title text,
  seo_description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.wisata_places (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text not null unique,
  city_id uuid references public.cities(id) on delete set null,
  short_description text,
  full_description text,
  address text,
  latitude float,
  longitude float,
  opening_hours text,
  ticket_price_text text,
  best_time_to_visit text,
  suitable_for text,
  tips text,
  hero_image_url text,
  is_featured boolean default false,
  is_published boolean default false,
  seo_title text,
  seo_description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.wisata_place_categories (
  id uuid default gen_random_uuid() primary key,
  wisata_place_id uuid references public.wisata_places(id) on delete cascade,
  wisata_category_id uuid references public.wisata_categories(id) on delete cascade,
  created_at timestamptz default now(),
  unique(wisata_place_id, wisata_category_id)
);

create table public.wisata_images (
  id uuid default gen_random_uuid() primary key,
  wisata_place_id uuid references public.wisata_places(id) on delete cascade,
  image_url text not null,
  alt_text text,
  sort_order int default 0,
  created_at timestamptz default now()
);

create table public.activity_offers (
  id uuid default gen_random_uuid() primary key,
  wisata_place_id uuid references public.wisata_places(id) on delete cascade,
  provider text not null,
  title text not null,
  affiliate_url text not null,
  image_url text,
  price_text text,
  note text,
  is_active boolean default true,
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.accommodations (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text not null unique,
  city_id uuid references public.cities(id) on delete set null,
  area text,
  short_description text,
  image_url text,
  provider text not null,
  affiliate_url text not null,
  property_type text,
  price_label text,
  address_short text,
  is_published boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.wisata_accommodations (
  id uuid default gen_random_uuid() primary key,
  wisata_place_id uuid references public.wisata_places(id) on delete cascade,
  accommodation_id uuid references public.accommodations(id) on delete cascade,
  distance_text text,
  sort_order int default 0,
  created_at timestamptz default now(),
  unique(wisata_place_id, accommodation_id)
);

create table public.blog_posts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text not null unique,
  excerpt text,
  content_html text,
  featured_image_url text,
  author_name text default 'Admin',
  is_published boolean default false,
  published_at timestamptz,
  seo_title text,
  seo_description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- INDEXES
-- ============================================================

create index on public.wisata_places(city_id);
create index on public.wisata_places(is_published, is_featured);
create index on public.wisata_places(slug);
create index on public.blog_posts(slug);
create index on public.blog_posts(is_published, published_at desc);
create index on public.cities(slug);
create index on public.wisata_categories(slug);
create index on public.accommodations(city_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.cities enable row level security;
alter table public.wisata_categories enable row level security;
alter table public.wisata_places enable row level security;
alter table public.wisata_place_categories enable row level security;
alter table public.wisata_images enable row level security;
alter table public.activity_offers enable row level security;
alter table public.accommodations enable row level security;
alter table public.wisata_accommodations enable row level security;
alter table public.blog_posts enable row level security;

-- Public read policies
create policy "Public read cities" on public.cities for select using (true);
create policy "Public read wisata_categories" on public.wisata_categories for select using (true);
create policy "Public read wisata_places" on public.wisata_places for select using (is_published = true);
create policy "Public read wisata_place_categories" on public.wisata_place_categories for select using (true);
create policy "Public read wisata_images" on public.wisata_images for select using (true);
create policy "Public read activity_offers" on public.activity_offers for select using (is_active = true);
create policy "Public read accommodations" on public.accommodations for select using (is_published = true);
create policy "Public read wisata_accommodations" on public.wisata_accommodations for select using (true);
create policy "Public read blog_posts" on public.blog_posts for select using (is_published = true);

-- ============================================================
-- SEED: Cities (dari cities.json)
-- ============================================================

insert into public.cities (name, slug, province, description, hero_image_url, latitude, longitude) values
('Ambon', 'ambon', 'Maluku', 'Kota Ambon adalah ibu kota Provinsi Maluku yang terkenal dengan keindahan alamnya.', 'https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg', -3.6954, 128.1814),
('Balikpapan', 'balikpapan', 'Kalimantan Timur', 'Balikpapan adalah kota industri minyak terbesar di Kalimantan Timur.', 'https://images.pexels.com/photos/2422915/pexels-photo-2422915.jpeg', -1.2379, 116.8529),
('Banda Aceh', 'bandaaceh', 'Aceh', 'Banda Aceh adalah ibu kota Provinsi Aceh yang kaya akan sejarah dan budaya Islam.', 'https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg', 5.5577, 95.3222),
('Bandar Lampung', 'bandarlampung', 'Lampung', 'Bandar Lampung adalah ibu kota Provinsi Lampung yang menjadi gerbang Sumatera.', 'https://images.pexels.com/photos/2422915/pexels-photo-2422915.jpeg', -5.3971, 105.2668),
('Bandung', 'bandung', 'Jawa Barat', 'Bandung adalah kota kreatif yang terkenal dengan kuliner dan fashion-nya.', 'https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg', -6.9175, 107.6191),
('Banjarmasin', 'banjarmasin', 'Kalimantan Selatan', 'Banjarmasin dikenal sebagai Kota Seribu Sungai dengan pasar terapungnya yang terkenal.', 'https://images.pexels.com/photos/2422915/pexels-photo-2422915.jpeg', -3.3194, 114.5906),
('Batam', 'batam', 'Kepulauan Riau', 'Batam adalah kota industri dan perdagangan yang strategis di Kepulauan Riau.', 'https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg', 1.0456, 104.0305),
('Bekasi', 'bekasi', 'Jawa Barat', 'Bekasi adalah kota satelit Jakarta yang berkembang pesat sebagai pusat industri.', 'https://images.pexels.com/photos/2422915/pexels-photo-2422915.jpeg', -6.2383, 106.9756),
('Bengkulu', 'bengkulu', 'Bengkulu', 'Bengkulu adalah ibu kota provinsi yang memiliki pantai indah di pesisir barat Sumatera.', 'https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg', -3.8004, 102.2655),
('Bogor', 'bogor', 'Jawa Barat', 'Bogor terkenal dengan Kebun Raya dan iklimnya yang sejuk.', 'https://images.pexels.com/photos/2422915/pexels-photo-2422915.jpeg', -6.5971, 106.8060),
('Cirebon', 'cirebon', 'Jawa Barat', 'Cirebon adalah kota bersejarah dengan perpaduan budaya Jawa, Sunda, dan Tionghoa.', 'https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg', -6.7063, 108.5571),
('Denpasar', 'denpasar', 'Bali', 'Denpasar adalah ibu kota Bali yang menjadi pusat pemerintahan dan budaya.', 'https://images.pexels.com/photos/2422915/pexels-photo-2422915.jpeg', -8.6705, 115.2126),
('Depok', 'depok', 'Jawa Barat', 'Depok adalah kota pendidikan yang terkenal dengan Universitas Indonesia.', 'https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg', -6.4025, 106.7942),
('Gorontalo', 'gorontalo', 'Gorontalo', 'Gorontalo adalah ibu kota provinsi yang terletak di Teluk Tomini.', 'https://images.pexels.com/photos/2422915/pexels-photo-2422915.jpeg', 0.5435, 123.0596),
('Jakarta', 'jakarta', 'DKI Jakarta', 'Jakarta adalah ibu kota Indonesia dan pusat bisnis terbesar di Asia Tenggara.', 'https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg', -6.2088, 106.8456),
('Jambi', 'jambi', 'Jambi', 'Jambi adalah ibu kota provinsi yang terkenal dengan Candi Muaro Jambi.', 'https://images.pexels.com/photos/2422915/pexels-photo-2422915.jpeg', -1.6101, 103.6131),
('Jayapura', 'jayapura', 'Papua', 'Jayapura adalah ibu kota Papua yang menjadi gerbang masuk ke Papua.', 'https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg', -2.5489, 140.7197),
('Kediri', 'kediri', 'Jawa Timur', 'Kediri adalah kota bersejarah yang terkenal dengan industri rokok dan gula.', 'https://images.pexels.com/photos/2422915/pexels-photo-2422915.jpeg', -7.8181, 112.0178),
('Kendari', 'kendari', 'Sulawesi Tenggara', 'Kendari adalah ibu kota Sulawesi Tenggara yang terkenal dengan nikel.', 'https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg', -3.9450, 122.5986),
('Kupang', 'kupang', 'Nusa Tenggara Timur', 'Kupang adalah ibu kota NTT yang menjadi gerbang ke Timor dan pulau-pulau sekitarnya.', 'https://images.pexels.com/photos/2422915/pexels-photo-2422915.jpeg', -10.1718, 123.6075),
('Madiun', 'madiun', 'Jawa Timur', 'Madiun adalah kota yang terkenal dengan pecel dan sejarah perjuangan kemerdekaan.', 'https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg', -7.6298, 111.5239),
('Magelang', 'magelang', 'Jawa Tengah', 'Magelang adalah kota yang dekat dengan Candi Borobudur dan Akademi Militer.', 'https://images.pexels.com/photos/2422915/pexels-photo-2422915.jpeg', -7.4698, 110.2177),
('Makassar', 'makassar', 'Sulawesi Selatan', 'Makassar adalah kota terbesar di Sulawesi dan pusat perdagangan Indonesia Timur.', 'https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg', -5.1477, 119.4327),
('Malang', 'malang', 'Jawa Timur', 'Malang adalah kota pendidikan dengan iklim sejuk dan banyak universitas.', 'https://images.pexels.com/photos/2422915/pexels-photo-2422915.jpeg', -7.9797, 112.6304),
('Manado', 'manado', 'Sulawesi Utara', 'Manado adalah ibu kota Sulawesi Utara yang terkenal dengan Bunaken dan kuliner ekstrem.', 'https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg', 1.4748, 124.8421),
('Mataram', 'mataram', 'Nusa Tenggara Barat', 'Mataram adalah ibu kota NTB yang menjadi gerbang ke Lombok dan Gili.', 'https://images.pexels.com/photos/2422915/pexels-photo-2422915.jpeg', -8.5833, 116.1167),
('Medan', 'medan', 'Sumatera Utara', 'Medan adalah kota terbesar di Sumatera dan pusat ekonomi wilayah barat Indonesia.', 'https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg', 3.5952, 98.6722),
('Padang', 'padang', 'Sumatera Barat', 'Padang adalah ibu kota Sumatera Barat yang terkenal dengan masakan Padang.', 'https://images.pexels.com/photos/2422915/pexels-photo-2422915.jpeg', -0.9471, 100.4172),
('Palangkaraya', 'palangkaraya', 'Kalimantan Tengah', 'Palangkaraya adalah ibu kota Kalimantan Tengah yang dikenal dengan orangutan.', 'https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg', -2.2080, 113.9294),
('Palembang', 'palembang', 'Sumatera Selatan', 'Palembang adalah kota tertua di Indonesia dengan Sungai Musi dan pempek yang terkenal.', 'https://images.pexels.com/photos/2422915/pexels-photo-2422915.jpeg', -2.9761, 104.7754),
('Palu', 'palu', 'Sulawesi Tengah', 'Palu adalah ibu kota Sulawesi Tengah yang terletak di lembah dengan pemandangan indah.', 'https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg', -0.8917, 119.8707),
('Pangkalpinang', 'pangkalpinang', 'Kepulauan Bangka Belitung', 'Pangkalpinang adalah ibu kota Babel yang terkenal dengan timah dan pantai indah.', 'https://images.pexels.com/photos/2422915/pexels-photo-2422915.jpeg', -2.1316, 106.1167),
('Pekanbaru', 'pekanbaru', 'Riau', 'Pekanbaru adalah ibu kota Riau yang menjadi pusat industri minyak dan kelapa sawit.', 'https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg', 0.5333, 101.4500),
('Pontianak', 'pontianak', 'Kalimantan Barat', 'Pontianak adalah kota khatulistiwa yang terkenal dengan Sungai Kapuas.', 'https://images.pexels.com/photos/2422915/pexels-photo-2422915.jpeg', -0.0263, 109.3425),
('Samarinda', 'samarinda', 'Kalimantan Timur', 'Samarinda adalah ibu kota Kalimantan Timur yang kaya akan sumber daya alam.', 'https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg', -0.5022, 117.1536),
('Semarang', 'semarang', 'Jawa Tengah', 'Semarang adalah ibu kota Jawa Tengah dengan pelabuhan penting dan Kota Lama yang bersejarah.', 'https://images.pexels.com/photos/2422915/pexels-photo-2422915.jpeg', -6.9667, 110.4167),
('Serang', 'serang', 'Banten', 'Serang adalah ibu kota Banten yang memiliki sejarah Kesultanan Banten.', 'https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg', -6.1200, 106.1500),
('Sidoarjo', 'sidoarjo', 'Jawa Timur', 'Sidoarjo adalah kota industri yang terkenal dengan petis dan bandeng.', 'https://images.pexels.com/photos/2422915/pexels-photo-2422915.jpeg', -7.4478, 112.7183),
('Solo', 'solo', 'Jawa Tengah', 'Solo adalah kota budaya Jawa dengan Keraton Kasunanan dan batik yang terkenal.', 'https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg', -7.5667, 110.8167),
('Sorong', 'sorong', 'Papua Barat', 'Sorong adalah kota industri minyak dan gerbang ke Raja Ampat.', 'https://images.pexels.com/photos/2422915/pexels-photo-2422915.jpeg', -0.8833, 131.2500),
('Surabaya', 'surabaya', 'Jawa Timur', 'Surabaya adalah kota terbesar kedua di Indonesia dan pusat industri Jawa Timur.', 'https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg', -7.2575, 112.7521),
('Tangerang', 'tangerang', 'Banten', 'Tangerang adalah kota satelit Jakarta yang berkembang pesat sebagai pusat bisnis.', 'https://images.pexels.com/photos/2422915/pexels-photo-2422915.jpeg', -6.1783, 106.6319),
('Tanjungpinang', 'tanjungpinang', 'Kepulauan Riau', 'Tanjungpinang adalah ibu kota Kepulauan Riau dengan sejarah Kerajaan Melayu.', 'https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg', 0.9167, 104.4500),
('Tarakan', 'tarakan', 'Kalimantan Utara', 'Tarakan adalah kota pulau yang terkenal dengan industri minyak dan sejarah Perang Dunia II.', 'https://images.pexels.com/photos/2422915/pexels-photo-2422915.jpeg', 3.3000, 117.6333),
('Tasikmalaya', 'tasikmalaya', 'Jawa Barat', 'Tasikmalaya adalah kota yang terkenal dengan kerajinan anyaman dan kelom geulis.', 'https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg', -7.3506, 108.2186),
('Tegal', 'tegal', 'Jawa Tengah', 'Tegal adalah kota pelabuhan yang terkenal dengan teh poci dan ikan asin.', 'https://images.pexels.com/photos/2422915/pexels-photo-2422915.jpeg', -6.8694, 109.1403),
('Ternate', 'ternate', 'Maluku Utara', 'Ternate adalah pulau bersejarah yang terkenal dengan rempah-rempah dan Gunung Gamalama.', 'https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg', 0.7833, 127.3833),
('Yogyakarta', 'yogyakarta', 'DI Yogyakarta', 'Yogyakarta adalah kota istimewa yang menjadi pusat budaya Jawa dan pendidikan.', 'https://images.pexels.com/photos/2422915/pexels-photo-2422915.jpeg', -7.7956, 110.3695),
('Batu', 'batu', 'Jawa Timur', 'Kota Batu adalah kota wisata di Jawa Timur yang terkenal dengan Jatim Park dan kebun apel.', 'https://images.pexels.com/photos/2422915/pexels-photo-2422915.jpeg', -7.8711, 122.5186),
('Banyuwangi', 'banyuwangi', 'Jawa Timur', 'Banyuwangi adalah kabupaten di ujung timur Pulau Jawa, pintu masuk ke Kawah Ijen dan Baluran.', 'https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg', -8.2188, 114.3691);

-- Mark beberapa kota populer sebagai featured
update public.cities set is_featured = true where slug in (
  'jakarta', 'yogyakarta', 'bali', 'bandung', 'batu', 'banyuwangi', 'malang', 'semarang', 'surabaya', 'medan'
);
-- Note: 'bali' tidak ada di slug, pakai 'denpasar'
update public.cities set is_featured = true where slug = 'denpasar';

-- ============================================================
-- SEED: Wisata Categories
-- ============================================================

insert into public.wisata_categories (name, slug, description, icon, is_featured) values
('Wisata Alam', 'wisata-alam', 'Destinasi alam terbuka seperti gunung, hutan, dan danau', '🏔️', true),
('Wisata Pantai', 'wisata-pantai', 'Pantai dan pesisir dengan pasir putih dan air jernih', '🏖️', true),
('Wisata Keluarga', 'wisata-keluarga', 'Destinasi ramah keluarga yang cocok untuk semua usia', '👨‍👩‍👧‍👦', true),
('Wisata Budaya', 'wisata-budaya', 'Candi, keraton, museum, dan situs budaya Indonesia', '🏛️', true),
('Wisata Sejarah', 'wisata-sejarah', 'Situs bersejarah, monumen, dan peninggalan masa lalu', '📜', false),
('Wisata Gunung', 'wisata-gunung', 'Pendakian gunung dan wisata pegunungan', '⛰️', true),
('Wisata Air Terjun', 'wisata-air-terjun', 'Curug dan air terjun yang menakjubkan', '💧', false),
('Taman Hiburan', 'taman-hiburan', 'Theme park, wahana, dan taman bermain', '🎡', true),
('Wisata Religi', 'wisata-religi', 'Masjid bersejarah, pura, klenteng, dan tempat ibadah', '🕌', false),
('Hidden Gem', 'hidden-gem', 'Destinasi tersembunyi yang belum banyak diketahui', '💎', false),
('Wisata Edukasi', 'wisata-edukasi', 'Kebun binatang, museum sains, dan destinasi edukatif', '🔬', false),
('Wisata Kuliner Area', 'wisata-kuliner', 'Kawasan wisata kuliner dan street food terkenal', '🍜', false);
