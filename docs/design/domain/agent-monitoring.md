# domain — Agent Monitoring & Call Whispering

Canonical semantics for the Supervision workspace's Agent Monitoring surface (`/admin/monitoring`) and its Call Whispering intervention. Workspace: **Supervision** (admin shell). Reuses the agent-state and call-state domain models — it defines no new agent or call states.

## Purpose

Agent Monitoring answers:

```text
Which agent needs my attention?
What state are they in?
How long have they been there?
Are they handling a call?
Should I intervene?
```

Call Whispering is the intervention: the supervisor coaches the agent during a live customer call; the caller does not hear the supervisor.

Operating flow: `Observe → Identify → Inspect → Intervene → Confirm → Monitor outcome`.

## Where shown

- New supervision route `admin/monitoring` (`pages/admin/agent-monitoring.tsx` → `features/agent-monitoring/`).
- Nav entry `Agent Monitoring` (capability `monitor.view`, workspace `admin`) in the SUPERVISION context group.
- Agent states come from `domain/agent-state.md`; call context from `domain/call-state.md`; freshness from `domain/data-freshness.md`.

## Data model

Reuses the dashboard realtime pipeline (`features/dashboard/dashboard-context.tsx`, `useDashboardData`). The monitoring derivation hook (`useAgentMonitoring`) joins the roster with active calls by agent id:

| Piece | Source | Notes |
|---|---|---|
| Agent identity / state / stateSince | `DashboardData.agents` (`AgentRosterEntry`) | canonical labels via `agent-state.md` |
| State duration | `stateSince` + ticking display | `useStateTimer`; never drives state |
| Current call | `DashboardData.activeCalls` joined by `agent.id` | privacy-masked per permission |
| Queue | roster `queue` / call `queue` | |
| Performance context | `callsToday`, `aht` | no per-agent SLA adherence exists in the runtime |
| Freshness / connection | pipeline `connectionState` / `lastUpdated` / `refresh` | |

No new polling, no new mock adapter, no websocket. Exactly one pipeline per route (see `09-realtime-data.md`).

## Supervision attention order (this surface)

```text
1. Operational context (state + state duration)
2. Workforce availability
3. Current live-call context
4. Intervention opportunity
5. Performance context
6. Navigation / chrome
```

Performance context is secondary — historical performance must not overpower a live call.

## Reachable states

### Roster / data

- `loading` — skeleton; `live` — fresh; `stale` — last-known rows preserved and marked; `error` — retry, preserve last-known data where safe.
- empty — no agents; filtered empty — no match (offer clear filters).
- unknown agent state — safe neutral label, never mapped to Ready, never whisper-eligible.

### Whisper session

```text
idle → available (agent talking + monitor.view + healthy) → initiating (simulated) → active → ended
                                     ↘ failure (error + retry)
```

## Call Whispering — canonical rules

> The POC runtime has **no telephony or media**. The whisper affordance is a **simulation** and must be labeled "Simulated — real whisper requires the Call Manager integration path." Do not document real whisper behavior the simulation does not have. Real media/telephony is a future backend concern.

- **Eligibility** is `monitor.view` + agent state `talking` on a supported active call + healthy connection + no active session. Never inferred from the visual label alone; revalidated at mutation time.
- **Stale safety:** when the feed is stale, do not present stale `talking` as confidently current; whisper is disabled when the connection cannot be safely validated.
- **Initiation is deliberate:** preflight states the agent, the call context, and "the customer will not hear you"; connecting state; duplicate initiation prevented; no false success before the simulated connection confirms.
- **Active state is unmistakable:** named agent + elapsed time + visible **Stop Whisper**. Whispering is an intentional active mode, not an alarm — no pulsing/flashing.
- **Stop is obvious and immediate**, keyboard-accessible, never hidden in an overflow menu; protected from duplicate clicks.
- **Call ends** during whisper or connect → session terminates, no fake active state, concise feedback (e.g., "Whisper ended — the agent's call has ended.").
- **One session** at a time for the supervisor; a second start is not offered while one is active.
- **Permissions / tenant:** eligibility respects `monitor.view`, tenant scope, and backend authority. Do not reveal extra customer identity in detail UI beyond existing permissions.

## Allowed actions

Per agent, the only intervention is **Whisper** (valid while `talking` on a supported call, permission held, healthy, and no active session). Do not offer an action the runtime cannot perform; do not add barge/join — the manual defines only Agent Monitoring and Call Whispering.

## Simulation honesty

- Whisper uses a mock adapter and is labeled Simulated wherever it appears.
- Do not fabricate media events, websocket traffic, or a postMessage protocol.
- Keep mock mode distinguishable from production; never mix mock data into presentation components.
