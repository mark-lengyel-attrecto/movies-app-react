'use client';

import { useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { useDebouncedCallback } from 'use-debounce';

import { usePathname, useRouter } from '@/i18n/navigation';

export function HeaderSearch({
  className,
  autoFocus,
}: {
  className?: string;
  autoFocus?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations('Search');

  const urlQuery = searchParams.get('q') ?? '';
  const [input, setInput] = useState(urlQuery);
  const [prevUrlQuery, setPrevUrlQuery] = useState(urlQuery);
  const [isFocused, setIsFocused] = useState(false);
  const originRef = useRef<string | null>(null);
  const isSearchPage = pathname === '/search';

  if (!isFocused && urlQuery !== prevUrlQuery) {
    setPrevUrlQuery(urlQuery);
    setInput(urlQuery);
  }

  const navigate = useDebouncedCallback((query: string) => {
    if (!query) {
      if (!isSearchPage) return;
      router.push(originRef.current ?? '/');
      originRef.current = null;
      setInput('');
      return;
    }

    const url = `/search?q=${encodeURIComponent(query)}`;
    if (isSearchPage) {
      router.replace(url, { scroll: false });
    } else {
      router.push(url);
    }
  }, 400);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    if (!input && value && !isSearchPage) {
      originRef.current = pathname;
    }
    setInput(value);
    navigate(value);
  }

  return (
    <input
      type="search"
      value={input}
      onChange={handleChange}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      placeholder={t('placeholder')}
      autoFocus={autoFocus}
      className={`border-input bg-elevated text-foreground w-full rounded-lg border px-3 py-1.5 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none ${className ?? 'max-w-xs'}`}
    />
  );
}
