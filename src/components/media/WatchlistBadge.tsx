'use client';

import { useWatchlist } from '@/features/watchlist/api/use-tmdb-watchlist';

import type { NormalizedMedia } from './normalize';

function parseHref(href: string): { mediaType: 'movie' | 'tv'; id: number } | null {
  const movie = /^\/movies\/(\d+)$/.exec(href);
  if (movie) return { mediaType: 'movie', id: Number(movie[1]) };
  const tv = /^\/tv\/(\d+)$/.exec(href);
  if (tv) return { mediaType: 'tv', id: Number(tv[1]) };
  return null;
}

export function WatchlistBadge({ item }: { item: NormalizedMedia }) {
  const { data } = useWatchlist();

  const parsed = parseHref(item.href);
  if (!parsed) return null;

  const inWatchlist =
    parsed.mediaType === 'movie'
      ? (data?.movies.some((m) => m.id === parsed.id) ?? false)
      : (data?.tvShows.some((s) => s.id === parsed.id) ?? false);

  if (!inWatchlist) return null;

  return (
    <div className="absolute top-2 left-2 rounded bg-black/70 px-1.5 py-0.5 text-xs font-semibold text-green-400">
      ✓
    </div>
  );
}
