'use client';

import { InfiniteGrid } from '@/components/media/InfiniteGrid';
import { movieToMedia } from '@/components/media/normalize';

import { usePopularMovies } from '../api/use-popular-movies';

export default function PopularPageClient() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } = usePopularMovies();

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
