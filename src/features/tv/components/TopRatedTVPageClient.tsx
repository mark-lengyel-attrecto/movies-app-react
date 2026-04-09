'use client';

import { InfiniteGrid } from '@/components/media/InfiniteGrid';
import { tvToMedia } from '@/components/media/normalize';

import { useTopRatedTV } from '../api/use-top-rated-tv';

export default function TopRatedTVPageClient() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } = useTopRatedTV();

  return (
    <InfiniteGrid
      data={data}
      toMedia={tvToMedia}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      isPending={isPending}
    />
  );
}
