import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';

import { backdropUrl, posterUrl, profileUrl } from '@/lib/tmdb/client';
import { getMovieCredits, getMovieDetails } from '@/lib/tmdb/endpoints';

interface MoviePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: MoviePageProps): Promise<Metadata> {
  const { id } = await params;
  const movie = await getMovieDetails(Number(id)).catch(() => null);
  if (!movie) return {};
  return {
    title: movie.title,
    description: movie.overview,
  };
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { id } = await params;
  const movieId = Number(id);

  const [movie, credits] = await Promise.all([
    getMovieDetails(movieId).catch(() => null),
    getMovieCredits(movieId).catch(() => null),
  ]);

  if (!movie) notFound();

  const backdrop = backdropUrl(movie.backdrop_path, 'w1280');
  const poster = posterUrl(movie.poster_path, 'w500');
  const director = credits?.crew.find((c) => c.job === 'Director');
  const topCast = credits?.cast.slice(0, 8) ?? [];

  return (
    <div className="flex flex-col gap-8">
      {/* Hero */}
      <div className="relative -mx-4 -mt-8 h-72 sm:-mx-6 sm:h-96 lg:-mx-8">
        {backdrop && (
          <Image
            src={backdrop}
            alt={movie.title}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent" />
      </div>

      {/* Details */}
      <div className="flex flex-col gap-6 sm:flex-row">
        {poster && (
          <div className="relative -mt-24 h-48 w-32 flex-shrink-0 sm:-mt-32 sm:h-64 sm:w-44">
            <Image
              src={poster}
              alt={movie.title}
              fill
              sizes="(max-width: 640px) 128px, 176px"
              className="rounded-lg object-cover shadow-2xl"
            />
          </div>
        )}

        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-bold">{movie.title}</h1>
          {movie.tagline && <p className="italic text-gray-400">{movie.tagline}</p>}
          <div className="flex flex-wrap gap-4 text-sm text-gray-400">
            <span>★ {movie.vote_average.toFixed(1)}</span>
            {movie.runtime && <span>{movie.runtime} min</span>}
            <span>{new Date(movie.release_date).getFullYear()}</span>
            {director && <span>Dir. {director.name}</span>}
          </div>
          <div className="flex flex-wrap gap-2">
            {movie.genres.map((genre) => (
              <span
                key={genre.id}
                className="rounded-full bg-gray-800 px-3 py-1 text-xs text-gray-300"
              >
                {genre.name}
              </span>
            ))}
          </div>
          <p className="max-w-2xl text-gray-300">{movie.overview}</p>
        </div>
      </div>

      {/* Cast */}
      {topCast.length > 0 && (
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold">Cast</h2>
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
            {topCast.map((member) => {
              const profile = profileUrl(member.profile_path, 'w185');
              return (
                <div key={member.id} className="flex flex-col items-center gap-1 text-center">
                  <div className="relative h-16 w-16 overflow-hidden rounded-full bg-gray-700">
                    {profile && (
                      <Image
                        src={profile}
                        alt={member.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <p className="text-xs font-medium text-white">{member.name}</p>
                  <p className="text-xs text-gray-500">{member.character}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
