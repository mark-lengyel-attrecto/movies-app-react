'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useSession } from '@/features/auth/hooks/use-session';
import type { Movie, TVSeries } from '@/types/tmdb';

export interface TMDBWatchlistData {
  movies: Movie[];
  tvShows: TVSeries[];
}

export const watchlistKeys = {
  all: ['watchlist'] as const,
};

async function fetchWatchlist(): Promise<TMDBWatchlistData> {
  const res = await fetch('/api/watchlist');
  if (!res.ok) throw new Error('Failed to fetch watchlist');
  return res.json() as Promise<TMDBWatchlistData>;
}

export function useTMDBWatchlist() {
  const { isAuthenticated } = useSession();
  return useQuery({
    queryKey: watchlistKeys.all,
    queryFn: fetchWatchlist,
    enabled: isAuthenticated,
  });
}

export function useToggleWatchlist() {
  const queryClient = useQueryClient();

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
      void queryClient.invalidateQueries({ queryKey: watchlistKeys.all });
    },
  });
}
