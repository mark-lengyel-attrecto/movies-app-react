'use client';

import { useTranslations } from 'next-intl';

import { useUIStore } from '@/stores/ui.store';

export function MobileMenuButtons() {
  const t = useTranslations('Header');
  const { isMobileSearchOpen, toggleMobileSearch, isMobileNavOpen, toggleMobileNav } =
    useUIStore();

  return (
    <div className="flex items-center gap-1 md:hidden">
      <button
        onClick={toggleMobileSearch}
        aria-label={t(isMobileSearchOpen ? 'closeSearch' : 'openSearch')}
        className="text-secondary hover:bg-elevated hover:text-foreground flex h-8 w-8 items-center justify-center rounded-md transition-colors"
      >
        {isMobileSearchOpen ? <XIcon /> : <SearchIcon />}
      </button>
      <button
        onClick={toggleMobileNav}
        aria-label={t(isMobileNavOpen ? 'closeMenu' : 'openMenu')}
        className="text-secondary hover:bg-elevated hover:text-foreground flex h-8 w-8 items-center justify-center rounded-md transition-colors"
      >
        {isMobileNavOpen ? <XIcon /> : <MenuIcon />}
      </button>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}
