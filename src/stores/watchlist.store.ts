import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { Movie } from '@/types/tmdb';

interface WatchlistStore {
  movies: Movie[];
  addMovie: (movie: Movie) => void;
  removeMovie: (id: number) => void;
  toggleMovie: (movie: Movie) => void;
  isInWatchlist: (id: number) => boolean;
  clearWatchlist: () => void;
}

export const useWatchlistStore = create<WatchlistStore>()(
  persist(
    (set, get) => ({
      movies: [],

      addMovie: (movie) =>
        set((state) => {
          if (state.movies.some((m) => m.id === movie.id)) return state;
          return { movies: [...state.movies, movie] };
        }),

      removeMovie: (id) =>
        set((state) => ({ movies: state.movies.filter((m) => m.id !== id) })),

      toggleMovie: (movie) => {
        const { isInWatchlist, addMovie, removeMovie } = get();
        if (isInWatchlist(movie.id)) {
          removeMovie(movie.id);
        } else {
          addMovie(movie);
        }
      },

      isInWatchlist: (id) => get().movies.some((m) => m.id === id),

      clearWatchlist: () => set({ movies: [] }),
    }),
    {
      name: 'tmdb-watchlist', // localStorage key
      // Only persist the movies array, not the functions
      partialize: (state) => ({ movies: state.movies }),
    },
  ),
);
