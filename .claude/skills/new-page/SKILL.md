---
name: new-page
description: Add a new page to the app following project conventions. Use when the user runs /new-page or asks to create a new route or page.
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

## Add a New Page

Create a new page following the project's established patterns. Work through these steps in order.

### Context

Current routes:
!`find src/app -name "page.tsx" | sort`

Current feature domains:
!`ls src/features/`

---

### Step 1 — Clarify requirements

If the user hasn't specified the following, ask before writing any code:
- **Route path** — where will the page live? (e.g. `movies/popular`, `tv/[id]`)
- **Feature domain** — which feature does this belong to? (`movies`, `tv`, `search`, or a new one?)
- **Data** — client-driven with TanStack Query, or a static/server-only page?
- **Nav entry** — does it need a link in the header?

---

### Step 2 — Create the route shell

Create `src/app/[locale]/<route>/page.tsx` as a thin shell:
- For client-driven pages: import and render the `<Name>PageClient` component from `features/`
- Add `generateMetadata` for the page title using `getTranslations` from `next-intl/server`
- No hooks, no data fetching, no business logic — routing only

---

### Step 3 — Create the feature component (if client-driven)

Create `src/features/<domain>/components/<PageName>PageClient.tsx` with `'use client'` at the top.

- If the page lists items with infinite scroll, follow the pattern from `InfiniteMovieGrid` or `InfiniteTVGrid`
- If it's a detail page, follow `MovieDetail` or the TV detail component

Skip this step for pure server-rendered pages with no interactivity.

---

### Step 4 — Create a TanStack Query hook (if needed)

In `src/features/<domain>/api/use-<resource>.ts`:
- Export a `<resource>Keys` object with typed query key factories
- Follow the hook pattern from existing hooks in the same domain (staleTime, error handling, etc.)

---

### Step 5 — Add translations

Add a namespace for this page to **both** `messages/en.json` and `messages/hu.json`.
Minimum: a `title` key consumed by `generateMetadata`. Add any other UI strings the component needs.

---

### Step 6 — Update Header nav (if needed)

If the page needs a nav entry, update `src/components/layout/Header.tsx`:
- Add to an existing `NavDropdown` `items` array, or add a new `NavDropdown`
- Nav `href` values are locale-relative paths (e.g. `/movies/popular`) — the locale prefix is added automatically

---

### Step 7 — Verify

Run `npm run lint` and fix any issues before reporting done.
