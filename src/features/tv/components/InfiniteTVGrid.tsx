'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';

import type { InfiniteData } from '@tanstack/react-query';

import type { PaginatedResponse, TVSeries } from '@/types/tmdb';

import { TVCard } from './TVCard';

interface InfiniteTVGridProps {
  data: InfiniteData<PaginatedResponse<TVSeries>> | undefined;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  isPending: boolean;
}

const SKELETON_COUNTS = { initial: 20, nextPage: 10 };

function TVSkeleton() {
  return <div className="bg-subtle aspect-[2/3] animate-pulse rounded-lg" />;
}

export function InfiniteTVGrid({
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  isPending,
}: InfiniteTVGridProps) {
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
          <TVSkeleton key={i} />
        ))}
      </div>
    );
  }

  const seen = new Set<number>();
  const shows = (data?.pages.flatMap((page) => page.results) ?? []).filter((s) => {
    if (seen.has(s.id)) return false;
    seen.add(s.id);
    return true;
  });

  if (shows.length === 0) {
    return <div className="text-muted flex h-48 items-center justify-center">{t('empty')}</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {shows.map((show, i) => (
          <TVCard key={show.id} show={show} index={i} />
        ))}
      </div>

      <div ref={sentinelRef} />

      {isFetchingNextPage && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: SKELETON_COUNTS.nextPage }).map((_, i) => (
            <TVSkeleton key={i} />
          ))}
        </div>
      )}
    </div>
  );
}
