import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { SearchPageClient } from '@/features/search/components/SearchPageClient';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Search');
  return { title: t('heading') };
}

export default function SearchPage() {
  return <SearchPageClient />;
}
