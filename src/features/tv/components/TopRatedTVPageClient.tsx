'use client';

import { useTopRatedTV } from '../api/use-top-rated-tv';
import { InfiniteTVGrid } from './InfiniteTVGrid';

export default function TopRatedTVPageClient() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } = useTopRatedTV();

  return (
    <InfiniteTVGrid
      data={data}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      isPending={isPending}
    />
  );
}
