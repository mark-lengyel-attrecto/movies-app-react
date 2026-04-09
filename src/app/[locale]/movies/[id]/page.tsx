import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { backdropUrl, posterUrl, profileUrl } from '@/lib/tmdb/client';
import { getMovieCredits, getMovieDetails } from '@/lib/tmdb/endpoints';

interface MoviePageProps {
  params: Promise<{ id: string; locale: string }>;
}

export async function generateMetadata({ params }: MoviePageProps): Promise<Metadata> {
  const { id } = await params;
  const movie = await getMovieDetails(Number(id)).catch(() => null);
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
    getMovieDetails(movieId, locale).catch(() => null),
    getMovieCredits(movieId, locale).catch(() => null),
  ]);

  if (!movie) notFound();

  const t = await getTranslations('MovieDetail');

  const backdrop = backdropUrl(movie.backdrop_path, 'w1280');
  const poster = posterUrl(movie.poster_path, 'w500');
  const director = credits?.crew.find((c) => c.job === 'Director');
  const topCast = credits?.cast.slice(0, 8) ?? [];

  return (
    <div className="flex flex-col gap-8">
      {/* Hero */}
      <div className="relative -mx-[calc(50vw-50%)] -mt-8 h-72 sm:h-96">
        {backdrop && (
          <Image
            src={backdrop}
            alt={movie.title}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        )}
        <div className="from-base via-base/60 absolute inset-0 bg-gradient-to-t to-transparent" />
      </div>

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
          <p className="text-secondary max-w-2xl">{movie.overview}</p>
        </div>
      </div>

      {/* Cast */}
      {topCast.length > 0 && (
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold">{t('cast')}</h2>
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
            {topCast.map((member) => {
              const profile = profileUrl(member.profile_path, 'w185');
              return (
                <div key={member.id} className="flex flex-col items-center gap-1 text-center">
                  <div className="bg-subtle relative h-16 w-16 overflow-hidden rounded-full">
                    {profile && (
                      <Image
                        src={profile}
                        alt={member.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <p className="text-foreground text-xs font-medium">{member.name}</p>
                  <p className="text-muted text-xs">{member.character}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
