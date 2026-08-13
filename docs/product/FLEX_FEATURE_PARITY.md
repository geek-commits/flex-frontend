# FLEX CRM — MASTER FEATURE PARITY & REVAMP TRACKER

**Canonical product-status document** (per `FLEX_MASTER_FEATURE_PARITY_PLAN.md` §5).
**Status:** Baseline v1.0 — reconciled against repository Git history and frontend source on 2026-08-12.
**Governing plan:** `FLEX_MASTER_FEATURE_PARITY_PLAN.md`
**Primary source:** `Flex CC User Manual`
**Purpose:** One source of truth that keeps "documented" distinct from "implemented / verified / revamped / shipped".

## How to use this tracker

- `SHIPPED` requires a remote-verified commit hash; `REVAMPED` only local verification; `REVAMP_PLANNED` only a PLAN exists. Never promote status without evidence (plan §2, §21).
- Unknown stays `UNKNOWN` — never guess.
- Before any future module revamp: find its feature IDs here, fill current-state evidence, mark `REVAMP_PLANNED`, implement on the canonical FLEX system, regression test, update this tracker in the same commit, push, verify (plan §29).
- Update a row's status to `IMPLEMENTATION_IN_PROGRESS` during implementation, `REGRESSION_VERIFIED` after preserved-functionality regression tests, `SHIPPED` only after remote verification.

## Lifecycle status enum

```
MANUAL_ONLY / CONFIRMED_FRONTEND / CONFIRMED_BACKEND / FUNCTIONALLY_VERIFIED /
REVAMP_PLANNED / IMPLEMENTATION_IN_PROGRESS / REVAMPED / REGRESSION_VERIFIED /
SHIPPED / NOT_PRESENT / DEPRECATED / NEEDS_PRODUCT_DECISION
```

## Workspace classification

`AGENT` · `SUPERVISION` · `ADMINISTRATION` · `PLATFORM` · `SHARED / INFRASTRUCTURE` · `AI / EXTENSION` · `EXTERNAL CRM BOUNDARY`

---

# 1. PROJECT-WIDE REVAMP CONTROL

Resolved from `git log` (46 commits, `main`, remote `origin` → `github.com/geek-commits/flex-frontend`, branch up-to-date).

| Area | Plan evidence | Implementation | Regression | Remote shipped (hash range) |
|---|---|---|---|---|
| FLEX UI Foundation (tokens/shell/status/table) | `docs/flex-ui-foundation.md` | `features/*`, `components/flex/*` | browser QA screenshots | ✅ `19732ca` → `838674c` |
| CDR modernization | AGENT/CDR plan material | `features/cdr/*` | `docs/screenshots/0X-cdr-*.png` | ✅ `5d1d6f4` → `2ea25f9` |
| Campaigns modernization | campaigns plan | `features/campaigns/*` | `docs/screenshots/0X-campaigns-*.png` | ✅ `a957e85` → `e5f8ec4` |
| Contact Center Dashboard modernization | dashboard plan | `features/dashboard/*` | `docs/screenshots/0X-dashboard-*.png` | ✅ `fde327b` → `a5089c0` |
| Craft Infrastructure (design OS + AGENTS.md) | `FLEX_CRAFT_INFRASTRUCTURE_PLAN.md` §6 | `docs/design/*` (01–12, `domain/`, `exemplars/`), root `AGENTS.md` | docs QAs | ✅ `655db6e` → `4bfd90b` |
| Agent Monitoring + Call Whispering | `AGENT_MONITORING_PLAN.md` | `features/agent-monitoring/*`, `pages/admin/agent-monitoring.tsx` | store/browser verified | ✅ `f54145e` → `24187c6` |
| Agent Workspace + Call Manager (Phases 1–11) | `AGENT_WORKSPACE_PLAN.md` | `features/agent-workspace/*`, `pages/agent/index.tsx` | store/browser verified | ✅ `ad46ccf` → `3c501e6` |
| Management Console + Navigation | next after parity | `pages/admin/management-console.tsx` + `admin/{module}` placeholders — see §7 readiness | not verified | ✅ `7827cb8` → `5a84f0d` (11 commits) |

> Rule: every `SHIPPED` above is backed by remote-verified commits on `origin/main`. Detail pages using Inertia routes: `admin/cdr/{record}`, `admin/campaigns/{campaign}`.

