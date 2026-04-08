import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';
import { posterUrl } from '@/lib/tmdb/client';
import type { Movie } from '@/types/tmdb';

interface MovieCardProps {
  movie: Movie;
  index: number;
}

export function MovieCard({ movie, index }: MovieCardProps) {
  const t = useTranslations('MovieCard');
  const poster = posterUrl(movie.poster_path, 'w342');
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : null;
  const rating = movie.vote_average?.toFixed(1);

  return (
    <Link
      href={`/movies/${movie.id}`}
      className="group relative flex flex-col overflow-hidden rounded-lg bg-elevated transition-transform hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative aspect-[2/3] w-full bg-subtle">
        {poster ? (
          <Image
            src={poster}
            alt={movie.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            loading={index < 5 ? 'eager' : 'lazy'}
            className="object-cover transition-opacity group-hover:opacity-90"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted">
            {t('noImage')}
          </div>
        )}

        {/* Rating badge */}
        {rating && (
          <div className="absolute right-2 top-2 rounded bg-black/70 px-1.5 py-0.5 text-xs font-semibold text-yellow-400">
            ★ {rating}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1 p-3">
        <h3 className="line-clamp-2 text-sm font-medium text-foreground">{movie.title}</h3>
        {year && <p className="text-xs text-muted">{year}</p>}
      </div>
    </Link>
  );
}
