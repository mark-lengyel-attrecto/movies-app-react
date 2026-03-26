'use client';

import { useState } from 'react';

import { useDebounce } from 'use-debounce';

import { useSearchMovies } from '@/features/movies/api/use-search-movies';

import { MovieGrid } from './MovieGrid';

// Note: install `use-debounce` → npm install use-debounce
export function SearchPageClient() {
  const [input, setInput] = useState('');
  const [debouncedQuery] = useDebounce(input, 400);

  const { data, isPending, isFetching } = useSearchMovies(debouncedQuery);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold">Search Movies</h1>

      <input
        type="search"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Search for a movie…"
        className="w-full rounded-xl border border-gray-700 bg-gray-800 px-5 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none sm:max-w-md"
        autoFocus
      />

      {isFetching && <p className="text-sm text-gray-400">Searching…</p>}

      {data && !isPending && (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-gray-400">{data.total_results.toLocaleString()} results</p>
          <MovieGrid movies={data.results} />
        </div>
      )}

      {debouncedQuery.length >= 2 && !isFetching && data?.results.length === 0 && (
        <p className="text-gray-400">No results for &quot;{debouncedQuery}&quot;</p>
      )}
    </div>
  );
}
