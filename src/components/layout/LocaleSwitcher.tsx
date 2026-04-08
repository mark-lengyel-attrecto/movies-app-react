'use client';

import { useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';

import type { FlagComponent } from 'country-flag-icons/react/3x2';
import GB from 'country-flag-icons/react/3x2/GB';
import HU from 'country-flag-icons/react/3x2/HU';

import { Dropdown } from '@/components/layout/Dropdown';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

const localeConfig: Record<string, { label: string; Flag: FlagComponent }> = {
  en: { label: 'English', Flag: GB },
  hu: { label: 'Magyar', Flag: HU },
};

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { label, Flag } = localeConfig[locale];

  return (
    <Dropdown
      trigger={
        <>
          <Flag className="h-4 w-5 rounded-sm" />
          <span className="hidden sm:inline">{label}</span>
        </>
      }
      items={routing.locales.map((l) => {
        const { label: lLabel, Flag: LFlag } = localeConfig[l];
        return {
          key: l,
          label: (
            <>
              <LFlag className="h-4 w-5 rounded-sm" />
              <span>{lLabel}</span>
            </>
          ),
          onClick: () => {
            if (l !== locale) {
              const query = searchParams.toString();
              router.replace(`${pathname}${query ? `?${query}` : ''}`, { locale: l });
            }
          },
          active: l === locale,
        };
      })}
      align="right"
panelClassName="min-w-32"
    />
  );
}
