import type {
  Movie,
  MovieCredits,
  MovieDetails,
  MovieVideos,
  PaginatedResponse,
} from '@/types/tmdb';

import { getTMDBClient } from './client';

// ─── Movie Lists ─────────────────────────────────────────────────────────────

export function getPopularMovies(page = 1): Promise<PaginatedResponse<Movie>> {
  return getTMDBClient().fetch('/movie/popular', { page });
}

export function getTopRatedMovies(page = 1): Promise<PaginatedResponse<Movie>> {
  return getTMDBClient().fetch('/movie/top_rated', { page });
}

export function getNowPlayingMovies(page = 1): Promise<PaginatedResponse<Movie>> {
  return getTMDBClient().fetch('/movie/now_playing', { page });
}

export function getUpcomingMovies(page = 1): Promise<PaginatedResponse<Movie>> {
  return getTMDBClient().fetch('/movie/upcoming', { page });
}

// ─── Movie Details ───────────────────────────────────────────────────────────

export function getMovieDetails(id: number): Promise<MovieDetails> {
  return getTMDBClient().fetch(`/movie/${id}`, undefined, {
    next: { revalidate: 86400, tags: [`movie-${id}`] }, // cache 24h, tag for revalidation
  });
}

export function getMovieCredits(id: number): Promise<MovieCredits> {
  return getTMDBClient().fetch(`/movie/${id}/credits`, undefined, {
    next: { revalidate: 86400, tags: [`movie-${id}-credits`] },
  });
}

export function getMovieVideos(id: number): Promise<MovieVideos> {
  return getTMDBClient().fetch(`/movie/${id}/videos`, undefined, {
    next: { revalidate: 86400, tags: [`movie-${id}-videos`] },
  });
}

export function getSimilarMovies(id: number, page = 1): Promise<PaginatedResponse<Movie>> {
  return getTMDBClient().fetch(`/movie/${id}/similar`, { page });
}

// ─── Search ──────────────────────────────────────────────────────────────────

export function searchMovies(query: string, page = 1): Promise<PaginatedResponse<Movie>> {
  return getTMDBClient().fetch('/search/movie', { query, page }, { next: { revalidate: 0 } });
}

// ─── Genres ──────────────────────────────────────────────────────────────────

export function getGenres(): Promise<{ genres: { id: number; name: string }[] }> {
  return getTMDBClient().fetch('/genre/movie/list', undefined, {
    next: { revalidate: 604800 }, // cache 7 days — genres rarely change
  });
}
