import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { LoginForm } from '@/features/auth/components/LoginForm';
import { auth } from '@/lib/auth';

export const metadata: Metadata = { title: 'Sign In' };

export default async function LoginPage() {
  const session = await auth();
  // Already logged in — send them home
  if (session?.user) redirect('/');

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-sm">
        <h1 className="mb-8 text-center text-2xl font-bold">Sign in to Movies</h1>
        <LoginForm />
      </div>
    </div>
  );
}
