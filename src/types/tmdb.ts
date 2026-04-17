// ─── Core Movie Types ────────────────────────────────────────────────────────

export interface Movie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  adult: boolean;
  video: boolean;
  original_language: string;
}

export interface MovieDetails extends Omit<Movie, 'genre_ids'> {
  genres: Genre[];
  runtime: number | null;
  status: string;
  tagline: string;
  budget: number;
  revenue: number;
  homepage: string | null;
  imdb_id: string | null;
  belongs_to_collection: Collection | null;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  spoken_languages: SpokenLanguage[];
}

// ─── Supporting Types ────────────────────────────────────────────────────────

export interface Genre {
  id: number;
  name: string;
}

export interface Collection {
  id: number;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
}

export interface ProductionCompany {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface SpokenLanguage {
  iso_639_1: string;
  name: string;
  english_name: string;
}

// ─── Cast & Crew ─────────────────────────────────────────────────────────────

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
  known_for_department: string;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface MovieCredits {
  id: number;
  cast: CastMember[];
  crew: CrewMember[];
}

// ─── Videos ──────────────────────────────────────────────────────────────────

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
  published_at: string;
}

export interface MovieVideos {
  id: number;
  results: Video[];
}

// ─── Core TV Types ────────────────────────────────────────────────────────────

export interface TVSeries {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  origin_country: string[];
}

export interface TVSeriesDetails extends Omit<TVSeries, 'genre_ids'> {
  genres: Genre[];
  status: string;
  tagline: string;
  homepage: string | null;
  number_of_seasons: number;
  number_of_episodes: number;
  seasons: Season[];
  created_by: Creator[];
  networks: Network[];
  last_air_date: string | null;
  episode_run_time: number[];
  in_production: boolean;
  type: string;
}

export interface Season {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
  episode_count: number;
  air_date: string | null;
}

export interface Episode {
  id: number;
  name: string;
  overview: string;
  episode_number: number;
  season_number: number;
  air_date: string | null;
  still_path: string | null;
  runtime: number | null;
  vote_average: number;
  vote_count: number;
}

export interface SeasonDetails extends Season {
  episodes: Episode[];
}

export interface Creator {
  id: number;
  name: string;
  profile_path: string | null;
}

export interface Network {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
}

export interface TVCredits {
  id: number;
  cast: CastMember[];
  crew: CrewMember[];
}

export interface TVVideos {
  id: number;
  results: Video[];
}

// ─── Multi-Search ─────────────────────────────────────────────────────────────

export type MultiSearchMovie = Movie & { media_type: 'movie' };
export type MultiSearchTV = TVSeries & { media_type: 'tv' };
export type MultiSearchPerson = {
  id: number;
  name: string;
  profile_path: string | null;
  popularity: number;
  media_type: 'person';
};
export type MultiSearchResult = MultiSearchMovie | MultiSearchTV | MultiSearchPerson;

// ─── API Response Wrappers ───────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

// ─── Image Sizes ─────────────────────────────────────────────────────────────

export type PosterSize = 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original';
export type BackdropSize = 'w300' | 'w780' | 'w1280' | 'original';
export type ProfileSize = 'w45' | 'w185' | 'h632' | 'original';
export type StillSize = 'w92' | 'w185' | 'w300' | 'original';
