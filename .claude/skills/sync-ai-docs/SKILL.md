---
name: sync-ai-docs
description: Sync AI documentation (CLAUDE.md, AGENTS.md, memory files) with recent code changes. Use when the user runs /sync-ai-docs, has just finished writing code manually, has completed a notable feature or refactor, or asks to update/sync the project AI docs.
disable-model-invocation: true
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

## Sync State

- Current HEAD: !`git rev-parse HEAD`
- Last synced commit: !`cat .claude/skills/sync-ai-docs/state 2>/dev/null || echo "(none — first run)"`
- Commits to review: !`LAST=$(cat .claude/skills/sync-ai-docs/state 2>/dev/null | tr -d '[:space:]'); if [ -z "$LAST" ] || [ "$LAST" = "(none" ]; then echo "(no prior sync — showing last 20 commits:)"; git log --oneline -20; else COUNT=$(git rev-list --count "${LAST}..HEAD" 2>/dev/null || echo 0); if [ "$COUNT" = "0" ]; then echo "(already up to date — no new commits since last sync)"; else echo "(${COUNT} new commit(s) since last sync:)"; git log "${LAST}..HEAD" --oneline; fi; fi`

## Your Task

Synchronize all AI documentation files so they accurately reflect the current codebase. Work through these steps in order.

---

### Step 1 — Check if anything needs doing

If the commits list above says "(already up to date)", report that and stop — no further action needed.

---

### Step 2 — Understand the changes

For each commit hash listed above, investigate:

```bash
git show <hash> --stat          # file-level overview of what changed
git show <hash> -- <path>       # full diff for a specific file if needed
```

Classify each commit:
- **Notable** — affects architecture, routes, components, stores, types, shared patterns, dependencies, or docs
- **Trivial** — lint fixes, formatting, minor style tweaks, comment edits (skip these)

Build a mental model of what the project looks like now vs. what the docs describe.

---

### Step 3 — Update CLAUDE.md

File: `CLAUDE.md` (project root)

Make targeted edits — only touch sections that are actually wrong or missing. Do not rewrite unrelated sections.

Check for:
- **Folder structure** — new `src/` directories or notable new files
- **Features section** — new features under `features/`, new components, new hooks
- **Routes** — new pages under `app/[locale]/`
- **Patterns** — new data-fetching, auth, or i18n conventions introduced
- **Stack table** — new tools or libraries added
- **Environment variables** — new `.env` keys
- **Commands** — new npm scripts
- **Header/Mobile sections** — new shared UI components or layout changes
- **Next Steps** — check off completed items, add newly identified future work

---

### Step 4 — Update AGENTS.md

File: `AGENTS.md` (project root)

Only update if changes affect rules that AI agents (not just Claude) need to know — typically Next.js API or routing conventions that differ from what an agent trained before this project would assume.

---

### Step 5 — Update memory files

Memory directory: `C:/Users/user/.claude/projects/c--projects-movies-app-react/memory/`

Update or add memory files for things that:
- Are non-obvious decisions with reasoning (e.g. "we use X instead of Y because...")
- Affect how future AI-assisted work should be approached
- Are architectural facts not derivable by reading the code

Do NOT save things that are already documented in CLAUDE.md or that can be found by reading the source.

When updating MEMORY.md index, keep each entry under ~150 characters.

---

### Step 6 — Save sync state

Write the current HEAD hash to the state file so the next run knows where to start:

1. Run `git rev-parse HEAD` to get the hash
2. Write just the hash (no trailing newline) to `.claude/skills/sync-ai-docs/state`

---

### Step 7 — Report

Summarize concisely:
- How many commits were reviewed
- Which docs were changed and the key update for each
- Which commits were skipped as trivial
