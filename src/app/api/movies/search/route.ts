import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { searchMovies } from '@/lib/tmdb/endpoints';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const query = searchParams.get('query');
  const page = Number(searchParams.get('page') ?? 1);

  if (!query) {
    return NextResponse.json({ error: 'query is required' }, { status: 400 });
  }

  const data = await searchMovies(query, page);
  return NextResponse.json(data);
}
