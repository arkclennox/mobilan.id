// Backfill wisata_place_categories for all existing wisata_places
// Usage: node scripts/link-categories.mjs
import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://jcvtwkjpbxxedooftbso.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpjdnR3a2pwYnh4ZWRvb2Z0YnNvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzE1Mzc5NCwiZXhwIjoyMDkyNzI5Nzk0fQ._m3MywFAty871UIJinBhLslFwSoDl0AZclaQdW7AWpE';
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

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

function parseCSV(text) {
  const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
  const headers = parseLine(lines[0]);
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const values = parseLine(line);
    const row = {};
    headers.forEach((h, idx) => { row[h.trim()] = values[idx] !== undefined ? values[idx].trim() : ''; });
    rows.push(row);
  }
  return rows;
}

function slugify(str) {
  return str.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

const BASE = '/Users/myusufnur/Downloads/database-wisata';
const csvDeskripsi = parseCSV(readFileSync(`${BASE}/wisata_indonesia_dengan_deskripsi.csv`, 'utf8'));
const csvMaster   = parseCSV(readFileSync(`${BASE}/master_wisata.csv`, 'utf8'));
const csvNusantara = parseCSV(readFileSync(`${BASE}/wisata_nusantara.csv`, 'utf8'));

// Build name → kategori map from all CSVs
const nameToCat = new Map();
for (const row of [...csvNusantara, ...csvMaster, ...csvDeskripsi]) {
  if (row.nama_wisata && row.kategori) {
    nameToCat.set(row.nama_wisata.toLowerCase().trim(), row.kategori.trim());
  }
}

// Fetch all places and categories
const { data: allPlaces } = await supabase.from('wisata_places').select('id, name, slug');
const { data: allCats }   = await supabase.from('wisata_categories').select('id, slug');

const catSlugToId = Object.fromEntries(allCats.map(c => [c.slug, c.id]));

const links = [];
for (const place of allPlaces) {
  const cat = nameToCat.get(place.name.toLowerCase().trim());
  if (!cat) continue;
  const catId = catSlugToId[slugify(cat)];
  if (!catId) continue;
  links.push({ wisata_place_id: place.id, wisata_category_id: catId });
}

console.log(`Linking ${links.length} place-category pairs...`);

const BATCH = 100;
let linked = 0;
for (let i = 0; i < links.length; i += BATCH) {
  const batch = links.slice(i, i + BATCH);
  const { error } = await supabase
    .from('wisata_place_categories')
    .upsert(batch, { onConflict: 'wisata_place_id,wisata_category_id', ignoreDuplicates: true });
  if (error) console.warn(`Batch ${i} error:`, error.message);
  else linked += batch.length;
  process.stdout.write(`  ${Math.min(i + BATCH, links.length)}/${links.length}\r`);
}

console.log(`\nDone! Linked ${linked} categories.`);
