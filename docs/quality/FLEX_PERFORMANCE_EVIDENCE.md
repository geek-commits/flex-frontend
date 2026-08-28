# FLEX Performance Evidence — Local Build (Phase 9 Snapshot)

**SHA:** `fae63f2` (main, post Phase 8)
**Date:** 2026-08-28
**Command:** `bun run build` (my-app)

## Build Artefacts (no regression)

- `app-RANlv6Jl.js` 333.91 kB gzip 104.20 kB (pre-phase1: 333.91kB — unchanged)
- `reports-mLYV1Ur6.js` 384.25 kB
- Total 174 assets brotli 831kB gzip 967kB, 9.8-10.2s
- Only CSS/token/component changes — no new libraries, no provider remount churn, no layout shift from avatar gradient (single CSS token `var(--flex-account-avatar-gradient)`)

## Chrome Traces — Planned (deferred to Phase E browser soak)

Representative routes per §17 to be profiled locally/dev:
`/dashboard`, `/agent/dashboard`, `/agent`, `/admin/cdr`, Global Search, locale switch, Call Manager history/search, Assist stream

Metrics to capture: long tasks, style/layout, paint, network, DOM growth, memory, provider remounts, Suspense behavior, 15/30/60min Assist soak (DOM nodes/memory/scroll), 30 transitions checkpoints 0/10/20/30 (DOM nodes/shell/dialog/iframe counts).

## Status

- Code-complete performance baseline GREEN (build same, no large payload growth)
- Browser trace evidence — pending Phase E local Chrome run (§9) before independent verifier (§13)
