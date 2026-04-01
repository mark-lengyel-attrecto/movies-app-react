export function Footer() {
  return (
    <footer className="mt-auto border-t border-ui bg-surface py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-muted">
          Movie data provided by{' '}
          <a
            href="https://www.themoviedb.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted underline hover:text-foreground"
          >
            TMDB
          </a>
        </p>
      </div>
    </footer>
  );
}
