'use client';

import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { useMultiSearch } from '@/features/search/api/use-multi-search';

import { InfiniteMediaGrid } from './InfiniteMediaGrid';

export function SearchPageClient() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const t = useTranslations('Search');

  const { data, isPending, isFetching, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useMultiSearch(query);

  const totalResults = data?.pages[0]?.total_results;
  const hasResults = (data?.pages[0]?.results.filter((r) => r.media_type !== 'person').length ?? 0) > 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-baseline gap-4">
        <h1 className="text-3xl font-bold">{query ? t('resultsFor', { query }) : t('heading')}</h1>
        {isFetching && <p className="text-muted text-sm">{t('searching')}</p>}
      </div>

      {totalResults !== undefined && (
        <p className="text-muted text-sm">{t('results', { count: totalResults })}</p>
      )}

      {query.length >= 2 && !isFetching && !hasResults ? (
        <p className="text-muted">{t('noResults', { query })}</p>
      ) : (
        <InfiniteMediaGrid
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
