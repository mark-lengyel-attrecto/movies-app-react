'use client';

import { useRef, useState } from 'react';
import { useLocale } from 'next-intl';
import GB from 'country-flag-icons/react/3x2/GB';
import HU from 'country-flag-icons/react/3x2/HU';

import { routing } from '@/i18n/routing';
import { usePathname, useRouter } from '@/i18n/navigation';
import { FlagComponent } from 'country-flag-icons/react/3x2';


const localeConfig: Record<string, { label: string; Flag: FlagComponent }> = {
  en: { label: 'English', Flag: GB },
  hu: { label: 'Magyar', Flag: HU },
};

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  function switchLocale(next: string) {
    setOpen(false);
    if (next !== locale) router.replace(pathname, { locale: next });
  }

  const current = localeConfig[locale];

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setOpen((o) => !o)}
        className="flex h-8 items-center gap-1.5 rounded-md px-2 text-sm text-secondary transition-colors hover:bg-elevated hover:text-foreground"
      >
        <current.Flag className="h-4 w-5 rounded-sm" />
        <span className="hidden sm:inline">{current.label}</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={`transition-transform ${open ? 'rotate-180' : ''}`}>
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-50 mt-1 min-w-32 overflow-hidden rounded-lg border border-ui bg-surface shadow-lg">
            {routing.locales.map((l) => {
              const { label, Flag } = localeConfig[l];
              return (
                <button
                  key={l}
                  onClick={() => switchLocale(l)}
                  className={`flex w-full items-center gap-2.5 px-3 py-2 text-sm transition-colors hover:bg-elevated ${l === locale ? 'text-foreground' : 'text-secondary'}`}
                >
                  <Flag className="h-4 w-5 rounded-sm" />
                  <span>{label}</span>
                  {l === locale && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="ml-auto">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
