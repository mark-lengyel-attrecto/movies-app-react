import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';

import WatchlistPageClient from '@/features/watchlist/components/WatchlistPageClient';

export const metadata: Metadata = { title: 'Watchlist' };

export default function WatchlistPage() {
  const t = useTranslations('Watchlist');
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-foreground text-3xl font-bold">{t('heading')}</h1>
        <p className="text-muted mt-1">{t('subtitle')}</p>
      </div>
      <WatchlistPageClient />
    </div>
  );
}
