'use client';

import type { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';

import { Dropdown } from '@/components/layout/Dropdown';
import { Link } from '@/i18n/navigation';

interface UserMenuProps {
  user: Session['user'] | null;
}

export function UserMenu({ user }: UserMenuProps) {
  const t = useTranslations('UserMenu');

  if (!user) {
    return (
      <Link
        href="/login"
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
      >
        {t('signIn')}
      </Link>
    );
  }

  return (
    <Dropdown
      trigger={user.name ?? user.email ?? ''}
      align="right"
      panelClassName="min-w-[160px]"
      items={[
        { key: 'watchlist', href: '/watchlist', label: t('watchlist') },
        { key: 'signout', onClick: () => signOut({ callbackUrl: '/' }), label: t('signOut') },
      ]}
    />
  );
}
