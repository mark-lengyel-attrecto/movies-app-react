'use client';

import type { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';

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
    <div className="flex items-center gap-3">
      <span className="text-secondary hidden text-sm sm:block">{user.name ?? user.email}</span>
      <button
        onClick={() => signOut({ callbackUrl: '/' })}
        className="border-input text-secondary hover:border-muted hover:text-foreground rounded-lg border px-3 py-1.5 text-sm transition-colors"
      >
        {t('signOut')}
      </button>
    </div>
  );
}