---

# 2. AGENT WORKSPACE FEATURES

| ID | Feature | Manual | Frontend evidence | Route | Source | Lifecycle | Notes |
|---|---|---|---|---|---|---|---|
| AGENT-001 | Agent Dashboard | YES | `pages/agent/index.tsx` | `/agent` | `features/agent-workspace/agent-workspace-page.tsx` | SHIPPED | `3c501e6` |
| AGENT-002 | Agent Profile | YES | in workspace page | `/agent` | agent-workspace | SHIPPED | compact header fields |
| AGENT-003 | Agent ID / Extension / Organization | YES | header | `/agent` | agent-workspace | SHIPPED | mock account |
| AGENT-004 | Session Duration | YES | `SessionTimer` | `/agent` | `features/agent-workspace/session-timer.tsx` | SHIPPED | isolated 1 Hz timer |
| AGENT-005 | Incoming Calls metric | PARTIAL | not a dedicated surface | — | — | UNKNOWN | dashboard family only |
| AGENT-006 | Outgoing Calls metric | PARTIAL | not a dedicated surface | — | — | UNKNOWN | |
| AGENT-007 | Calls per Hour | MANUAL | — | — | — | UNKNOWN | backend metric |
| AGENT-008 | Call Answering Rate | MANUAL | — | — | — | UNKNOWN | |
| AGENT-009 | Average Handling Time | MANUAL | — | — | — | UNKNOWN | |
| AGENT-010 | Skills & Proficiency | MANUAL | module `agents` in registry | `/admin/agents` | placeholder | MANUAL_ONLY | needs real surface |
| AGENT-011 | Queue Status | MANUAL | dashboard queue cards | `/dashboard` | `features/dashboard/queue-health.tsx` | REVAMPED | dash domain |
| AGENT-012…AGENT-018 | Avg Wrap-Up / Wait, Abandoned, Calls in Queue, Provider Minutes, Calls Waiting, System Notices | MANUAL | — | — | — | UNKNOWN | backend metrics; system notices surfaced in agent surface where implemented |

## Agent State features

| ID | Feature | Manual | Evidence | Lifecycle | Notes |
|---|---|---|---|---|---|
| AGENT-STATE-001 | Not Ready | YES | `agent-state-control.tsx` | SHIPPED | distinct from Offline (`agent-state.md`) |
| AGENT-STATE-002 | Ready | YES | control + store | SHIPPED | inbound eligible |
| AGENT-STATE-003 | Break | YES | control | SHIPPED | normal state, not error |
| AGENT-STATE-004 | Wrap Up | YES | `wrap-up-surface.tsx` | SHIPPED | first-class post-call mode |
| AGENT-STATE-005 | Wrap-Up timer | YES | `useWrapUpCountdown` + `wrapUpStartedAt` | SHIPPED | derived from mock owner duration |
| AGENT-STATE-006 | Auto return to Ready | YES | store `beginWrapUp` schedule | SHIPPED | `wrapUpReturnMs` 6000 |
| AGENT-STATE-007 | State dropdown/control | YES | `agent-state-control.tsx` | SHIPPED | only real selectable states |

## CRM + Softphone / Call Manager

