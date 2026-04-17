# Movies — TMDB Movies App

Next.js 16 app for discovering and tracking movies using the TMDB API.
Built as a learning project with production-grade patterns.

> **Maintenance rule:** Whenever a notable change is made to the project — new components, architectural decisions, new patterns, store shape changes, or anything that would affect how future work should be approached — run `/sync-ai-docs` to update this file, `AGENTS.md`, and the memory files. If you wrote code manually without Claude, run `/sync-ai-docs` afterwards to bring all AI docs up to date.
>
> **Companion file:** `AGENTS.md` (project root) is a condensed summary read by any AI agent (not just Claude Code). It mirrors the most critical rules from this file. Keep them in sync — `/sync-ai-docs` handles this automatically.

---

## Stack

| Layer | Tool | Why |
|---|---|---|
| Runtime | Node.js 22.22.0 | LTS — pinned in `.nvmrc` and `package.json#engines` |
| Framework | Next.js 16 (App Router) | File-based routing, Server Components, built-in image/font optimisation |
| Language | TypeScript (strict) | Type safety, autocompletion, catch bugs at compile time |
| Styling | Tailwind CSS v4 | Utility-first, no context-switching, Prettier plugin for class sorting |
| Server state | TanStack Query v5 | Caching, deduplication, loading/error states, pagination |
| Client state | Zustand | Minimal boilerplate, TypeScript-first, `persist` middleware for localStorage |
| Auth | Auth.js v5 (next-auth@beta) | Next.js-native, TMDB credentials provider, JWT sessions |
| i18n | next-intl v4 | URL-prefix routing (`/en/`, `/hu/`), Server + Client Component support |
| Linting | ESLint v9 (flat config) | TypeScript rules, React hooks rules, import sorting, unused import removal |
| Formatting | Prettier + prettier-plugin-tailwindcss | Consistent style, Tailwind class order enforced |

---

## Architecture: Server State vs Client State

The most important mental model for this codebase:

- **Server state** (movie data from TMDB) → **TanStack Query**
  Async, can go stale, needs caching. Fetched via `/api/*` route handlers client-side,
  or directly in Server Components.

- **Client state** (UI — filters, mobile nav, search input) → **Zustand**
  Lives only in the browser. Never touches the server.

- **Auth state** → **Auth.js**
  Session lives in a JWT (server-verified). Read it in Server Components via `auth()`.
  Client components get it via `useSession()` from `next-auth/react`.

**Rule: if data came from a server, TanStack Query owns it. If it's pure UI, Zustand owns it.**

---

## Folder Structure

