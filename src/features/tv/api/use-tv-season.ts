'use client';

import { useLocale } from 'next-intl';

import { useQuery } from '@tanstack/react-query';

import type { SeasonDetails } from '@/types/tmdb';

export const tvSeasonKeys = {
  detail: (showId: number, seasonNumber: number, locale: string) =>
    ['tv', 'season', showId, seasonNumber, locale] as const,
};

async function fetchTVSeason(
  showId: number,
  seasonNumber: number,
  locale: string,
): Promise<SeasonDetails> {
  const res = await fetch(`/api/tv/${showId}/season/${seasonNumber}?locale=${locale}`);
  if (!res.ok) throw new Error('Failed to fetch season');
  return res.json();
}

export function useTVSeason(showId: number, seasonNumber: number, enabled: boolean) {
  const locale = useLocale();
  return useQuery({
    queryKey: tvSeasonKeys.detail(showId, seasonNumber, locale),
    queryFn: () => fetchTVSeason(showId, seasonNumber, locale),
    enabled,
  });
}
