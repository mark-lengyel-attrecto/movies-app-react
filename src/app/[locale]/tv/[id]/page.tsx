import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { CastGrid } from '@/components/CastGrid';
import { Hero } from '@/components/Hero';
import { SeasonsAccordion } from '@/features/tv/components/SeasonsAccordion';
import { WatchlistButton } from '@/features/watchlist/components/WatchlistButton';
import { backdropUrl, posterUrl } from '@/lib/tmdb/client';
import { getTVCredits, getTVDetails } from '@/lib/tmdb/endpoints';

interface TVPageProps {
  params: Promise<{ id: string; locale: string }>;
}

export async function generateMetadata({ params }: TVPageProps): Promise<Metadata> {
  const { id, locale } = await params;
  const showId = Number(id);

  const show = await getTVDetails(showId, locale).catch(() => null);
  if (!show) return {};
  return {
    title: show.name,
    description: show.overview,
  };
}

export default async function TVPage({ params }: TVPageProps) {
  const { id, locale } = await params;
  const showId = Number(id);

  const [show, credits] = await Promise.all([
    getTVDetails(showId, locale).catch((err: unknown) => {
      if (err instanceof Error && err.message.includes('404')) return null;
      throw err;
    }),
    getTVCredits(showId, locale).catch(() => null),
  ]);

  if (!show) notFound();

  const t = await getTranslations('TVDetail');

  const backdrop = backdropUrl(show.backdrop_path, 'w1280');
  const poster = posterUrl(show.poster_path, 'w500');
  const creators = show.created_by;
  const topCast = credits?.cast ?? [];
  const year = show.first_air_date ? new Date(show.first_air_date).getFullYear() : null;
  const runtime = show.episode_run_time[0];

  return (
    <div className="flex flex-col gap-8">
      <Hero src={backdrop} alt={show.name} />

      {/* Details */}
      <div className="flex flex-col gap-6 sm:flex-row">
        {poster && (
          <div className="relative -mt-24 h-48 w-32 flex-shrink-0 sm:-mt-32 sm:h-64 sm:w-44">
            <Image
              src={poster}
              alt={show.name}
              fill
              sizes="(max-width: 640px) 128px, 176px"
              className="rounded-lg object-cover shadow-2xl"
            />
          </div>
        )}

        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-bold">{show.name}</h1>
          {show.tagline && <p className="text-muted italic">{show.tagline}</p>}
          <div className="text-muted flex flex-wrap gap-4 text-sm">
            <span>★ {show.vote_average.toFixed(1)}</span>
            {year && <span>{year}</span>}
            {runtime && <span>{runtime} min</span>}
            <span>{t('seasons', { count: show.number_of_seasons })}</span>
            <span>{t('episodes', { count: show.number_of_episodes })}</span>
            {creators.length > 0 && (
              <span>{t('createdBy', { name: creators.map((c) => c.name).join(', ') })}</span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {show.genres.map((genre) => (
              <span
                key={genre.id}
                className="bg-elevated text-secondary rounded-full px-3 py-1 text-xs"
              >
                {genre.name}
              </span>
            ))}
          </div>
          <WatchlistButton mediaType="tv" media={show} />
          <p className="text-secondary max-w-2xl">{show.overview}</p>
        </div>
      </div>

      {/* Seasons */}
      <SeasonsAccordion showId={showId} seasons={show.seasons} />

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
