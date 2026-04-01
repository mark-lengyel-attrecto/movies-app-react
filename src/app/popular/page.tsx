import PopularPageClient from '@/features/movies/components/PopularPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Movies' };

export default function PopularPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Popular Movies</h1>
        <p className="mt-1 text-gray-400">What everyone is watching right now</p>
      </div>
      <PopularPageClient />
    </div>
  );
}
