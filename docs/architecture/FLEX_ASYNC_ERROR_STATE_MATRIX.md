# FLEX Async / Error State Matrix — Increment 2

> **Increment:** 2 — Testing + Authorization Foundation
> **Canonical:** `docs/design/07-feedback-states.md` + hardening §6 / §15

## State taxonomy

| State | When | Visual | Owner | Retry |
|---|---|---|---|---|
| `cold loading` | no prior data, first fetch | skeleton/spinner only | `isLoading` (per `DashboardProvider`, `useRecoveryData`, DataGrid) | auto |
| `refreshing` | poll or manual refresh, **keep last-known-data visible** | subtle progress (not skeleton replay) — e.g. `isRefreshing` banner, Live badge `stale` | `isRefreshing` + `lastUpdated` | auto |
| `reconnecting` | poll failed, retry scheduled | `Reconnecting…` (stale tone) + preserve data | `connectionState='reconnecting'` (UI-only at baseline) | auto |
| `offline` | `navigator.onLine === false` or `document` offline | `Disconnected` / `Offline` banner | `connectionState='disconnected'` | on `online` |
| `empty` | zero records by product truth (no calls, no conversations) | `FlexEmptyState` with product explanation | feature empty check (`filtered.length === 0` + no filter) | — |
| `no results` | zero after filter/search | `No results — explain filter/search context` | `FlexEmptyState` with filter summary | clear filter |
| `permission denied` | `has(capability) === false` | explicit authorization message (not generic 404) | `CapabilityProvider` guard | — |
| `partial failure` | one section fails, others ok | localize to that card/section (not whole shell) | per-section `error` | per-section `Refresh` |
| `full failure` | page load failed | `FlexErrorState` + retry + `correlationId` if available | `error` + `FlexError` | `Retry` |
| `stale data` | `Date.now() - lastUpdated > STALE_THRESHOLD_MS (30000)` | `Stale Data` badge | `checkStale 5s` interval (Dashboard) | auto `refresh()` on `visibilitychange` |
| `retrying` | transient retry in flight | `Retrying…` + keep data | `isRefreshing` + retry count | auto |

## Rules (§6, §15)

* `cold load → skeleton only` when no prior data exists.
* `refresh → keep existing content visible` (Dashboard `isRefreshing` keeps `data`).
* `reconnect → preserve last-known safe data`.
* `partial failure → localize` — a chart failure must not crash the shell (§11 error boundaries: route + feature + call-critical).
* `permission denied → explicit` authorization message.
* `no results → explain filter/search`; `empty → explain product state`.
* Never generic "Something went wrong" for everything.

## Current gaps (Increment 2 scaffolding)

* `cold vs refreshing` partly distinguished (`DashboardProvider` has both `isLoading` + `isRefreshing`; `useRecoveryData` single timer less clear — standardize).
* Error boundaries missing at `route/feature/call-critical` levels — Increment 4.
* `connectionState` (`reconnecting` vs `stale` vs `error`) UI-only, no reconnect backoff — Increment 3.
* Tenant-scoped stale data not yet invalidated — ADR-002.
