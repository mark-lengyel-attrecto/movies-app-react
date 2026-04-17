import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { CastGrid } from '@/components/CastGrid';
import { Hero } from '@/components/Hero';
import { WatchlistButton } from '@/features/watchlist/components/WatchlistButton';
import { backdropUrl, posterUrl } from '@/lib/tmdb/client';
import { getMovieCredits, getMovieDetails } from '@/lib/tmdb/endpoints';

interface MoviePageProps {
  params: Promise<{ id: string; locale: string }>;
}

export async function generateMetadata({ params }: MoviePageProps): Promise<Metadata> {
  const { id, locale } = await params;
  const movieId = Number(id);

  const movie = await getMovieDetails(movieId, locale).catch(() => null);
  if (!movie) return {};
  return {
    title: movie.title,
    description: movie.overview,
  };
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { id, locale } = await params;
  const movieId = Number(id);

  const [movie, credits] = await Promise.all([
    getMovieDetails(movieId, locale).catch((err: unknown) => {
      if (err instanceof Error && err.message.includes('404')) return null;
      throw err;
    }),
    getMovieCredits(movieId, locale).catch(() => null),
  ]);

  if (!movie) notFound();

  const t = await getTranslations('MovieDetail');

  const backdrop = backdropUrl(movie.backdrop_path, 'w1280');
  const poster = posterUrl(movie.poster_path, 'w500');
  const director = credits?.crew.find((c) => c.job === 'Director');
  const topCast = credits?.cast ?? [];

  return (
    <div className="flex flex-col gap-8">
      <Hero src={backdrop} alt={movie.title} />

      {/* Details */}
      <div className="flex flex-col gap-6 sm:flex-row">
        {poster && (
          <div className="relative -mt-24 h-48 w-32 flex-shrink-0 sm:-mt-32 sm:h-64 sm:w-44">
            <Image
              src={poster}
              alt={movie.title}
              fill
              sizes="(max-width: 640px) 128px, 176px"
              className="rounded-lg object-cover shadow-2xl"
            />
          </div>
        )}

        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-bold">{movie.title}</h1>
          {movie.tagline && <p className="text-muted italic">{movie.tagline}</p>}
          <div className="text-muted flex flex-wrap gap-4 text-sm">
            <span>★ {movie.vote_average.toFixed(1)}</span>
            {movie.runtime && <span>{movie.runtime} min</span>}
            {movie.release_date && <span>{new Date(movie.release_date).getFullYear()}</span>}
            {director && <span>{t('director', { name: director.name })}</span>}
          </div>
          <div className="flex flex-wrap gap-2">
            {movie.genres.map((genre) => (
              <span
                key={genre.id}
                className="bg-elevated text-secondary rounded-full px-3 py-1 text-xs"
              >
                {genre.name}
              </span>
            ))}
          </div>
          <WatchlistButton mediaType="movie" media={movie} />
          <p className="text-secondary max-w-2xl">{movie.overview}</p>
        </div>
      </div>

      {/* Cast */}
      {topCast.length > 0 && (
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold">{t('cast')}</h2>
          <CastGrid cast={topCast} limit={8} />
        </div>
      )}
    </div>
  );
}
