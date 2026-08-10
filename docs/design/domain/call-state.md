# domain — Call State

Canonical call-state semantics for FLEX. Runtime type: `CallState` in `resources/js/types/flex.ts`; implementation in `components/flex/call-manager.tsx`; dashboard active-call display in `features/dashboard/dashboard-types.ts`; outcomes in CDR (`features/cdr/*`, `data/cdr.mock.ts`).

## Call states

The type declares ten states. Only states the runtime actually supports may be presented as current behavior.

| Runtime value | Meaning | Implemented today? |
|---|---|---|
| `idle` | No active call; dialing allowed | Yes — initial state |
| `dialing` | Outbound call in progress | Yes — simulated (Call Manager) |
| `ringing` | Call offered to the agent | Yes — simulated (Call Manager); displayed on Dashboard |
| `connected` | Active conversation | Yes — simulated (Call Manager); displayed on Dashboard |
| `hold` | Call on hold | Partial — Dashboard displays it; Call Manager uses a `isOnHold` toggle |
| `muted` | Agent muted | Partial — Call Manager `isMuted` toggle |
| `transferring` | Transfer in progress | Displayed on Dashboard; no transfer flow implemented |
| `wrap-up` | Post-call state (see `agent-state.md`) | Yes — Call Manager returns to wrap-up on end |
| `ended` | Call finished | Not exposed as a live state; CDR records outcomes |
| `failed` | Call failed | Not exposed in the live call UI |

> The Call Manager is a POC simulation (dial → ring → connect on timers). Do not document real telephony behavior the simulation does not have.

## CDR outcomes (recorded history)

```text
answered | missed | voicemail | transferred
```

These are historical call outcomes, distinct from live call states.

## Call actions

| Action | Valid when | Runtime behavior |
|---|---|---|
| Dial | `idle` | Disabled unless a number is entered and the call is `idle` — duplicate initiation is prevented |
| Mute / Unmute | call active | `isMuted` toggle |
| Hold / Resume | call active | `isOnHold` toggle |
| Transfer | call active | Control exists but no transfer flow is implemented — do not claim transfer works |
| End | call active | Moves to `wrap-up`, then back to `idle` |

## Call action safety

- **Hold** only while a call is active and supported;
- **Resume** only while held;
- **Transfer** requires a valid target — and is not offered as functional until the backend implements it;
- **Decline** only for an applicable incoming state;
- **duplicate call initiation prevented** — dial is disabled while a call is active;
- **end is deliberate but not cumbersome** — a single explicit End action, no accidental hang-up.

## Timer behavior

- Live call duration ticks once per second (`use-call-timer` in `features/dashboard/active-calls.tsx`), seeded from the call's start time.
- Timer is a display concern; it never changes call state.

## Agent-state interaction

A connected call drives the agent into `talking`; ending the call moves the agent into `wrap-up`, then auto-return to `ready` (see `agent-state.md`). The POC mocks this relationship rather than computing it.
