'use client';

import { useTranslations } from 'next-intl';

import { MediaCard } from '@/components/media/MediaCard';
import { movieToMedia, tvToMedia } from '@/components/media/normalize';

import { useWatchlist } from '../api/use-tmdb-watchlist';

function Skeleton() {
  return (
    <div className="flex flex-col gap-8">
      <div className="bg-subtle h-4 w-24 animate-pulse rounded" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-subtle aspect-[2/3] animate-pulse rounded-lg" />
        ))}
      </div>
    </div>
  );
}

export default function WatchlistPageClient() {
  const t = useTranslations('Watchlist');
  const { data, isPending, isError } = useWatchlist();

  if (isPending) return <Skeleton />;

  if (isError) {
    return (
      <div className="bg-error-surface text-error rounded-lg p-4 text-sm">{t('fetchError')}</div>
    );
  }

  const items = [
    ...(data?.movies ?? []).map((m) => ({
      ...movieToMedia(m),
      id: `movie-${m.id}`,
      mediaTypeBadge: 'movie' as const,
    })),
    ...(data?.tvShows ?? []).map((s) => ({
      ...tvToMedia(s),
      id: `tv-${s.id}`,
      mediaTypeBadge: 'tv' as const,
    })),
  ];

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-24">
        <p className="text-foreground text-lg font-medium">{t('empty')}</p>
        <p className="text-muted text-sm">{t('emptyHint')}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="text-muted text-sm">{t('itemCount', { count: items.length })}</p>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {items.map((item, i) => (
          <MediaCard key={item.id} item={item} index={i} />
        ))}
      </div>
    </div>
  );
}