| ID | Feature | Manual | Evidence | Route | Lifecycle | Notes |
|---|---|---|---|---|---|---|
| AGENT-CALL-001 | External CRM integration host | YES | `integration/crm-integration-host.tsx` | `/agent` | SHIPPED | **BOUNDARY PRESERVED** (`e0c6b49`) |
| AGENT-CALL-002 | Connection Status | YES | `connection-status.tsx` | `/agent` | SHIPPED | separate axis from Ready |
| AGENT-CALL-003 | Dialer | YES | `call-manager/dialer.tsx` | `/agent` | SHIPPED | |
| AGENT-CALL-004 | Inbound call | YES | store `simulateIncomingCall` | `/agent` | SHIPPED | |
| AGENT-CALL-005 | Answer | YES | `incoming-call-surface.tsx` | `/agent` | SHIPPED | |
| AGENT-CALL-006 | Decline | YES | incoming surface | `/agent` | SHIPPED | |
| AGENT-CALL-007 | Outbound call | YES | dialer + store | `/agent` | SHIPPED | |
| AGENT-CALL-008 | Mute / Unmute | YES | `active-call-surface.tsx` | `/agent` | SHIPPED | |
| AGENT-CALL-009 | Hold / Resume | YES | active surface | `/agent` | SHIPPED | |
| AGENT-CALL-010 | Transfer | YES | transfer panel + `transfer-targets.ts` | `/agent` | SHIPPED | direct only |
| AGENT-CALL-011 | Warm Transfer | YES | — | — | NEEDS_PRODUCT_DECISION | **NO runtime consultation state** — not offered (§43) |
| AGENT-CALL-012 | Simple Call History | YES | `idle-call-surface.tsx` history tab | `/agent` | SHIPPED | lightweight, not CDR |
| AGENT-CALL-013 | Recent calls | YES | history tabs | `/agent` | SHIPPED | |
| AGENT-CALL-014 | Missed call tab/history | YES | history tabs | `/agent` | SHIPPED | distinct from callback workflow |
| AGENT-CALL-015 | Outgoing history | YES | history tabs | `/agent` | SHIPPED | |

---

# 3. EXTERNAL CRM BOUNDARY FEATURES

Treat as external/integration-owned. Do not redesign blindly (plan §7).

| ID | Feature | Manual | Evidence | Lifecycle | Notes |
|---|---|---|---|---|---|
| CRM-001…002 | Customers / profiles | YES | external CRM family | EXTERNAL CRM BOUNDARY | ownership audit needed |
| CRM-003…009 | Task Management — My/All Tasks, details, escalate, urgency, share, transfer | YES | external CRM | EXTERNAL CRM BOUNDARY | ownership audit needed |
| CRM-010 | Feedbacks | YES | external CRM | UNKNOWN | ownership audit |
| CRM-011 | System Audit Trail | YES | — | UNKNOWN | ownership audit |
| CRM-012 | CRM Settings | YES | — | UNKNOWN | role-gated |

---

# 4. CALLBACK & VOICEMAIL

| ID | Feature | Manual | Evidence | Lifecycle | Notes |
|---|---|---|---|---|---|
| CALLBACK-001 | Callback Window | YES | `pages/agent/missed-calls.tsx` | REVAMPED (partial) | dedicated revamp later |
| CALLBACK-002 | Missed-call list | YES | missed-calls page | REVAMPED | |
| CALLBACK-003 | Customer / phone | YES | missed-calls page | REVAMPED | |
| CALLBACK-004 | Queue | YES | — | UNKNOWN | audit fields |
| CALLBACK-005 | Attempt count | YES | — | UNKNOWN | |
| CALLBACK-006 | Call Back action | YES | — | UNKNOWN | use canonical outbound pipeline |
| CALLBACK-007 | Claimed ownership after attempt | YES | — | UNKNOWN | **critical workflow rule** |
| CALLBACK-008 | Attended after successful answer | YES | — | UNKNOWN | **critical workflow rule** |
| CALLBACK-009 | Voicemail list | YES | — | UNKNOWN | no voicemail surface found |
| CALLBACK-010 | Voicemail playback | YES | — | NOT_PRESENT (POC) | backend dependency |

---

# 5. SOCIAL / OMNICHANNEL

| ID | Feature | Manual | Evidence | Lifecycle | Notes |
|---|---|---|---|---|---|
| SOCIAL-001 | Flex Social Interface | YES | — | NOT_PRESENT (POC) | audit |
| SOCIAL-002…004 | Instagram / Facebook / WhatsApp | YES | — | NOT_PRESENT (POC) | connected channels unverified |
| SOCIAL-005 | Unified incoming messages | YES | — | NOT_PRESENT (POC) | |
| SOCIAL-006 | Reply | YES | — | NOT_PRESENT (POC) | |
| SOCIAL-007 | Tag/follow-up | YES | — | NOT_PRESENT (POC) | |
| SOCIAL-008 | Escalate to supervisor | YES | — | NOT_PRESENT (POC) | |
| SOCIAL-009 | Response templates | MANUAL TIP | — | NOT_PRESENT | not confirmed without code |

---

# 6. CONTACT CENTER DASHBOARD

