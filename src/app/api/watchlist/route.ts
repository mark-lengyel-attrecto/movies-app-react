import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { auth } from '@/lib/auth';
import type { Movie, TVSeries } from '@/types/tmdb';

const TMDB_BASE = 'https://api.themoviedb.org/3';

function tmdbHeaders() {
  return {
    Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
  };
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.sessionId || !session.user.accountId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { sessionId, accountId } = session.user;
  const params = `session_id=${sessionId}&page=1`;

  const [moviesRes, tvRes] = await Promise.all([
    fetch(`${TMDB_BASE}/account/${accountId}/watchlist/movies?${params}`, {
      headers: tmdbHeaders(),
      cache: 'no-store',
    }),
    fetch(`${TMDB_BASE}/account/${accountId}/watchlist/tv?${params}`, {
      headers: tmdbHeaders(),
      cache: 'no-store',
    }),
  ]);

  if (!moviesRes.ok || !tvRes.ok) {
    return NextResponse.json({ error: 'TMDB error' }, { status: 502 });
  }

  const [moviesData, tvData] = (await Promise.all([
    moviesRes.json(),
    tvRes.json(),
  ])) as [{ results: Movie[] }, { results: TVSeries[] }];

  return NextResponse.json({
    movies: moviesData.results ?? [],
    tvShows: tvData.results ?? [],
  });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.sessionId || !session.user.accountId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { sessionId, accountId } = session.user;
  const body = (await request.json()) as {
    media_type: 'movie' | 'tv';
    media_id: number;
    watchlist: boolean;
  };

  const res = await fetch(
    `${TMDB_BASE}/account/${accountId}/watchlist?session_id=${sessionId}`,
    {
      method: 'POST',
      headers: tmdbHeaders(),
      body: JSON.stringify(body),
      cache: 'no-store',
    },
  );

  if (!res.ok) {
    return NextResponse.json({ error: 'TMDB error' }, { status: res.status });
  }

  return NextResponse.json(await res.json());
}
