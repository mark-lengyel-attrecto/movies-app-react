'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { ChevronDown } from 'lucide-react';

import { Link } from '@/i18n/navigation';
import { posterUrl } from '@/lib/tmdb/client';
import type { Season } from '@/types/tmdb';

import { useTVSeason } from '../api/use-tv-season';
import { EpisodeList } from './EpisodeList';

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
              <div className="hover:bg-surface flex w-full items-center gap-4 p-3 transition-colors">
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
                  <Link
                    href={`/tv/${showId}/seasons/${season.season_number}`}
                    className="text-foreground hover:text-secondary w-fit font-medium underline-offset-4 hover:underline"
                  >
                    {season.name}
                  </Link>
                  <p className="text-muted text-sm">
                    {t('episodes', { count: season.episode_count })}
                    {year ? ` · ${year}` : ''}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => toggle(season.season_number)}
                  aria-expanded={isOpen}
                  aria-label={isOpen ? t('collapseSeason') : t('expandSeason')}
                  className="text-muted hover:text-foreground px-1"
                >
                  <ChevronDown
                    size={16}
                    aria-hidden="true"
                    className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
              </div>
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

  return <EpisodeList showId={showId} seasonNumber={seasonNumber} episodes={data.episodes} />;
}
