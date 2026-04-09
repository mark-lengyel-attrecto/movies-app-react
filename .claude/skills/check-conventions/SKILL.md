---
name: check-conventions
description: Audit the codebase for project-specific convention violations. Use when the user runs /check-conventions or asks to validate that the code follows project conventions.
allowed-tools: Grep, Read, Glob
---

## Convention Audit

Scan results are pre-populated below. Review each category, then report findings.

---

### 1. Locale-aware navigation

All navigation must import from `@/i18n/navigation`, not `next/link` or `next/navigation`.

Allowed exceptions from `next/navigation`: `useSearchParams`, `notFound`, and `redirect` in `src/app/[locale]/page.tsx` only (the root redirect).

Scan results:
!`grep -rn "from 'next/link'\|from \"next/link\"" src/ --include="*.tsx" --include="*.ts" 2>/dev/null || echo "(none)"`
!`grep -rn "from 'next/navigation'\|from \"next/navigation\"" src/ --include="*.tsx" --include="*.ts" 2>/dev/null || echo "(none)"`

---

### 2. Semantic color tokens

Theme-aware colors must use semantic tokens — never raw `gray-*` classes. Violating this breaks dark mode.

Valid tokens: `bg-base`, `bg-surface`, `bg-elevated`, `bg-subtle`, `text-foreground`, `text-secondary`, `text-muted`, `border-ui`, `border-input`, `bg-error-surface`, `text-error`.

Scan results:
!`grep -rn "bg-gray-\|text-gray-\|border-gray-" src/ --include="*.tsx" --include="*.ts" 2>/dev/null || echo "(none)"`

---

### 3. Business logic in app/ routes

Pages in `src/app/[locale]/` must be thin shells. TanStack Query hooks, Zustand hooks, and data-fetching logic belong in `features/` only.

Scan results:
!`grep -rn "useQuery\|useMutation\|useInfiniteQuery\|useUIStore\|useWatchlistStore" src/app/ --include="*.tsx" 2>/dev/null || echo "(none)"`

---

### 4. Next.js Image `fill` without `sizes`

Every `<Image fill` must also have a `sizes` prop — omitting it causes a console warning and poor LCP.

Scan results:
!`grep -rn "fill" src/ --include="*.tsx" 2>/dev/null || echo "(none)"`

---

## Instructions

For each category above:
- If no violations: mark it **Pass**
- If violations found: list the file and line, explain what's wrong, and show the correct fix

For category 4 (fill/sizes), grep for all `fill` occurrences in Image components and check whether `sizes` is also present in the same component — they may be on different lines, so read the surrounding context if needed.
