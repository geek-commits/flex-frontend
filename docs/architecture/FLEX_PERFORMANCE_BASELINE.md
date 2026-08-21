# FLEX Performance Baseline — Increment 4

> **Increment:** 4 — Quality Hardening (measure first)
> **Commit:** `169855e` on `main`
> **Build:** Vite 8 + `precompress` — 157 assets, `br` 771 kB / `gz` 889 kB (2026-08-21)

## Build output (2026-08-21, `169855e`)

| Asset | Size | Gz |
|---|---|---|
| `app-B9Js1U-M.js` | 325 kB | 102 kB |
| `reports-CyHoQ_dW.js` | 384 kB | 106 kB |
| `social-*` | ~45 kB est | — |
| `dashboard-*` (traffic-chart, active-calls, etc.) | ~77–132 kB | — |
| total 157 assets under `public/build` | — | — |

Plugin timings: `vite:react-babel` 78% (6.5 s), `vite:css` 20%, `vite-plugin-svgr` 5142 loads.

## Route-level profiling (Vitest + manual, §13)

| Surface | Known hotspot | Verdict at baseline | Mitigation (this increment) |
|---|---|---|---|
| Agent Monitoring roster | `useStateTimer 1 Hz × rows` re-renders, `filteredAgents` sort/filter recalculation | hotspot exists, no memoization | documented; defer deep memo fix to post-baseline (measure-first) |
| Dashboard `ContactCenterDashboard` | `poll 5s` + `stale 5s` + `visibilitychange → refresh`; chart rerenders on `data` | quiet refresh keeps `lastKnownData` (correct); no skeleton replay | `AbortController` to be added when WS fallback lands |
| Social message list | `message-timeline` + avatar loading | single `setData(getInbox())` per mutation; dedupe now pure helper | `social-dedupe.ts` added |
| Agent Workspace timers | `SessionTimer` + `useWrapUpCountdown` `1 Hz` | isolated 1 Hz not whole-page — correct | — |
| Call Manager | `activeCallSurface` Mute/Hold toggles | `motion.span` presentation-only (0.15 s) does not gate command | verified in Increment 3 |
| CRM iframe | `crm-integration-host.tsx` | unrelated state must not remount iframe | verified — no remount on workspace state changes |

## Bundle audit

* Heavy: `recharts 3.8`, `@visx/* 4.0.1-alpha`, `motion 13.1`, `date-fns`. No duplicate icon system beyond `lucide-react` + `flex/icons` + `@assets/social` (each svgr-scoped, validated via `icons:audit`).
* No `lighthouse` run at baseline (server not on `:8000` with Chrome); budget to be set after real Chrome run in Increment 5 `perf:audit` on `login` + `dashboard` + `agent` routes.

## Next

* Whole-product perf matrix (§33) in Increment 5 — browsers Chrome/Edge, network normal/slow/offline/reconnect, breakpoints 360–1440, themes light/dark, roles agent/admin/super-admin, tenants platform/A/B.
