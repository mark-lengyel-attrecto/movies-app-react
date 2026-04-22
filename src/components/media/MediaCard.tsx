'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { Star } from 'lucide-react';

import { Link } from '@/i18n/navigation';
import { posterUrl } from '@/lib/tmdb/client';

import type { NormalizedMedia } from './normalize';
import { WatchlistBadge } from './WatchlistBadge';

interface MediaCardProps {
  item: NormalizedMedia;
  index: number;
}

export function MediaCard({ item, index }: MediaCardProps) {
  const t = useTranslations('MovieCard');
  const poster = posterUrl(item.posterPath, 'w342');
  const rating = item.voteAverage?.toFixed(1);

  return (
    <Link
      href={item.href}
      className="group bg-elevated relative flex flex-col overflow-hidden rounded-lg transition-transform hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="bg-subtle relative aspect-[2/3] w-full">
        {poster ? (
          <Image
            src={poster}
            alt={item.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            loading={index < 5 ? 'eager' : 'lazy'}
            className="object-cover transition-opacity group-hover:opacity-90"
          />
        ) : (
          <div className="text-muted flex h-full items-center justify-center">{t('noImage')}</div>
        )}

        {rating && (
          <div className="absolute top-2 right-2 flex min-h-5 items-center gap-1 rounded bg-black/70 px-1.5 py-0.5 text-xs font-semibold text-yellow-400">
            <Star size={10} fill="currentColor" aria-hidden="true" /> {rating}
          </div>
        )}

        {item.mediaTypeBadge && (
          <div className="absolute bottom-2 left-2 min-h-5 rounded bg-black/70 px-1.5 py-0.5 text-xs font-medium text-white">
            {item.mediaTypeBadge === 'tv' ? 'TV' : 'Movie'}
          </div>
        )}

        <WatchlistBadge item={item} />
      </div>

      <div className="flex flex-col gap-1 p-3">
        <h3 className="text-foreground line-clamp-2 text-sm font-medium">{item.title}</h3>
        {item.year && <p className="text-muted text-xs">{item.year}</p>}
      </div>
    </Link>
  );
}
