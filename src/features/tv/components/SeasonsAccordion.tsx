'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { posterUrl, stillUrl } from '@/lib/tmdb/client';
import type { Season } from '@/types/tmdb';

import { useTVSeason } from '../api/use-tv-season';

interface SeasonsAccordionProps {
  showId: number;
  seasons: Season[];
}

export function SeasonsAccordion({ showId, seasons }: SeasonsAccordionProps) {
  const t = useTranslations('TVDetail');
  const [openSeasons, setOpenSeasons] = useState<Set<number>>(new Set());

  const visibleSeasons = seasons.filter((s) => s.season_number > 0);

  if (visibleSeasons.length === 0) return null;

  const toggle = (seasonNumber: number) => {
    setOpenSeasons((prev) => {
      const next = new Set(prev);
      if (next.has(seasonNumber)) next.delete(seasonNumber);
      else next.add(seasonNumber);
      return next;
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">{t('seasonsHeading')}</h2>
      <div className="border-ui divide-ui flex flex-col divide-y overflow-hidden rounded-lg border">
        {visibleSeasons.map((season) => {
          const isOpen = openSeasons.has(season.season_number);
          const poster = posterUrl(season.poster_path, 'w185');
          const year = season.air_date ? new Date(season.air_date).getFullYear() : null;

          return (
            <div key={season.id} className="bg-elevated">
              <button
                type="button"
                onClick={() => toggle(season.season_number)}
                aria-expanded={isOpen}
                className="hover:bg-surface flex w-full items-center gap-4 p-3 text-left transition-colors"
              >
                <div className="bg-subtle relative h-20 w-14 flex-shrink-0 overflow-hidden rounded">
                  {poster && (
                    <Image
                      src={poster}
                      alt={season.name}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <p className="text-foreground font-medium">{season.name}</p>
                  <p className="text-muted text-sm">
                    {t('episodes', { count: season.episode_count })}
                    {year ? ` · ${year}` : ''}
                  </p>
                </div>
                <span
                  aria-hidden
                  className={`text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`}
                >
                  ▾
                </span>
              </button>
              {isOpen && <SeasonEpisodes showId={showId} seasonNumber={season.season_number} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SeasonEpisodes({ showId, seasonNumber }: { showId: number; seasonNumber: number }) {
  const t = useTranslations('TVDetail');
  const { data, isPending, isError } = useTVSeason(showId, seasonNumber, true);

  if (isPending) {
    return (
      <div className="flex flex-col gap-3 p-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-subtle h-24 animate-pulse rounded" />
        ))}
      </div>
    );
  }

  if (isError) {
    return <p className="bg-error-surface text-error p-4 text-sm">{t('episodesError')}</p>;
  }

  if (data.episodes.length === 0) {
    return <p className="text-muted p-4 text-sm">{t('noEpisodes')}</p>;
  }

  return (
    <ul className="divide-ui flex flex-col divide-y">
      {data.episodes.map((episode) => {
        const still = stillUrl(episode.still_path, 'w300');
        return (
          <li key={episode.id} className="flex flex-col gap-3 p-4 sm:flex-row">
            <div className="bg-subtle relative h-28 w-full flex-shrink-0 overflow-hidden rounded sm:w-48">
              {still && (
                <Image
                  src={still}
                  alt={episode.name}
                  fill
                  sizes="(max-width: 640px) 100vw, 192px"
                  className="object-cover"
                />
              )}
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="text-muted text-sm">
                  {t('episodeNumber', { number: episode.episode_number })}
                </span>
                <h3 className="text-foreground font-medium">{episode.name}</h3>
              </div>
              <div className="text-muted flex flex-wrap gap-3 text-xs">
                {episode.air_date && <span>{episode.air_date}</span>}
                {episode.runtime ? <span>{episode.runtime} min</span> : null}
                {episode.vote_count > 0 && <span>★ {episode.vote_average.toFixed(1)}</span>}
              </div>
              {episode.overview && (
                <p className="text-secondary mt-1 text-sm">{episode.overview}</p>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
