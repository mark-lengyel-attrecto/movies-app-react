import { MovieGrid } from '@/features/movies/components/MovieGrid';
import { getPopularMovies } from '@/lib/tmdb/endpoints';

export default async function HomePage() {
  // Server Component — data fetched at request time, no useEffect needed
  const { results: movies } = await getPopularMovies();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Popular Movies</h1>
        <p className="mt-1 text-gray-400">What everyone is watching right now</p>
      </div>
      <MovieGrid movies={movies} />
    </div>
  );
}
