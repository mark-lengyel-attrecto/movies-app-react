'use client';

import { useLocale } from 'next-intl';

import { useInfiniteQuery } from '@tanstack/react-query';

import type { MultiSearchResult, PaginatedResponse } from '@/types/tmdb';

export const multiSearchKeys = {
  all: ['search', 'multi'] as const,
  query: (query: string, locale: string) => [...multiSearchKeys.all, query, locale] as const,
};

async function fetchMultiSearch(
  query: string,
  page: number,
  locale: string,
): Promise<PaginatedResponse<MultiSearchResult>> {
  const params = new URLSearchParams({ query, page: String(page), locale });
  const res = await fetch(`/api/search?${params}`);
  if (!res.ok) throw new Error('Failed to search');
  return res.json();
}

export function useMultiSearch(query: string) {
  const locale = useLocale();
  return useInfiniteQuery({
    queryKey: multiSearchKeys.query(query, locale),
    queryFn: ({ pageParam }) => fetchMultiSearch(query, pageParam, locale),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
    enabled: query.trim().length >= 2,
  });
}
