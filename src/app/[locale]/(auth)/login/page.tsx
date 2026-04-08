import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { LoginForm } from '@/features/auth/components/LoginForm';
import { auth } from '@/lib/auth';

export const metadata: Metadata = { title: 'Sign In' };

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect('/');

  const t = await getTranslations('Auth');

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-sm">
        <h1 className="mb-8 text-center text-2xl font-bold">{t('pageHeading')}</h1>
        <LoginForm />
      </div>
    </div>
  );
}
