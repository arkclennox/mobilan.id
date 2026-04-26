const BASE_URL = 'https://deepskyblue-oryx-260341.hostingersite.com';

export async function getPosts() {
  const res = await fetch(`${BASE_URL}/wp-json/wp/v2/posts?_embed`, {
    next: { revalidate: 60 }
  });

  if (!res.ok) {
    console.error('Gagal mengambil posts:', res.status);
    return [];
  }

  return await res.json();
}

export async function getPostsPaginated(page = 1, category = null) {
  let url = `${BASE_URL}/wp-json/wp/v2/posts?_embed&page=${page}&per_page=6`;
  if (category) {
    url += `&categories=${category}`;
  }

  const res = await fetch(url, {
    next: { revalidate: 60 }
  });

  if (!res.ok) {
    console.error('Gagal mengambil posts:', res.status);
    return { posts: [], totalPages: 0 };
  }

  const posts = await res.json();
  const totalPages = parseInt(res.headers.get('X-WP-TotalPages') || '1');

  return { posts, totalPages };
}

export async function getCategories() {
  const res = await fetch(`${BASE_URL}/wp-json/wp/v2/categories`, {
    next: { revalidate: 60 }
  });

  if (!res.ok) {
    console.error('Gagal mengambil categories:', res.status);
    return [];
  }

  return await res.json();
}
export async function getPost(slug) {
  const res = await fetch(`${BASE_URL}/wp-json/wp/v2/posts?slug=${slug}&_embed`, {
    next: { revalidate: 60 }
  });

  if (!res.ok) {
    console.error('Gagal mengambil post:', res.status);
    return null;
  }

  const data = await res.json();
  return data.length > 0 ? data[0] : null;
}

export async function getPostPreview(slug) {
  const res = await fetch(`${BASE_URL}/wp-json/wp/v2/posts?slug=${slug}&_embed&status=draft,publish`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    console.error('Gagal mengambil post preview:', res.status);
    return null;
  }

  const data = await res.json();
  return data.length > 0 ? data[0] : null;
}

// Helper function to extract featured image URL from WordPress post
export function getFeaturedImageUrl(post) {
  // Method 1: Check _embedded wp:featuredmedia
  if (post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'][0]) {
    const media = post._embedded['wp:featuredmedia'][0];
    
    // Try source_url first
    if (media.source_url) {
      return media.source_url;
    }
    
    // Try media_details sizes
    if (media.media_details && media.media_details.sizes) {
      // Try full size first
      if (media.media_details.sizes.full && media.media_details.sizes.full.source_url) {
        return media.media_details.sizes.full.source_url;
      }
      
      // Try large size
      if (media.media_details.sizes.large && media.media_details.sizes.large.source_url) {
        return media.media_details.sizes.large.source_url;
      }
      
      // Try medium_large size
      if (media.media_details.sizes.medium_large && media.media_details.sizes.medium_large.source_url) {
        return media.media_details.sizes.medium_large.source_url;
      }
      
      // Try medium size
      if (media.media_details.sizes.medium && media.media_details.sizes.medium.source_url) {
        return media.media_details.sizes.medium.source_url;
      }
    }
    
    // Try guid as last resort
    if (media.guid && media.guid.rendered) {
      return media.guid.rendered;
    }
  }
  
  // Method 2: If featured_media ID exists, construct URL (fallback method)
  if (post.featured_media && post.featured_media > 0) {
    // This is a fallback - in a real scenario you'd make another API call to get media details
    // For now, we'll return null and let the component handle no image
    return null;
  }
  
  return null;
}