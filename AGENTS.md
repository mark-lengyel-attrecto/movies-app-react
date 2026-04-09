<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# Project: Movies — TMDB Movies App

> **Claude Code users:** Read `CLAUDE.md` for the full picture — architecture, patterns, styling tokens, and maintenance rules. This file is a condensed summary for any agent.

## Critical Rules

### Navigation — always locale-aware
```ts
// ✅
import { Link, useRouter, usePathname, redirect } from '@/i18n/navigation';

// ❌ — loses the locale prefix
import Link from 'next/link';
import { useRouter } from 'next/navigation';
```
Exceptions: `useSearchParams`, `notFound`, and plain `redirect` still come from `next/navigation`.

### Routing vs logic separation
- `app/` — routing only. Pages are thin shells that import from `features/`.
- `features/` — all domain logic, hooks, and components.
- Never put business logic or data-fetching hooks directly in `app/`.

### State ownership
| Data type | Owner |
|---|---|
| Server data (TMDB API responses) | TanStack Query |
| UI-only state (search input, mobile nav) | Zustand |
| Auth session | Auth.js (`auth()` server-side / `useSession()` client-side) |

### Styling — use semantic color tokens, not raw Tailwind grays
```ts
// ✅
className="bg-base text-foreground border-ui"

// ❌ — breaks dark mode
className="bg-white text-gray-900 border-gray-200"
```
Full token table is in `CLAUDE.md` → Styling section.

### i18n — translations in both locale files
Any new translation key must be added to both `messages/en.json` and `messages/hu.json`.

## Stack (quick ref)
Next.js 16 · TypeScript (strict) · Tailwind CSS v4 · TanStack Query v5 · Zustand · Auth.js v5 · next-intl v4 · ESLint v9 flat config
