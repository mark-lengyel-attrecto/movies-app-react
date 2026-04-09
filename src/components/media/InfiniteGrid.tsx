'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';

import type { InfiniteData } from '@tanstack/react-query';

import { usePathname } from '@/i18n/navigation';
import type { PaginatedResponse } from '@/types/tmdb';

import { MediaCard } from './MediaCard';
import type { NormalizedMedia } from './normalize';

interface InfiniteGridProps<T> {
  data: InfiniteData<PaginatedResponse<T>> | undefined;
  toMedia: (item: T) => NormalizedMedia | null;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  isPending: boolean;
}

const SKELETON_COUNTS = { initial: 20, nextPage: 10 };

function Skeleton() {
  return <div className="bg-subtle aspect-[2/3] animate-pulse rounded-lg" />;
}

export function InfiniteGrid<T>({
  data,
  toMedia,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  isPending,
}: InfiniteGridProps<T>) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('MovieGrid');
  const pathname = usePathname();
  const scrollKey = `scroll:${pathname}`;

  useLayoutEffect(() => {
    if (isPending) return;
    const saved = sessionStorage.getItem(scrollKey);
    if (!saved) return;
    sessionStorage.removeItem(scrollKey);
    document.body.scrollTop = Number(saved);
  }, [scrollKey, isPending]);

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
          <Skeleton key={i} />
        ))}
      </div>
    );
  }

  const seen = new Set<string>();
  const items = (data?.pages.flatMap((page) => page.results) ?? [])
    .map(toMedia)
    .filter((item): item is NormalizedMedia => {
      if (item === null) return false;
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });

  if (items.length === 0) {
    return <div className="text-muted flex h-48 items-center justify-center">{t('empty')}</div>;
  }

  return (
    <div
      className="flex flex-col gap-6"
      onClick={() => sessionStorage.setItem(scrollKey, String(document.body.scrollTop))}
    >
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {items.map((item, i) => (
          <MediaCard key={item.id} item={item} index={i} />
        ))}
      </div>

      <div ref={sentinelRef} />

      {isFetchingNextPage && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: SKELETON_COUNTS.nextPage }).map((_, i) => (
            <Skeleton key={i} />
          ))}
        </div>
      )}
    </div>
  );
}
