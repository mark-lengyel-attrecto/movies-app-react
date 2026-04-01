import Link from 'next/link';

import { UserMenu } from '@/features/auth/components/UserMenu';
import { auth } from '@/lib/auth';
import { ThemeToggle } from '@/components/layout/ThemeToggle';

export async function Header() {
  // auth() is a server-side call — no client-side token exposure
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 border-b border-ui bg-surface/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-bold tracking-tight text-foreground">
          Movies
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/popular"
            className="text-sm text-secondary transition-colors hover:text-foreground"
          >
            Popular
          </Link>
          <Link
            href="/search"
            className="text-sm text-secondary transition-colors hover:text-foreground"
          >
            Search
          </Link>
          {session?.user && (
            <Link
              href="/watchlist"
              className="text-sm text-secondary transition-colors hover:text-foreground"
            >
              Watchlist
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <UserMenu user={session?.user ?? null} />
        </div>
      </div>
    </header>
  );
}
