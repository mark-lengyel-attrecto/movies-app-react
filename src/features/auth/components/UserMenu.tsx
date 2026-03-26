'use client';

import Link from 'next/link';
import type { Session } from 'next-auth';
import { signOut } from 'next-auth/react';

interface UserMenuProps {
  user: Session['user'] | null;
}

export function UserMenu({ user }: UserMenuProps) {
  if (!user) {
    return (
      <Link
        href="/login"
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
      >
        Sign in
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="hidden text-sm text-gray-300 sm:block">{user.name ?? user.email}</span>
      <button
        onClick={() => signOut({ callbackUrl: '/' })}
        className="rounded-lg border border-gray-600 px-3 py-1.5 text-sm text-gray-300 transition-colors hover:border-gray-400 hover:text-white"
      >
        Sign out
      </button>
    </div>
  );
}
