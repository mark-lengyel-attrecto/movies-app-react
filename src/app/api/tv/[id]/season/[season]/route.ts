import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { getTVSeasonDetails } from '@/lib/tmdb/endpoints';

interface RouteContext {
  params: Promise<{ id: string; season: string }>;
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  const { id, season } = await params;
  const { searchParams } = request.nextUrl;
  const locale = searchParams.get('locale') ?? 'en';

  const data = await getTVSeasonDetails(Number(id), Number(season), locale);
  return NextResponse.json(data);
}
