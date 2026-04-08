'use client';

import { usePopularTV } from '../api/use-popular-tv';
import { InfiniteTVGrid } from './InfiniteTVGrid';

export default function PopularTVPageClient() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } = usePopularTV();

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
