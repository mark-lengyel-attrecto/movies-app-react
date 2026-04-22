'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import { Moon, Sun } from 'lucide-react';

type Theme = 'light' | 'dark';

function setThemeCookie(theme: Theme) {
  document.cookie = `theme=${theme};path=/;max-age=31536000;SameSite=Lax`;
}

export function ThemeToggle({ initialTheme }: { initialTheme: Theme }) {
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const t = useTranslations('ThemeToggle');

  function toggle() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    setThemeCookie(next);
    document.documentElement.classList.toggle('dark', next === 'dark');
  }

  if (theme === null) return <div className="h-8 w-8" />;

  return (
    <button
      onClick={toggle}
      aria-label={theme === 'dark' ? t('toLight') : t('toDark')}
      className="text-secondary hover:bg-elevated hover:text-foreground flex h-8 w-8 items-center justify-center rounded-md transition-colors"
    >
      {theme === 'dark' ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
    </button>
  );
}
