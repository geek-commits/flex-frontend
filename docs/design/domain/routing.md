# domain — Routing Configuration (Queues, IVR, Time Groups, Time Conditions)

Defines the UI treatment for the FLEX routing-configuration family. This is a **frontend modernization**, not a routing-engine rewrite. Queue behavior, ACD rules, ring timeout, member assignment, IVR execution order, DTMF, destination resolution, Time Group evaluation, Time Condition evaluation, timezone rules, routing precedence, fallback destinations, and telephony-provider integration are all preserved.

## Workspace

**Administration** (configure call distribution). Primary users: Administrator, Supervisor (where permissions allow), Super Administrator (platform/tenant-context support). These are high-consequence operational configuration surfaces — not decorative settings dashboards.

## Current runtime (baseline, 2026-08)

- All four modules are **placeholder**: `/admin/queues`, `/admin/ivr`, `/admin/time-conditions` resolve via the `admin/{module}` catch-all to `pages/admin/module-placeholder.tsx` ("Coming soon"). `/admin/time-groups` has **no route and no module entry** (hits generic "Module not part of the POC").
- **Dual registry entries** in `domain/modules.ts`: `queue`, `ivr`, `time-conditions` each exist in both `CONSOLE_MODULES` (`/admin/...`, gated `console.view`) and `SETTINGS_MODULES` (`/admin/settings/...`, gated `settings.manage`). No `time-groups` entry anywhere.
- **Backend:** no routing-configuration backend exists. Parity tracker flags Queues, IVR, Time Groups & Time Conditions as `MANUAL_ONLY` placeholder.
- **Permission:** only `console.view` and `settings.manage` gate these modules. There is **no** queue/ivr/time-specific capability; do not invent one. The canonical surfaces will live at `/admin/...` (gated `console.view`, held by `super-admin` and `admin`).
- **Tenant:** single implicit tenant. No tenant-switching UI exists; `tenant-context.md` records it as future treatment only. Routing data stays scoped to the single tenant.

## Queue runtime semantics (preserved)

From `docs/design/domain/queue-state.md`: the canonical runtime queue set is `Customer Support`, `Sales & Inquiries`, `Technical Escalations`. Health fields are `queue`, `waiting`, `longestWait`, `availableAgents`, `totalAgents`, `sla`; only `SLA_TARGET = 90` is a runtime constant. **Semantic health derives from actual configured thresholds/backend state — never invent thresholds.** The admin Queue surfaces must align with these queue identities.

## Routing mental model (guide for wording/cross-links)

```text
Time Group     → defines when
Time Condition → decides where
IVR / Queue / Destination → routes customer call
Queue          → distributes call to members
```

Only surface relationships that actual data supports — do not invent direct object relationships absent from the runtime.

## Baseline matrix — modules

| MODULE | ROUTE | CATEGORY | PERMISSION | STATUS |
|---|---|---|---|---|
| Queues | `/admin/queues` | Telephony & Operations | `console.view` | placeholder |
| IVR | `/admin/ivr` | Telephony & Operations | `console.view` | placeholder |
| Time Groups | `/admin/time-groups` (new) | Telephony & Operations | `console.view` | no route/entry |
| Time Conditions | `/admin/time-conditions` | System Configuration | `console.view` | placeholder |

## Baseline matrix — capabilities (manual)

| CAPABILITY | PRESERVE |
|---|---|
| Queue list/add/view/members/edit/delete, ACD, ring duration | yes |
| IVR list/add/edit/delete, destination, prompt/ringtone/recording, entries | yes |
| Time Group description/hours/weekdays/month days/months/multiple entries | yes |
| Time Condition date/time/schedule routing, list/add/edit/delete | yes |

## Preserved invariants

- No routing semantics changed; no new backend capabilities invented.
- No drag-and-drop IVR builder (keep form/table-based); no fake IVR simulator.
- Destinations show only supported types; store original IDs/values.
- Time Group/Condition evaluation, timezone, precedence, and deletion semantics preserved; never silently rewrite or normalize backend values.
- Deletion is deliberate (named confirmation); delete-blocked-by-dependency shows backend reason only if backend provides it.
- Empty tenant shows a real empty state with create CTA only if permitted; no fake examples.
- Deleted references render safe unknown/missing state — no silent remap.
- Test routing changes during low-traffic periods (help text only, no artificial enforcement).
