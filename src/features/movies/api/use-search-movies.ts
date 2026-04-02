'use client';

import { useLocale } from 'next-intl';

import { useInfiniteQuery } from '@tanstack/react-query';

import type { Movie, PaginatedResponse } from '@/types/tmdb';

export const searchKeys = {
  all: ['movies', 'search'] as const,
  query: (query: string, locale: string) => [...searchKeys.all, query, locale] as const,
};

async function fetchSearchMovies(
  query: string,
  page: number,
  locale: string,
): Promise<PaginatedResponse<Movie>> {
  const params = new URLSearchParams({ query, page: String(page), locale });
  const res = await fetch(`/api/movies/search?${params}`);
  if (!res.ok) throw new Error('Failed to search movies');
  return res.json();
}

export function useSearchMovies(query: string) {
  const locale = useLocale();
  return useInfiniteQuery({
    queryKey: searchKeys.query(query, locale),
    queryFn: ({ pageParam }) => fetchSearchMovies(query, pageParam, locale),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
    enabled: query.trim().length >= 2,
  });
}
