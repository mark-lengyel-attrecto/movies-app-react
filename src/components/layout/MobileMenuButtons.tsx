'use client';

import { useTranslations } from 'next-intl';

import { Menu, Search, X } from 'lucide-react';

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
        {isMobileSearchOpen ? <X size={18} aria-hidden="true" /> : <Search size={18} aria-hidden="true" />}
      </button>
      <button
        onClick={toggleMobileNav}
        aria-label={t(isMobileNavOpen ? 'closeMenu' : 'openMenu')}
        className="text-secondary hover:bg-elevated hover:text-foreground flex h-8 w-8 items-center justify-center rounded-md transition-colors"
      >
        {isMobileNavOpen ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
      </button>
    </div>
  );
}
