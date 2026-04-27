'use client';

import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { ActivityOffer } from '@/types/database';

type Props = {
  offer: Pick<ActivityOffer, 'id' | 'provider' | 'title' | 'affiliate_url' | 'image_url' | 'price_text' | 'note'>;
  wisataName?: string;
  wisataSlug?: string;
};

const PROVIDER_COLORS: Record<string, string> = {
  Traveloka: 'bg-blue-100 text-blue-700',
  'tiket.com': 'bg-red-100 text-red-700',
  Agoda: 'bg-orange-100 text-orange-700',
  Klook: 'bg-green-100 text-green-700',
};

export function OfferCard({ offer, wisataName, wisataSlug }: Props) {
  const handleClick = () => {
    if (typeof window !== 'undefined' && (window as Window & typeof globalThis & { gtag?: (...args: unknown[]) => void }).gtag) {
      (window as Window & typeof globalThis & { gtag: (...args: unknown[]) => void }).gtag('event', 'affiliate_offer_clicked', {
        provider: offer.provider,
        type: 'ticket',
        wisata_name: wisataName,
        wisata_slug: wisataSlug,
        page_path: window.location.pathname,
      });
    }
  };

  const providerColor = PROVIDER_COLORS[offer.provider] || 'bg-gray-100 text-gray-700';

  return (
    <div className="border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow bg-card">
      {offer.image_url && (
        <div className="h-32 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={offer.image_url} alt={offer.title} className="w-full h-full object-cover" loading="lazy" />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <p className="font-semibold text-sm line-clamp-2 flex-1">{offer.title}</p>
          <Badge className={`text-xs shrink-0 ${providerColor} border-0`}>{offer.provider}</Badge>
        </div>
        {offer.price_text && (
          <p className="text-brand-600 font-medium text-sm mb-1">{offer.price_text}</p>
        )}
        {offer.note && (
          <p className="text-xs text-muted-foreground mb-3 line-clamp-1">{offer.note}</p>
        )}
        <Button
          asChild
          size="sm"
          className="w-full bg-brand-600 hover:bg-brand-700 text-white"
          onClick={handleClick}
        >
          <a href={offer.affiliate_url} target="_blank" rel="noopener noreferrer nofollow">
            Pesan di {offer.provider}
            <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
          </a>
        </Button>
      </div>
    </div>
  );
}
