'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? '/';
  const t = useTranslations('Auth');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    setError(null);
    setIsPending(true);

    const result = await signIn('tmdb', { username, password, redirect: false });

    setIsPending(false);

    if (result?.error) {
      setError(t('error'));
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && <p className="bg-error-surface text-error rounded-lg px-4 py-3 text-sm">{error}</p>}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="username" className="text-foreground text-sm font-medium">
          {t('usernameLabel')}
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="border-input bg-elevated text-foreground rounded-lg border px-4 py-2.5 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none"
          placeholder={t('usernamePlaceholder')}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-foreground text-sm font-medium">
          {t('passwordLabel')}
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border-input bg-elevated text-foreground rounded-lg border px-4 py-2.5 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none"
          placeholder={t('passwordPlaceholder')}
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
      >
        {isPending ? t('submitting') : t('submitButton')}
      </button>
    </form>
  );
}
