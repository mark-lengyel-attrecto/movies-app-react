import { useTranslations } from 'next-intl';

import type { Movie } from '@/types/tmdb';

import { MovieCard } from './MovieCard';

interface MovieGridProps {
  movies: Movie[];
}

export function MovieGrid({ movies }: MovieGridProps) {
  const t = useTranslations('MovieGrid');

  if (movies.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-muted">
        {t('empty')}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {movies.map((movie, i) => (
        <MovieCard key={movie.id} movie={movie} index={i} />
      ))}
    </div>
  );
}
