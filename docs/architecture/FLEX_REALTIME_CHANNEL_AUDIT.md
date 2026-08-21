# FLEX Realtime Channel Audit — Increment 1

> **Increment:** 1 — Baseline + Architecture Truth (no dedupe fix in this increment)
> **Scope:** every interval, timeout-scheduled transition, and event listener that claims to be realtime.

## Verdict at baseline

```
No WebSocket / SSE / Pusher / Laravel Echo / EventSource / Broadcast — zero hits
(grep -r "WebSocket|EventSource|Pusher|Echo|Broadcast" resources/js → 0)
All "realtime" is polling (setInterval) + deterministic setTimeout transitions + visibilitychange.
No duplicate polling proven at baseline; one canonical interval per feature (see table).
```

## Channel inventory

| Feature | Transport | Owner | Connect trigger | Disconnect trigger | Reconnect strategy | Dedupe strategy | Tenant scope | Fallback | UI status | Risks |
|---|---|---|---|---|---|---|---|---|---|---|
| **Contact Center Dashboard** (`features/dashboard/dashboard-context.tsx`) | `setInterval 5000 ms` poll `fetchDashboardData()` + `setInterval 5000 ms` stale check + `visibilitychange → refresh()` | `DashboardProvider` (`pollTimerRef`, `staleCheckInterval`) | `useEffect` mount: `setTimeout(refresh,0)` + `startPolling()` | `useEffect` cleanup: `clearTimeout(initialLoad)` + `clearInterval(stale)` + `stopPolling()` + `removeEventListener` | `checkStale`: `Date.now() - lastUpdated > STALE_THRESHOLD_MS (30000)` → `live→stale`; `document.hidden` guard skips refresh while hidden | `isRefreshingRef` + `mountedRef` guards prevent parallel fetch | not tenant-scoped | error → `connectionState='error'` | `ConnectionState='live|stale|reconnecting|error'` → `flex-live-data-status.tsx` / `status-styles.ts` (`reconnecting` maps to stale styles) | No exponential backoff; no `AbortController`; `BROADCAST_CONNECTION=null` in `phpunit.xml` |
| **Agent Monitoring timers** (`features/dashboard/use-state-timer.ts`, `features/agent-monitoring/*`) | `setInterval 1000 ms` `setNow(Date.now())` per roster row | `useStateTimer` / roster | `useEffect` mount (`[stateSince]`) | `clearInterval` on effect re-run / unmount | — | — (per-row) | not tenant-scoped | — | ticking `State Time` column | `render count = rows × 1 Hz` hotspot — needs memoization in Inc.4 (perf §13) |
| **Agent Workspace session/wrap-up timers** (`features/agent-workspace/session-timer.tsx`, `state/use-wrap-up-countdown.ts`, `use-call-timer.ts`) | `setInterval 1000 ms` + deterministic `WORKSPACE_TIMINGS` timeouts (450–12000 ms) in `mock-workspace-state.ts` | `MockWorkspaceState` singleton | `useWorkspaceState` subscribe + `workspaceState.schedule(fn,ms)` for each lifecycle transition | `timers Set` not cleared on route leave (call **survives** route leave by design — §51) | — | `subscribe` dedupes | not tenant-scoped | — | `WorkspaceState.connection` (`live|stale|reconnecting|error`) + `SessionTimer` + `WrapUpSurface` | `setInterval 1 Hz` per timer must not rerender whole shell — profile in Inc.4 |
| **Social inbox** (`features/social/use-social-workspace.ts` + `social-repository.ts`) | **none** — synchronous mock mutations `sendReply/setFollowUp/escalate` + `setData(getInbox())` | `socialRepository` singleton + `useSocialWorkspace` binding | — (in-memory) | — | — | — | **NOT tenant-scoped** | — | `filteredConversations` + unread badge | Needs `message ID dedupe`, ordering, pagination merge, read-state, reconnect behavior when real transport lands (Inc.3 §8) |
| **Agent Assist** (`features/ai/*`, `features/agent-workspace/agent-assist/*`) | **none** at baseline — call-scoped panel, no transcript stream | `mock-workspace-state` call lifecycle drives `isAssistEligible` | call `connected → eligible`, `endCall/nextCall → ineligible` | call end | no reconnect at baseline | — | not tenant-scoped | honest DEFERRED panels | `ASSIST_PANEL_META` states | Verify `segment ID` + `interim/final` reconciliation when stream exists (Inc.3 §8) |
| **Conference** (`CONFERENCE_*_AUDIT.md`) | **none** — unsupported capability boundary | telephony-owned (`MockWorkspaceState`) | — | — | — | — | — | — | — | No stale participant state — no fabricated diarization |
| **Dashboard realtime fallback** | Inertia flash (`useFlashToast` → `sonner`) | `hooks/use-flash-toast.ts` | `usePage().props.flash` | ephemeral | — | — | — | — | toast | — |
| **Customer Recovery** (`features/customer-recovery/use-recovery-data.ts`) | `setInterval` background refresh (single timer) | `useRecoveryData` | `useEffect` mount | cleanup `clearInterval(timerRef)` | — | single `timerRef` guard comment "no duplicate polling" | not tenant-scoped | error → `FlexErrorState` | `isRefreshing` vs cold `isLoading` partially distinguished | Background refresh must not remount entire DataGrid — keep last-known-data (§8) |
| **Other `setTimeout` consumers** | `setTimeout 200 ms` in `dashboard-data.ts`, debounced/filter `setTimeout` in `routing/*`, `recordings/*`, `subscriptions/*`, `reports/*`, `tenants/*`, `access-management/*` | per-page `useState` filters | user interaction | `clearTimeout` on unmount per file | — | per-file `loadTimerRef` | not tenant-scoped | — | skeleton only on cold load (intended) | Audit for missing `clearTimeout` on StrictMode remount in Inc.3 |

## Connection-state semantics (§8)

Internal canonical set:

```
connected | reconnecting | stale | offline | failed
```

Baseline reality (polling-only):

```
DashboardProvider: live | stale | error
WorkspaceState:    live | stale | reconnecting | error   (reconnecting currently UI-only)
Tenant/Social/Assist/Conference: no connection-state yet — to be unified in Inc.3
```

**Standardize before instrumenting** (§11): surface `reconnecting|stale` only when meaningful; preserve `lastKnownData` visible during refresh/reconnect — never replace stable operational data with skeletons every poll (current `DashboardProvider` keeps `data` during `isRefreshing`, correct).

## StrictMode / duplicate-listener audit

* `DashboardProvider` mounts one `pollTimerRef` + one `staleCheckInterval` + one `visibilitychange` listener; cleanup removes all three. `startPolling` guards with `if (pollTimerRef.current) return`.
* `useWorkspaceState` subscribes once to `workspaceState` (`useEffect(() => workspaceState.subscribe(setState), [])`) — no duplicate subscription.
* `MockWorkspaceState` timers survive route leave by design (call persistence).
* **Not removed in Increment 1** — proven duplicates not found. Later dedupe (§8, §9) must prove canonical ownership before removing anything.

## Opportunistic checks deferred (Increment 3)

* Offline 5 s / 30 s, server reconnect, `tenant switch while reconnecting`, `route change during reconnect` — manual test matrix (§8 Reconnect tests).
* No `AbortController` on `fetchDashboardData` — add if long-poll or WS fallback lands.
* No tenant-scoped invalidation of intervals — tie to ADR-002.
