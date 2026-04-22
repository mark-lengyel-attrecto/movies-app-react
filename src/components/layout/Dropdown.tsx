'use client';

import { useEffect, useRef, useState } from 'react';

import { Check, ChevronDown } from 'lucide-react';

import { Link } from '@/i18n/navigation';

export interface DropdownItem {
  key: string;
  label: React.ReactNode;
  href?: string;
  onClick?: () => void;
  active?: boolean;
}

interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: 'left' | 'right';
  triggerClassName?: string;
  panelClassName?: string;
}

const itemBase =
  'flex w-full items-center gap-2.5 px-4 py-2 text-sm transition-colors hover:bg-elevated';

export function Dropdown({
  trigger,
  items,
  align = 'left',
  triggerClassName = 'text-secondary hover:bg-elevated hover:text-foreground flex h-8 items-center gap-1.5 rounded-md px-2 text-sm transition-colors',
  panelClassName,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handlePointerDown(e: PointerEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        close();
      }
    }
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
        className={triggerClassName}
      >
        {trigger}
        <ChevronDown
          size={12}
          aria-hidden="true"
          className={`transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div
          className={`bg-surface border-ui absolute top-full z-50 mt-1 overflow-hidden rounded-lg border shadow-lg ${align === 'right' ? 'right-0' : 'left-0'} ${panelClassName ?? ''}`}
        >
          {items.map((item) => {
            const content = (
              <>
                {item.label}
                {item.active && (
                  <Check size={12} aria-hidden="true" className="ml-auto" />
                )}
              </>
            );

            if (item.href) {
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={close}
                  className={`${itemBase} text-secondary hover:text-foreground`}
                >
                  {content}
                </Link>
              );
            }

            return (
              <button
                key={item.key}
                onClick={() => {
                  close();
                  item.onClick?.();
                }}
                className={`${itemBase} ${item.active ? 'text-foreground' : 'text-secondary hover:text-foreground'}`}
              >
                {content}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