```
src/
├── app/                  # Next.js routing ONLY — pages should be thin shells
│   ├── [locale]/         # All user-facing routes live under the locale segment
│   │   ├── (auth)/       # Route group — login page
│   │   ├── movies/[id]/  # Dynamic route for movie detail — has error.tsx for TMDB errors
│   │   ├── tv/[id]/      # Dynamic route for TV detail — has error.tsx for TMDB errors (listed below)
│   │   ├── movies/popular/   # Popular movies page
│   │   ├── movies/top-rated/ # Top rated movies page
│   │   ├── movies/upcoming/  # Upcoming movies page
│   │   ├── search/       # Search results page — multi-search (movies + TV), driven by ?q= param
│   │   ├── tv/popular/   # Popular TV shows page
│   │   ├── tv/top-rated/ # Top rated TV shows page
│   │   ├── tv/on-the-air/ # Currently airing TV shows page
│   │   ├── tv/[id]/      # Dynamic route for TV show detail (error.tsx noted above)
│   │   ├── watchlist/    # Auth-protected watchlist page (TMDB-synced)
│   │   ├── [...rest]/    # Catch-all — calls notFound() so locale 404 renders with full layout
│   │   ├── error.tsx     # Locale-level error boundary — catches unhandled errors in any page
│   │   ├── not-found.tsx # Locale-aware 404
│   │   └── layout.tsx    # Root layout — QueryProvider, NextIntlClientProvider, Header/Footer
│   ├── global-error.tsx  # Root error boundary — no providers available, hard-coded English
│   ├── api/auth/         # Auth.js route handler (no locale prefix)
│   ├── api/movies/       # Route handlers for popular, top-rated, upcoming (used by TanStack Query)
│   ├── api/tv/           # Route handlers for tv/popular, tv/top-rated, tv/on-the-air, tv/[id]/season/[season]
│   ├── api/search/       # Multi-search route handler (TMDB /search/multi)
│   └── api/watchlist/    # GET + POST to TMDB account watchlist (requires auth session)
│
├── i18n/
│   ├── routing.ts        # Defines locales (['en', 'hu']) and defaultLocale
│   ├── request.ts        # Loads messages per request for Server Components
│   └── navigation.ts     # Locale-aware Link, useRouter, usePathname, redirect
│
├── features/             # All domain logic lives here
│   ├── movies/
│   │   ├── api/          # TanStack Query hooks — use-popular-movies, use-top-rated-movies, use-upcoming-movies
│   │   └── components/   # PopularPageClient, TopRatedPageClient, UpcomingPageClient
│   ├── tv/
│   │   ├── api/          # use-popular-tv, use-top-rated-tv, use-on-the-air-tv, use-tv-season
│   │   └── components/   # PopularTVPageClient, TopRatedTVPageClient, OnTheAirTVPageClient, SeasonsAccordion
│   ├── search/
│   │   ├── api/          # use-multi-search (TMDB /search/multi — movies + TV, filters out persons)
│   │   └── components/   # SearchPageClient
│   ├── watchlist/
│   │   ├── api/          # use-tmdb-watchlist (query + useToggleWatchlist mutation)
│   │   └── components/   # WatchlistPageClient, WatchlistButton
│   └── auth/
│       ├── components/   # LoginForm, UserMenu
│       └── hooks/        # use-session.ts wrapper
│
├── lib/
│   ├── tmdb/
│   │   ├── client.ts     # TMDBClient class with fetch + image URL helpers
│   │   └── endpoints.ts  # All TMDB API calls as plain async functions (server-only)
│   ├── auth.ts           # Auth.js config (providers, callbacks, session)
│   └── query-client.ts   # QueryClient factory — staleTime, gcTime, retry config
│
├── stores/
│   ├── ui.store.ts       # Search query, genre filter, mobile nav/search open state
│   └── watchlist.store.ts # Persisted watchlist (localStorage via persist middleware)
│
├── components/
│   ├── providers/        # React context providers (QueryProvider)
│   ├── layout/           # Header, Footer, ThemeToggle, HeaderSearch, LocaleSwitcher,
│   │                     # MobileMenuButtons, MobilePanels, MobilePanelsServer, Dropdown, NavDropdown
│   ├── ErrorDisplay.tsx  # Shared error UI (500 card + Try again / Back to home); used by all error.tsx files
│   └── media/            # Shared media display components (cross-feature)
│       ├── MediaCard.tsx # Single card — renders poster, rating, type badge, watchlist badge
│       ├── InfiniteGrid.tsx # Generic infinite-scroll grid — accepts a toMedia adapter; handles scroll restoration on back-navigation
│       ├── WatchlistBadge.tsx # ✓ overlay inside MediaCard; reads useWatchlist cache
│       └── normalize.ts  # NormalizedMedia type + movieToMedia / tvToMedia / multiSearchResultToMedia
│
├── messages/
│   ├── en.json           # English translations
│   └── hu.json           # Hungarian translations
│
└── types/
    ├── tmdb.ts           # Raw TMDB API response types (Movie, MovieDetails, etc.)
    └── next-auth.d.ts    # NextAuth type augmentation — adds sessionId, accountId to Session/User/JWT
```

### Key rule: `app/` is routing, `features/` is logic

