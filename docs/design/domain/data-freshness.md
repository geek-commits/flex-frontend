# domain — Data Freshness

Defines the semantic freshness states FLEX realtime surfaces can show, and which ones the runtime can actually detect.

## Freshness states

Only use states the runtime can actually detect. Do not invent an `offline` state the UI has no way to observe.

| State | Runtime meaning | Detected by |
|---|---|---|
| `connecting` | Initial connection attempt (future websocket) | transport |
| `live` | Data updated within the staleness threshold | successful update recency |
| `refreshing` | A refresh is currently in flight | in-flight guard |
| `stale` | Data older than the threshold, connection still expected | elapsed time since last successful update |
| `reconnecting` | Transport reconnecting (future websocket) | transport |
| `disconnected` | Transport lost (future websocket) | transport |
| `error` | A refresh failed | failed fetch |

Runtime type: `ConnectionState` in `resources/js/types/flex.ts` (`connecting | live | stale | reconnecting | disconnected | error`); the Dashboard exposes `live | stale | reconnecting | error` via `dashboard-types.ts`.

## Dashboard semantics (current runtime)

- Poll cadence: `DASHBOARD_POLL_INTERVAL = 5_000ms`.
- Staleness threshold: `STALE_THRESHOLD_MS = 30_000ms`.
- A successful update sets `lastUpdated` and returns the state to `live`.
- If no successful update for the threshold, the state flips to `stale` (checked on an interval); it does not become `error`.
- A failed fetch sets `error`; previous data is preserved.
- "Live" is claimed only while the state is `live` — the Dashboard never shows a fake Live indicator when stale.

## UI treatment

- `live` → static "Live" status (a live dot never pulses — see `05-motion.md`).
- `refreshing` → subtle in-flight indicator; existing data stays visible.
- `stale` → explicit staleness ("data may be out of date"), with a refresh path. Stale is recoverable, not a failure.
- `error` → failure message with retry; last known data retained where safe.

## Mock vs production

The POC fetches from a mock adapter (`dashboard-data.ts`), so cadence and failure behavior are simulated. Production will replace the adapter behind the same provider boundary.

- Keep the mock and production refresh cadence distinguishable (e.g., documented constants).
- Never let a mock simulate "Live" behavior in a way that would mask a real production disconnect.
