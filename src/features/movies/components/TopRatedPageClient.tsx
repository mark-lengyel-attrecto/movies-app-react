'use client';

import { useTopRatedMovies } from '../api/use-top-rated-movies';
import { InfiniteMovieGrid } from './InfiniteMovieGrid';

export default function TopRatedPageClient() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } = useTopRatedMovies();

  return (
    <InfiniteMovieGrid
      data={data}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      isPending={isPending}
    />
  );
}
