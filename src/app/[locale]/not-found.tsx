import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { Link } from '@/i18n/navigation';

export const metadata: Metadata = { title: '404 — Page Not Found' };

export default async function NotFound() {
  const t = await getTranslations('NotFound');
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
      <p className="text-7xl font-bold text-foreground/20">404</p>
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-foreground">{t('heading')}</h1>
        <p className="text-muted">{t('description')}</p>
      </div>
      <Link
        href="/"
        className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
      >
        {t('backHome')}
      </Link>
    </div>
  );
}
