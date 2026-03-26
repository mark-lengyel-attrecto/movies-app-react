'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleCredentialsSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsPending(true);

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    setIsPending(false);

    if (result?.error) {
      setError('Invalid email or password');
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-6">
      {/* OAuth Providers */}
      <div className="flex flex-col gap-3">
        <button
          onClick={() => signIn('google', { callbackUrl })}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-600 bg-transparent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/5"
        >
          Sign in with Google
        </button>
        <button
          onClick={() => signIn('github', { callbackUrl })}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-600 bg-transparent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/5"
        >
          Sign in with GitHub
        </button>
      </div>

      <div className="relative flex items-center">
        <div className="flex-grow border-t border-gray-700" />
        <span className="mx-4 flex-shrink text-xs text-gray-500">or continue with email</span>
        <div className="flex-grow border-t border-gray-700" />
      </div>

      {/* Credentials Form */}
      <form onSubmit={handleCredentialsSubmit} className="flex flex-col gap-4">
        {error && (
          <p className="rounded-lg bg-red-900/30 px-4 py-3 text-sm text-red-400">{error}</p>
        )}

        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium text-gray-300">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="rounded-lg border border-gray-600 bg-gray-800 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
            placeholder="you@example.com"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-sm font-medium text-gray-300">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="rounded-lg border border-gray-600 bg-gray-800 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
        >
          {isPending ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
