import Link from 'next/link';

import { UserMenu } from '@/features/auth/components/UserMenu';
import { auth } from '@/lib/auth';

export async function Header() {
  // auth() is a server-side call — no client-side token exposure
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-gray-900/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-bold tracking-tight text-white">
          Movies
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/movies"
            className="text-sm text-gray-300 transition-colors hover:text-white"
          >
            Movies
          </Link>
          <Link
            href="/search"
            className="text-sm text-gray-300 transition-colors hover:text-white"
          >
            Search
          </Link>
          {session?.user && (
            <Link
              href="/watchlist"
              className="text-sm text-gray-300 transition-colors hover:text-white"
            >
              Watchlist
            </Link>
          )}
        </nav>

        <UserMenu user={session?.user ?? null} />
      </div>
    </header>
  );
}
