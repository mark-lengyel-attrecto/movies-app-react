import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';

import TopRatedTVPageClient from '@/features/tv/components/TopRatedTVPageClient';

export const metadata: Metadata = { title: 'Top Rated TV Shows' };

export default function TopRatedTVPage() {
  const t = useTranslations('TVTopRated');
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-foreground text-3xl font-bold">{t('heading')}</h1>
        <p className="text-muted mt-1">{t('subtitle')}</p>
      </div>
      <TopRatedTVPageClient />
    </div>
  );
}
