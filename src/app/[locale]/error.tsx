'use client';

import { ErrorDisplay } from '@/components/ErrorDisplay';

export default function LocaleError({ reset }: { error: Error; reset: () => void }) {
  return <ErrorDisplay reset={reset} />;
}
