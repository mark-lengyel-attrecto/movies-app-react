export type TVListCategory = 'popular' | 'top_rated' | 'airing_today' | 'on_the_air';

export interface TVListOption {
  value: TVListCategory;
  label: string;
}

export const TV_LIST_OPTIONS: TVListOption[] = [
  { value: 'popular', label: 'Popular' },
  { value: 'top_rated', label: 'Top Rated' },
  { value: 'airing_today', label: 'Airing Today' },
  { value: 'on_the_air', label: 'On The Air' },
];
