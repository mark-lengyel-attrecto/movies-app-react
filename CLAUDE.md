# Movies — TMDB Movies App

Next.js 16 app for discovering and tracking movies using the TMDB API.
Built as a learning project with production-grade patterns.

---

## Stack

| Layer | Tool | Why |
|---|---|---|
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
│   │   ├── movies/[id]/  # Dynamic route for movie detail
│   │   ├── popular/      # Popular movies page
│   │   ├── search/       # Search results page (driven by ?q= param)
│   │   ├── top-rated/    # Top rated movies page
│   │   ├── [...rest]/    # Catch-all — calls notFound() so locale 404 renders with full layout
│   │   ├── not-found.tsx # Locale-aware 404
│   │   └── layout.tsx    # Root layout — QueryProvider, NextIntlClientProvider, Header/Footer
│   ├── api/auth/         # Auth.js route handler (no locale prefix)
│   └── api/movies/       # Route handlers for popular, top-rated, search (used by TanStack Query)
│
├── i18n/
│   ├── routing.ts        # Defines locales (['en', 'hu']) and defaultLocale
│   ├── request.ts        # Loads messages per request for Server Components
│   └── navigation.ts     # Locale-aware Link, useRouter, usePathname, redirect
│
├── features/             # All domain logic lives here
│   ├── movies/
│   │   ├── api/          # TanStack Query hooks (use-*.ts)
│   │   ├── components/   # Movie-specific UI components
│   │   └── types.ts      # UI-level types (not raw TMDB API types)
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
│   ├── ui.store.ts       # Search query, genre filter, mobile nav state
│   └── watchlist.store.ts # Persisted watchlist (localStorage via persist middleware)
│
├── components/
│   ├── providers/        # React context providers (QueryProvider)
│   └── layout/           # Header, Footer, ThemeToggle, HeaderSearch, LocaleSwitcher
│
├── messages/
│   ├── en.json           # English translations
│   └── hu.json           # Hungarian translations
│
└── types/
    └── tmdb.ts           # Raw TMDB API response types (Movie, MovieDetails, etc.)
```

### Key rule: `app/` is routing, `features/` is logic

A page file (`app/[locale]/popular/page.tsx`) should import from `features/` and do almost nothing else.
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
// features/movies/components/SearchPageClient.tsx  ('use client')
const { data, isPending } = useSearchMovies(query);
```

### Query key conventions
Each hook file exports its own `*Keys` object:
```ts
export const movieKeys = {
  detail: (id: number) => ['movies', 'detail', id] as const,
};
```
This prevents typos and makes targeted cache invalidation explicit.

---

## Internationalisation (i18n)

Routes are prefixed with the locale: `/en/popular`, `/hu/popular`. The middleware (`src/proxy.ts`) handles detection and redirects.

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

---

## Next Steps

- [ ] Add a real database (Prisma + PostgreSQL) for user accounts and server-side watchlist
- [ ] Add `loading.tsx` files next to pages for streaming skeleton UIs
- [ ] Add `error.tsx` files for per-route error boundaries
- [ ] Add genre filtering using `useUIStore`
