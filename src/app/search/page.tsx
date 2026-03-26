import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Search' };

// Search is fully client-driven (user types → query fires).
// Import the client component that contains the search input + TanStack Query hook.
export { SearchPageClient as default } from '@/features/movies/components/SearchPageClient';
