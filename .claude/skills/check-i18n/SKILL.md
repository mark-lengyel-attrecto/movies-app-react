---
name: check-i18n
description: Validate that all translation keys used in source code exist in both en.json and hu.json. Use when the user runs /check-i18n or wants to audit translation completeness.
allowed-tools: Read, Grep
---

## i18n Key Audit

Translation files and source usage are pre-populated below. Analyse them, then report.

---

### Locale files

`messages/en.json`:
!`cat messages/en.json`

`messages/hu.json`:
!`cat messages/hu.json`

---

### Translation usage in source

`useTranslations` / `getTranslations` calls (gives namespace per file):
!`grep -rn "useTranslations\|getTranslations" src/ --include="*.tsx" --include="*.ts" 2>/dev/null || echo "(none)"`

`t('key')` calls:
!`grep -rn "t('" src/ --include="*.tsx" --include="*.ts" 2>/dev/null || echo "(none)"`
!`grep -rn 't("' src/ --include="*.tsx" --include="*.ts" 2>/dev/null || echo "(none)"`

---

## Instructions

Using the data above, check for:

1. **Missing namespace** — a namespace passed to `useTranslations`/`getTranslations` that doesn't exist as a top-level key in `en.json` or `hu.json`
2. **Missing key** — a `t('key')` call whose key doesn't exist inside its namespace in either file
3. **Locale mismatch** — a key that exists in `en.json` but is absent from `hu.json`, or vice versa

Report each issue with the file and line where it's used. If everything is in sync, confirm that clearly.
