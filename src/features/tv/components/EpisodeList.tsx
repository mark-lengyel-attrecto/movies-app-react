import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { stillUrl } from '@/lib/tmdb/client';
import type { Episode } from '@/types/tmdb';

interface EpisodeListProps {
  episodes: Episode[];
}

export function EpisodeList({ episodes }: EpisodeListProps) {
  const t = useTranslations('TVDetail');

  if (episodes.length === 0) {
    return <p className="text-muted p-4 text-sm">{t('noEpisodes')}</p>;
  }

  return (
    <ul className="divide-ui flex flex-col divide-y">
      {episodes.map((episode) => {
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
