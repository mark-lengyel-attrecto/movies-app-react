'use client';

import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';

interface ErrorDisplayProps {
  reset: () => void;
}

export function ErrorDisplay({ reset }: ErrorDisplayProps) {
  const t = useTranslations('Error');
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
      <p className="text-foreground/20 text-7xl font-bold">500</p>
      <div className="flex flex-col gap-2">
        <h1 className="text-foreground text-2xl font-bold">{t('heading')}</h1>
        <p className="text-muted">{t('description')}</p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          {t('tryAgain')}
        </button>
        <Link
          href="/"
          className="border-input rounded-lg border px-5 py-2.5 text-sm font-medium transition-colors"
        >
          {t('backHome')}
        </Link>
      </div>
    </div>
  );
}