| ID | Feature | Manual | Evidence | Route | Lifecycle | Notes |
|---|---|---|---|---|---|---|
| SUP-DASH-001 | Contact Center Dashboard | YES | `features/dashboard/*` | `/dashboard` | SHIPPED | `fde327b`→`a5089c0` |
| SUP-DASH-002 | Agent Activity by State | YES | agent wallboard | `/dashboard` | SHIPPED | |
| SUP-DASH-003 | Active Calls | YES | `active-calls.tsx` | `/dashboard` | SHIPPED | |
| SUP-DASH-004 | Today's Call Statistics | YES | operations summary | `/dashboard` | SHIPPED | |
| SUP-DASH-005 | Realtime call/state graph | YES | `call-volume-chart.tsx` | `/dashboard` | SHIPPED | chart restraint per exemplar |
| SUP-DASH-006 | SLA Performance | YES | `queue-health.tsx` | `/dashboard` | SHIPPED | no invented thresholds |
| SUP-DASH-007 | Queue Stats | YES | queue health | `/dashboard` | SHIPPED | |
| SUP-DASH-008 | Top Performing Agents | MANUAL | — | — | UNKNOWN | confirm scope after revamp |
| SUP-DASH-009 | Call Volumes by Hour / trend | YES | call-volume-chart | `/dashboard` | SHIPPED | |

## Agent Monitoring + Call Whispering

| ID | Feature | Manual | Evidence | Route | Lifecycle | Notes |
|---|---|---|---|---|---|---|
| SUP-MON-001 | Agent Monitoring | YES | `features/agent-monitoring/*` | `/admin/monitoring` | SHIPPED | `24187c6` |
| SUP-MON-002 | Realtime Agent Status | YES | monitoring use + pipeline | `/admin/monitoring` | SHIPPED | |
| SUP-MON-003 | State Duration | YES | `use-state-timer` family | `/admin/monitoring` | SHIPPED | |
| SUP-MON-004 | Summary by State | YES | `agent-state-summary.tsx` | `/admin/monitoring` | SHIPPED | |
| SUP-MON-005 | Agent Performance Summary | YES | monitoring page | `/admin/monitoring` | REVAMPED | metrics secondary |
| SUP-MON-006 | Current Call context | IMPLIED | monitoring page | `/admin/monitoring` | REVAMPED | privacy noted |
| SUP-MON-007 | Call Whispering | YES | — | — | NEEDS_PRODUCT_DECISION | **backend capability unproven** — must verify before UI |
| SUP-MON-008…009…010 | Whisper start / active / stop | YES/IMPLIED | — | — | NEEDS_PRODUCT_DECISION | runtime state needed |

---

# 7. CALL DETAIL RECORDS (CDR)

| ID | Feature | Manual | Evidence | Lifecycle | Notes |
|---|---|---|---|---|---|
| SUP-CDR-001 | CDR | YES | `features/cdr/*` → `/admin/cdr` | SHIPPED | canonical exemplar |
| SUP-CDR-002 | Date/time | YES | cdr table | SHIPPED | |
| SUP-CDR-003 | Customer / number | YES | cdr table | SHIPPED | |
| SUP-CDR-004 | Agent | YES | cdr table | SHIPPED | |
| SUP-CDR-005 | Queue | YES | cdr table | SHIPPED | |
| SUP-CDR-006 | Duration | YES | cdr table | SHIPPED | |
| SUP-CDR-007 | Call status/outcome | YES | `cdr-columns.tsx` | SHIPPED | canonical values |
| SUP-CDR-008 | Recording playback | YES | detail sheet | REVAMPED (playback in POC mock) | depends on storage/config — verify |
| SUP-CDR-009 | Date filter | YES | `cdr-toolbar.tsx` | SHIPPED | |
| SUP-CDR-010 | Agent filter | YES | cdr toolbar | SHIPPED | |
| SUP-CDR-011 | Customer/number filter | YES | cdr toolbar | SHIPPED | |
| SUP-CDR-012 | Export | YES | — | UNKNOWN | confirm current frontend |

---

# 8. CALL CAMPAIGNS

