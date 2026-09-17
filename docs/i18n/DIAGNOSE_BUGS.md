# i18n Diagnose Bugs — 2026-09-17

Scope: `my-app/resources/js/i18n/*`, `components/language-switcher.tsx:1`, `components/flags/FlagIcon.tsx:1`, `i18n/locales/{en,sw,fr}/*` (9 NS ×3), audit `scripts/i18n-audit.mjs:1`, matrix `docs/localization/FLEX_LOCALIZATION_SURFACE_MATRIX.md`.

Tests consulted: `translation-completeness.test.ts:1` PASS on key existence (false-negative on values), `i18n.test.ts:1`.

## Summary

- **Structural completeness:** PASS (0 missing keys). `common 177/177/177`, `administration 1164`, `navigation 101`, `agent 224`, `supervision 385`, `platform 43`, `auth 69`, `assist 12`, `validation 4`.
- **Effective completeness (value-level):** FAIL. 291 `sw` and 309 `fr` keys identical to `en` (English shown in `sw/fr` UI). Dominated by `administration.json` ivр/timeGroups/timeConditions/ai/modules.
- **Runtime:** `toLocale*` bypass of `formatters.ts` (sw-TZ / fr-FR) + manual plural ternaries + hardcoded `Head`/`toast` in ~85% of feature files.

## 1. Value-identical to English (hidden by `fallbackLng`)

| Namespace | Keys | Example path | Actual `sw` value |
|-----------|------|--------------|-------------------|
| `administration` ivr | 76 | `sw:534 ivr.title "IVR"` vs `en` identical | English on `/admin/ivr` when `sw` |
| `administration` timeGroups | 66 | `sw:637 timeGroups.*` | English |
| `administration` timeConditions | 67 | `sw:746` | English |
| `administration` ai | 52 (`sw`) / 54 (`fr`) | `sw:1260 ai.title "AI Center"` | English on `/admin/ai` |
| modules (tenant) | 62 | `administration.json` | English |

- Root: `i18n/index.ts:78` `fallbackLng:'en'` + `resources` contain English-filled `sw/fr` entries → `t()` returns English without warning; audit `i18n-audit.mjs:53` would flag but `translation-completeness.test.ts:24` checks only `key in file`.
- Action: Mark each block `TRANSLATE` (product copy) vs `TECHNICAL` (`Starter` plan, `notifications@yourdomain.com` placeholder, `common:languages.en/sw/fr` native names). See §4.

## 2. Interpolation mismatch (single block)

- `sw/administration.json:251` `roles.form.assignedWarning` base: `"Jukumu hili limepangiwa watumiaji {{count}}."` — drops `{{pluralSuffix}}` present in `en:251` `"user{{pluralSuffix}}"`. `_one`/`_other` correctly differentiate via `mtumiaji` / `watumiaji`; base not used when `count` triggers plural pick, but inconsistency with `en` manual `{{pluralSuffix}}`. Code `roles-form.tsx` passes `{count, pluralSuffix: count===1?'':'s'}` — English leak into `sw` if base ever used. Fix: migrate to `t('assignedWarning', {count})` without manual suffix (Intl plural, `fr` `0→one`).

## 3. Manual plural ternaries (breaks `fr` `0→one` and future locales)

- `my-app/resources/js/features/subscriptions/subscriptions-table.tsx:134` `t(days===1?'days_one':'days_other', {count:days})` — **Fixed this PR** → `t('subscriptions.columns.days', {count:days})` (with `zeroDays` guard). Same pattern:
- `my-app/resources/js/features/subscriptions/subscription-detail-sheet.tsx:48` `meta_one/_other` → **Fixed** → `t('meta', {count, days, plan, seats})`; `:98` `daysRemaining_one/_other` → `t('daysRemaining', {count})`; `:119` `seatAllocationValue_one/_other` → `t('seatAllocationValue', {count})`.
- Remaining to audit: `common.json:178 events_one/_other`, other `administration` `unknownWarning:{{pluralSuffix}}` manual `s`.

Rule: `t('key', {count})` let i18next `Intl.PluralRules` pick `_one/_other/_few`, not `===1`.

## 4. Date/Number/Currency `[]` bypass (locale not sw-TZ / fr-FR)

`formatters.ts:1` `LOCAlE_CONFIG[locale].formatLocale` (`en-GB/sw-TZ/fr-FR`) is bypassed by coll-site `toLocale*([], …)` (host `en-US` leak on `fr`):

- `subscriptions-table.tsx:88` `amount.toLocaleString()` → **Fixed** → `formatNumber`; `:109` `date.toLocaleDateString([],{month:'short'})` → **Fixed** → `formatDate`.
- `subscription-detail-sheet.tsx:103` `expiresAt.toLocaleDateString([],{dateStyle:'full'})` → **Fixed** → `formatDate`; `:127` `lastPaymentDate`, `:177` `reminderSentAt` → **Fixed**.
- `customer-recovery/recovery-columns.tsx:35` `toLocaleDateString([],…)` → **Fixed** → `formatDate`.
- Remaining bypass to fix next pass: `recovery-detail-sheet.tsx:50` `toLocaleString([])`, `reports/yearly-performance.tsx:58` `toLocaleString()`, `campaigns/campaigns-summary.tsx:41` etc.; `subscriptions-table.tsx:121` `$` prefix should be `formatCurrency(..., currency)`.

## 5. Hardcoded surfaces (no `useTranslation`)

Per `FLEX_LOCALIZATION_SURFACE_MATRIX` + `i18n-audit.mjs:76`:

- `Head title` ~36/41 files not `t()` (e.g., `features/tenants/tenants-page.tsx`); `toast` ~58 hits in 14 files; `placeholder` ~30, `aria-label` ~70 hardcoded. Grep `useTranslation` 22 files vs ~150 feature files (~85% uncovered). Wrap with `t()` or audit allowlist.

## 6. Other findings

- `language-switcher.tsx:25` `t('languages.language','Language')` fallback literal masks missing key; removed literal, rely on `fallbackLng`. `i18n/index.ts:99` duplicate allowlist vs `locale.ts:42` — inline `['en','sw','fr']` hazard if list grows.
- `getInitialLocale` vs `useFlexLocale:148` `<html lang>` race (one-frame `en` flash before `languageChanged`). Low severity.
- `FlagIcon.tsx:1` `LOCALE_TO_FLAG` `en→gb, fr→fr, sw→tz` correct per design; future locale without flag falls back to `Globe` (`language-switcher.tsx:42`).

## Actions (surgical + report)

- [x] This PR: fix `subscription-detail-sheet` + `subscriptions-table` plurals & `formatDate/formatNumber`, `recovery-columns` date via `formatters.ts`.
- [ ] Next PR: finish `toLocale` sweep, `roles-form` manual `{{pluralSuffix}}`, `Head`/`toast` hardcoded audit, dedupe `index.ts:99` allowlist, and `translation-completeness` value check (`value !== en` for non-technical).
- [ ] L10n backlog: translate or mark 209 blocks above (`TECHNICAL` vs `TRANSLATE`).

Generated from commit `6d50ef4` + `6ff98bc` baseline, branch `main`.
