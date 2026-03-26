import type { BackdropSize, PosterSize, ProfileSize } from '@/types/tmdb';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// ─── Image URL Helpers (no token needed) ────────────────────────────────────
// Safe to import in any component, including client components.

export function posterUrl(path: string | null, size: PosterSize = 'w500'): string | null {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}

export function backdropUrl(path: string | null, size: BackdropSize = 'w1280'): string | null {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}

export function profileUrl(path: string | null, size: ProfileSize = 'w185'): string | null {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}

// ─── Authenticated API Client (server-side only) ─────────────────────────────

class TMDBClient {
  private readonly token: string;

  constructor(token: string) {
    if (!token) throw new Error('TMDB_ACCESS_TOKEN is not set in .env.local');
    this.token = token;
  }

  async fetch<T>(
    path: string,
    params?: Record<string, string | number>,
    options?: RequestInit & { next?: { revalidate?: number; tags?: string[] } },
  ): Promise<T> {
    const url = new URL(`${TMDB_BASE_URL}${path}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.set(key, String(value));
      });
    }

    const res = await fetch(url.toString(), {
      ...options,
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      next: { revalidate: 3600, ...options?.next },
    });

    if (!res.ok) {
      throw new Error(`TMDB API error ${res.status}: ${res.statusText} — ${path}`);
    }

    return res.json() as Promise<T>;
  }
}

// Instantiated lazily so missing env var only throws when an API call is made,
// not when image URL helpers are imported.
let _tmdb: TMDBClient | null = null;

export function getTMDBClient(): TMDBClient {
  if (!_tmdb) _tmdb = new TMDBClient(process.env.TMDB_ACCESS_TOKEN ?? '');
  return _tmdb;
}
