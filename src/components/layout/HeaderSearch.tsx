'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { useDebouncedCallback } from 'use-debounce';

import { usePathname, useRouter } from '@/i18n/navigation';

export function HeaderSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations('Search');

  const urlQuery = searchParams.get('q') ?? '';
  const [input, setInput] = useState(urlQuery);
  const originRef = useRef<string | null>(null);
  const isSearchPage = pathname === '/search';

  useEffect(() => {
    setInput(urlQuery);
  }, [urlQuery]);

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
      placeholder={t('placeholder')}
      className="border-input bg-elevated text-foreground w-full max-w-xs rounded-lg border px-3 py-1.5 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none"
    />
  );
}
