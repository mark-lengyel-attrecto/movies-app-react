import type { Movie, MultiSearchResult, TVSeries } from '@/types/tmdb';

export type NormalizedMedia = {
  id: string;
  title: string;
  year: number | null;
  href: string;
  posterPath: string | null;
  voteAverage: number;
  mediaTypeBadge?: 'movie' | 'tv';
};

export function movieToMedia(movie: Movie): NormalizedMedia {
  return {
    id: String(movie.id),
    title: movie.title,
    year: movie.release_date ? new Date(movie.release_date).getFullYear() : null,
    href: `/movies/${movie.id}`,
    posterPath: movie.poster_path,
    voteAverage: movie.vote_average,
  };
}

export function tvToMedia(show: TVSeries): NormalizedMedia {
  return {
    id: String(show.id),
    title: show.name,
    year: show.first_air_date ? new Date(show.first_air_date).getFullYear() : null,
    href: `/tv/${show.id}`,
    posterPath: show.poster_path,
    voteAverage: show.vote_average,
  };
}

/** Returns null for person results (filtered out in multi-search). */
export function multiSearchResultToMedia(item: MultiSearchResult): NormalizedMedia | null {
  if (item.media_type === 'person') return null;
  if (item.media_type === 'movie') {
    return { ...movieToMedia(item), id: `movie-${item.id}`, mediaTypeBadge: 'movie' };
  }
  return { ...tvToMedia(item), id: `tv-${item.id}`, mediaTypeBadge: 'tv' };
}
