'use client';

import { InfiniteGrid } from '@/components/media/InfiniteGrid';
import { movieToMedia } from '@/components/media/normalize';

import { useTopRatedMovies } from '../api/use-top-rated-movies';

export default function TopRatedPageClient() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } = useTopRatedMovies();

  return (
    <InfiniteGrid
      data={data}
      toMedia={movieToMedia}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      isPending={isPending}
    />
  );
}
