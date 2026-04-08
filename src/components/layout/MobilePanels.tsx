'use client';

import { useEffect } from 'react';
import type { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';

import { HeaderSearch } from '@/components/layout/HeaderSearch';
import { Link, usePathname } from '@/i18n/navigation';
import { useUIStore } from '@/stores/ui.store';

interface MobilePanelsProps {
  hasWatchlist: boolean;
  user: Session['user'] | null;
}

export function MobilePanels({ hasWatchlist, user }: MobilePanelsProps) {
  const t = useTranslations('Header');
  const tUser = useTranslations('UserMenu');
  const { isMobileSearchOpen, isMobileNavOpen, setMobileNavOpen } = useUIStore();
  const pathname = usePathname();

  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname, setMobileNavOpen]);

  return (
    <>
      {isMobileSearchOpen && (
        <div className="border-ui border-t px-4 py-3 md:hidden">
          <HeaderSearch className="max-w-none" autoFocus />
        </div>
      )}
      {isMobileNavOpen && (
        <nav className="border-ui border-t px-4 py-3 md:hidden">
          <div className="flex flex-col">
            <Link
              href="/popular"
              className="text-secondary hover:text-foreground hover:bg-elevated rounded-md px-3 py-2 text-sm transition-colors"
            >
              {t('popular')}
            </Link>
            <Link
              href="/top-rated"
              className="text-secondary hover:text-foreground hover:bg-elevated rounded-md px-3 py-2 text-sm transition-colors"
            >
              {t('topRated')}
            </Link>
            {hasWatchlist && (
              <Link
                href="/watchlist"
                className="text-secondary hover:text-foreground hover:bg-elevated rounded-md px-3 py-2 text-sm transition-colors"
              >
                {t('watchlist')}
              </Link>
            )}
            <div className="border-ui mt-2 border-t pt-2">
              {user ? (
                <>
                  {user.name && <span className="text-muted px-3 py-2 text-xs">{user.name}</span>}
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="text-secondary hover:text-foreground hover:bg-elevated w-full rounded-md px-3 py-2 text-left text-sm transition-colors"
                  >
                    {tUser('signOut')}
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="block rounded-md px-3 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-600 hover:text-white"
                >
                  {tUser('signIn')}
                </Link>
              )}
            </div>
          </div>
        </nav>
      )}
    </>
  );
}
