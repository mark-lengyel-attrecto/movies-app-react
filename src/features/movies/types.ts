// Movie-specific UI types that extend or narrow the base TMDB types

export type MovieListCategory = 'popular' | 'top_rated' | 'now_playing' | 'upcoming';

export interface MovieListOption {
  value: MovieListCategory;
  label: string;
}

export const MOVIE_LIST_OPTIONS: MovieListOption[] = [
  { value: 'popular', label: 'Popular' },
  { value: 'top_rated', label: 'Top Rated' },
  { value: 'now_playing', label: 'Now Playing' },
  { value: 'upcoming', label: 'Upcoming' },
];
