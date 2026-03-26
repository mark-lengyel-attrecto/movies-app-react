# Movies App

A Next.js app for discovering movies, powered by the [TMDB API](https://www.themoviedb.org/).

**Live demo:** https://movies-app-react-one.vercel.app/

## Stack

- **Next.js 16** (App Router) — routing, Server Components
- **TanStack Query v5** — server state, caching, and data fetching
- **Zustand** — client UI state and persisted watchlist
- **Auth.js v5** — authentication (Google, GitHub, Credentials)
- **Tailwind CSS v4** — styling

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

```bash
cp .env.local.example .env.local
```

Fill in the values:

| Variable | Where to get it |
|---|---|
| `TMDB_ACCESS_TOKEN` | [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api) → API Read Access Token |
| `AUTH_SECRET` | Run `npx auth secret` |
| `GOOGLE_CLIENT_ID/SECRET` | [Google Cloud Console](https://console.cloud.google.com) (optional) |
| `GITHUB_CLIENT_ID/SECRET` | [GitHub OAuth Apps](https://github.com/settings/applications/new) (optional) |

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Scripts

```bash
npm run dev          # Development server (Turbopack)
npm run build        # Production build
npm run lint         # ESLint
npm run format       # Prettier
npm run format:check # Prettier check (CI)
```

---

## Deployment

Deploy on [Vercel](https://vercel.com) — import the repository and set the environment variables in the dashboard. No configuration needed.
