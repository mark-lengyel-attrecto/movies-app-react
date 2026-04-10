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

  const [moviesData, tvData] = await Promise.all([
    getWatchlistMovies(accountId, sessionId, locale),
    getWatchlistTV(accountId, sessionId, locale),
  ]);

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

  const data = await updateWatchlist(accountId, sessionId, body);
  return NextResponse.json(data);
}
