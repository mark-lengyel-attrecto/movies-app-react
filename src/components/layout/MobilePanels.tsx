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

const subItemCls =
  'text-secondary hover:text-foreground hover:bg-elevated rounded-md py-3 pr-3 pl-6 text-sm transition-colors';

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
        <div className="border-ui bg-surface/80 fixed inset-x-0 top-16 z-40 border-t px-4 py-3 shadow-lg backdrop-blur-sm md:hidden">
          <HeaderSearch className="max-w-none" autoFocus />
        </div>
      )}
      {isMobileNavOpen && (
        <nav className="border-ui bg-surface/80 fixed inset-x-0 top-16 z-40 max-h-[calc(100dvh-4rem)] overflow-y-auto border-t px-4 py-3 shadow-lg backdrop-blur-sm md:hidden">
          <div className="flex flex-col">
            <p className="text-muted px-3 pt-1 pb-1 text-xs font-semibold tracking-wider uppercase">
              {t('movies')}
            </p>
            <Link href="/movies/popular" className={subItemCls}>
              {t('popular')}
            </Link>
            <Link href="/movies/top-rated" className={subItemCls}>
              {t('topRated')}
            </Link>
            <Link href="/movies/upcoming" className={subItemCls}>
              {t('upcoming')}
            </Link>

            <p className="text-muted px-3 pt-4 pb-1 text-xs font-semibold tracking-wider uppercase">
              {t('tv')}
            </p>
            <Link href="/tv/popular" className={subItemCls}>
              {t('popular')}
            </Link>
            <Link href="/tv/top-rated" className={subItemCls}>
              {t('topRated')}
            </Link>
            <Link href="/tv/on-the-air" className={subItemCls}>
              {t('onTheAir')}
            </Link>

            <div className="border-ui mt-3 border-t pt-2" />
            {user ? (
              <>
                <p className="text-muted px-3 pt-1 pb-1 text-xs font-semibold tracking-wider">
                  {user.name ?? user.email}
                </p>
                {hasWatchlist && (
                  <Link href="/watchlist" className={subItemCls}>
                    {tUser('watchlist')}
                  </Link>
                )}
                <a onClick={() => signOut({ callbackUrl: '/' })} className={subItemCls}>
                  {tUser('signOut')}
                </a>
              </>
            ) : (
              <Link
                href="/login"
                className="block rounded-md px-3 py-3 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-600 hover:text-white"
              >
                {tUser('signIn')}
              </Link>
            )}
          </div>
        </nav>
      )}
    </>
  );
}
