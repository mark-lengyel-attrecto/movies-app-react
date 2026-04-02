'use client';

import { useLocale } from 'next-intl';

import { useInfiniteQuery } from '@tanstack/react-query';

import type { Movie, PaginatedResponse } from '@/types/tmdb';

export const topRatedMovieKeys = {
  all: (locale: string) => ['movies', 'top-rated', locale] as const,
};

async function fetchTopRatedMovies(
  page: number,
  locale: string,
): Promise<PaginatedResponse<Movie>> {
  const res = await fetch(`/api/movies/top-rated?page=${page}&locale=${locale}`);
  if (!res.ok) throw new Error('Failed to fetch top-rated movies');
  return res.json();
}

export function useTopRatedMovies() {
  const locale = useLocale();
  return useInfiniteQuery({
    queryKey: topRatedMovieKeys.all(locale),
    queryFn: ({ pageParam }) => fetchTopRatedMovies(pageParam, locale),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
  });
}
