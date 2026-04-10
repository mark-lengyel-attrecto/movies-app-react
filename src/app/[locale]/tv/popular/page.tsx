import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import PopularTVPageClient from '@/features/tv/components/PopularTVPageClient';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('TVPopular');
  return { title: t('heading') };
}

export default async function PopularTVPage() {
  const t = await getTranslations('TVPopular');
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
