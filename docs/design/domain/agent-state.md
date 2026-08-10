# domain — Agent State

Canonical agent-state semantics for FLEX. Runtime type: `AgentState` in `resources/js/types/flex.ts` and `resources/js/features/dashboard/dashboard-types.ts`. Display and tone mapping in `features/dashboard/agent-wallboard.tsx`.

## State reference

| Runtime value | Canonical display label | Meaning | Semantic tone (runtime) |
|---|---|---|---|
| `ready` | Ready | Available to take calls; incoming calls ring | success |
| `talking` | Talking (On Call) | Handling a call | info |
| `ringing` | Ringing | Call offered to the agent, not yet answered | warning |
| `wrap-up` | Wrap Up | Post-call state for finalizing customer details | neutral |
| `break` | Break | Short pause; does not affect queue distribution | neutral |
| `not-ready` | Not Ready | Not prepared to receive calls; calls do not ring | warning |
| `offline` | Offline | Not connected / not logged in | danger |

Manual definitions (from the *Flex CC User Manual*): **Not Ready** is the default state before the agent is prepared to receive calls; **Ready** is the active availability state; **Break** is a designated short pause; **Wrap Up** follows a call and returns to Ready automatically when the supervisor-set timer expires.

> Do not treat normal workflow as failure: `break` and `wrap-up` are normal states, not errors. `not-ready` is not `offline`. Only `offline` is a disconnection.

> **Discrepancy (flagged):** the current Dashboard wallboard renders the raw runtime value (e.g., `ready`, `wrap-up`) as its visible label. The canonical display labels above (Ready, Wrap Up, …) come from the manual. Keep the runtime values in data; migrate visible labels to canonical forms.

## Transitions

The POC runtime has no live state machine — the Dashboard reads mock roster data. The transition model below is the product reference from the manual; the backend will implement it:

```text
Not Ready
↓
Ready
↓
In Call (ringing → talking)
↓
Wrap Up
↓
Ready

Ready ↔ Break
```

## Timer behavior

- Runtime: `useStateTimer(stateSince)` (`features/dashboard/use-state-timer.ts`) ticks once per second and renders `MM:SS` elapsed in the current state.
- Where `stateSince` is absent the timer shows a dash (`—`); do not fabricate a duration.
- Timer is a display concern; it never drives state.

## Where shown

- Supervision: Dashboard Agent Wallboard (`features/dashboard/agent-wallboard.tsx`) — state dot + label + state duration.
- Agent workspace: agent state and status indicator (per the manual's Agent Dashboard).
- Future: Agent Monitoring, Reports.

## Allowed actions

Per state, the agent may change availability: switching to Ready, Not Ready, or Break, and being placed in Wrap Up automatically after a call. Actions are state-dependent; the UI must not offer an action the runtime cannot perform.
