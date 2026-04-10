import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import TopRatedPageClient from '@/features/movies/components/TopRatedPageClient';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('TopRated');
  return { title: t('heading') };
}

export default async function TopRatedPage() {
  const t = await getTranslations('TopRated');
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
