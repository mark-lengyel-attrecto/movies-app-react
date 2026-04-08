'use client';

import { useLocale } from 'next-intl';

import { useInfiniteQuery } from '@tanstack/react-query';

import type { PaginatedResponse, TVSeries } from '@/types/tmdb';

export const popularTVKeys = {
  all: (locale: string) => ['tv', 'popular', locale] as const,
};

async function fetchPopularTV(page: number, locale: string): Promise<PaginatedResponse<TVSeries>> {
  const res = await fetch(`/api/tv/popular?page=${page}&locale=${locale}`);
  if (!res.ok) throw new Error('Failed to fetch popular TV shows');
  return res.json();
}

export function usePopularTV() {
  const locale = useLocale();
  return useInfiniteQuery({
    queryKey: popularTVKeys.all(locale),
    queryFn: ({ pageParam }) => fetchPopularTV(pageParam, locale),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
  });
}
