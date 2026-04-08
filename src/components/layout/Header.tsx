import { getTranslations } from 'next-intl/server';

import { HeaderSearch } from '@/components/layout/HeaderSearch';
import { LocaleSwitcher } from '@/components/layout/LocaleSwitcher';
import { MobileMenuButtons } from '@/components/layout/MobileMenuButtons';
import { MobilePanels } from '@/components/layout/MobilePanels';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { UserMenu } from '@/features/auth/components/UserMenu';
import { Link } from '@/i18n/navigation';
import { auth } from '@/lib/auth';

export async function Header({ isDark }: { isDark: boolean }) {
  const session = await auth();
  const t = await getTranslations('Header');

  return (
    <header className="border-ui bg-surface/80 sticky top-0 z-50 border-b backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:gap-8 lg:px-8">
        <Link href="/" className="text-foreground shrink-0 text-xl font-bold tracking-tight">
          {t('brand')}
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/popular"
            className="text-secondary hover:text-foreground text-sm transition-colors"
          >
            {t('popular')}
          </Link>
          <Link
            href="/top-rated"
            className="text-secondary hover:text-foreground text-sm transition-colors"
          >
            {t('topRated')}
          </Link>
          {session?.user && (
            <Link
              href="/watchlist"
              className="text-secondary hover:text-foreground text-sm transition-colors"
            >
              {t('watchlist')}
            </Link>
          )}
        </nav>

        <div className="hidden flex-1 justify-center md:flex">
          <HeaderSearch />
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <LocaleSwitcher />
          <ThemeToggle initialTheme={isDark ? 'dark' : 'light'} />
          <div className="hidden md:block">
            <UserMenu user={session?.user ?? null} />
          </div>
          <MobileMenuButtons />
        </div>
      </div>

      <MobilePanels hasWatchlist={!!session?.user} user={session?.user ?? null} />
    </header>
  );
}
