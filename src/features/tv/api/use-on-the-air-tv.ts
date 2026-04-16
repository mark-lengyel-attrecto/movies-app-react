'use client';

import { useLocale } from 'next-intl';

import { useInfiniteQuery } from '@tanstack/react-query';

import type { PaginatedResponse, TVSeries } from '@/types/tmdb';

export const onTheAirTVKeys = {
  all: (locale: string) => ['tv', 'on-the-air', locale] as const,
};

async function fetchOnTheAirTV(page: number, locale: string): Promise<PaginatedResponse<TVSeries>> {
  const res = await fetch(`/api/tv/on-the-air?page=${page}&locale=${locale}`);
  if (!res.ok) throw new Error('Failed to fetch on the air TV shows');
  return res.json();
}

export function useOnTheAirTV() {
  const locale = useLocale();
  return useInfiniteQuery({
    queryKey: onTheAirTVKeys.all(locale),
    queryFn: ({ pageParam }) => fetchOnTheAirTV(pageParam, locale),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
  });
}
