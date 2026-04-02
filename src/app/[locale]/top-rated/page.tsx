import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';

import TopRatedPageClient from '@/features/movies/components/TopRatedPageClient';

export const metadata: Metadata = { title: 'Top Rated' };

export default function TopRatedPage() {
  const t = useTranslations('TopRated');
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('heading')}</h1>
        <p className="mt-1 text-muted">{t('subtitle')}</p>
      </div>
      <TopRatedPageClient />
    </div>
  );
}
