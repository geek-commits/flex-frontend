# FLEX Role / Permission / Tenant Matrix — Increment 2

> **Increment:** 2 — Testing + Authorization Foundation
> **Source of truth (UI):** `resources/js/auth/capabilities.tsx` — `ROLE_CAPABILITIES`, `NAVIGATION` (19 capabilities). Backend authority **NOT VERIFIED** — POC mock.

## 1. Roles in runtime

| Role | Source | Fixture | Notes |
|---|---|---|---|
| `super-admin` | `ROLE_CAPABILITIES['super-admin'] = ALL (19)` | `Grace Mwanga` (`u1`) `data/users.mock.ts` | Platform + Tenant management via `roles.manage` |
| `admin` | `ROLE_CAPABILITIES.admin` (9 caps) | synthetic via localStorage switcher | Supervisor maps to `admin` — no distinct `supervisor` role in POC |
| `agent` | `ROLE_CAPABILITIES.agent` (7 caps) | synthetic via localStorage | |

Capabilities (19): `dashboard.view`, `monitor.view`, `console.view`, `cdr.view`, `campaigns.view`, `campaigns.manage`, `reports.view`, `ai.view`, `system.view`, `settings.manage`, `security.view`, `roles.manage`, `agent.workspace`, `agent.dashboard.view`, `social.view`, `call.manager`, `missed-calls.view`, `troubleshooting.view`, `support.view`.

## 2. Matrix (visibility / action)

`●` allowed (UI shows / action gated via `has(capability)`), `○` forbidden (UI hidden, route expected redirect/deny), `?` needs backend provenance.

| Route / Action | Capability gate | super-admin | admin | agent | Backend authority |
|---|---|---|---|---|---|
| `Agent Workspace` `/agent` | `agent.workspace` | ○ (hidden) | ○ | ● | NOT VERIFIED — POC `has()` only |
| `Social Inbox` `/agent/social` | `social.view` | ○ | ○ | ● | NOT VERIFIED |
| `Agent Dashboard` `/agent/dashboard` | `agent.dashboard.view` | ○ | ○ | ● | NOT VERIFIED |
| `Contact Center Dashboard` `/dashboard` | `dashboard.view` | ● | ● | ○ | NOT VERIFIED |
| `Agent Monitoring` `/admin/monitoring` | `monitor.view` | ● | ● | ○ | NOT VERIFIED |
| `Management Console` `/admin/management-console` | `console.view` | ● | ● | ○ | NOT VERIFIED |
| `Tenants` `/admin/tenants` | `roles.manage` (super-admin only) | ● | ○ | ○ | NOT VERIFIED |
| `Users` `/admin/users` | — (console) | ● | ● | ○ | NOT VERIFIED |
| `Roles` `/admin/roles` | `roles.manage` | ● | ○ | ○ | NOT VERIFIED |
| `CDR` `/admin/cdr` | `cdr.view` | ● | ● | ○ | NOT VERIFIED |
| `Campaigns` `/admin/campaigns` | `campaigns.view` | ● | ● | ○ | NOT VERIFIED |
| `Reports` `/admin/reports` | `reports.view` | ● | ● | ○ | NOT VERIFIED |
| `AI Center` `/admin/ai/*` | `ai.view` | ● | ○ | ○ | NOT VERIFIED |
| `System` `/admin/system` | `system.view` | ● | ○ | ○ | NOT VERIFIED |
| `Create User` | `roles.manage` | ● | ○ | ○ | NOT VERIFIED |
| `Delete Queue` | `console.view` family | ● | ● | ○ | NOT VERIFIED |
| `Download Recording` | `cdr.view` (affordance non-functional KD-005) | ? | ? | ○ | GAP-013 |
| `Whisper / Conference` | `monitor.view` + telephony runtime | ? | ? | ○ | GAP-001/002 backend capability UNKNOWN |
| `Switch Tenant` `enterTenant()` | `roles.manage` implied | ● | ○ | ○ | NOT VERIFIED — POC in-memory only (ADR-002) |
| `Export Report` | `reports.view` | ● | ● | ○ | UNKNOWN — backend absent (GAP-006) |

## 3. Tenant matrix

| Context | Behaviour at baseline | Verdict |
|---|---|---|
| Platform | `TenantContext mode=platform` — tenants directory visible, directory is tenant-agnostic mock | Frontend mock only |
| Tenant A (`t1` FLEX HQ) | `enterTenant(t1)` flips context indicator; **no data re-scope** | GAP — ADR-002 contract deferred |
| Tenant B (`t2` Nairobi Central) | same | GAP |
| `A→B→A` rapid | context flips, stale rows may persist until page remount — expected baseline gap | To be fixed in Increment 3 via `invalidateOnTenantChange` |
| Backend isolation | **NOT VERIFIED — POC mock environment** | Recorded, not pretended |

## 4. Coverage plan (Increment 2)

* Pest: `allowed route` / `forbidden route` redirect/denied behaviour (requires Laravel auth scaffolding; currently Fortify session only — mark `Backend authorization: NOT VERIFIED` until real guards land).
* Vitest: `has(capability)` selector, `NAVIGATION` single-model invariant, `tenant-invalidation` helper (registry + `invalidateOnTenantChange` idempotency), `status-styles` mapping. Sample tests already land `auth/capabilities.test.ts` (18 tests).
