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

### Shared media display components — do not duplicate
Card and grid UI for movies, TV, and search results live in `components/media/`, not in feature folders.

- **`InfiniteGrid<T>`** — infinite-scroll grid. Pass a `toMedia` adapter; it handles flattening, dedup, skeletons, and the intersection observer.
- **`MediaCard`** — single card rendered by the grid. Renders rating, type, and watchlist badges internally. No direct instantiation needed.
- **`WatchlistBadge`** — rendered inside `MediaCard`; reads `useWatchlist()` cache. Do not add it elsewhere.
- **`normalize.ts`** — exports `movieToMedia`, `tvToMedia`, `multiSearchResultToMedia`.

When adding a new list page, wire it like this — do NOT create new card or grid files:
```tsx
import { InfiniteGrid } from '@/components/media/InfiniteGrid';
import { movieToMedia } from '@/components/media/normalize';

<InfiniteGrid data={data} toMedia={movieToMedia} fetchNextPage={…} … />
```

### Watchlist — authenticated users only
- Route `/watchlist` is auth-protected; TMDB API backs the data.
- `useWatchlist()` self-manages `enabled` via `useSession()` — never pass an `enabled` arg.
- `WatchlistButton` accepts a discriminated union prop — narrow through `props`, not destructured variables, to preserve TypeScript type narrowing.

### Error boundaries — do not add `.catch(() => null)` on detail pages
Detail pages (`movies/[id]`, `tv/[id]`) distinguish TMDB 404s from real errors:
- 404 → `.catch` returns `null` → `notFound()` (renders `not-found.tsx`)
- Other errors → re-throw → caught by route-level `error.tsx`

Do not swallow non-404 errors with `.catch(() => null)` — they must reach the error boundary.

### i18n — translations in both locale files
Any new translation key must be added to both `messages/en.json` and `messages/hu.json`.

### Shared detail-page components — do not duplicate
Hero backdrop and cast avatar grid are shared across all detail pages (movie, TV, episode):

- **`Hero`** (`components/Hero.tsx`) — full-bleed backdrop image with bottom gradient. Used on movie detail, TV detail, season, and episode pages. Pass `src` + `alt`.
- **`CastGrid`** (`components/CastGrid.tsx`) — avatar grid for cast, crew, or guest stars. Accepts `cast: CastMember[]` and optional `limit`. Used on movie detail, TV detail, and episode detail.

Never recreate these in a new detail page.

## Stack (quick ref)
Node.js 22.22.0 · Next.js 16 · TypeScript v6 (strict) · Tailwind CSS v4 · TanStack Query v5 · Zustand · Auth.js v5 · next-intl v4 · ESLint v9 flat config · lucide-react (icons)
