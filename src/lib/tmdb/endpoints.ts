import { localeToTmdb } from '@/i18n/routing';
import type {
  Movie,
  MovieCredits,
  MovieDetails,
  MovieVideos,
  MultiSearchResult,
  PaginatedResponse,
  TVCredits,
  TVSeries,
  TVSeriesDetails,
  TVVideos,
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

// ─── TV Lists ────────────────────────────────────────────────────────────────

export function getPopularTV(page = 1, locale = 'en'): Promise<PaginatedResponse<TVSeries>> {
  return getTMDBClient().fetch('/tv/popular', { page, language: localeToTmdb(locale) });
}

export function getTopRatedTV(page = 1, locale = 'en'): Promise<PaginatedResponse<TVSeries>> {
  return getTMDBClient().fetch('/tv/top_rated', { page, language: localeToTmdb(locale) });
}

// ─── TV Details ──────────────────────────────────────────────────────────────

export function getTVDetails(id: number, locale = 'en'): Promise<TVSeriesDetails> {
  return getTMDBClient().fetch(
    `/tv/${id}`,
    { language: localeToTmdb(locale) },
    { next: { revalidate: 86400, tags: [`tv-${id}`] } },
  );
}

export function getTVCredits(id: number, locale = 'en'): Promise<TVCredits> {
  return getTMDBClient().fetch(
    `/tv/${id}/credits`,
    { language: localeToTmdb(locale) },
    { next: { revalidate: 86400, tags: [`tv-${id}-credits`] } },
  );
}

export function getTVVideos(id: number, locale = 'en'): Promise<TVVideos> {
  return getTMDBClient().fetch(
    `/tv/${id}/videos`,
    { language: localeToTmdb(locale) },
    { next: { revalidate: 86400, tags: [`tv-${id}-videos`] } },
  );
}

// ─── Account Watchlist ────────────────────────────────────────────────────────

export function getWatchlistMovies(
  accountId: number,
  sessionId: string,
  locale = 'en',
): Promise<PaginatedResponse<Movie>> {
  return getTMDBClient().fetch(
    `/account/${accountId}/watchlist/movies`,
    { language: localeToTmdb(locale), session_id: sessionId, page: 1 },
    { next: { revalidate: 0 } },
  );
}

export function getWatchlistTV(
  accountId: number,
  sessionId: string,
  locale = 'en',
): Promise<PaginatedResponse<TVSeries>> {
  return getTMDBClient().fetch(
    `/account/${accountId}/watchlist/tv`,
    { language: localeToTmdb(locale), session_id: sessionId, page: 1 },
    { next: { revalidate: 0 } },
  );
}

export function updateWatchlist(
  accountId: number,
  sessionId: string,
  body: { media_type: 'movie' | 'tv'; media_id: number; watchlist: boolean },
): Promise<unknown> {
  return getTMDBClient().fetch(
    `/account/${accountId}/watchlist`,
    { session_id: sessionId },
    { method: 'POST', body: JSON.stringify(body), next: { revalidate: 0 } },
  );
}

// ─── Multi-Search ─────────────────────────────────────────────────────────────

export function multiSearch(
  query: string,
  page = 1,
  locale = 'en',
): Promise<PaginatedResponse<MultiSearchResult>> {
  return getTMDBClient().fetch(
    '/search/multi',
    { query, page, language: localeToTmdb(locale) },
    { next: { revalidate: 0 } },
  );
}
