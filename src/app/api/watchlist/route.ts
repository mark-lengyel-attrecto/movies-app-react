import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { auth } from '@/lib/auth';
import { getWatchlistMovies, getWatchlistTV, updateWatchlist } from '@/lib/tmdb/endpoints';

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.sessionId || !session.user.accountId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const locale = searchParams.get('locale') ?? 'en';
  const { sessionId, accountId } = session.user;

  const [moviesPage, tvPage] = await Promise.all([
    getWatchlistMovies(accountId, sessionId, locale, 1),
    getWatchlistTV(accountId, sessionId, locale, 1),
  ]);

  const movieExtraPages = Array.from({ length: moviesPage.total_pages - 1 }, (_, i) =>
    getWatchlistMovies(accountId, sessionId, locale, i + 2),
  );
  const tvExtraPages = Array.from({ length: tvPage.total_pages - 1 }, (_, i) =>
    getWatchlistTV(accountId, sessionId, locale, i + 2),
  );

  const extraResults = await Promise.all([...movieExtraPages, ...tvExtraPages]);
  const extraMovies = extraResults.slice(0, moviesPage.total_pages - 1);
  const extraTV = extraResults.slice(moviesPage.total_pages - 1);

  return NextResponse.json({
    movies: [moviesPage.results, ...extraMovies.map((p) => p.results)].flat(),
    tvShows: [tvPage.results, ...extraTV.map((p) => p.results)].flat(),
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

  const data = await updateWatchlist(accountId, sessionId, body);
  return NextResponse.json(data);
}
