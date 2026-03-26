import type { Metadata } from 'next';

import { MovieGrid } from '@/features/movies/components/MovieGrid';
import { getPopularMovies } from '@/lib/tmdb/endpoints';

export const metadata: Metadata = { title: 'Movies' };

export default async function MoviesPage() {
  const { results: movies } = await getPopularMovies();

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold">Movies</h1>
      <MovieGrid movies={movies} />
    </div>
  );
}