| ID | Feature | Manual | Evidence | Lifecycle | Notes |
|---|---|---|---|---|---|
| SUP-CAMP-001…015 | Campaigns list/create/form/name/purpose/schedule, manual entry, Excel upload, lifecycle (Draft/Scheduled/Active/Paused/Completed), pause/resume, progress, answer rate, delete | YES | `features/campaigns/*` → `/admin/campaigns` | SHIPPED | `a957e85`→`e5f8ec4`; pause/resume pending guard `f4b3415` |
| SUP-CAMP-016 | Delete | YES | campaigns table | SHIPPED | confirm destructive action |

---

# 9. REPORTS — SUMMARY / OPERATIONAL

| ID | Feature | Manual | Evidence | Lifecycle | Notes |
|---|---|---|---|---|---|
| REPORT-001 | Reports module | YES | `pages/admin/reports.tsx` → `features/reports/*` | REVAMPED (route exists) | FLEX Reports v0.1 shipped: canonical AdminShell + context sidebar, grouped searchable Report Library, in-page Report Viewer, filter bar, export menu. Backend absent (GAP-006) — mock `ReportRepository` behind real capability model. |
| REPORT-002…013 | Contact Center Performance, Yearly Performance, Agent Performance, Agent State Log, Agent Outgoing, IVR Report, Customer End to IVR, Queue Logs, Outgoing Calls, Recordings | YES | `features/reports/viewers/*` | MANUAL_ONLY → REVAMPED | 10 canonical viewers shipped (section-first Contact Center/Yearly, table-first Agent reports, multi-section Outgoing, high-density Queue Logs). Report names reconciled to manual canonical inventory; runtime names were non-canonical mock labels. |
| REPORT-014…017 | PDF / Excel / CSV export | YES | `features/reports/report-export-menu.tsx` | MANUAL_ONLY → REVAMPED | canonical Export menu with supported-format awareness + Preparing/success/failure states; no browser-fake exports. Copy/Print not surfaced (backend absent). |
| REPORT-018 | Custom report configuration request | YES | — | UNKNOWN | audit workflow |

---

# 10. SCHEDULED REPORTS

| ID | Feature | Manual | Evidence | Lifecycle | Notes |
|---|---|---|---|---|---|
| SCHED-001…030 | Create/edit/delete schedule, name, type, output format, Daily/Weekly/Monthly/custom, email/user/role/department targets, Active/Inactive, Last/Next Run, execution state (Scheduled/Running/Completed/Failed/Retrying), logs, retry, records processed, file size, emails sent/failed, download logs | YES | `features/reports/scheduled/*` | MANUAL_ONLY → REVAMPED | Scheduled Reports workspace shipped: dense table with distinct status vs execution state, search/filters, create/edit sheet (Report/Schedule/Recipients/Status), execution history + stage detail, delete confirmation, retry (Failed-only). Mock `ScheduledReportsRepository`; backend remains authoritative. |

---

# 11. MANAGEMENT CONSOLE & ROUTING

| ID | Feature | Manual | Evidence | Lifecycle | Notes |
|---|---|---|---|---|---|
| ADMIN-CONSOLE-001 | Management Console | YES | `pages/admin/management-console.tsx`, `features/management-console/*`, `domain/modules.ts` | REVAMPED | grouped directory surface; 18 modules / 4 categories; `docs/screenshots/02-management-console-after-desktop.png` |
| ADMIN-CONSOLE-002 | Search settings/modules | YES | `features/management-console/console-search.tsx` + `use-visible-modules.ts` | REVAMPED | searches canonical registry (label/description/category/keywords); permission filter runs first |
| ADMIN-CONSOLE-003 | Default timers (incl. Wrap-Up duration) | YES | described in `domain/modules.ts` queue description; mock owner `wrapUpReturnMs` | CONFIRMED_FRONTEND | **real config location unresolved** — readiness gap |
| ADMIN-CONSOLE-004 | Ringtone | YES | — | MANUAL_ONLY | |
| ADMIN-CONSOLE-005 | Ring volume | YES | — | MANUAL_ONLY | |
| ADMIN-CONSOLE-006 | Permission-aware visibility | YES | `auth/capabilities.tsx` (Capability model); console filters by `has()` | REVAMPED (frontend guard) | backend remains authoritative; search never surfaces hidden modules |

## Queues / IVR / Time / Recordings / Users / Roles / Mail / Subscriptions / Tenants

