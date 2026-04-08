import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';
import { posterUrl } from '@/lib/tmdb/client';
import type { TVSeries } from '@/types/tmdb';

interface TVCardProps {
  show: TVSeries;
  index: number;
}

export function TVCard({ show, index }: TVCardProps) {
  const t = useTranslations('MovieCard');
  const poster = posterUrl(show.poster_path, 'w342');
  const year = show.first_air_date ? new Date(show.first_air_date).getFullYear() : null;
  const rating = show.vote_average?.toFixed(1);

  return (
    <Link
      href={`/tv/${show.id}`}
      className="group bg-elevated relative flex flex-col overflow-hidden rounded-lg transition-transform hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="bg-subtle relative aspect-[2/3] w-full">
        {poster ? (
          <Image
            src={poster}
            alt={show.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            loading={index < 5 ? 'eager' : 'lazy'}
            className="object-cover transition-opacity group-hover:opacity-90"
          />
        ) : (
          <div className="text-muted flex h-full items-center justify-center">{t('noImage')}</div>
        )}

        {/* Rating badge */}
        {rating && (
          <div className="absolute top-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-xs font-semibold text-yellow-400">
            ★ {rating}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1 p-3">
        <h3 className="text-foreground line-clamp-2 text-sm font-medium">{show.name}</h3>
        {year && <p className="text-muted text-xs">{year}</p>}
      </div>
    </Link>
  );
}
