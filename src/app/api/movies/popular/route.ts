import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { getPopularMovies } from '@/lib/tmdb/endpoints';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const page = Number(searchParams.get('page') ?? 1);
  const locale = searchParams.get('locale') ?? 'en';

  const data = await getPopularMovies(page, locale);
  return NextResponse.json(data);
}
