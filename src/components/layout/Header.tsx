import Link from 'next/link';

import { UserMenu } from '@/features/auth/components/UserMenu';
import { auth } from '@/lib/auth';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { HeaderSearch } from '@/components/layout/HeaderSearch';

export async function Header() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 border-b border-ui bg-surface/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-8 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="shrink-0 text-xl font-bold tracking-tight text-foreground">
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
            href="/top-rated"
            className="text-sm text-secondary transition-colors hover:text-foreground"
          >
            Top rated
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

        <div className="flex flex-1 justify-center">
          <HeaderSearch />
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />
          <UserMenu user={session?.user ?? null} />
        </div>
      </div>
    </header>
  );
}
