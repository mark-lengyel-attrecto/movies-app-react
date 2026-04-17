'use client';

import { ErrorDisplay } from '@/components/ErrorDisplay';

export default function SeasonError({ reset }: { error: Error; reset: () => void }) {
  return <ErrorDisplay reset={reset} />;
}
