'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { useDebounce } from 'use-debounce';

import { usePathname, useRouter } from '@/i18n/navigation';

export function HeaderSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations('Search');

  const [input, setInput] = useState(searchParams.get('q') ?? '');
  const [debouncedQuery] = useDebounce(input, 400);
  const originRef = useRef<string | null>(null);

  useEffect(() => {
    setInput(searchParams.get('q') ?? '');
  }, [searchParams]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    if (!input && value && pathname !== '/search') {
      originRef.current = pathname;
    }
    setInput(value);
  }

  useEffect(() => {
    if (!debouncedQuery) {
      if (pathname !== '/search') return;
      router.push(originRef.current ?? '/');
      originRef.current = null;
      return;
    }

    const url = `/search?q=${encodeURIComponent(debouncedQuery)}`;

    if (pathname === '/search') {
      router.replace(url, { scroll: false });
    } else {
      router.push(url);
    }
  }, [debouncedQuery]);

  return (
    <input
      type="search"
      value={input}
      onChange={handleChange}
      placeholder={t('placeholder')}
      className="w-full max-w-xs rounded-lg border border-input bg-elevated px-3 py-1.5 text-sm text-foreground placeholder-gray-400 focus:border-blue-500 focus:outline-none"
    />
  );
}
