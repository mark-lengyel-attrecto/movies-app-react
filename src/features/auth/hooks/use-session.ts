'use client';

import { useSession as useNextAuthSession } from 'next-auth/react';

// Thin wrapper so feature code doesn't import from next-auth directly.
// Swap the underlying implementation here without touching feature code.
export function useSession() {
  const { data: session, status } = useNextAuthSession();

  return {
    user: session?.user ?? null,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
  };
}
