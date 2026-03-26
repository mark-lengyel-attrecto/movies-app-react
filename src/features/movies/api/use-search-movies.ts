'use client';

import { useQuery } from '@tanstack/react-query';

import type { Movie, PaginatedResponse } from '@/types/tmdb';

export const searchKeys = {
  all: ['movies', 'search'] as const,
  query: (query: string, page: number) => [...searchKeys.all, query, page] as const,
};

async function fetchSearchMovies(query: string, page: number): Promise<PaginatedResponse<Movie>> {
  const params = new URLSearchParams({ query, page: String(page) });
  const res = await fetch(`/api/movies/search?${params}`);
  if (!res.ok) throw new Error('Failed to search movies');
  return res.json();
}

export function useSearchMovies(query: string, page = 1) {
  return useQuery({
    queryKey: searchKeys.query(query, page),
    queryFn: () => fetchSearchMovies(query, page),
    // Don't fire the query until the user has typed at least 2 characters
    enabled: query.trim().length >= 2,
    // Keep previous page data visible while fetching the next page
    placeholderData: (prev) => prev,
  });
}
