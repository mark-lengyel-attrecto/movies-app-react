'use client';

import { usePopularMovies } from "../api/use-popular-movies";
import { InfiniteMovieGrid } from "./InfiniteMovieGrid";

export default function PopularPageClient() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } = usePopularMovies();

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
