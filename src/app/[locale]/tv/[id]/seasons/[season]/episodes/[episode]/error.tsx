'use client';

import { ErrorDisplay } from '@/components/ErrorDisplay';

export default function EpisodeError({ reset }: { error: Error; reset: () => void }) {
  return <ErrorDisplay reset={reset} />;
}