| Feature family | Manual | Frontend evidence | Lifecycle | Notes |
|---|---|---|---|---|
| Queues (list/add/view/members/edit/delete, ACD, ring duration) | YES | `domain/modules.ts` entries (`/admin/queues`, `/admin/settings/queues`) | MANUAL_ONLY | 2026-08 baseline: placeholder routes, no surfaces. Modernization P0 in progress. |
| IVR (list/add/edit/delete, destination, prompt/ringtone/recording, entries) | YES | module entries | MANUAL_ONLY | 2026-08 baseline: placeholder routes, no surfaces; `ADMIN-IVR-007` entries needs product/runtime clarification. Modernization P0 in progress. |
| Time Groups & Time Conditions | YES | module entries (`/admin/time-conditions`, settings family) | MANUAL_ONLY | 2026-08 baseline: placeholder routes; `/admin/time-groups` has no route or module entry. Modernization P0 in progress. |
| Recordings (list/upload/name/description/preview/edit/replace/delete; CDR dependency) | YES | module entries; CDR detail | MANUAL_ONLY | |
| User Management (create/update/reset/deactivate/roles) | YES | `features/access-management/users/*`; `/admin/users` | MANUAL_ONLY → REVAMPED | 2026-08: mock `AccessRepository` behind real capability model — add/edit sheets, email temp credentials, password reset link, deactivate/soft-delete/Show Deleted/restore; no backend CRUD (Fortify only), backend remains authoritative |
| Roles & Permissions (roles/permissions/module visibility/ops/role-permission map; tenant-restricted admin) | YES | `features/access-management/roles/*`; `/admin/roles`; `auth/capabilities.tsx` | CONFIRMED_FRONTEND → REVAMPED | Roles/Permissions tabs; roles directory with real permission counts from capability registry; grouped permission assignment; read-only permission catalog + Add Permission (types derived from real tokens); backend enforcement unverified |
| Subscriptions (remaining days/reminders/expiry/payment/search) | YES | — | MANUAL_ONLY | 5-day reminder is manual claim — verify runtime config |
| Mail Configuration (from/SMTP/port/encryption/user/status/test/send/active) | YES | — | MANUAL_ONLY | **never log secrets** |
| Tenants / Super Admin (tenant mgmt, add/edit/enable/disable/config, switch/view/exit context) | YES | `domain/modules.ts` (`/admin/tenants`), Super Admin role | MANUAL_ONLY → CONFIRMED_FRONTEND | tenant-kind boundary; switch UX not implemented |

---

# 12. MODERN CURRENT EXTENSIONS (may exceed manual)

| ID | Feature | Manual | Evidence | Lifecycle | Notes |
|---|---|---|---|---|---|
| AI-001…005 | AI Center / Global AI Gateway / Knowledge Base / Agent Assist / Voice AI | PARTIAL | `pages/admin/ai.tsx` | CONFIRMED_FRONTEND | audit real capability |
| SYS-001…004 | System & Infrastructure / Service Health / Server Resources / Backup Status | FAQ | `pages/admin/system.tsx` | CONFIRMED_FRONTEND | |
| SUPPORT-001…002 | Quick Support / Troubleshooting-Diagnostics | general | `pages/agent/support.tsx`, `pages/agent/troubleshooting.tsx` | CONFIRMED_FRONTEND | |

---

# 13. GAP REGISTER

Maintained during audits. Unresolved entries are kept (do not delete to look green).

