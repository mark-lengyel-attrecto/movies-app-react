import { getTranslations } from 'next-intl/server';

import { HeaderSearch } from '@/components/layout/HeaderSearch';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { UserMenu } from '@/features/auth/components/UserMenu';
import { Link } from '@/i18n/navigation';
import { auth } from '@/lib/auth';

export async function Header({ isDark }: { isDark: boolean }) {
  const session = await auth();
  const t = await getTranslations('Header');

  return (
    <header className="sticky top-0 z-50 border-b border-ui bg-surface/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-8 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="shrink-0 text-xl font-bold tracking-tight text-foreground">
          {t('brand')}
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/popular"
            className="text-sm text-secondary transition-colors hover:text-foreground"
          >
            {t('popular')}
          </Link>
          <Link
            href="/top-rated"
            className="text-sm text-secondary transition-colors hover:text-foreground"
          >
            {t('topRated')}
          </Link>
          {session?.user && (
            <Link
              href="/watchlist"
              className="text-sm text-secondary transition-colors hover:text-foreground"
            >
              {t('watchlist')}
            </Link>
          )}
        </nav>

        <div className="flex flex-1 justify-center">
          <HeaderSearch />
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle initialTheme={isDark ? 'dark' : 'light'} />
          <UserMenu user={session?.user ?? null} />
        </div>
      </div>
    </header>
  );
}
