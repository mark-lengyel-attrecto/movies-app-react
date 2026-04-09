import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { Movie, TVSeries } from '@/types/tmdb';

interface WatchlistStore {
  movies: Movie[];
  tvShows: TVSeries[];

  addMovie: (movie: Movie) => void;
  removeMovie: (id: number) => void;
  toggleMovie: (movie: Movie) => void;
  isMovieInWatchlist: (id: number) => boolean;

  addTV: (show: TVSeries) => void;
  removeTV: (id: number) => void;
  toggleTV: (show: TVSeries) => void;
  isTVInWatchlist: (id: number) => boolean;

  clearWatchlist: () => void;
}

export const useWatchlistStore = create<WatchlistStore>()(
  persist(
    (set, get) => ({
      movies: [],
      tvShows: [],

      addMovie: (movie) =>
        set((state) => {
          if (state.movies.some((m) => m.id === movie.id)) return state;
          return { movies: [...state.movies, movie] };
        }),

      removeMovie: (id) => set((state) => ({ movies: state.movies.filter((m) => m.id !== id) })),

      toggleMovie: (movie) => {
        const { isMovieInWatchlist, addMovie, removeMovie } = get();
        if (isMovieInWatchlist(movie.id)) {
          removeMovie(movie.id);
        } else {
          addMovie(movie);
        }
      },

      isMovieInWatchlist: (id) => get().movies.some((m) => m.id === id),

      addTV: (show) =>
        set((state) => {
          if (state.tvShows.some((s) => s.id === show.id)) return state;
          return { tvShows: [...state.tvShows, show] };
        }),

      removeTV: (id) => set((state) => ({ tvShows: state.tvShows.filter((s) => s.id !== id) })),

      toggleTV: (show) => {
        const { isTVInWatchlist, addTV, removeTV } = get();
        if (isTVInWatchlist(show.id)) {
          removeTV(show.id);
        } else {
          addTV(show);
        }
      },

      isTVInWatchlist: (id) => get().tvShows.some((s) => s.id === id),

      clearWatchlist: () => set({ movies: [], tvShows: [] }),
    }),
    {
      name: 'tmdb-watchlist',
      partialize: (state) => ({ movies: state.movies, tvShows: state.tvShows }),
    },
  ),
);
