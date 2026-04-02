'use client';

import { useEffect, useRef } from 'react';

import type { InfiniteData } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

import type { Movie, PaginatedResponse } from '@/types/tmdb';

import { MovieCard } from './MovieCard';

interface InfiniteMovieGridProps {
  data: InfiniteData<PaginatedResponse<Movie>> | undefined;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  isPending: boolean;
}

const SKELETON_COUNTS = { initial: 20, nextPage: 10 };

function MovieSkeleton() {
  return <div className="aspect-[2/3] animate-pulse rounded-lg bg-subtle" />;
}

export function InfiniteMovieGrid({
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  isPending,
}: InfiniteMovieGridProps) {
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
          <MovieSkeleton key={i} />
        ))}
      </div>
    );
  }

  const seen = new Set<number>();
  const movies = (data?.pages.flatMap((page) => page.results) ?? []).filter((m) => {
    if (seen.has(m.id)) return false;
    seen.add(m.id);
    return true;
  });

  if (movies.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-muted">{t('empty')}</div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {movies.map((movie, i) => (
          <MovieCard key={movie.id} movie={movie} index={i} />
        ))}
      </div>

      {/* Fetches the next page when scrolled into view */}
      <div ref={sentinelRef} />

      {isFetchingNextPage && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: SKELETON_COUNTS.nextPage }).map((_, i) => (
            <MovieSkeleton key={i} />
          ))}
        </div>
      )}
    </div>
  );
}
