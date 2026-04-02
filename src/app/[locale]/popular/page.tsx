import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';

import PopularPageClient from '@/features/movies/components/PopularPageClient';

export const metadata: Metadata = { title: 'Popular' };

export default function PopularPage() {
  const t = useTranslations('Popular');
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('heading')}</h1>
        <p className="mt-1 text-muted">{t('subtitle')}</p>
      </div>
      <PopularPageClient />
    </div>
  );
}
