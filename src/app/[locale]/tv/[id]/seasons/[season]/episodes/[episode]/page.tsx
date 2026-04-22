import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { Star } from 'lucide-react';

import { CastGrid } from '@/components/CastGrid';
import { Hero } from '@/components/Hero';
import { stillUrl } from '@/lib/tmdb/client';
import { getTVDetails, getTVEpisodeDetails } from '@/lib/tmdb/endpoints';

interface EpisodePageProps {
  params: Promise<{ id: string; season: string; episode: string; locale: string }>;
}

async function catch404<T>(promise: Promise<T>): Promise<T | null> {
  return promise.catch((err: unknown) => {
    if (err instanceof Error && err.message.includes('404')) return null;
    throw err;
  });
}

export async function generateMetadata({ params }: EpisodePageProps): Promise<Metadata> {
  const { id, season, episode, locale } = await params;
  const showId = Number(id);

  const [show, episodeData] = await Promise.all([
    catch404(getTVDetails(showId, locale)),
    catch404(getTVEpisodeDetails(showId, Number(season), Number(episode), locale)),
  ]);

  if (!show || !episodeData) return {};

  const t = await getTranslations('TVDetail');

  return {
    title: t('episodeMetaTitle', {
      show: show.name,
      season: episodeData.season_number,
      episode: episodeData.episode_number,
      name: episodeData.name,
    }),
    description: episodeData.overview || show.overview,
  };
}

export default async function EpisodePage({ params }: EpisodePageProps) {
  const { id, season, episode, locale } = await params;
  const showId = Number(id);
  const seasonNumber = Number(season);
  const episodeNumber = Number(episode);

  const [show, episodeData] = await Promise.all([
    catch404(getTVDetails(showId, locale)),
    catch404(getTVEpisodeDetails(showId, seasonNumber, episodeNumber, locale)),
  ]);

  if (!show || !episodeData) notFound();

  const t = await getTranslations('TVDetail');
  const still = stillUrl(episodeData.still_path, 'original');

  const directors = episodeData.crew.filter((c) => c.job === 'Director');
  const writers = episodeData.crew.filter((c) => c.department === 'Writing');

  return (
    <div className="flex flex-col gap-8">
      <Hero src={still} alt={episodeData.name} />

      <div className="flex flex-col gap-3">
        <p className="text-muted text-sm">
          {t('episodeBreadcrumb', {
            season: seasonNumber,
            episode: episodeData.episode_number,
          })}
        </p>
        <h1 className="text-3xl font-bold">{episodeData.name}</h1>
        <div className="text-muted flex flex-wrap gap-4 text-sm">
          {episodeData.air_date && <span>{episodeData.air_date}</span>}
          {episodeData.runtime ? <span>{episodeData.runtime} min</span> : null}
          {episodeData.vote_count > 0 && (
            <span className="flex items-center gap-1">
              <Star size={12} fill="currentColor" aria-hidden="true" />
              {episodeData.vote_average.toFixed(1)}
            </span>
          )}
        </div>
        {(directors.length > 0 || writers.length > 0) && (
          <div className="text-secondary flex flex-col gap-1 text-sm">
            {directors.length > 0 && (
              <p>{t('directedBy', { name: directors.map((d) => d.name).join(', ') })}</p>
            )}
            {writers.length > 0 && (
              <p>{t('writtenBy', { name: writers.map((w) => w.name).join(', ') })}</p>
            )}
          </div>
        )}
        {episodeData.overview && <p className="text-secondary max-w-2xl">{episodeData.overview}</p>}
      </div>

      {episodeData.guest_stars.length > 0 && (
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold">{t('guestStars')}</h2>
          <CastGrid cast={episodeData.guest_stars} limit={16} />
        </div>
      )}
    </div>
  );
}