A page file (`app/[locale]/movies/popular/page.tsx`) should import from `features/` and do almost nothing else.
All business logic, data fetching hooks, and domain components belong in `features/`.

---

## Data Fetching Patterns

### Server Components (preferred for initial data)
```tsx
// app/[locale]/movies/[id]/page.tsx
export default async function MoviePage() {
  const movie = await getMovieDetails(id); // runs on server, no useEffect
  return <MovieDetail movie={movie} />;
}
```

### TanStack Query hooks (for interactive / client-driven data)
```tsx
// features/search/components/SearchPageClient.tsx  ('use client')
const { data, isPending } = useMultiSearch(query);
```

### Query key conventions
Each hook file exports its own `*Keys` object:
```ts
export const movieKeys = {
  detail: (id: number) => ['movies', 'detail', id] as const,
};
```
This prevents typos and makes targeted cache invalidation explicit.

### Streaming skeletons (loading.tsx)

A `loading.tsx` sibling to a `page.tsx` acts as its automatic Suspense fallback — Next.js streams it instantly while the server awaits data. Use `bg-subtle animate-pulse` for placeholder blocks (the project's semantic skeleton token).

Pages that have `loading.tsx`:
- `movies/[id]/` and `tv/[id]/` — hero bar, poster, meta, genre badges, overview, 8 cast circles
- `movies/popular/`, `movies/top-rated/`, `movies/upcoming/`, `tv/popular/`, `tv/top-rated/`, `tv/on-the-air/` — heading + 20-card grid

The detail pages benefit most (they `await` two TMDB calls). The list pages are synchronous shells so their `loading.tsx` is future-proofing; client-side pending state is handled by `InfiniteGrid`'s own `isPending` skeleton.

### Error boundaries (error.tsx)

Three levels of error boundary exist:

| File | Scope | Notes |
|---|---|---|
| `src/app/global-error.tsx` | Root layout crash | No providers — hard-coded English, inline styles, `window.location.href` for navigation |
| `src/app/[locale]/error.tsx` | Any page under `[locale]/` | Full locale layout available — uses `ErrorDisplay` component with `useTranslations` |
| `src/app/[locale]/movies/[id]/error.tsx` | Movie detail only | Same as above, scoped so `reset()` only retries the detail fetch |
| `src/app/[locale]/tv/[id]/error.tsx` | TV detail only | Same as above |

`ErrorDisplay` (`components/ErrorDisplay.tsx`) is the shared error UI — 500 heading, description, "Try again" + "Back to home" buttons. It reads from the `Error` translation namespace.

**Detail page error contract:** `movies/[id]/page.tsx` and `tv/[id]/page.tsx` distinguish errors:
- TMDB 404 → `.catch` returns `null` → `notFound()` → locale `not-found.tsx`
- Any other error → re-throws → caught by route-level `error.tsx`

---

## Internationalisation (i18n)

Routes are prefixed with the locale: `/en/movies/popular`, `/hu/movies/popular`. The middleware (`src/proxy.ts`) handles detection and redirects.

**Rules:**
- All user-facing pages live under `app/[locale]/`
- `api/` routes stay at the root — no locale prefix
- Always use navigation utilities from `@/i18n/navigation` — never `next/link` or `next/navigation` directly

```tsx
// ✅ Correct — locale-aware
import { Link, useRouter, usePathname, redirect } from '@/i18n/navigation';

// ❌ Wrong — loses locale prefix
import Link from 'next/link';
import { useRouter } from 'next/navigation';
```

- `useSearchParams` and plain `redirect`/`notFound` are exceptions — they still come from `next/navigation`
- The i18n `redirect` from `@/i18n/navigation` takes `{ href, locale }` and is only needed when redirecting to a specific locale explicitly

**Using translations:**
```tsx
// Sync Server Components and Client Components
const t = useTranslations('Popular');

// Async Server Components and generateMetadata
const t = await getTranslations('Popular'); // import from 'next-intl/server'
```

**Page metadata rule:** All locale pages use `generateMetadata` (async function) with `getTranslations` — never `export const metadata` with hard-coded strings. This ensures the browser tab title is locale-aware.
```ts
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Popular');
  return { title: t('heading') };
}
```
`generateMetadata` needs no `params` argument for locale — `next-intl` picks it up from the request context automatically.

Translation files live in `messages/en.json` and `messages/hu.json`. Add new keys to both files.

**Adding a new locale:** add it to the `locales` array in `src/i18n/routing.ts` and create the matching `messages/<locale>.json`.

---

## Auth Patterns

```tsx
// Server Component — read session directly
const session = await auth();

// Client Component — use the hook wrapper
const { user, isAuthenticated } = useSession(); // from features/auth/hooks/use-session.ts
```

Protected routes are handled by the `authorized` callback in `lib/auth.ts`.
Add paths to the `protectedPaths` array in `lib/auth.ts` to require login.

### Session shape

The TMDB `session_id` and `account_id` obtained at login are stored in the JWT via the `jwt` callback and surfaced on `session.user`:

```ts
session.user.sessionId  // string | undefined — TMDB session ID
session.user.accountId  // number | undefined — TMDB account ID
```

**JWT type-narrowing rule:** `JWT` in Auth.js v5 extends `Record<string, unknown>`, so property reads return `unknown`. Never cast — use runtime type guards:

```ts
// ✅ type-safe and handles stale tokens
session.user.sessionId = typeof token.sessionId === 'string' ? token.sessionId : undefined;

// ❌ cast silently passes `unknown` through
session.user.sessionId = token.sessionId as string;
```

---

## Watchlist

The watchlist is **authenticated-only** — the `/watchlist` route is in `protectedPaths`.

| Context | Data source |
|---|---|
| Watchlist page (always authenticated) | TMDB API via `useWatchlist()` |
| `WatchlistButton` on detail pages — authenticated | TMDB API toggle via `useToggleWatchlist()` |
| `WatchlistButton` on detail pages — unauthenticated | Zustand localStorage (`watchlist.store.ts`) |
| `WatchlistBadge` inside `MediaCard` on list pages | `useWatchlist()` cache (no-op when not authenticated) |

**`useWatchlist()` is self-managing** — it calls `useSession()` and `useLocale()` internally; sets `enabled: isAuthenticated` and includes locale in the query key so results are locale-aware. Callers never pass an `enabled` flag or locale.

**Pagination:** The `/api/watchlist` route fetches all pages from TMDB in parallel (page 1 of both movies and TV, then all remaining pages concurrently). The client always receives a complete flat list — no client-side pagination needed.

**`WatchlistButton` props are a discriminated union** — narrow through `props` (not destructured variables) to preserve TypeScript narrowing:
```ts
// ✅ — TypeScript knows props.media is MovieDetails here
if (props.mediaType === 'movie') toggleMovie(toMovie(props.media));

// ❌ — destructuring loses the union relationship
const { mediaType, media } = props;
if (mediaType === 'movie') toggleMovie(media); // media is still MovieDetails | TVSeriesDetails
```

Both `MovieDetails` and `TVSeriesDetails` extend `Omit<Base, 'genre_ids'>`. Reconstruct `genre_ids` before storing in Zustand:
```ts
function toMovie(detail: MovieDetails): Movie {
  return { ...detail, genre_ids: detail.genres.map((g) => g.id) };
}

---

## TV Seasons & Episodes

The TV detail page renders `SeasonsAccordion` (`features/tv/components/SeasonsAccordion.tsx`) between the header block and the cast grid. Each row is a season summary; clicking expands it and lazy-loads episodes via `useTVSeason(showId, seasonNumber, enabled)` against `/api/tv/[id]/season/[season]`.

**Key points:**
- `SeasonEpisodes` is only mounted when a row is open — TanStack Query caches the result keyed by `['tv', 'season', showId, seasonNumber, locale]`, so collapse/re-expand within `staleTime` is free.
- Specials (`season_number === 0`) are filtered out before rendering.
- Per-season TMDB responses are tagged `tv-{id}-season-{n}` with 24h ISR (`getTVSeasonDetails` in `lib/tmdb/endpoints.ts`).
- Episode still images use a new `stillUrl(path, size)` helper in `lib/tmdb/client.ts` (sizes: `w92 | w185 | w300 | original`).
- Translations live under the `TVDetail` namespace: `seasonsHeading`, `episodeNumber`, `episodesError`, `noEpisodes` (plus the existing `episodes` plural form reused for per-season counts).

A dedicated `/tv/[id]/seasons/[season]` route is still on the roadmap for deep-linking (see Next Steps).

---

## Environment Variables

Copy `.env.local.example` to `.env.local` and fill in the values.

| Variable | Required | Description |
|---|---|---|
| `TMDB_ACCESS_TOKEN` | Yes | TMDB v4 Read Access Token |
| `AUTH_SECRET` | Yes | Random secret for JWT signing (`npx auth secret`) |
| `AUTH_URL` | No | Base URL for Auth.js callbacks (defaults to `localhost:3000`) |

---

## Styling

Use Tailwind classes wherever possible. Only fall back to `globals.css` for things Tailwind cannot express.

### Dark / Light Mode

Dark mode uses the `.dark` class on `<html>` (toggled by `ThemeToggle`, persisted in a `theme` cookie, applied server-side in `[locale]/layout.tsx` before render to avoid flash). The `dark:` variant is configured in `globals.css` via `@custom-variant dark`.

**Use semantic color tokens — never raw gray-* classes for theme-aware colors.**
Tokens are defined as CSS custom properties in `:root` / `.dark` and exposed as Tailwind utilities via `@theme inline` in `globals.css`.

| Token | Usage | Light | Dark |
|---|---|---|---|
| `bg-base` | Page background | white | gray-950 |
| `bg-surface` | Header, footer | gray-100 | gray-900 |
| `bg-elevated` | Cards, inputs, badges | gray-100 | gray-800 |
| `bg-subtle` | Skeletons, image placeholders | gray-200 | gray-700 |
| `text-foreground` | Primary text | gray-900 | white |
| `text-secondary` | Secondary / descriptive text | gray-600 | gray-300 |
| `text-muted` | Meta, timestamps, placeholders | gray-500 | gray-400 |
| `border-ui` | UI borders (header, cards) | gray-200 | white/10 |
| `border-input` | Form input borders | gray-300 | gray-600 |
| `bg-error-surface` | Error message background | red-50 | red-900/30 |
| `text-error` | Error message text | red-600 | red-400 |

**Accent colors** are not theme-aware and stay as raw Tailwind classes:
- Accent: `bg-blue-600 hover:bg-blue-700 text-white`
- Rating: `text-yellow-400`
- Overlay: `bg-black/70`

Opacity modifiers work with tokens: `bg-surface/80`, `text-foreground/10`, etc.

---

## Linting

ESLint runs on `.ts` and `.tsx` files via the flat config (`eslint.config.mjs`). Two plugins handle imports automatically on save in VS Code:

- **`eslint-plugin-simple-import-sort`** — sorts imports into groups: React/Next → external packages → `@/` aliases → relative → CSS.
- **`eslint-plugin-unused-imports`** — auto-removes unused imports. Replaces `@typescript-eslint/no-unused-vars` for imports (that rule is turned off to avoid duplicate reports).

VS Code applies both fixes on save via `source.fixAll.eslint` in `.vscode/settings.json`. The ESLint extension must validate `typescriptreact` (already configured) for this to work on `.tsx` files.

---

## Commands

```bash
npm run dev       # Start dev server (Turbopack)
npm run build     # Production build
npm run lint      # ESLint
npm run format    # Prettier (add to package.json scripts: "prettier --write .")
```

```
/sync-ai-docs     # Sync AI docs (CLAUDE.md, AGENTS.md, memory) with commits not yet reviewed
/find-dead-code   # Detect unused files, exports, and dependencies with knip
```

---

## Layout Scroll Container

The root layout uses `<html className="... overflow-hidden h-full">` and `<body className="... h-full overflow-y-auto">`. The **`<body>` is the scroll container**, not the viewport/window.

**Rule: never use `window.scrollY` / `window.scrollTo` for page scroll.** Use `document.body.scrollTop` to read and write the page scroll position instead. `window.scrollY` always returns `0` in this layout.

`InfiniteGrid` uses this when saving and restoring scroll position via `sessionStorage` on back-navigation.

---

## Header Navigation

The desktop nav (`hidden md:flex`) uses two shared primitives:

- **`Dropdown`** — generic dropdown shell. Accepts `trigger` (ReactNode rendered inside the toggle button), `items` (`DropdownItem[]`), `align`, `triggerClassName`, `panelClassName`. Items with `href` render as `<Link>`, items with `onClick` render as `<button>`. Active items get a checkmark. Closes on outside click via a `pointerdown` listener (not a backdrop overlay — the backdrop approach fails inside the sticky header's stacking context).
- **`NavDropdown`** — thin wrapper around `Dropdown` for nav links. When `items.length === 1` it skips the dropdown entirely and renders the item directly as a `<Link>` with the same button styling, so single-destination items stay visually consistent without an unnecessary chevron.
- **`UserMenu`** — when authenticated, renders a `Dropdown` with the user's name as trigger (`align="right"`), containing a Watchlist link and Sign out button. When unauthenticated, renders a Sign in link.

All nav trigger buttons share the same base: `h-8 rounded-md px-2 hover:bg-elevated` — this is the default `triggerClassName` in `Dropdown`.

---

## Mobile Header

On mobile (`< md`) the header collapses to: **logo — locale — theme — search icon — hamburger**.

- `MobileMenuButtons` — renders the two icon buttons (search + hamburger), `md:hidden`. Toggling one closes the other via Zustand (`isMobileSearchOpen`, `isMobileNavOpen` in `ui.store.ts`).
- `MobilePanels` (client) + `MobilePanelsServer` (server wrapper) — rendered as a `fixed top-16` sibling of `<Header>` in the locale layout, **not inside `<header>`**. This is intentional: placing it outside the sticky header's stacking context allows `backdrop-blur-sm` to work correctly on the panels. The panels overlap page content without pushing it down.
- The nav panel closes on route change. The search panel stays open while the user is searching.
- On mobile, the user's name, Watchlist link, and Sign out are in the nav panel under a user section heading — `UserMenu` is `hidden md:block`.
- On desktop, `UserMenu` renders a `Dropdown` with the user's name as trigger, containing Watchlist and Sign out items.
- `HeaderSearch` accepts an optional `className` prop to override `max-w-xs` (used by the mobile panel to go full-width) and `autoFocus` to focus on mount.
- **Watchlist nav link** lives inside the `UserMenu` dropdown on desktop and the nav panel on mobile — it is not a standalone `NavDropdown` in the header nav.

---

## Next Steps

- [ ] Add dedicated TV season/episode pages (`/tv/[id]/seasons/[season]`) — episodes are currently shown via the inline `SeasonsAccordion` on the TV detail page; a standalone route would enable deep-linking to a season
- [ ] Display app version in Footer — push a semver git tag before deploying (`git tag v1.x.x && git push origin v1.x.x`), then read `NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF` at build time; fall back to `'dev'` locally
- [ ] Upgrade ESLint 9 → 10 — check flat config API changes and `eslint-plugin-simple-import-sort` v13 compatibility at the same time (the `@typescript-eslint` peer dep conflict also resolves here)
- [ ] Upgrade TypeScript 5 → 6 — isolate in its own PR; fix any new strict type errors before merging
