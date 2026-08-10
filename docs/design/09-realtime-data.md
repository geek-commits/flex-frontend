# 09 — Realtime Data

Defines how FLEX realtime surfaces behave. Applies to the Dashboard today and to future realtime surfaces: Agent Monitoring, Call Manager, callback views, system monitoring, and voice/AI monitoring.

## Realtime core rules

```text
one data pipeline per domain
no duplicate polling
no leaked listeners
no overlapping requests
explicit freshness when knowable
stale ≠ error
preserve last known data where safe
localized failure
no fake Live state
```

- **One data pipeline per domain** — a domain's data is fetched/refreshed by a single provider, not by every component independently.
- **No duplicate polling** — two components never start their own polls for the same domain data.
- **No leaked listeners** — every `setInterval`, subscription, and event listener is cleaned up on unmount.
- **No overlapping requests** — a refresh already in flight suppresses a new one (guard flag), so requests cannot pile up.
- **Explicit freshness when knowable** — when the UI can know how fresh data is, it shows it (last-updated time, freshness state).
- **Stale ≠ error** — old data with an unknown current state is staleness, not a failure.
- **Preserve last known data where safe** — on a failed refresh, keep the previous data instead of blanking the surface.
- **Localized failure** — one failed domain/source does not blank healthy domains (see `07-feedback-states.md` partial failure).
- **No fake Live state** — do not claim "Live" unless the runtime can actually detect the connection (see `domain/data-freshness.md`).

## Reference implementation

`features/dashboard/dashboard-context.tsx` is the canonical realtime provider:

- cadence centralized in `constants.ts` (`DASHBOARD_POLL_INTERVAL = 5_000`);
- `isRefreshingRef` prevents overlapping requests;
- `mountedRef` + cleanup in the effect prevent leaked timers/listeners;
- polling pauses while `document.hidden` and refreshes on `visibilitychange`;
- `checkStale` flips to `stale` after `STALE_THRESHOLD_MS` without a successful update;
- freshness is explicit (`lastUpdated` surfaced as "Updated …" in the Live status);
- the mock adapter and the production backend must remain distinguishable (see `domain/data-freshness.md`).

## Polling rules

When polling exists:

- cadence is centralized in one constants location;
- request overlap is prevented (in-flight guard);
- cleanup on unmount is mandatory;
- cadence is never increased arbitrarily by components;
- mock vs production cadence must be distinguishable — never ship a production-like cadence behind a mock adapter without noting it.

## Websocket / SSE rules

When live subscriptions exist (not yet implemented in the POC — polling is used today):

- subscribe once per domain;
- clean up listeners on unmount;
- preserve auth across reconnects;
- reconnect with a bounded backoff;
- prevent duplicate reconnect streams;
- expose connection status only when it is actually knowable.

Do not document websocket behavior as current until it exists; do not prescribe polling where the runtime will use websockets, and vice versa (see `domain/data-freshness.md`).
