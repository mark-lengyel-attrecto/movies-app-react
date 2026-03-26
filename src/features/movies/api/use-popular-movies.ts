'use client';

import { useQuery } from '@tanstack/react-query';

import type { Movie, PaginatedResponse } from '@/types/tmdb';

// Query keys are centralised in each hook file.
// This prevents key typos and makes invalidation explicit.
export const popularMoviesKeys = {
  all: ['movies', 'popular'] as const,
  page: (page: number) => [...popularMoviesKeys.all, page] as const,
};

async function fetchPopularMovies(page: number): Promise<PaginatedResponse<Movie>> {
  const res = await fetch(`/api/movies/popular?page=${page}`);
  if (!res.ok) throw new Error('Failed to fetch popular movies');
  return res.json();
}

export function usePopularMovies(page = 1) {
  return useQuery({
    queryKey: popularMoviesKeys.page(page),
    queryFn: () => fetchPopularMovies(page),
  });
}
