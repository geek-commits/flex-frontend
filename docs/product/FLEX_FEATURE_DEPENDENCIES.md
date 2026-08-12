# FLEX CRM — FEATURE DEPENDENCIES

Canonical dependency map (per `FLEX_MASTER_FEATURE_PARITY_PLAN.md` §6/§28).
Basis: frontend source, `AGENT_WORKSPACE_PLAN.md`, user manual. Dependencies are only recorded where there is evidence — no inferred ones.

## Core dependency chain

```text
Agent Ready
  → telephony connection / availability (agent-state ↔ connection-status are separate axes)
  → eligible for inbound calls

Call active (connected)
  → agent state `talking`
  → valid call actions depend on state (mute/hold/transfer/end)

Call ends
  → Wrap Up (first-class mode)
  → CRM completion work (CRM stays usable during Wrap Up)
  → supervisor-set wrap-up timer → auto-return to Ready
      (POC: mock owner `wrapUpReturnMs` = 6000; real default config unresolved — GAP-008 in tracker)
```

## Call Manager flows

```text
Outbound: dial → dialing → connecting → connected
Inbound:  simulate incoming → ringing → answer → connecting → connected · decline → idle
Hold/Resume: connected ↔ hold (mutually exclusive with mute? no — independent toggles)
Transfer:   connected → transferring(selecting) → pending → hand-off(transferred → Wrap Up)
            · cancel → connected · unreachable target fails deterministically → connected + notice
Wrap Up:    end → wrap-up → (timer) → ready
```

### Action preconditions (state-dependent, enforced by store)

| Action | Requires | Note |
|---|---|---|
| Hold | call active (`connected`) | resume only when held |
| Mute | call active | toggle |
| Transfer | call active (`connected`) | valid, reachable target (agents + queues only); no warm transfer (no consultation state) |
| Answer / Decline | `ringing` | |
| Dial | `idle` | duplicate initiation guarded |
| End | call active | records history then Wrap Up |

## Supervision dependencies

```text
Dashboard SLA / queue health
  → real queue/ACD metrics + agent availability (mock source)
  → no invented SLA thresholds

Agent Monitoring
  → realtime agent state pipeline (`features/agent-monitoring/*`)
  → state duration timers
  → current-call context

Call Whispering
  → supervisor permission + active agent call + backend telephony capability
  → ⚠️ backend capability UNPROVEN — do not surface until verified (tracker GAP-001)
```

## Data / telephony dependencies

```text
CDR recording playback  → recording availability / storage / config (CDR is canonical exemplar)
CDR outcome values      → canonical call outcomes (answered/missed/transferred/voicemail/failed/busy — only where supported)

Call history (Call Manager)  → lightweight, distinct from CDR (do not conflate)
```

## Administration dependencies

```text
Roles & Permissions UI model  → `capabilities.tsx` (frontend guard) — backend remains authoritative
Module visibility             → role × capability × tenant context

Management Console            → module registry (`domain/modules.ts`) + permission-aware visibility
  → individual CRUD modules (queues, IVR, time groups/conditions, users, recordings) currently placeholder
  → must become evidenced before that roadmap item starts

Wrap-Up / default timers       → real admin configuration surface (unresolved — GAP-008)
```

## Notification dependencies

```text
Subscription expiration/payment notifications
  → Mail Configuration (SMTP)
  → reminder 5 days before expiry is a MANUAL claim — verify runtime config

Scheduled Reports delivery
  → report generation → recipient resolution (email/user/role/department) → mail delivery
```

## Workspace boundary notes

```text
Agent            handle interactions (agent-workspace, call manager, CRM host is EXTERNAL boundary)
Supervision      monitor + intervene (dashboard, monitoring, CDR, campaigns, reports)
Administration   configure (management console, users, roles, queues, IVR, time, recordings, mail, subscriptions)
Platform         operate multi-tenant (tenants, super-admin, tenant context — boundary NOT implemented yet)
```

## Preservation rule

Never remove a dependency edge just because a redesign changes visuals — feature preservation is the goal. Update this map in the same commit as any canonical change that alters a dependency.