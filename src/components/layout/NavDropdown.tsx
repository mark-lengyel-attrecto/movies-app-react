'use client';

import { Dropdown } from '@/components/layout/Dropdown';
import { Link } from '@/i18n/navigation';

interface NavDropdownProps {
  label: string;
  items: { href: string; label: string }[];
}

const triggerCls =
  'text-secondary hover:bg-elevated hover:text-foreground flex h-8 items-center gap-1.5 rounded-md px-2 text-sm transition-colors';

export function NavDropdown({ label, items }: NavDropdownProps) {
  if (items.length === 1) {
    return (
      <Link href={items[0].href} className={triggerCls}>
        {label}
      </Link>
    );
  }

  return (
    <Dropdown
      trigger={label}
      items={items.map((item) => ({ key: item.href, href: item.href, label: item.label }))}
      panelClassName="min-w-[140px]"
    />
  );
}
