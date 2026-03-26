export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-gray-900 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-gray-500">
          Movie data provided by{' '}
          <a
            href="https://www.themoviedb.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 underline hover:text-white"
          >
            TMDB
          </a>
        </p>
      </div>
    </footer>
  );
}
