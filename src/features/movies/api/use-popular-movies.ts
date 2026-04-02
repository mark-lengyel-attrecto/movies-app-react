'use client';

import { useLocale } from 'next-intl';

import { useInfiniteQuery } from '@tanstack/react-query';

import type { Movie, PaginatedResponse } from '@/types/tmdb';

export const popularMoviesKeys = {
  all: (locale: string) => ['movies', 'popular', locale] as const,
};

async function fetchPopularMovies(page: number, locale: string): Promise<PaginatedResponse<Movie>> {
  const res = await fetch(`/api/movies/popular?page=${page}&locale=${locale}`);
  if (!res.ok) throw new Error('Failed to fetch popular movies');
  return res.json();
}

export function usePopularMovies() {
  const locale = useLocale();
  return useInfiniteQuery({
    queryKey: popularMoviesKeys.all(locale),
    queryFn: ({ pageParam }) => fetchPopularMovies(pageParam, locale),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
  });
}
