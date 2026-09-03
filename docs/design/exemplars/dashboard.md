# Exemplar — Contact Center Dashboard

Route: `/dashboard` · `features/dashboard/*` · page `pages/admin/contact-center-dashboard.tsx`

## What this page proves

- **Realtime state** — one provider (`dashboard-context.tsx`) owns polling, freshness, and refresh for the whole surface; components consume via `useDashboardData()` and never poll independently (`09-realtime-data.md`).
- **Data freshness** — explicit `lastUpdated`/status display; `live | stale | reconnecting | error` semantics from `domain/data-freshness.md`; stale is recoverable, never shown as an error.
- **Exception-first hierarchy** — operational exceptions are surfaced first, above metrics, implementing the supervisor attention order (`03-attention-hierarchy.md`).
- **Queue health** — real `QueueHealth` fields, no invented thresholds (`domain/queue-state.md`).
- **Active calls** — live call rows with ticking durations (`use-call-timer`) and call-state display (`domain/call-state.md`).
- **Agent state** — the wallboard shows each agent's state, tone, and elapsed state time (`domain/agent-state.md`).
- **Partial failure** — sections render independently; a failed source does not blank healthy sections (`07-feedback-states.md`).
- **Progressive loading** — the below-the-fold sections (traffic chart, queue health, active calls, agent wallboard) load asynchronously after first paint, each with a card skeleton fallback that reserves its height; the exception + metrics strip paints first (`12-quality-gates.md`).
- **Chart restraint** — the call-volume chart shows the needed signal with no decorative animation or count-up effects (`05-motion.md`).

## Patterns to reuse

- The realtime provider pattern (single pipeline, in-flight guard, cleanup, visibility pause);
- freshness display instead of fake "Live";
- exception-first layout;
- status via `FlexStatus` + per-domain tone maps.

## What not to copy blindly

- Dashboard-specific cards and mock jitter logic;
- the POC's `Math.random()` refresh behavior — production replaces the adapter;
- do not assume every realtime surface needs the same cards; follow the workspace attention order instead.
