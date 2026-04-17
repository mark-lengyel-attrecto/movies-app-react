import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { EpisodeList } from '@/features/tv/components/EpisodeList';
import { posterUrl } from '@/lib/tmdb/client';
import { getTVDetails, getTVSeasonDetails } from '@/lib/tmdb/endpoints';

interface SeasonPageProps {
  params: Promise<{ id: string; season: string; locale: string }>;
}

function catch404<T>(promise: Promise<T>): Promise<T | null> {
  return promise.catch((err: unknown) => {
    if (err instanceof Error && err.message.includes('404')) return null;
    throw err;
  });
}

export async function generateMetadata({ params }: SeasonPageProps): Promise<Metadata> {
  const { id, season } = await params;
  const [show, seasonData] = await Promise.all([
    catch404(getTVDetails(Number(id))),
    catch404(getTVSeasonDetails(Number(id), Number(season))),
  ]);
  if (!show || !seasonData) return {};
  const t = await getTranslations('TVDetail');
  return {
    title: t('seasonMetaTitle', { show: show.name, season: seasonData.name }),
    description: seasonData.overview || show.overview,
  };
}

export default async function SeasonPage({ params }: SeasonPageProps) {
  const { id, season, locale } = await params;
  const showId = Number(id);
  const seasonNumber = Number(season);

  const [show, seasonData] = await Promise.all([
    catch404(getTVDetails(showId, locale)),
    catch404(getTVSeasonDetails(showId, seasonNumber, locale)),
  ]);

  if (!show || !seasonData) notFound();

  const t = await getTranslations('TVDetail');
  const poster = posterUrl(seasonData.poster_path, 'w500');
  const year = seasonData.air_date ? new Date(seasonData.air_date).getFullYear() : null;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-6 sm:flex-row">
        {poster && (
          <div className="relative h-64 w-44 flex-shrink-0 overflow-hidden rounded-lg shadow-lg">
            <Image
              src={poster}
              alt={seasonData.name}
              fill
              sizes="176px"
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-bold">{seasonData.name}</h1>
          <div className="text-muted flex flex-wrap gap-4 text-sm">
            {year && <span>{year}</span>}
            <span>{t('episodes', { count: seasonData.episodes.length })}</span>
          </div>
          {seasonData.overview && <p className="text-secondary max-w-2xl">{seasonData.overview}</p>}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">{t('episodesHeading')}</h2>
        <div className="border-ui overflow-hidden rounded-lg border">
          <EpisodeList
            showId={showId}
            seasonNumber={seasonNumber}
            episodes={seasonData.episodes}
          />
        </div>
      </div>
    </div>
  );
}
