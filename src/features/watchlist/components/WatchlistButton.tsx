'use client';

import { useTranslations } from 'next-intl';

import { useSession } from '@/features/auth/hooks/use-session';
import { useWatchlistStore } from '@/stores/watchlist.store';
import type { Movie, MovieDetails, TVSeries, TVSeriesDetails } from '@/types/tmdb';

import { useTMDBWatchlist, useToggleWatchlist } from '../api/use-tmdb-watchlist';

// Both MovieDetails and TVSeriesDetails extend Omit<Base, 'genre_ids'> and
// replace it with genres: Genre[]. Reconstruct genre_ids for the Zustand store.
function toMovie(detail: MovieDetails): Movie {
  return { ...detail, genre_ids: detail.genres.map((g) => g.id) };
}

function toTVSeries(detail: TVSeriesDetails): TVSeries {
  return { ...detail, genre_ids: detail.genres.map((g) => g.id) };
}

type WatchlistButtonProps =
  | { mediaType: 'movie'; media: MovieDetails }
  | { mediaType: 'tv'; media: TVSeriesDetails };

export function WatchlistButton(props: WatchlistButtonProps) {
  const t = useTranslations('WatchlistButton');
  const { isAuthenticated, isLoading: isSessionLoading } = useSession();

  // ── TMDB path (authenticated) ──────────────────────────────────────────────
  const { data: watchlistData, isPending: isWatchlistPending } = useTMDBWatchlist();
  const toggleMutation = useToggleWatchlist();

  // ── Zustand path (unauthenticated) ────────────────────────────────────────
  const { isMovieInWatchlist, isTVInWatchlist, toggleMovie, toggleTV } = useWatchlistStore();

  const isDisabled = isSessionLoading || toggleMutation.isPending;

  // Narrowing through props preserves the discriminated union so TypeScript
  // knows props.media is MovieDetails when props.mediaType === 'movie', etc.
  let inWatchlist: boolean;
  if (isAuthenticated) {
    if (isWatchlistPending) {
      inWatchlist = false;
    } else if (props.mediaType === 'movie') {
      inWatchlist = watchlistData?.movies.some((m) => m.id === props.media.id) ?? false;
    } else {
      inWatchlist = watchlistData?.tvShows.some((s) => s.id === props.media.id) ?? false;
    }
  } else if (props.mediaType === 'movie') {
    inWatchlist = isMovieInWatchlist(props.media.id);
  } else {
    inWatchlist = isTVInWatchlist(props.media.id);
  }

  function handleToggle() {
    if (isAuthenticated) {
      toggleMutation.mutate({
        media_type: props.mediaType,
        media_id: props.media.id,
        watchlist: !inWatchlist,
      });
    } else if (props.mediaType === 'movie') {
      toggleMovie(toMovie(props.media));
    } else {
      toggleTV(toTVSeries(props.media));
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isDisabled || (isAuthenticated && isWatchlistPending)}
      className={`flex w-fit items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 ${
        inWatchlist
          ? 'bg-blue-600 text-white hover:bg-blue-700'
          : 'bg-elevated border-ui text-foreground border hover:opacity-80'
      }`}
    >
      <span>{inWatchlist ? '✓' : '+'}</span>
      <span>{inWatchlist ? t('inWatchlist') : t('add')}</span>
    </button>
  );
}
