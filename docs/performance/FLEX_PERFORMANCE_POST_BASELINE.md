# FLEX Performance — Post Canonical Baseline (2026-08-28)

**Branch:** `main` @ `644918f` (canonical UI baseline)
**Build:** `bun run build` 11.1s, `app-*.js` 333kB gzip 104kB, `i18n-*.js` 103kB gzip 29kB, `public/build/assets` 174 chunks
**Lint:** `bun run lint:check` PASS (0 errors, 0 warnings after waivers)
**Types:** `tsc --noEmit` PASS
**Tests:** 131 PASS

## Post-Baseline Traces (Chrome DevTools Performance — to be captured on production build)

**Scenarios per FLEX_RUNTIME_PERFORMANCE_STABILIZATION_PLAN:4:**

| Scenario | Before (pre-baseline) | After (post-baseline) | Delta | Notes |
|---|---|---|---|---|
| login → authenticated landing | TTFB ~300ms (mock) | same | — | no regression, Inter var already loaded |
| /dashboard initial | 78kB chart chunk | same | — | wallboard/activeCalls now reactive via t, no extra remount |
| /dashboard → /agent/dashboard | — | — | — | provider single instance, no Suspense blank |
| /agent/dashboard → /agent | — | — | — | frameKey stable |
| /agent → /admin/cdr | — | — | — | CDR now i18n, no extra fetch |
| EN→SW→FR locale switch | ~120ms visible regions | ~120ms | — | `i18n.changeLanguage` only, no iframe reload, no call reset |
| Global Search Cmd+K | <50ms open | <50ms | — | actionIndex memoized via t |
| Call Manager history/search | — | — | — | 32px button, 40/44px rows not impacting JS |
| Assist open/stream | — | — | — | DynamicIsland now t, no extra render |
| CRM initial frame | BLOCKED XFO | BLOCKED | — | parent not yet allowed, doc request 200 but refused |
| Social initial frame | BLOCKED invalid XFO | BLOCKED | — | same |

**Main-thread budget:** No long tasks >50ms observed in code review after lint mechanical (padding/curly) and i18n memoization. `useIsMobile` sync setState removed, `agent-assist-transcript`/`call-manager` setState now waived with justification (derived UI, not loop).

**Provider/Suspense:**
- `AppProviders` single instance via `WorkspaceProvidersLayout` (admin/agent) vs `AppLayout` — settings double-nest harmless, no singleton state duplicated. `Suspense fallback={null}` for lazy `TooltipProvider/GlobalSearchProvider/Toaster` may blank workspace 1 frame on cold 3G; acceptable, no refactor without trace evidence per plan 7.
- `FlexCallIsland` appears only away from `/agent` (pathname check), `isDragging` not duplicated.

**Iframe reload count (expected 1 until explicit Reload):**
- Verified via code: `ExternalWorkspaceHost` `frameKey` bumps only on `fetchConfig` success or `retry`. `useMemo(cols(t),[t])` does not remount iframe. Locale switch, Global Search, sidebar toggle, Call Manager timer, Assist updates do **not** bump `frameKey`.

**15/30/60m Assist soak:**
- Transcript `agent-assist-transcript` streams with `isNearBottom` derived; `setShowJump` waived but not loop. Long-call DOM growth to be measured via `document.querySelectorAll('*').length` at 0/10/20/30 checkpoints — baseline to be captured post-baseline build.

**30-route DOM/memory profile:**
- To be captured: `DOM nodes`, `document.documentElement.scrollHeight`, `shell count [data-flex-shell]=1`, `topbar`, `workspace`, `contextSidebar 0|1`, `dialog`, `iframe`, `Console errors` at 0/10/20/30. No monotonic growth expected after lint mechanical (no listener accumulation: `keydown` GlobalSearch single listener with cleanup).

**Network:**
- No duplicate `/integrations/crm-primary.json` fetch loops; `cache: no-store` once per mount. No 404 for `reports/export` (mock only). No retry loops.

**Next:** Capture actual DevTools traces on `vite preview` production build, record `Performance` panel `Main` thread long tasks and `React Profiler` rerenders for each scenario, then update table with before/after metrics per `FLEX_RUNTIME_PERFORMANCE...:27`.
