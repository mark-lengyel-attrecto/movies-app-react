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
| Auth | Auth.js v5 (next-auth@beta) | Next.js-native, handles OAuth + credentials, JWT sessions |
| Linting | ESLint v9 (flat config) | TypeScript rules, React hooks rules, import sorting |
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
│   ├── (auth)/           # Route group — shares no layout with main app
│   ├── movies/[id]/      # Dynamic route for movie detail
│   ├── api/auth/         # Auth.js route handler
│   └── layout.tsx        # Root layout with QueryProvider + Header/Footer
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
│   │   └── endpoints.ts  # All TMDB API calls as plain async functions
│   ├── auth.ts           # Auth.js config (providers, callbacks, session)
│   └── query-client.ts   # QueryClient factory — staleTime, gcTime, retry config
│
├── stores/
│   ├── ui.store.ts       # Search query, genre filter, mobile nav state
│   └── watchlist.store.ts # Persisted watchlist (localStorage via persist middleware)
│
├── components/
│   ├── providers/        # React context providers (QueryProvider)
│   └── layout/           # Header, Footer — shared across all pages
│
└── types/
    └── tmdb.ts           # Raw TMDB API response types (Movie, MovieDetails, etc.)
```

### Key rule: `app/` is routing, `features/` is logic

A page file (`app/movies/page.tsx`) should import from `features/` and do almost nothing else.
All business logic, data fetching hooks, and domain components belong in `features/`.

---

## Data Fetching Patterns

### Server Components (preferred for initial data)
```tsx
// app/movies/page.tsx
export default async function MoviesPage() {
  const { results } = await getPopularMovies(); // runs on server, no useEffect
  return <MovieGrid movies={results} />;
}
```

### TanStack Query hooks (for interactive / client-driven data)
```tsx
// features/movies/components/SearchPageClient.tsx  ('use client')
const { data, isPending } = useSearchMovies(debouncedQuery);
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

## Auth Patterns

```tsx
// Server Component — read session directly
const session = await auth();

// Client Component — use the hook wrapper
const { user, isAuthenticated } = useSession(); // from features/auth/hooks/use-session.ts
```

Protected routes are handled by the `authorized` callback in `lib/auth.ts` + `middleware.ts`.
Add paths to the `protectedPaths` array in `lib/auth.ts` to require login.

---

## Environment Variables

Copy `.env.local.example` to `.env.local` and fill in the values.

| Variable | Required | Description |
|---|---|---|
| `TMDB_ACCESS_TOKEN` | Yes | TMDB v4 Read Access Token |
| `AUTH_SECRET` | Yes | Random secret for JWT signing (`npx auth secret`) |
| `GOOGLE_CLIENT_ID/SECRET` | No | Google OAuth |
| `GITHUB_CLIENT_ID/SECRET` | No | GitHub OAuth |

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

- [ ] Add API route handlers (`app/api/movies/`) so client-side TanStack Query hooks work
- [ ] Add a real database (Prisma + PostgreSQL) for user accounts and server-side watchlist
- [ ] Add `loading.tsx` files next to pages for streaming skeleton UIs
- [ ] Add `error.tsx` files for per-route error boundaries
- [ ] Add pagination to the movies list
- [ ] Add genre filtering using `useUIStore`
