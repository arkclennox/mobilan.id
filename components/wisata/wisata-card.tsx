import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Clock, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { WisataPlace } from '@/types/database';

type Props = {
  wisata: Pick<WisataPlace, 'id' | 'name' | 'slug' | 'short_description' | 'hero_image_url' | 'ticket_price_text' | 'opening_hours' | 'is_featured'> & {
    city?: { name: string; slug: string } | null;
    categories?: { name: string; slug: string; icon?: string | null }[];
  };
};

export function WisataCard({ wisata }: Props) {
  const firstCategory = wisata.categories?.[0];

  return (
    <Link href={`/wisata/${wisata.slug}`} className="group block">
      <article className="bg-card rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
        <div className="relative h-52 overflow-hidden">
          {wisata.hero_image_url ? (
            <Image
              src={wisata.hero_image_url}
              alt={wisata.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <MapPin className="h-10 w-10 text-muted-foreground" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          {wisata.is_featured && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-brand-600 text-white text-xs">Unggulan</Badge>
            </div>
          )}
          {firstCategory && (
            <div className="absolute top-3 right-3">
              <Badge variant="secondary" className="text-xs bg-black/50 text-white border-0">
                {firstCategory.icon} {firstCategory.name}
              </Badge>
            </div>
          )}
        </div>

        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-bold text-lg mb-1 group-hover:text-brand-600 transition-colors line-clamp-1">
            {wisata.name}
          </h3>

          {wisata.city && (
            <div className="flex items-center text-sm text-muted-foreground mb-2">
              <MapPin className="h-3.5 w-3.5 mr-1 shrink-0" />
              <span>{wisata.city.name}</span>
            </div>
          )}

          {wisata.short_description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3 flex-1">
              {wisata.short_description}
            </p>
          )}

          <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
            {wisata.ticket_price_text ? (
              <div className="flex items-center text-sm text-brand-600 font-medium">
                <Tag className="h-3.5 w-3.5 mr-1" />
                <span className="line-clamp-1">{wisata.ticket_price_text}</span>
              </div>
            ) : (
              <span className="text-xs text-muted-foreground">Info tiket tersedia</span>
            )}
            {wisata.opening_hours && (
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                <span className="line-clamp-1 max-w-[100px]">{wisata.opening_hours}</span>
              </div>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
