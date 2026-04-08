import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';

import PopularPageClient from '@/features/movies/components/PopularPageClient';

export const metadata: Metadata = { title: 'Popular' };

export default function PopularPage() {
  const t = useTranslations('Popular');
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-foreground text-3xl font-bold">{t('heading')}</h1>
        <p className="text-muted mt-1">{t('subtitle')}</p>
      </div>
      <PopularPageClient />
    </div>
  );
}
