# domain — Call State

Canonical call-state semantics for FLEX. Runtime type: `CallState` in `resources/js/types/flex.ts`; canonical state owner in `features/agent-workspace/state/mock-workspace-state.ts` (the single place call state, mute/hold, wrap-up, and call history mutate); Call Manager surfaces in `features/agent-workspace/call-manager/`; dashboard active-call display in `features/dashboard/dashboard-types.ts`; outcomes in CDR (`features/cdr/*`, `data/cdr.mock.ts`).

## Call states

The type declares eleven states. Only states the runtime actually supports may be presented as current behavior.

| Runtime value | Meaning | Implemented today? |
|---|---|---|
| `idle` | No active call; dialing allowed | Yes — initial state |
| `dialing` | Outbound call in progress | Yes — mock owner (`dial()`), deterministic timers |
| `ringing` | Call offered to the agent | Yes — mock owner (`simulateIncomingCall()`); displayed on Dashboard |
| `connecting` | Answer/dial accepted, connecting | Yes — mock owner, both directions; no talk time starts before `connected` |
| `connected` | Active conversation | Yes — mock owner; displayed on Dashboard |
| `hold` | Call on hold | Yes — mock owner `isOnHold` (`toggleHold()`), Call Manager surface |
| `muted` | Agent muted | Yes — mock owner `isMuted` (`toggleMute()`), Call Manager surface |
| `transferring` | Transfer in progress | Yes — mock owner direct-transfer flow (`startTransfer()` → `selectTransferTarget()` → `completeTransfer()`), see Call actions |
| `wrap-up` | Post-call state (see `agent-state.md`) | Yes — mock owner auto-returns to `idle`/`ready` |
| `ended` | Call finished | Not exposed as a live state; CDR records outcomes |
| `failed` | Call failed | Not exposed in the live call UI |

> The Call Manager is a POC simulation (dial → ring → connect on deterministic timers in the mock owner). Do not document real telephony behavior the simulation does not have.

## Canonical ownership

- The mock adapter (`mock-workspace-state.ts`) is the POC's single owner of agent state, telephony connection, call state, the active call, mute/hold, transfer, wrap-up, and call history. Components never mutate call state and never schedule fake transitions.
- The adapter is a module singleton: a live call survives route leave/re-enter (call persistence audit).
- Timings are deterministic constants (dev/test reproducibility over randomness).

## CDR outcomes (recorded history)

```text
answered | missed | voicemail | transferred
```

These are historical call outcomes, distinct from live call states. The mock owner records `answered | missed | declined | outgoing | transferred` per call; CDR mapping is the reporting boundary.

## Call actions

| Action | Valid when | Runtime behavior |
|---|---|---|
| Dial | `idle` | Disabled unless a number is entered and the call is `idle` — duplicate initiation is prevented |
| Answer | `ringing` | `ringing → connecting → connected` (inbound); repeated answers are ignored |
| Decline | `ringing` | Records `declined` and returns to `idle`; unanswered rings record `missed` after the ring timeout |
| Mute / Unmute | call active | `isMuted` toggle |
| Hold / Resume | call active | `isOnHold` toggle |
| Transfer | call active (`connected`) | Direct transfer only — the runtime has no consultation state, so Warm Transfer is not offered (§43). `connected → transferring (selecting) → pending → hand-off (records `transferred`, then Wrap Up)`; Cancel returns to `connected`; an unreachable target fails deterministically and returns to `connected` with a failure notice (the caller stays on the line, §44) |
| End | call active | Records history and moves to `wrap-up`, then auto-returns to `idle`/`ready` |

## Call action safety

- **Hold** only while a call is active and supported;
- **Resume** only while held;
- **Transfer** requires a valid, reachable target — agents and queues only (no placeholder categories, §41); unreachable targets are shown disabled and a transfer to one fails without forcing Wrap Up (§44);
- **Decline** only for an applicable incoming state;
- **duplicate call initiation prevented** — dial is disabled while a call is active;
- **duplicate answer prevented** — answering a call that is no longer `ringing` is a no-op;
- **end is deliberate but not cumbersome** — a single explicit End action, no accidental hang-up.

## Timer behavior

- Live call duration ticks once per second (`use-call-timer` in `features/dashboard/use-call-timer.ts`), seeded from the call's connect time.
- The timer component mounts only in duration states (`connected`, `hold`, `transferring`) and unmounts on end — the timer is a display concern, it never changes call state.

## Agent-state interaction

A connected call drives the agent into `talking`; ending the call moves the agent into `wrap-up`, then auto-return to `ready` (see `agent-state.md`). The mock owner computes this relationship; the UI does not fake it.
