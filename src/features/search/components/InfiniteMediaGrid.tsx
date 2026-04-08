'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';

import type { InfiniteData } from '@tanstack/react-query';

import type { MultiSearchMovie, MultiSearchResult, MultiSearchTV, PaginatedResponse } from '@/types/tmdb';

import { MediaCard } from './MediaCard';

interface InfiniteMediaGridProps {
  data: InfiniteData<PaginatedResponse<MultiSearchResult>> | undefined;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  isPending: boolean;
}

const SKELETON_COUNTS = { initial: 20, nextPage: 10 };

function MediaSkeleton() {
  return <div className="bg-subtle aspect-[2/3] animate-pulse rounded-lg" />;
}

export function InfiniteMediaGrid({
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  isPending,
}: InfiniteMediaGridProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('MovieGrid');

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: '300px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isPending) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {Array.from({ length: SKELETON_COUNTS.initial }).map((_, i) => (
          <MediaSkeleton key={i} />
        ))}
      </div>
    );
  }

  const seenKeys = new Set<string>();
  const deduped = (data?.pages.flatMap((page) => page.results) ?? [])
    .filter((item): item is MultiSearchMovie | MultiSearchTV => item.media_type !== 'person')
    .filter((item) => {
      const key = `${item.media_type}-${item.id}`;
      if (seenKeys.has(key)) return false;
      seenKeys.add(key);
      return true;
    });

  if (deduped.length === 0) {
    return <div className="text-muted flex h-48 items-center justify-center">{t('empty')}</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {deduped.map((item, i) => (
          <MediaCard key={`${item.media_type}-${item.id}`} item={item} index={i} />
        ))}
      </div>

      <div ref={sentinelRef} />

      {isFetchingNextPage && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: SKELETON_COUNTS.nextPage }).map((_, i) => (
            <MediaSkeleton key={i} />
          ))}
        </div>
      )}
    </div>
  );
}
