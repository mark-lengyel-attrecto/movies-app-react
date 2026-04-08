import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';
import { posterUrl } from '@/lib/tmdb/client';
import type { MultiSearchMovie, MultiSearchTV } from '@/types/tmdb';

type MediaCardProps = {
  item: MultiSearchMovie | MultiSearchTV;
  index: number;
};

export function MediaCard({ item, index }: MediaCardProps) {
  const t = useTranslations('MovieCard');
  const poster = posterUrl(item.poster_path, 'w342');
  const isTV = item.media_type === 'tv';
  const title = isTV ? item.name : item.title;
  const date = isTV ? item.first_air_date : item.release_date;
  const year = date ? new Date(date).getFullYear() : null;
  const href = isTV ? `/tv/${item.id}` : `/movies/${item.id}`;
  const rating = item.vote_average?.toFixed(1);

  return (
    <Link
      href={href}
      className="group bg-elevated relative flex flex-col overflow-hidden rounded-lg transition-transform hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="bg-subtle relative aspect-[2/3] w-full">
        {poster ? (
          <Image
            src={poster}
            alt={title}
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

        {/* Media type badge */}
        <div className="absolute bottom-2 left-2 rounded bg-black/70 px-1.5 py-0.5 text-xs font-medium text-white">
          {isTV ? 'TV' : 'Movie'}
        </div>
      </div>

      <div className="flex flex-col gap-1 p-3">
        <h3 className="text-foreground line-clamp-2 text-sm font-medium">{title}</h3>
        {year && <p className="text-muted text-xs">{year}</p>}
      </div>
    </Link>
  );
}
