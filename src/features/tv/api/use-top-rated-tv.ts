'use client';

import { useLocale } from 'next-intl';

import { useInfiniteQuery } from '@tanstack/react-query';

import type { PaginatedResponse, TVSeries } from '@/types/tmdb';

export const topRatedTVKeys = {
  all: (locale: string) => ['tv', 'top-rated', locale] as const,
};

async function fetchTopRatedTV(page: number, locale: string): Promise<PaginatedResponse<TVSeries>> {
  const res = await fetch(`/api/tv/top-rated?page=${page}&locale=${locale}`);
  if (!res.ok) throw new Error('Failed to fetch top-rated TV shows');
  return res.json();
}

export function useTopRatedTV() {
  const locale = useLocale();
  return useInfiniteQuery({
    queryKey: topRatedTVKeys.all(locale),
    queryFn: ({ pageParam }) => fetchTopRatedTV(pageParam, locale),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
  });
}
