import { getPosts } from '@/lib/wp';

export async function GET() {
  const baseUrl = 'https://mobilan.id';
  
  // Get all WordPress posts for dynamic sitemap
  let posts = [];
  try {
    posts = await getPosts();
  } catch (error) {
    console.error('Error fetching posts for sitemap:', error);
  }
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>2024-01-15T00:00:00Z</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/destinasi</loc>
    <lastmod>2024-01-15T00:00:00Z</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/kalkulator</loc>
    <lastmod>2024-01-15T00:00:00Z</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/blog</loc>
    <lastmod>2024-01-15T00:00:00Z</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/tentang</loc>
    <lastmod>2024-01-15T00:00:00Z</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${baseUrl}/kontak</loc>
    <lastmod>2024-01-15T00:00:00Z</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${baseUrl}/kebijakan-privasi</loc>
    <lastmod>2024-01-15T00:00:00Z</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>${baseUrl}/syarat-ketentuan</loc>
    <lastmod>2024-01-15T00:00:00Z</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
${posts.map((post: any) => `  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${new Date(post.modified).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}