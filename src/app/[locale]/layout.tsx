import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import { cookies } from 'next/headers';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { routing } from '@/i18n/routing';

import '../globals.css';

const geist = Geist({
  variable: '--font-geist',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Movies',
    template: '%s | Movies',
  },
  description: 'Discover and track movies powered by TMDB',
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as 'en' | 'hu')) notFound();

  const [messages, cookieStore] = await Promise.all([getMessages(), cookies()]);
  const isDark = cookieStore.get('theme')?.value === 'dark';

  return (
    <html lang={locale} className={`${geist.variable} h-full overflow-hidden antialiased${isDark ? ' dark' : ''}`}>
      <body className="flex h-full flex-col overflow-x-clip overflow-y-auto bg-base text-foreground">
        <NextIntlClientProvider messages={messages}>
          <QueryProvider>
            <Header />
            <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
              {children}
            </main>
            <Footer />
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
