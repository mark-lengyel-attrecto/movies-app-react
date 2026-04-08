import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';

import PopularTVPageClient from '@/features/tv/components/PopularTVPageClient';

export const metadata: Metadata = { title: 'Popular TV Shows' };

export default function PopularTVPage() {
  const t = useTranslations('TVPopular');
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-foreground text-3xl font-bold">{t('heading')}</h1>
        <p className="text-muted mt-1">{t('subtitle')}</p>
      </div>
      <PopularTVPageClient />
    </div>
  );
}
