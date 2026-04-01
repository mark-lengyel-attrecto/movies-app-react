'use client';

import { useInfiniteQuery } from '@tanstack/react-query';

import type { Movie, PaginatedResponse } from '@/types/tmdb';

export const popularMoviesKeys = {
  all: ['movies', 'popular'] as const,
};

async function fetchPopularMovies(page: number): Promise<PaginatedResponse<Movie>> {
  const res = await fetch(`/api/movies/popular?page=${page}`);
  if (!res.ok) throw new Error('Failed to fetch popular movies');
  return res.json();
}

export function usePopularMovies() {
  return useInfiniteQuery({
    queryKey: popularMoviesKeys.all,
    queryFn: ({ pageParam }) => fetchPopularMovies(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
  });
}
