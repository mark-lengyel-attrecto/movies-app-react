import PopularPageClient from '@/features/movies/components/PopularPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Movies' };

export default function PopularPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Popular Movies</h1>
        <p className="mt-1 text-muted">What everyone is watching right now</p>
      </div>
      <PopularPageClient />
    </div>
  );
}
