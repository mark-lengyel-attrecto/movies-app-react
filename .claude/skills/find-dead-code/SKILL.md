---
name: find-dead-code
description: Detect unused files, exports, and dependencies with knip. Use when the user runs /find-dead-code or asks to find dead code, unused exports, or unused dependencies.
disable-model-invocation: true
allowed-tools: Bash, Read, Glob, Grep
---

## Dead Code Report

knip v5 scan results (auto-detects Next.js entry points — pages, layouts, API routes, middleware are not flagged):

!`npx knip@5 --no-color 2>&1 || echo "(knip exited with errors — see output above)"`

---

## Node Version Note

!`node --version`

> knip@6+ requires Node ≥20.19. If the Node version above is older, the skill pins to knip@5 automatically.

---

## Instructions

Analyse the knip output above and produce a structured report with three sections. For each finding, say what it is, whether it looks like real dead code or a false positive, and what action to take.

---

### Section 1 — Unused Files

Files that are never imported by any other module. These are the highest-priority findings.

**Known false-positive patterns for this project — skip these:**
- Files under `src/app/` (Next.js entry points — pages, layouts, route handlers, middleware)
- `src/proxy.ts` / `src/middleware.ts` (Next.js middleware, auto-executed)
- Test files (`*.test.ts`, `*.spec.ts`)

For each real unused file: name it, describe what it contains, and recommend deleting it or wiring it up.

---

### Section 2 — Unused Exports

Named exports that no other module imports. These are lower priority — the file itself is live, but the export is dead weight.

**Known false-positive patterns for this project — skip these:**
- `signIn` / `signOut` re-exports from `src/lib/auth.ts` — used by Auth.js internally via the `auth` config object
- Query key objects (`*Keys`) — these are exported for cache invalidation and may not show up in static analysis
- `redirect` from `src/i18n/navigation.ts` — re-exported from next-intl, may be used conditionally

For each real unused export: name it, show the file:line, and recommend either removing the export or deleting the function/type entirely if nothing else in the file is used.

---

### Section 3 — Unlisted / Unused Dependencies

**Unlisted** = used in code but not declared in `package.json` (transitive dep leak — fragile).
**Unused** = declared in `package.json` but never imported in the scanned source.

**Known false-positive patterns for this project — skip these:**
- `postcss` unlisted — it's a peer dependency of `@tailwindcss/postcss`, not needed as a direct dep

For each real finding: name the package, show where it is/isn't used, and recommend adding it explicitly or removing it.

---

### Summary

End with a concise punch list:
- **Delete** — files/exports that are clearly dead
- **Investigate** — findings that might be false positives requiring a closer look
- **Skip** — confirmed false positives and why
