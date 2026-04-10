'use client';

import { ErrorDisplay } from '@/components/ErrorDisplay';

export default function MovieError({ reset }: { error: Error; reset: () => void }) {
  return <ErrorDisplay reset={reset} />;
}
