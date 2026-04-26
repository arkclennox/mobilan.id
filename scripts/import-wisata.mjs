// Import wisata CSV data into Supabase
// Usage: node scripts/import-wisata.mjs
import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://jcvtwkjpbxxedooftbso.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpjdnR3a2pwYnh4ZWRvb2Z0YnNvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzE1Mzc5NCwiZXhwIjoyMDkyNzI5Nzk0fQ._m3MywFAty871UIJinBhLslFwSoDl0AZclaQdW7AWpE';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

// ── CSV Parser ────────────────────────────────────────────────────────────────
function parseCSV(text) {
  const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
  const headers = parseLine(lines[0]);
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const values = parseLine(line);
    const row = {};
    headers.forEach((h, idx) => {
      row[h.trim()] = values[idx] !== undefined ? values[idx].trim() : '';
    });
    rows.push(row);
  }
  return rows;
}

function parseLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
      else { inQuotes = !inQuotes; }
    } else if (ch === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

// ── Slugify ───────────────────────────────────────────────────────────────────
function slugify(str) {
  return str
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// ── Island mapping ────────────────────────────────────────────────────────────
const PROVINCE_TO_ISLAND = {
  'Bali': 'Bali & Nusa Tenggara',
  'Nusa Tenggara Barat': 'Bali & Nusa Tenggara',
  'Nusa Tenggara Timur': 'Bali & Nusa Tenggara',
  'DKI Jakarta': 'Jawa',
  'Jawa Barat': 'Jawa',
  'Jawa Tengah': 'Jawa',
  'Jawa Timur': 'Jawa',
  'DI Yogyakarta': 'Jawa',
  'Banten': 'Jawa',
  'Aceh': 'Sumatra',
  'Sumatera Utara': 'Sumatra',
  'Sumatera Barat': 'Sumatra',
  'Riau': 'Sumatra',
  'Kepulauan Riau': 'Sumatra',
  'Jambi': 'Sumatra',
  'Sumatera Selatan': 'Sumatra',
  'Bengkulu': 'Sumatra',
  'Lampung': 'Sumatra',
  'Kepulauan Bangka Belitung': 'Sumatra',
  'Kalimantan Barat': 'Kalimantan',
  'Kalimantan Tengah': 'Kalimantan',
  'Kalimantan Selatan': 'Kalimantan',
  'Kalimantan Timur': 'Kalimantan',
  'Kalimantan Utara': 'Kalimantan',
  'Sulawesi Utara': 'Sulawesi',
  'Sulawesi Tengah': 'Sulawesi',
  'Sulawesi Selatan': 'Sulawesi',
  'Sulawesi Tenggara': 'Sulawesi',
  'Gorontalo': 'Sulawesi',
  'Sulawesi Barat': 'Sulawesi',
  'Maluku': 'Maluku',
  'Maluku Utara': 'Maluku',
  'Papua': 'Papua',
  'Papua Barat': 'Papua',
  'Papua Selatan': 'Papua',
  'Papua Tengah': 'Papua',
  'Papua Pegunungan': 'Papua',
  'Papua Barat Daya': 'Papua',
};

// ── Load CSVs ─────────────────────────────────────────────────────────────────
const BASE = '/Users/myusufnur/Downloads/database-wisata';
const csvDeskripsi = parseCSV(readFileSync(`${BASE}/wisata_indonesia_dengan_deskripsi.csv`, 'utf8'));
const csvMaster   = parseCSV(readFileSync(`${BASE}/master_wisata.csv`, 'utf8'));
const csvNusantara = parseCSV(readFileSync(`${BASE}/wisata_nusantara.csv`, 'utf8'));

// ── Merge & deduplicate ───────────────────────────────────────────────────────
// Key: nama_wisata (lowercased). Prefer records with deskripsi, then master, then nusantara.
const map = new Map();

function normalizeKey(name) {
  return name.toLowerCase().trim();
}

// Process in reverse priority so higher-priority sources overwrite
for (const row of csvNusantara) {
  if (!row.nama_wisata) continue;
  map.set(normalizeKey(row.nama_wisata), {
    nama_wisata: row.nama_wisata,
    kategori: '',
    latitude: row.latitude,
    longitude: row.longitude,
    alamat: row.alamat,
    provinsi: row.provinsi,
    kota_kabupaten: row.kota_kabupaten,
    deskripsi: '',
  });
}
for (const row of csvMaster) {
  if (!row.nama_wisata) continue;
  const key = normalizeKey(row.nama_wisata);
  const existing = map.get(key);
  map.set(key, {
    nama_wisata: row.nama_wisata,
    kategori: row.kategori || (existing?.kategori ?? ''),
    latitude: row.latitude || (existing?.latitude ?? ''),
    longitude: row.longitude || (existing?.longitude ?? ''),
    alamat: row.alamat || (existing?.alamat ?? ''),
    provinsi: row.provinsi || (existing?.provinsi ?? ''),
    kota_kabupaten: row.kota_kabupaten || (existing?.kota_kabupaten ?? ''),
    deskripsi: existing?.deskripsi ?? '',
  });
}
for (const row of csvDeskripsi) {
  if (!row.nama_wisata) continue;
  const key = normalizeKey(row.nama_wisata);
  const existing = map.get(key);
  const deskripsi = (row.deskripsi && row.deskripsi !== 'Deskripsi tidak ditemukan') ? row.deskripsi : (existing?.deskripsi ?? '');
  map.set(key, {
    nama_wisata: row.nama_wisata,
    kategori: row.kategori || (existing?.kategori ?? ''),
    latitude: row.latitude || (existing?.latitude ?? ''),
    longitude: row.longitude || (existing?.longitude ?? ''),
    alamat: row.alamat || (existing?.alamat ?? ''),
    provinsi: row.provinsi || (existing?.provinsi ?? ''),
    kota_kabupaten: row.kota_kabupaten || (existing?.kota_kabupaten ?? ''),
    deskripsi,
  });
}

const records = [...map.values()];
console.log(`Total unique wisata: ${records.length}`);

// ── Collect unique categories ─────────────────────────────────────────────────
const kategoriSet = new Set(records.map(r => r.kategori).filter(Boolean));
const kategoris = [...kategoriSet].sort();
console.log(`Unique categories: ${kategoris.length}`);

// ── Collect unique cities ─────────────────────────────────────────────────────
const cityKeySet = new Set(
  records
    .filter(r => r.kota_kabupaten)
    .map(r => `${r.kota_kabupaten}||${r.provinsi}`)
);
console.log(`Unique cities: ${cityKeySet.size}`);

// ── Step 1: Upsert categories ─────────────────────────────────────────────────
console.log('\n[1/4] Upserting categories...');
const categoryRowsRaw = kategoris.map(k => ({
  name: k.charAt(0).toUpperCase() + k.slice(1),
  slug: slugify(k),
  is_featured: false,
  updated_at: new Date().toISOString(),
}));
// Deduplicate by slug (keep first occurrence)
const seenCatSlugs = new Set();
const categoryRows = categoryRowsRaw.filter(r => {
  if (seenCatSlugs.has(r.slug)) return false;
  seenCatSlugs.add(r.slug);
  return true;
});

const { error: catErr } = await supabase
  .from('wisata_categories')
  .upsert(categoryRows, { onConflict: 'slug', ignoreDuplicates: true });
if (catErr) { console.error('Category upsert error:', catErr.message); process.exit(1); }

// Fetch all categories to get their IDs
const { data: allCats } = await supabase.from('wisata_categories').select('id, slug');
const catSlugToId = Object.fromEntries(allCats.map(c => [c.slug, c.id]));
console.log(`  ✓ ${allCats.length} categories ready`);

// ── Step 2: Upsert cities ─────────────────────────────────────────────────────
console.log('\n[2/4] Upserting cities...');

// Fetch existing cities
const { data: existingCities } = await supabase.from('cities').select('id, name, province, slug');
const citySlugToId = Object.fromEntries(existingCities.map(c => [c.slug, c.id]));
const cityNameProvinceToId = Object.fromEntries(
  existingCities.map(c => [`${(c.name||'').toLowerCase()}||${(c.province||'').toLowerCase()}`, c.id])
);

const newCityRows = [];
for (const cityKey of cityKeySet) {
  const [kotaKab, provinsi] = cityKey.split('||');
  const lookupKey = `${kotaKab.toLowerCase()}||${provinsi.toLowerCase()}`;
  if (cityNameProvinceToId[lookupKey]) continue; // already exists
  const slug = slugify(kotaKab);
  if (citySlugToId[slug]) {
    // slug exists but different province — suffix with province slug
    const altSlug = `${slug}-${slugify(provinsi)}`;
    if (!newCityRows.find(r => r.slug === altSlug)) {
      newCityRows.push({
        name: kotaKab,
        slug: altSlug,
        province: provinsi || null,
        island: PROVINCE_TO_ISLAND[provinsi] || null,
        is_featured: false,
        updated_at: new Date().toISOString(),
      });
    }
  } else if (!newCityRows.find(r => r.slug === slug)) {
    newCityRows.push({
      name: kotaKab,
      slug,
      province: provinsi || null,
      island: PROVINCE_TO_ISLAND[provinsi] || null,
      is_featured: false,
      updated_at: new Date().toISOString(),
    });
  }
}

if (newCityRows.length > 0) {
  const BATCH = 50;
  for (let i = 0; i < newCityRows.length; i += BATCH) {
    const batch = newCityRows.slice(i, i + BATCH);
    const { error: cityErr } = await supabase
      .from('cities')
      .upsert(batch, { onConflict: 'slug', ignoreDuplicates: true });
    if (cityErr) console.warn('  city upsert warning:', cityErr.message);
  }
  console.log(`  ✓ Inserted ${newCityRows.length} new cities`);
} else {
  console.log('  ✓ No new cities needed');
}

// Refresh city map
const { data: allCities } = await supabase.from('cities').select('id, name, province, slug');
const refreshedCityMap = new Map(
  allCities.map(c => [`${(c.name||'').toLowerCase()}||${(c.province||'').toLowerCase()}`, c.id])
);
const refreshedSlugMap = new Map(allCities.map(c => [c.slug, c.id]));

function getCityId(kotaKab, provinsi) {
  if (!kotaKab) return null;
  const byNameProv = refreshedCityMap.get(`${kotaKab.toLowerCase()}||${(provinsi||'').toLowerCase()}`);
  if (byNameProv) return byNameProv;
  // fallback: match by slug
  return refreshedSlugMap.get(slugify(kotaKab)) || null;
}

// ── Step 3: Insert wisata_places ──────────────────────────────────────────────
console.log('\n[3/4] Inserting wisata places...');

// Get existing slugs to avoid duplicates
const { data: existingPlaces } = await supabase.from('wisata_places').select('id, slug, name');
const existingSlugSet = new Set(existingPlaces.map(p => p.slug));
const existingNameSet = new Set(existingPlaces.map(p => p.name.toLowerCase().trim()));

const wisataRows = [];
const slugCounter = {};

for (const r of records) {
  if (!r.nama_wisata) continue;
  if (existingNameSet.has(r.nama_wisata.toLowerCase().trim())) continue;

  let slug = slugify(r.nama_wisata);
  // Deduplicate slugs within this batch
  if (existingSlugSet.has(slug) || slugCounter[slug]) {
    const suffix = slugCounter[slug] ? slugCounter[slug] + 1 : 2;
    slug = `${slug}-${suffix}`;
  }
  slugCounter[slugify(r.nama_wisata)] = (slugCounter[slugify(r.nama_wisata)] || 1);
  existingSlugSet.add(slug);

  const city_id = getCityId(r.kota_kabupaten, r.provinsi);

  wisataRows.push({
    name: r.nama_wisata,
    slug,
    city_id,
    short_description: r.deskripsi || null,
    address: r.alamat || null,
    latitude: r.latitude ? parseFloat(r.latitude) : null,
    longitude: r.longitude ? parseFloat(r.longitude) : null,
    is_featured: false,
    is_published: true,
    updated_at: new Date().toISOString(),
    // _kategori is used locally, not inserted
    _kategori: r.kategori,
  });
}

console.log(`  Inserting ${wisataRows.length} new wisata places...`);

const BATCH_SIZE = 100;
const insertedPlaces = [];

for (let i = 0; i < wisataRows.length; i += BATCH_SIZE) {
  const batch = wisataRows.slice(i, i + BATCH_SIZE).map(({ _kategori, ...rest }) => rest);
  const { data, error } = await supabase
    .from('wisata_places')
    .insert(batch)
    .select('id, slug');
  if (error) {
    console.error(`  Batch ${i}-${i + BATCH_SIZE} error:`, error.message);
    continue;
  }
  // Map inserted slugs back to kategori
  data.forEach((inserted) => {
    const original = wisataRows.find(w => w.slug === inserted.slug);
    insertedPlaces.push({ id: inserted.id, slug: inserted.slug, kategori: original?._kategori || '' });
  });
  process.stdout.write(`  ${Math.min(i + BATCH_SIZE, wisataRows.length)}/${wisataRows.length}\r`);
}
console.log(`\n  ✓ Inserted ${insertedPlaces.length} wisata places`);

// ── Step 4: Insert wisata_place_categories ────────────────────────────────────
console.log('\n[4/4] Linking categories...');

const categoryLinks = [];
for (const place of insertedPlaces) {
  if (!place.kategori) continue;
  const catId = catSlugToId[slugify(place.kategori)];
  if (!catId) continue;
  categoryLinks.push({
    wisata_place_id: place.id,
    wisata_category_id: catId,
  });
}

if (categoryLinks.length > 0) {
  for (let i = 0; i < categoryLinks.length; i += BATCH_SIZE) {
    const batch = categoryLinks.slice(i, i + BATCH_SIZE);
    const { error } = await supabase
      .from('wisata_place_categories')
      .upsert(batch, { onConflict: 'wisata_place_id,wisata_category_id', ignoreDuplicates: true });
    if (error) console.warn('  Category link warning:', error.message);
  }
  console.log(`  ✓ Linked ${categoryLinks.length} category associations`);
} else {
  console.log('  ✓ No category links to insert');
}

console.log('\nDone!');
