# FLEX Performance Baseline — Phase D Pre-Profile

**Branch:** `main` @ `d8b9d31` (2026-08-28T16:35Z)
**Build:** `bun run build` 11.29s, `app-DpGept9d.js` 333.94kB gzip 104.2kB, `public/build/assets` 529 chunks, `brotli 830KB / gzip 966KB`
**Prod-like build profiled:** yes (vite production). Dev HMR overhead excluded per `FLEX_RUNTIME_PERFORMANCE...:3`.

## Scenarios (to be profiled with Chrome DevTools Performance + React DevTools)
- login → authenticated landing
- /dashboard initial
- /dashboard → /agent/dashboard
- /agent/dashboard → /agent
- /agent → /admin/cdr
- EN→SW→FR locale switch (no refresh, no iframe reload, no call reset)
- Global Search Cmd+K open/type
- Call Manager history/search
- Assist open/stream
- CRM initial frame (`/integrations/crm-primary.json` 200?) — currently BLOCKED by XFO, parent separate
- Social initial frame — BLOCKED

## Observations from Code (pre-trace)
- **Provider remount:** `AppProviders` under `WorkspaceProvidersLayout` (admin/agent) vs `AppLayout` — `settings` nests 2× `AppProviders` (harmless, no singleton state). `Suspense fallback={null}` wraps lazy `TooltipProvider/GlobalSearchProvider/Toaster` — cold-load may blank workspace until chunks resolve (documented in `app-providers.tsx:6`).
- **Iframe load count:** `ExternalWorkspaceHost` `frameKey` bumps only on `fetchConfig` success or explicit `retry`; `useMemo(() => cols(t), [t])` ensures locale switch does not remount iframe. Expected `iframe document request count` =1 per route until explicit Reload.
- **Locale switch:** `setFlexLocale` does `i18n.changeLanguage` + `html lang` sync, no provider remount, no full document navigation (verified via `language-switcher` tests). No unrelated dashboard refetch observed in code.
- **Dashboard:** `useDashboardData` polling? Check `dashboard-repository` for duplicate polls. `wallboardColumnsTranslated`/`activeCallColumnsTranslated` now reactive via `t` dep, no `key` remount hack.
- **Global Search:** `buildActionIndex(t)` memoized via `t` dep; `filteredRecords` slices to 8, no heavy recompute.

## Traces Required (next)
- Capture `Performance` traces for each scenario: `interaction start → main-thread work → long tasks >50ms → style/layout/paint → network`
- React Profiler: provider remount, whole-tree rerender, table rebuild
- Measure `boot loader hide → provider chunk resolution → meaningful workspace first paint → blank interval`
- Event listeners accumulation after 30 route transitions (`keydown/resize/scroll/message/storage/languageChanged`)
- 15/30/60 min Assist soak DOM nodes/memory (transcript windowing if needed)
- Dynamic Island drag/expand + timer duplication check

## Before/After Template (per fix)
```
Scenario | Before | Root Cause | Change | After | Regression Risk | Trace Ref
```

Next: run Chrome DevTools traces on production build, record 0/10/20/30 checkpoint DOM counts per `FLEX_RUNTIME_PERFORMANCE...:21`.
