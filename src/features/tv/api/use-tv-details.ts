'use client';

import { useQuery } from '@tanstack/react-query';

import type { TVCredits, TVSeriesDetails, TVVideos } from '@/types/tmdb';

export const tvKeys = {
  all: ['tv'] as const,
  detail: (id: number) => ['tv', 'detail', id] as const,
  credits: (id: number) => ['tv', 'credits', id] as const,
  videos: (id: number) => ['tv', 'videos', id] as const,
};

async function fetchTVDetails(id: number): Promise<TVSeriesDetails> {
  const res = await fetch(`/api/tv/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch TV show ${id}`);
  return res.json();
}

async function fetchTVCredits(id: number): Promise<TVCredits> {
  const res = await fetch(`/api/tv/${id}/credits`);
  if (!res.ok) throw new Error(`Failed to fetch credits for TV show ${id}`);
  return res.json();
}

async function fetchTVVideos(id: number): Promise<TVVideos> {
  const res = await fetch(`/api/tv/${id}/videos`);
  if (!res.ok) throw new Error(`Failed to fetch videos for TV show ${id}`);
  return res.json();
}

export function useTVDetails(id: number) {
  return useQuery({
    queryKey: tvKeys.detail(id),
    queryFn: () => fetchTVDetails(id),
    enabled: !!id,
  });
}

export function useTVCredits(id: number) {
  return useQuery({
    queryKey: tvKeys.credits(id),
    queryFn: () => fetchTVCredits(id),
    enabled: !!id,
  });
}

export function useTVVideos(id: number) {
  return useQuery({
    queryKey: tvKeys.videos(id),
    queryFn: () => fetchTVVideos(id),
    enabled: !!id,
  });
}
