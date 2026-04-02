'use client';

import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { useSearchMovies } from '@/features/movies/api/use-search-movies';

import { InfiniteMovieGrid } from './InfiniteMovieGrid';

export function SearchPageClient() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const t = useTranslations('Search');

  const { data, isPending, isFetching, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSearchMovies(query);

  const totalResults = data?.pages[0]?.total_results;
  const hasResults = (data?.pages[0]?.results.length ?? 0) > 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-baseline gap-4">
        <h1 className="text-3xl font-bold">
          {query ? t('resultsFor', { query }) : t('heading')}
        </h1>
        {isFetching && <p className="text-sm text-muted">{t('searching')}</p>}
      </div>

      {totalResults !== undefined && (
        <p className="text-sm text-muted">{t('results', { count: totalResults })}</p>
      )}

      {query.length >= 2 && !isFetching && !hasResults ? (
        <p className="text-muted">{t('noResults', { query })}</p>
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
