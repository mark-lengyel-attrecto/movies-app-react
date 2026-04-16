'use client';

import { InfiniteGrid } from '@/components/media/InfiniteGrid';
import { movieToMedia } from '@/components/media/normalize';

import { useUpcomingMovies } from '../api/use-upcoming-movies';

export default function UpcomingPageClient() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } = useUpcomingMovies();

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
