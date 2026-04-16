'use client';

import { InfiniteGrid } from '@/components/media/InfiniteGrid';
import { tvToMedia } from '@/components/media/normalize';

import { useOnTheAirTV } from '../api/use-on-the-air-tv';

export default function OnTheAirTVPageClient() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } = useOnTheAirTV();

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
