# FLEX Release Notes

**Release Candidate 1** — 2026-08-17
**Branch:** `main` · **Commit:** `f59b08fdc9e6ca839a51e75d6f552527e641e77b`

## Release Summary

FLEX Contact Center frontend POC release candidate. This release surfaces
realtime Agent Monitoring data that was previously computed but never rendered,
makes POC mock data honest and identifiable at the metric level, and applies a
product-wide quality sweep across foundation tokens, shell, iconography,
feedback states, responsiveness, accessibility, motion, and copy consistency.

> Only features that are verified in the running runtime are claimed here. No
> feature is claimed that is not backed by the actual code and runtime.

## Major Workflow Improvements

- **Agent Monitoring (GAP-009):** live agent roster now renders directly on the
  Agent Monitoring page, backed entirely by the monitoring runtime
  (`useAgentMonitoring`). Columns mirror the Live Agent Wallboard grammar for
  cross-supervision consistency: Agent, Ext., Queue, State, State Time
  (ticking), Current Call (direction · customer · call state when active),
  Calls Today, and AHT. Includes proper loading skeleton, error state with
  Retry, filtered-empty ("No agents match your filters"), and true-empty ("No
  agents online") states. Monitoring-specific actions (Whisper/Inspect/View)
  are intentionally omitted until a real capability exists.
- **System mock-SLA honesty:** the SLA metric is now explicitly labeled
  `Uptime (30d) — Sample` with supporting copy "Sample / POC data — not live
  SLA telemetry," and the System page carries a POC mock-data disclosure. Live
  operational truth and demonstration data are now distinguishable at a glance.

## Brand / Icon System

- Brand mark keyframes refactored to standalone `scale`/`translate` CSS
  properties, eliminating Web Animations API "invalid keyframe value" console
  warnings while preserving the exact construction visuals.

## Responsive & Accessibility Improvements

- Recording upload drop zone is now a label-associated control — keyboard
  reachable and focus-visible, not a click-only `div`.
- Theme toggle button now has an accessible `aria-label` ("Switch to light/dark
  mode").
- Module-directory search input now has an accessible `aria-label`.
- All record tables continue to route through the shared ReUI DataGrid
  primitive; no raw `<table>` bypasses.

## Foundation / Token Consistency

- Warning helper boxes in User and Role form sheets now use FLEX status tokens
  (`--flex-status-warning-*`) instead of raw `amber-*` utilities.
- No hardcoded hex/rgb/purple tokens remain in feature/page code; charts use
  `--status-*` tokens.

## Known Limitations

- See `FLEX_KNOWN_ISSUES.md` for the full list. Highlights: whisper and warm
  transfer are documented-but-not-implemented (GAP-001/002); tenants, routing,
  campaigns, access, and CDR use POC mock adapters at their repository
  boundaries; CDR export and free-text customer filter are not yet wired to a
  backend (GAP-013); the frontend-only POC has no tenant-boundary backend
  enforcement (GAP-004, honest DEFERRED).
- The vendored shadcn/Base UI preset emits a pre-existing `nativeButton`
  console diagnostic; it is library-internal, non-fatal, and does not change
  rendered DOM semantics.

## Upgrade / Deployment Notes

- No external upgrade required for this frontend POC candidate.
- Deployment: build frontend assets (`npm run build`), serve via the Laravel
  app. `Vite` dev server (port 5173) is for development only; the production
  surface is served through the Laravel app on port 8000.