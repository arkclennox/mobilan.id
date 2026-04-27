'use client';

import { MapPin, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { WisataAccommodationWithDetail } from '@/types/database';

type Props = {
  item: WisataAccommodationWithDetail;
  wisataName?: string;
  wisataSlug?: string;
};

export function AccommodationCard({ item, wisataName, wisataSlug }: Props) {
  const { accommodation, distance_text } = item;
  if (!accommodation) return null;

  const handleClick = () => {
    if (typeof window !== 'undefined' && (window as Window & typeof globalThis & { gtag?: (...args: unknown[]) => void }).gtag) {
      (window as Window & typeof globalThis & { gtag: (...args: unknown[]) => void }).gtag('event', 'accommodation_offer_clicked', {
        provider: accommodation.provider,
        accommodation_name: accommodation.name,
        wisata_name: wisataName,
        wisata_slug: wisataSlug,
        page_path: window.location.pathname,
      });
    }
  };

  return (
    <div className="border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow bg-card flex flex-col">
      {accommodation.image_url && (
        <div className="h-36 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={accommodation.image_url} alt={accommodation.name} className="w-full h-full object-cover" loading="lazy" />
        </div>
      )}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h4 className="font-semibold text-sm line-clamp-1 flex-1">{accommodation.name}</h4>
          {accommodation.property_type && (
            <Badge variant="outline" className="text-xs shrink-0">{accommodation.property_type}</Badge>
          )}
        </div>

        {(accommodation.area || distance_text) && (
          <div className="flex items-center text-xs text-muted-foreground mb-2">
            <MapPin className="h-3 w-3 mr-1 shrink-0" />
            <span>
              {accommodation.area}
              {accommodation.area && distance_text && ' · '}
              {distance_text}
            </span>
          </div>
        )}

        {accommodation.short_description && (
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3 flex-1">
            {accommodation.short_description}
          </p>
        )}

        {accommodation.price_label && (
          <p className="text-brand-600 font-medium text-sm mb-3">{accommodation.price_label}</p>
        )}

        <Button
          asChild
          size="sm"
          variant="outline"
          className="w-full mt-auto hover:bg-brand-600 hover:text-white hover:border-brand-600 transition-colors"
          onClick={handleClick}
        >
          <a href={accommodation.affiliate_url} target="_blank" rel="noopener noreferrer nofollow">
            Lihat di {accommodation.provider}
            <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
          </a>
        </Button>
      </div>
    </div>
  );
}
