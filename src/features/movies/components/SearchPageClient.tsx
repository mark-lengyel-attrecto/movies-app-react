'use client';

import { useSearchParams } from 'next/navigation';

import { useSearchMovies } from '@/features/movies/api/use-search-movies';

import { InfiniteMovieGrid } from './InfiniteMovieGrid';

export function SearchPageClient() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') ?? '';

  const { data, isPending, isFetching, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSearchMovies(query);

  const totalResults = data?.pages[0]?.total_results;
  const hasResults = (data?.pages[0]?.results.length ?? 0) > 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-baseline gap-4">
        <h1 className="text-3xl font-bold">
          {query ? `Results for "${query}"` : 'Search Movies'}
        </h1>
        {isFetching && <p className="text-sm text-muted">Searching…</p>}
      </div>

      {totalResults !== undefined && (
        <p className="text-sm text-muted">{totalResults.toLocaleString()} results</p>
      )}

      {query.length >= 2 && !isFetching && !hasResults ? (
        <p className="text-muted">No results for &quot;{query}&quot;</p>
      ) : (
        <InfiniteMovieGrid
          data={data}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          isPending={isPending && query.length >= 2}
        />
      )}
    </div>
  );
}
