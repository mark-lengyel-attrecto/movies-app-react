'use client';

import { useLocale } from 'next-intl';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useSession } from '@/features/auth/hooks/use-session';
import type { Movie, TVSeries } from '@/types/tmdb';

export interface WatchlistData {
  movies: Movie[];
  tvShows: TVSeries[];
}

export const watchlistKeys = {
  all: (locale: string) => ['watchlist', locale] as const,
};

async function fetchWatchlist(locale: string): Promise<WatchlistData> {
  const res = await fetch(`/api/watchlist?locale=${locale}`);
  if (!res.ok) throw new Error('Failed to fetch watchlist');
  return res.json() as Promise<WatchlistData>;
}

export function useWatchlist() {
  const { isAuthenticated } = useSession();
  const locale = useLocale();

  return useQuery({
    queryKey: watchlistKeys.all(locale),
    queryFn: () => fetchWatchlist(locale),
    enabled: isAuthenticated,
  });
}

export function useToggleWatchlist() {
  const queryClient = useQueryClient();
  const locale = useLocale();

  return useMutation({
    mutationFn: async (params: {
      media_type: 'movie' | 'tv';
      media_id: number;
      watchlist: boolean;
    }) => {
      const res = await fetch('/api/watchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (!res.ok) throw new Error('Failed to update watchlist');
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: watchlistKeys.all(locale) });
    },
  });
}
