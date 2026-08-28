# FLEX Lint Baseline

**Branch:** `main` @ `d8b9d31` (2026-08-28T16:35Z)
**Command:** `bun run lint:check` (eslint with @stylistic, typescript, react-hooks, import)
**Baseline after localization batches 1-6:**

```
✖ 617 problems (605 errors, 12 warnings)
528 errors and 8 warnings fixable with --fix
```

**Previous baseline per FLEX_REPOSITORY_LINT_QUALITY_STABILIZATION_PLAN:** 577 problems / 565 errors / 12 warnings — delta +40 errors due to new i18n keys + bulk `useTranslation` edits (mechanical import order, padding, curly).

## Counts by Rule (top)
- `@stylistic/padding-line-between-statements`: ~280
- `@stylistic/curly` / `import/order`: ~150
- `react-hooks/set-state-in-effect`: 1 (`hooks/use-mobile.ts:14`)
- `@typescript-eslint/no-unused-vars`: ~12
- `prefer-const`: ~8

## Counts by Directory
- `resources/js/features/**`: ~380
- `resources/js/components/**`: ~90
- `resources/js/i18n/**`: ~40
- `resources/js/pages/**`: ~30
- `resources/js/lib/**`: ~20
- `resources/js/layouts/**`: ~15

## Classification
- **P0 potential runtime/correctness:** 1 (`react-hooks/set-state-in-effect` in `use-mobile.ts` — synchronous setState in effect may cascade renders; needs manual review per plan §5)
- **P1 maintainability/dead code:** ~20 (`no-unused-vars`, `prefer-const`, unused imports)
- **P2 mechanical style:** ~596 (`padding-line-between-statements`, `curly`, `import/order`, stylistic)

## Priority Order per Plan §10
Batch 1 — semantic React/hooks (P0)
Batch 2 — unused/dead code (P1)
Batch 3 — agent workspace mechanical
Batch 4 — dashboards mechanical
Batch 5 — integrations/i18n/lib mechanical
Batch 6 — remaining files

No global `eslint . --fix` committed yet (forbidden per §1). Each batch will be landed with `types:check + test + build` PASS and `git diff --check` review per §11,14.

## Gate
Repo-wide `bun run lint:check` remains red mid-program (honest baseline §11). Error count will decrease monotonically as batches land. No blanket rule disable per §12; vendor/generated (`public/build/**`, `node_modules/**`) already excluded.
