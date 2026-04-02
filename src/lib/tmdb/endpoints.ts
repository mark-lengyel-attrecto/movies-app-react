import { localeToTmdb } from '@/i18n/routing';
import type {
  Movie,
  MovieCredits,
  MovieDetails,
  MovieVideos,
  PaginatedResponse,
} from '@/types/tmdb';

import { getTMDBClient } from './client';

// ─── Movie Lists ─────────────────────────────────────────────────────────────

export function getPopularMovies(page = 1, locale = 'en'): Promise<PaginatedResponse<Movie>> {
  return getTMDBClient().fetch('/movie/popular', { page, language: localeToTmdb(locale) });
}

export function getTopRatedMovies(page = 1, locale = 'en'): Promise<PaginatedResponse<Movie>> {
  return getTMDBClient().fetch('/movie/top_rated', { page, language: localeToTmdb(locale) });
}

export function getNowPlayingMovies(page = 1, locale = 'en'): Promise<PaginatedResponse<Movie>> {
  return getTMDBClient().fetch('/movie/now_playing', { page, language: localeToTmdb(locale) });
}

export function getUpcomingMovies(page = 1, locale = 'en'): Promise<PaginatedResponse<Movie>> {
  return getTMDBClient().fetch('/movie/upcoming', { page, language: localeToTmdb(locale) });
}

// ─── Movie Details ───────────────────────────────────────────────────────────

export function getMovieDetails(id: number, locale = 'en'): Promise<MovieDetails> {
  return getTMDBClient().fetch(
    `/movie/${id}`,
    { language: localeToTmdb(locale) },
    {
      next: { revalidate: 86400, tags: [`movie-${id}`] },
    },
  );
}

export function getMovieCredits(id: number, locale = 'en'): Promise<MovieCredits> {
  return getTMDBClient().fetch(
    `/movie/${id}/credits`,
    { language: localeToTmdb(locale) },
    {
      next: { revalidate: 86400, tags: [`movie-${id}-credits`] },
    },
  );
}

export function getMovieVideos(id: number, locale = 'en'): Promise<MovieVideos> {
  return getTMDBClient().fetch(
    `/movie/${id}/videos`,
    { language: localeToTmdb(locale) },
    {
      next: { revalidate: 86400, tags: [`movie-${id}-videos`] },
    },
  );
}

export function getSimilarMovies(
  id: number,
  page = 1,
  locale = 'en',
): Promise<PaginatedResponse<Movie>> {
  return getTMDBClient().fetch(`/movie/${id}/similar`, { page, language: localeToTmdb(locale) });
}

// ─── Search ──────────────────────────────────────────────────────────────────

export function searchMovies(
  query: string,
  page = 1,
  locale = 'en',
): Promise<PaginatedResponse<Movie>> {
  return getTMDBClient().fetch(
    '/search/movie',
    { query, page, language: localeToTmdb(locale) },
    { next: { revalidate: 0 } },
  );
}

// ─── Genres ──────────────────────────────────────────────────────────────────

export function getGenres(locale = 'en'): Promise<{ genres: { id: number; name: string }[] }> {
  return getTMDBClient().fetch(
    '/genre/movie/list',
    { language: localeToTmdb(locale) },
    {
      next: { revalidate: 604800 },
    },
  );
}
