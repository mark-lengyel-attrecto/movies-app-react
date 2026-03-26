'use client';

import { useQuery } from '@tanstack/react-query';

import type { MovieCredits, MovieDetails, MovieVideos } from '@/types/tmdb';

export const movieKeys = {
  all: ['movies'] as const,
  detail: (id: number) => ['movies', 'detail', id] as const,
  credits: (id: number) => ['movies', 'credits', id] as const,
  videos: (id: number) => ['movies', 'videos', id] as const,
};

async function fetchMovieDetails(id: number): Promise<MovieDetails> {
  const res = await fetch(`/api/movies/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch movie ${id}`);
  return res.json();
}

async function fetchMovieCredits(id: number): Promise<MovieCredits> {
  const res = await fetch(`/api/movies/${id}/credits`);
  if (!res.ok) throw new Error(`Failed to fetch credits for movie ${id}`);
  return res.json();
}

async function fetchMovieVideos(id: number): Promise<MovieVideos> {
  const res = await fetch(`/api/movies/${id}/videos`);
  if (!res.ok) throw new Error(`Failed to fetch videos for movie ${id}`);
  return res.json();
}

export function useMovieDetails(id: number) {
  return useQuery({
    queryKey: movieKeys.detail(id),
    queryFn: () => fetchMovieDetails(id),
    enabled: !!id,
  });
}

export function useMovieCredits(id: number) {
  return useQuery({
    queryKey: movieKeys.credits(id),
    queryFn: () => fetchMovieCredits(id),
    enabled: !!id,
  });
}

export function useMovieVideos(id: number) {
  return useQuery({
    queryKey: movieKeys.videos(id),
    queryFn: () => fetchMovieVideos(id),
    enabled: !!id,
  });
}
