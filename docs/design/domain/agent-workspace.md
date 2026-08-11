# domain — Agent Workspace

Canonical semantics for the FLEX Agent transaction workspace. Workspace: **Agent**. Primary user: an agent working a shift (not a Super Administrator test account). This is the high-frequency call-handling surface: availability state, telephony connection, external CRM integration boundary, Call Manager, Wrap Up, and recent call context.

Execution authority: `AGENT_WORKSPACE_PLAN.md` (repo root). This doc records the modernization baseline and the architectural decisions taken at Phase 0.

## Boundary rule

The external CRM integration host is a **frozen integration boundary**. FLEX owns the shell, boundary chrome, agent state, connection state, Call Manager, call feedback, and workspace layout — never the CRM contents. Do not redesign CRM content, replace iframe behavior, invent CRM APIs/postMessage contracts, or couple Call Manager presentation to the CRM host. CRM failure must not imply call failure and vice versa.

## Architecture owner map (Phase 0 baseline)

| Concern | Owner (runtime) |
|---|---|
| Agent state | `AgentShell` local `useState<AgentState>('ready')`; selector in `AppTopbar` (`components/flex/app-topbar.tsx`) |
| State duration | `AppTopbar` hardcoded session counter (00:05:19 initial) — not authoritative |
| Signaling connection | Static `connectionState='live'` prop; `connectionStateMap` (`lib/status-styles.ts`) |
| WebRTC media | None |
| Active call | `CallManager` local `useState<CallState>('idle')` (`components/flex/call-manager.tsx`) |
| Call duration | Hardcoded `02:14` string |
| Dialed number | `CallManager` local state |
| Mute / Hold | Local booleans `isMuted` / `isOnHold` — not call states |
| Transfer | Icon button only; no flow (matches `call-state.md`) |
| Warm Transfer | None |
| Wrap Up | `setTimeout` 2 s → back to idle; no timer |
| Call history | Hardcoded 3-row array |
| CRM host | `EmbeddedWorkspace` (`components/flex/embedded-workspace.tsx`) — boundary header + host line + iframe; reads `/mocks/integrations/crm-primary.json` |
| CRM state | loading / error / retry only; no `unavailable` / `retrying` / `missing-config` distinction |
| Telephony store | None — no application-global store; call and agent state are route-local |

## Decisions (Phase 0)

- **Sequencing:** Agent Workspace proceeds now; Agent Monitoring Phase 5+ is paused (its pushed work remains intact).
- **Call persistence:** route-scoped. There is no global telephony store and calls do not survive navigation today. Keep one canonical owner inside `/agent`; do not introduce a persistent-call architecture in this release (`AGENT_WORKSPACE_PLAN.md` §117 defers it as risky).
- **Telephony adapter:** the inline `setTimeout` simulation in the presentational Call Manager is replaced by an isolated mock adapter behind a production-facing interface (`§56`, `§57`). Deterministic test scenarios are supported.
- **State extension:** `incoming` and `connecting` call states are added to the runtime model for the incoming-call surface; `muted` / `hold` remain derived flags rather than mutually exclusive call states. `call-state.md` and `types/flex.ts` are updated in the same phase (§114).

## Pre-existing defects (recorded at baseline, not caused by this work)

- Call Manager call-control buttons are icon-only (ambiguous); plan §65 requires icon + label.
- Call duration in the active-call card is a hardcoded string.
- Topbar session timer is a hardcoded demo counter, not authoritative.
- Transfer button exists with no transfer flow.
- No `incoming` / `connecting` / `ended` / `failed` live presentation in Call Manager.
- Mute / Hold are local toggles and not server-authoritative states.
- Call history is static mock data.
- `EmbeddedWorkspace` lacks distinct `unavailable` / `retrying` / `missing-config` states.
- `ready` and `connected` both use the green tone; the workspace must keep `Ready` and `Disconnected` visually distinct facts.

## Agent attention hierarchy (within workspace)

```text
CURRENT CALL
↓
VALID CALL ACTIONS
↓
CUSTOMER / CRM CONTEXT
↓
AGENT STATE + CONNECTION
↓
CALL HISTORY / SECONDARY WORK
↓
GLOBAL NAVIGATION
```

During ringing, Answer/Decline dominate; during an active call, call state and controls dominate; during Wrap Up, CRM work and Wrap Up timing dominate.

## Semantics kept distinct

`Ready` is not `Connected`. `Not Ready` is not `Offline`. `Break` and `Wrap Up` are normal states, not errors. Telephony `Connected` is an operational axis separate from availability state. A Ready agent with disconnected telephony must see both facts (`§108`).

## Where shown

- `/agent` — Agent Workspace: operational header, CRM integration host, Call Manager (`pages/agent/index.tsx`).
- Related routes: `/agent/missed-calls`, `/agent/troubleshooting`, `/agent/support` (agent workspace), Dashboard wallboard, Agent Monitoring (`/admin/monitoring`).
