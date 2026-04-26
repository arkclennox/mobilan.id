import React from 'react';
import Link from 'next/link';
import { MapPin, Clock, DollarSign } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface DestinationCardProps {
  id: string;
  name: string;
  description: string;
  image: string;
  distance?: string;
  time?: string;
  cost?: string;
}

export function DestinationCard({
  id,
  name,
  description,
  image,
  distance,
  time,
  cost,
}: DestinationCardProps) {
  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <h3 className="absolute bottom-4 left-4 text-xl font-bold text-white">
          {name}
        </h3>
      </div>
      <CardContent className="p-6">
        <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
          {description}
        </p>
        
        {distance && time && cost && (
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{distance}</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-2" />
              <span>{time}</span>
            </div>
            <div className="flex items-center text-sm text-brand-600 font-medium">
              <DollarSign className="h-4 w-4 mr-2" />
              <span>{cost}</span>
            </div>
          </div>
        )}
        
        <Button 
          asChild 
          variant="outline" 
          className="w-full group-hover:bg-brand-600 group-hover:text-white group-hover:border-brand-600 transition-colors"
        >
          <Link href={`/destinasi/${id}`}>
            Lihat Detail
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}