'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { useDebounce } from 'use-debounce';

export function HeaderSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [input, setInput] = useState(searchParams.get('q') ?? '');
  const [debouncedQuery] = useDebounce(input, 400);

  useEffect(() => {
    setInput(searchParams.get('q') ?? '');
  }, [searchParams]);

  useEffect(() => {
    if (!debouncedQuery && pathname !== '/search') return;

    const url = debouncedQuery ? `/search?q=${encodeURIComponent(debouncedQuery)}` : '/search';

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
      onChange={(e) => setInput(e.target.value)}
      placeholder="Search movies…"
      className="w-full max-w-xs rounded-lg border border-input bg-elevated px-3 py-1.5 text-sm text-foreground placeholder-gray-400 focus:border-blue-500 focus:outline-none"
    />
  );
}
