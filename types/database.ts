export type City = {
  id: string;
  name: string;
  slug: string;
  province: string | null;
  island: string | null;
  description: string | null;
  hero_image_url: string | null;
  latitude: number | null;
  longitude: number | null;
  is_featured: boolean;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
};

export type WisataCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  is_featured: boolean;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
};

export type WisataPlace = {
  id: string;
  name: string;
  slug: string;
  city_id: string | null;
  short_description: string | null;
  full_description: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  opening_hours: string | null;
  ticket_price_text: string | null;
  best_time_to_visit: string | null;
  suitable_for: string | null;
  tips: string | null;
  hero_image_url: string | null;
  is_featured: boolean;
  is_published: boolean;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
  // Joined
  city?: City | null;
  categories?: WisataCategory[];
  images?: WisataImage[];
  activity_offers?: ActivityOffer[];
  accommodations?: WisataAccommodationWithDetail[];
};

export type WisataImage = {
  id: string;
  wisata_place_id: string;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
  created_at: string;
};

export type ActivityOffer = {
  id: string;
  wisata_place_id: string;
  provider: string;
  title: string;
  affiliate_url: string;
  image_url: string | null;
  price_text: string | null;
  note: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type Accommodation = {
  id: string;
  name: string;
  slug: string;
  city_id: string | null;
  area: string | null;
  short_description: string | null;
  image_url: string | null;
  provider: string;
  affiliate_url: string;
  property_type: string | null;
  price_label: string | null;
  address_short: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type WisataAccommodationWithDetail = {
  id: string;
  wisata_place_id: string;
  accommodation_id: string;
  distance_text: string | null;
  sort_order: number;
  created_at: string;
  accommodation: Accommodation;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content_html: string | null;
  featured_image_url: string | null;
  author_name: string;
  is_published: boolean;
  published_at: string | null;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
};

// Form types for admin
export type WisataPlaceForm = Omit<WisataPlace, 'id' | 'created_at' | 'updated_at' | 'city' | 'categories' | 'images' | 'activity_offers' | 'accommodations'>;
export type BlogPostForm = Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>;
export type ActivityOfferForm = Omit<ActivityOffer, 'id' | 'created_at' | 'updated_at'>;
export type AccommodationForm = Omit<Accommodation, 'id' | 'created_at' | 'updated_at'>;
