'use client';

import { useInfiniteQuery } from '@tanstack/react-query';

import type { Movie, PaginatedResponse } from '@/types/tmdb';

export const searchKeys = {
  all: ['movies', 'search'] as const,
  query: (query: string) => [...searchKeys.all, query] as const,
};

async function fetchSearchMovies(query: string, page: number): Promise<PaginatedResponse<Movie>> {
  const params = new URLSearchParams({ query, page: String(page) });
  const res = await fetch(`/api/movies/search?${params}`);
  if (!res.ok) throw new Error('Failed to search movies');
  return res.json();
}

export function useSearchMovies(query: string) {
  return useInfiniteQuery({
    queryKey: searchKeys.query(query),
    queryFn: ({ pageParam }) => fetchSearchMovies(query, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
    enabled: query.trim().length >= 2,
  });
}
