import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'hu'],
  defaultLocale: 'en',
});

const tmdbLanguageMap: Record<string, string> = {
  en: 'en-US',
  hu: 'hu-HU',
};

export function localeToTmdb(locale: string): string {
  return tmdbLanguageMap[locale] ?? 'en-US';
}
