# domain — Routing Configuration (Queues, IVR, Time Groups, Time Conditions)

Defines the UI treatment for the FLEX routing-configuration family. This is a **frontend modernization**, not a routing-engine rewrite. Queue behavior, ACD rules, ring timeout, member assignment, IVR execution order, DTMF, destination resolution, Time Group evaluation, Time Condition evaluation, timezone rules, routing precedence, fallback destinations, and telephony-provider integration are all preserved.

## Workspace

**Administration** (configure call distribution). Primary users: Administrator, Supervisor (where permissions allow), Super Administrator (platform/tenant-context support). These are high-consequence operational configuration surfaces — not decorative settings dashboards.

## Current runtime (FLEX Routing Configuration v0.1, shipped)

- Four canonical routes: `/admin/queues`, `/admin/ivr`, `/admin/time-groups` (new), `/admin/time-conditions` → `features/routing/*`. All gated `console.view`.
- **Queues** (`features/routing/queues/*`): dense directory (search + strategy filter), structured form (General / Call Distribution / Status), detail sheet, first-class **Members** surface (search, add/remove, duplicate prevention), delete confirmation.
- **IVR** (`features/routing/ivr/*`): directory, form with a **menu-entry editor** (key → label → destination rows, duplicate-key validation), shared destination picker, fallback destination, delete confirmation.
- **Time Groups** (`features/routing/time-groups/*`): directory with schedule summaries + usage; form with **multiple schedule entries** (hours, weekdays, month days, months) via a reusable `schedule-entry-editor`; timezone note; delete dialog that blocks deletion when the group is used by a Time Condition.
- **Time Conditions** (`features/routing/time-conditions/*`): directory showing the Time Group relationship (with missing-reference safety); form with Time Group selector + **when schedule matches / does not match** routing destinations; delete confirmation.
- **Relationships** (`features/routing/shared/*`): `RoutingRepository` boundary (`domain/routing-repository.ts`); shared destination picker, destination cross-links, time-group resolver, status badge, delete dialogs. Cross-module links (Time Condition → Time Group, IVR → Queue/IVR/Recording destinations, Time Group → usage count).
- **Backend:** no routing-configuration backend exists. Parity tracker flags Queues/IVR/Time Groups/Time Conditions as `REVAMPED` mock-adapter surfaces; the backend remains authoritative for routing semantics and authorization.
- **Tenant:** single implicit tenant (no switch UI). Routing data stays scoped to the single tenant.

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

## Module matrix

| MODULE | ROUTE | CATEGORY | PERMISSION | STATUS |
|---|---|---|---|---|
| Queues | `/admin/queues` | Telephony & Operations | `console.view` | shipped |
| IVR | `/admin/ivr` | Telephony & Operations | `console.view` | shipped |
| Time Groups | `/admin/time-groups` | Telephony & Operations | `console.view` | shipped (new route) |
| Time Conditions | `/admin/time-conditions` | System Configuration | `console.view` | shipped |

Settings-directory entries for queues/ivr/time-conditions were consolidated to these canonical `/admin/...` routes.

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