| Gap | Type | Feature IDs | Description | Risk | Resolution |
|---|---|---|---|---|---|
| GAP-001 | BACKEND_CAPABILITY_UNKNOWN | SUP-MON-007…010 | Call Whispering has no proven backend/telephony capability | HIGH | telephony audit before any whisper UI |
| GAP-002 | NEEDS_PRODUCT_DECISION | AGENT-CALL-011 | Warm Transfer documented in manual, no runtime consultation state | HIGH | product + telephony decision |
| GAP-003 | EXTERNAL_BOUNDARY_UNKNOWN | CRM-001…012 | CRM family ownership (external vs embedded) unverified | HIGH | integration ownership audit |
| GAP-004 | TENANT_SCOPE_UNKNOWN | Tenants family | tenant switch/view/exit UX not implemented; boundary mapping required before admin revamps | HIGH | auth/tenant audit |
| GAP-005 | ROUTE_MISMATCH | Management Console family | most `domain/modules.ts` routes resolve to placeholder pages (`admin/{module}`) — console directory itself is real; inbound-routes href aligned to a routable path | MEDIUM | surface-first evidence per module |
| GAP-006 | UNKNOWN_BACKEND | Agent metrics (AGENT-005…018), Subscriptions, Mail | Reports + Scheduled Reports shipped as REVAMPED mock-adapter surfaces (FLEX Reports v0.1); backend still absent for these | MEDIUM | repository/runtime audit on backend rollout |
| GAP-007 | PLAN_EXISTS_NOT_IMPLEMENTED | none at baseline | all 7 prior revamps verified shipped | CLOSED | — |
| GAP-008 | Manual terminology | AGENT-STATE / wrap timer settings | "Wrap-Up" vs "Wrap Up" canonicalized; timer default location unresolved | LOW | resolve via real admin config surface |

---

# 14. MANAGEMENT CONSOLE READINESS GATE (plan §8)

After `MANAGEMENT_CONSOLE_PLAN.md` execution (`7827cb8` → `5a84f0d`):

| Readiness item | Status | Evidence |
|---|---|---|
| Console route/module registry | ✅ | `pages/admin/management-console.tsx`, `domain/modules.ts`, `features/management-console/*` |
| Search behavior | ✅ | `features/management-console/console-search.tsx` + `use-visible-modules.ts` |
| Module permission visibility | ⚠️ frontend only | `capabilities.tsx` Capability model; backend enforcement unverified |
| Tenant context behavior | ⬜ | not implemented (GAP-004); document-only per Phase 6 |
| Queue route | ⚠️ placeholder | `/admin/queues` registry entry only |
| IVR route | ⚠️ placeholder | `/admin/ivr` registry entry only |
| Time Group / Time Condition route | ⚠️ placeholder | `/admin/time-conditions` registry entry only |
| Users route | ✅ | `/admin/users` revamped (mock `AccessRepository`); `features/access-management/users/*` |
| Roles / Permissions route | ✅ | `/admin/roles` revamped; `features/access-management/roles/*` |
| Recordings route | ⚠️ placeholder | `/admin/recordings` registry entry only |
| Default / Wrap-Up timer config location | ⬜ | unresolved (GAP-008) |
| Module navigation behavior | ✅ | every console module route resolves; Back/Enter/focus verified; `features/management-console/console-module-item.tsx` |

**Verdict:** ✅ CONSOLE DIRECTORY SHIPPED WITH AUDIT GAPS — the grouped, searchable, permission-aware directory is real and every module route resolves; the individual CRUD modules remain placeholder/audit items that must become evidenced (`REVAMP_PLANNED` per revamp-control rule) as they are modernized.

---

# 15. RECOMMENDED ROADMAP AFTER PARITY (default)

```text
1. ~~Management Console + Navigation Architecture~~ ✅ shipped (`7827cb8` → `5a84f0d`)
2. ~~Users / Roles / Permissions~~ ✅ shipped (access-management workspace; mock `AccessRepository` behind real capability model)
3. ~~Reports + Scheduled Reports~~ ✅ shipped (FLEX Reports v0.1; `features/reports/*`; mock `ReportRepository` + `ScheduledReportsRepository`)
4. Queues / IVR / Routing / Time Groups / Time Conditions
5. Callback + Voicemail
6. Recordings
7. Subscription + Mail
8. Tenant / Super Admin
9. Agent Dashboard
10. Social / Omnichannel
11. AI Center / AI extensions
12. Remaining confirmed modules
13. Whole-product parity audit
14. Whole-product quality sweep
```

Resolve whisper (GAP-001) and warm transfer (GAP-002) before any surface is offered — manually documented ≠ implemented.

---

# 16. UPDATE RULE

Before implementation: row exists → current behavior verified → `REVAMP_PLANNED`. During: `IMPLEMENTATION_IN_PROGRESS`. After local verification: `REVAMPED`. After preserved-functionality regression tests: `REGRESSION_VERIFIED`. After commit + push + remote verification: `SHIPPED` + commit hash.

**The goal is to make the tracker true, not green.**