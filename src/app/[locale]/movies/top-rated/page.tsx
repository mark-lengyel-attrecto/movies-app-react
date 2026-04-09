import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';

import TopRatedPageClient from '@/features/movies/components/TopRatedPageClient';

export const metadata: Metadata = { title: 'Top Rated' };

export default function TopRatedPage() {
  const t = useTranslations('TopRated');
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-foreground text-3xl font-bold">{t('heading')}</h1>
        <p className="text-muted mt-1">{t('subtitle')}</p>
      </div>
      <TopRatedPageClient />
    </div>
  );
}
