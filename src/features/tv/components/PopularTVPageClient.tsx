'use client';

import { InfiniteGrid } from '@/components/media/InfiniteGrid';
import { tvToMedia } from '@/components/media/normalize';

import { usePopularTV } from '../api/use-popular-tv';

export default function PopularTVPageClient() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } = usePopularTV();

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
