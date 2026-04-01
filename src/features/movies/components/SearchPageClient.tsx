'use client';

import { useState } from 'react';

import { useDebounce } from 'use-debounce';

import { useSearchMovies } from '@/features/movies/api/use-search-movies';

import { InfiniteMovieGrid } from './InfiniteMovieGrid';

export function SearchPageClient() {
  const [input, setInput] = useState('');
  const [debouncedQuery] = useDebounce(input, 400);

  const { data, isPending, isFetching, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSearchMovies(debouncedQuery);

  const totalResults = data?.pages[0]?.total_results;
  const hasResults = (data?.pages[0]?.results.length ?? 0) > 0;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold">Search Movies</h1>

      <div className="flex flex-row items-center gap-6">
        <input
          type="search"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Search for a movie…"
          className="w-full rounded-xl border border-gray-700 bg-gray-800 px-5 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none sm:max-w-md"
          autoFocus
        />
        {isFetching && <p className="text-sm text-gray-400">Searching…</p>}
      </div>

      {totalResults !== undefined && (
        <p className="text-sm text-gray-400">{totalResults.toLocaleString()} results</p>
      )}

      {debouncedQuery.length >= 2 && !isFetching && !hasResults ? (
        <p className="text-gray-400">No results for &quot;{debouncedQuery}&quot;</p>
      ) : (
        <InfiniteMovieGrid
          data={data}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          isPending={isPending && debouncedQuery.length >= 2}
        />
      )}
    </div>
  );
}
