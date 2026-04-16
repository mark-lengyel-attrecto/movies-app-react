'use client';

import { useLocale } from 'next-intl';

import { useInfiniteQuery } from '@tanstack/react-query';

import type { Movie, PaginatedResponse } from '@/types/tmdb';

export const upcomingMovieKeys = {
  all: (locale: string) => ['movies', 'upcoming', locale] as const,
};

async function fetchUpcomingMovies(
  page: number,
  locale: string,
): Promise<PaginatedResponse<Movie>> {
  const res = await fetch(`/api/movies/upcoming?page=${page}&locale=${locale}`);
  if (!res.ok) throw new Error('Failed to fetch upcoming movies');
  return res.json();
}

export function useUpcomingMovies() {
  const locale = useLocale();
  return useInfiniteQuery({
    queryKey: upcomingMovieKeys.all(locale),
    queryFn: ({ pageParam }) => fetchUpcomingMovies(pageParam, locale),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
  });
}
