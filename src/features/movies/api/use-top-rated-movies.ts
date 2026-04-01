import { useInfiniteQuery } from '@tanstack/react-query';

import type { Movie, PaginatedResponse } from '@/types/tmdb';

export const topRatedMovieKeys = {
  all: ['movies', 'top-rated'] as const,
};

async function fetchTopRatedMovies(page: number): Promise<PaginatedResponse<Movie>> {
  const res = await fetch(`/api/movies/top-rated?page=${page}`);
  if (!res.ok) throw new Error('Failed to fetch top-rated movies');
  return res.json();
}

export function useTopRatedMovies() {
  return useInfiniteQuery({
    queryKey: topRatedMovieKeys.all,
    queryFn: ({ pageParam }) => fetchTopRatedMovies(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
  });
}
