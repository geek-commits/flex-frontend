# FLEX CRM — MASTER FEATURE PARITY & REVAMP TRACKER

**Canonical product-status document** (per `FLEX_MASTER_FEATURE_PARITY_PLAN.md` §5).
**Status:** Baseline v1.0 — reconciled against repository Git history and frontend source on 2026-08-12. Whole-product parity audit executed 2026-08-17 (see `FLEX_PARITY_AUDIT_REPORT.md`).
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
| Management Console + Navigation | next after parity | `pages/admin/management-console.tsx` + `admin/{module}` placeholders | verified | ✅ `7827cb8` → `5a84f0d` |
| Customer Recovery (Callback & Voicemail) | feature parity §4 | `features/customer-recovery/*`, `pages/agent/missed-calls.tsx` | store/browser verified | ✅ `d990b9e` → `9474c81` |
| Recordings & Audio Prompts | feature parity §11 | `features/recordings/*`, `pages/admin/recordings.tsx` | store/browser verified | ✅ `07ac7a1` |
| Subscriptions & Mail Configuration | feature parity §11 | `features/subscriptions/*`, `features/mail-config/*` | store/browser verified | ✅ in release |

> Rule: every `SHIPPED` above is backed by remote-verified commits on `origin/main`. Detail pages using Inertia routes: `admin/cdr/{record}`, `admin/campaigns/{campaign}`.

---

# 2. AGENT WORKSPACE FEATURES

| ID | Feature | Manual | Frontend evidence | Route | Source | Lifecycle | Notes |
|---|---|---|---|---|---|---|---|
| AGENT-001 | Agent Dashboard | YES | `pages/agent/dashboard.tsx` | `/agent/dashboard` | `features/agent-dashboard/*` | REVAMPED | new awareness surface (`agent.dashboard.view`) |
| AGENT-002 | Agent Profile | YES | status section | `/agent/dashboard` | agent-dashboard | SHIPPED | repo-backed profile |
| AGENT-003 | Agent ID / Extension / Organization | YES | status section | `/agent/dashboard` | agent-dashboard | SHIPPED | mock profile |
| AGENT-004 | Session Duration | YES | `SessionTimer` | `/agent` + `/agent/dashboard` | `agent-workspace/session-timer.tsx` | SHIPPED | isolated 1 Hz timer |
| AGENT-005 | Incoming Calls metric | MANUAL | — | — | — | DEFERRED | needs backend call accounting |
| AGENT-006 | Outgoing Calls metric | MANUAL | — | — | — | DEFERRED | |
| AGENT-007 | Calls per Hour | MANUAL | — | — | — | DEFERRED | backend metric |
| AGENT-008 | Call Answering Rate | MANUAL | — | — | — | DEFERRED | |
| AGENT-009 | Average Handling Time | MANUAL | — | — | — | DEFERRED | |
| AGENT-010 | Skills & Proficiency | MANUAL | empty state | `/agent/dashboard` | agent-dashboard | DEFERRED | needs real surface / backend skills |
| AGENT-011 | Queue Status | MANUAL | queue-pressure section | `/agent/dashboard` | `features/agent-dashboard/sections/queue-pressure.tsx` | REVAMPED | real `QueueHealth` fields |
| AGENT-012…AGENT-018 | Avg Wrap-Up / Wait, Abandoned, Calls in Queue, Provider Minutes, Calls Waiting, System Notices | MANUAL | empty states | `/agent/dashboard` | agent-dashboard | DEFERRED | backend metrics; notices/queue pressure surfaced where implemented |

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
| AGENT-CALL-012 | Simple Call History | YES | `idle-call-surface.tsx` history tab | `/agent` | SHIPPED | single flat "Call History" tab; search input uncontrolled (`idle-call-surface.tsx:33-106`) |
| AGENT-CALL-013 | Recent calls | YES | history tab | `/agent` | FRONTEND_ONLY (partial) | **2026-08-17 audit:** no dedicated Recent/Missed/Outgoing sub-tabs — all outcomes in one flat list, distinguished only by outcome badge; not separate tabs as documented |
| AGENT-CALL-014 | Missed call tab/history | YES | history tab | `/agent` | FRONTEND_ONLY (partial) | same single flat list; missed entries identifiable by outcome badge only (audit 2026-08-17) |
| AGENT-CALL-015 | Outgoing history | YES | history tab | `/agent` | FRONTEND_ONLY (partial) | same single flat list; outgoing by outcome badge only (audit 2026-08-17) |

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
| CALLBACK-001 | Callback Window | YES | `features/customer-recovery/*`, `pages/agent/missed-calls.tsx` | FRONTEND_ONLY (partial) | **2026-08-17 audit:** no literal callback time-window concept; tracker evidence is the recovery data layer (`useRecoveryData`, filters, summary, DataGrid) — those exist, the named window does not |
| CALLBACK-002 | Missed-call list | YES | missed-calls table | SHIPPED | customer identity, missed timestamp, queue, category |
| CALLBACK-003 | Customer / phone | YES | missed-calls table + detail | SHIPPED | customer name, phone number, click-to-copy/dial |
| CALLBACK-004 | Queue | YES | missed-calls table | SHIPPED | queue badge, category classification |
| CALLBACK-005 | Attempt count | YES | missed-calls table + attempt history | SHIPPED | incremented on callback attempt, audit timeline |
| CALLBACK-006 | Call Back action | YES | `callback-action.tsx` | SHIPPED | initiates outbound call via canonical `workspaceState.dial` |
| CALLBACK-007 | Claimed ownership after attempt | YES | `recovery-ownership.tsx` | SHIPPED | claim acknowledgment from repository, collision prevention |
| CALLBACK-008 | Attended after successful answer | YES | `recovery-status.tsx` | FRONTEND_ONLY (unreachable) | `markAttended` implemented in repo (`recovery-repository.ts:110-120`) but **no call site/UI** — resolved transition not attainable at runtime (audit 2026-08-17) |
| CALLBACK-009 | Voicemail list | YES | missed-calls table | SHIPPED | duration, presence indicator, canonical absence |
| CALLBACK-010 | Voicemail playback | YES | `voicemail-player.tsx` | SHIPPED | shared audio player with play/pause, duration, stop-propagation |

---

# 5. SOCIAL / OMNICHANNEL

| ID | Feature | Manual | Evidence | Lifecycle | Notes |
|---|---|---|---|---|---|
| SOCIAL-001 | Flex Social Interface | YES | `/agent/social`, `features/social/social-workspace-page.tsx`, `social.view` capability | SHIPPED (POC) | Agent workspace unified inbox; AgentShell + AgentOperationalHeader; three-pane inline ≥1280 (inbox / conversation / context), list→detail + context sheet below; committed `5c8f2c8` |
| SOCIAL-002…004 | Instagram / Facebook / WhatsApp | YES | `SOCIAL_CHANNELS` in `features/social/social-constants.ts`, `components/flex/social/social-channel-icon.tsx`, `assets/flex/icons/social/*.svg` | SHIPPED (POC) | channel filters All/IG/FB/WA; approved provider vector icons (FB/WA svgrepo, IG clean 726-byte vector); avatar badge; no provider behavior invented |
| SOCIAL-005 | Unified incoming messages | YES | `features/social/social-repository.ts`, `data/social.mock.ts`, `message-timeline.tsx`, `message-bubble.tsx` | SHIPPED (POC) | deterministic 5-conversation mock; clean incoming-left/outgoing-right rhythm; FLEX primary outgoing; avatar only on same-sender run start; no INCOMING/OUTGOING labels; channel text visible, never color-only |
| SOCIAL-006 | Reply | YES | `social-composer.tsx`, `socialRepository.sendReply` | SHIPPED (POC) | compact persistent composer; single-line auto-expanding; semantic border + focus ring; FLEX primary Send; plain-text reply; pending/disabled guard; draft preserved; error surfaced; Enter sends / Shift+Enter newline |
| SOCIAL-007 | Tag/follow-up | YES | `follow-up-controls.tsx`, `socialRepository.setFollowUp`, `social-context-pane.tsx` | SHIPPED (POC) | follow-up flag toggled (aria-pressed); shown in row + detail header + context pane |
| SOCIAL-008 | Escalate to supervisor | YES | `follow-up-controls.tsx`, `socialRepository.escalate` | SHIPPED (POC) | escalate sets escalated + clears follow-up; state shown in row + detail + context pane; button disables |
| SOCIAL-009 | Response templates | MANUAL TIP | — | NOT_PRESENT | manual tip only, not a runtime feature |
| SOCIAL-010 | Conversation context | YES | `components/social-context-pane.tsx` | SHIPPED (POC) | real runtime-backed rail: Contact/Channel/Follow-up/Escalation/Started/Last activity; inline ≥1280, `FlexDetailSheet` below; no AI, no fabricated history, no customer-record link (no route) |

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
| SUP-MON-002 | Realtime Agent Status | YES | `agent-monitoring-roster.tsx` + `use-agent-monitoring.ts` | `/admin/monitoring` | SHIPPED | roster renders `filteredAgents` (Agent/Ext/Queue/State/State Time/Current Call/Calls Today/AHT) — canonical wallboard grammar backed by monitoring runtime; browser-verified 2026-08-17 |
| SUP-MON-003 | State Duration | YES | `useStateTimer` in `agent-monitoring-roster.tsx` | `/admin/monitoring` | SHIPPED | `stateSince` rendered + ticking timer; browser-verified 2026-08-17 |
| SUP-MON-004 | Summary by State | YES | `agent-state-summary.tsx` | `/admin/monitoring` | SHIPPED | runtime-verified counts (Talking/Ready/Ringing/WrapUp/Break/NotReady/Offline) |
| SUP-MON-005 | Agent Performance Summary | YES | `agent-monitoring-roster.tsx` | `/admin/monitoring` | SHIPPED | Calls Today + AHT columns rendered per agent; browser-verified 2026-08-17 |
| SUP-MON-006 | Current Call context | YES | `agent-monitoring-roster.tsx` `CurrentCallCell` | `/admin/monitoring` | SHIPPED | direction + customer + call state rendered when a call is active; browser-verified 2026-08-17 |
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
| SUP-CDR-011 | Customer/number filter | YES | cdr toolbar | FRONTEND_ONLY (partial) | no dedicated customer field — free-text search only (`cdr-toolbar.tsx:84`; audit 2026-08-17) |
| SUP-CDR-012 | Export | YES | — | UNKNOWN | **non-functional affordance:** "Download Record"/"Export" buttons render with no handler (`cdr-columns.tsx:143-150`); audit 2026-08-17 |

---

# 8. CALL CAMPAIGNS

| ID | Feature | Manual | Evidence | Lifecycle | Notes |
|---|---|---|---|---|---|
| SUP-CAMP-001…015 | Campaigns list/create/form/name/schedule, lifecycle (Draft/Scheduled/Active/Paused/Completed), pause/resume, progress, answer rate, delete | YES | `features/campaigns/*` → `/admin/campaigns` | SHIPPED (partial) | `a957e85`→`e5f8ec4`; pause/resume pending guard `f4b3415`. Form = Title/Destination/Schedule/Status + numeric Contacts/Dialed/Answered (`campaign-form-sheet.tsx`). **Audit deviations (2026-08-17):** SUP-CAMP-005 `purpose` field NOT_PRESENT; SUP-CAMP-007 manual contact-list entry absent (numeric counts only, contacts read-only mock); SUP-CAMP-008 Excel upload NOT_PRESENT |
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
| Queues (list/add/view/members/edit/delete, ACD, ring duration) | YES | `features/routing/queues/*`; `/admin/queues` | MANUAL_ONLY → REVAMPED | FLEX Routing v0.1: dense directory (search/strategy filter), structured form (General/Call Distribution), detail sheet, first-class members (add/remove, duplicate prevention), delete confirmation. Mock `RoutingRepository`. |
| IVR (list/add/edit/delete, destination, prompt/ringtone/recording, entries) | YES | `features/routing/ivr/*`; `/admin/ivr` | MANUAL_ONLY → REVAMPED | FLEX Routing v0.1: directory, form with menu-entry editor (key→label→destination), shared destination picker, fallback destination, duplicate-key validation, delete confirmation. |
| Time Groups & Time Conditions | YES | `features/routing/time-groups/*`, `features/routing/time-conditions/*`; `/admin/time-groups`, `/admin/time-conditions` | MANUAL_ONLY → REVAMPED | FLEX Routing v0.1: Time Group form with multiple schedule entries (hours/weekdays/month days/months) + delete dependency-block; Time Condition list/form with Time Group relationship + match/no-match routing. New `/admin/time-groups` route/module added. |
| Recordings (list/upload/name/description/preview/edit/replace/delete; CDR dependency) | YES | `features/recordings/*`; `/admin/recordings` | MANUAL_ONLY → REVAMPED | FLEX Recordings v0.1: audio assets & prompt directory, category filter (IVR/Queue/Voicemail/Hold/Notice), inline audio player, upload/edit/replace form sheet, detail sheet with routing dependencies, safe delete dialog. Mock `RecordingRepository`. |
| User Management (create/update/reset/deactivate/roles) | YES | `features/access-management/users/*`; `/admin/users` | MANUAL_ONLY → REVAMPED | 2026-08: mock `AccessRepository` behind real capability model — add/edit sheets, email temp credentials, password reset link, deactivate/soft-delete/Show Deleted/restore; no backend CRUD (Fortify only), backend remains authoritative |
| Roles & Permissions (roles/permissions/module visibility/ops/role-permission map; tenant-restricted admin) | YES | `features/access-management/roles/*`; `/admin/roles`; `auth/capabilities.tsx` | CONFIRMED_FRONTEND → REVAMPED | Roles/Permissions tabs; roles directory with real permission counts from capability registry; grouped permission assignment; read-only permission catalog + Add Permission (types derived from real tokens); backend enforcement unverified |
| Subscriptions (remaining days/reminders/expiry/payment/search) | YES | `features/subscriptions/*`; `/admin/subscription` | MANUAL_ONLY → REVAMPED | FLEX Subscriptions v0.1: account directory with remaining days countdown, 5-day expiry warning, plan & seats breakdown, billing cycle tracking, manual reminder dispatch, term renewal dialog. Mock `SubscriptionRepository`. |
| Mail Configuration (from/SMTP/port/encryption/user/status/test/send/active) | YES | `features/mail-config/*`; `/admin/mail-config` | MANUAL_ONLY → REVAMPED | FLEX Mail Configuration v0.1: SMTP host/port/encryption setup, write-only password security, live connection status banner, socket handshake test action, delivery test email action, operational cross-link with Subscriptions. Mock `MailRepository`. |
| Tenants / Super Admin (tenant mgmt, add/edit/enable/disable/config, switch/view/exit context) | YES | `features/tenants/*`, `/admin/tenants`, `domain/tenant-repository.ts`, `data/tenants.mock.ts`, `auth/capabilities.tsx` | MANUAL_ONLY → REVAMPED (frontend POC) | FLEX Tenants + Super Admin v0.1: canonical platform directory (search/status filter/table/status/actions), add/edit sheets, detail sheet, consequence-aware enable/disable confirm, persistent platform/tenant context indicator + Enter/Return workflow. Mock `TenantRepository`; **no tenant backend** — real CRUD, status semantics, context switch and authorization are DEFERRED (backend authoritative in rollout). |

---

# 11b. PLATFORM / SUPER ADMIN PARITY (PLATFORM-001…009)

Super Administrator platform scope and tenant management. Backend authorization and tenant
isolation are **not yet implemented** (GAP-004); the frontend POC surface is built on a mock
`TenantRepository` and the existing localStorage capability layer. `roles.manage` (super-admin
only) gates the Tenants surface.

| ID | Feature | Manual | Evidence | Lifecycle | Notes |
|---|---|---|---|---|---|
| PLATFORM-001 | Super Administrator role | YES | `auth/capabilities.tsx` (`super-admin` → ALL); `/admin/tenants` gated on `roles.manage` | CONFIRMED_FRONTEND → REVAMPED (POC) | role is frontend-only POC (localStorage `flex.poc.role`); **real backend super-admin authority DEFERRED** — backend remains authoritative |
| PLATFORM-002 | Tenant Management | YES | `features/tenants/*`; `/admin/tenants` | MANUAL_ONLY → REVAMPED (frontend POC) | canonical platform directory: search/status filter/table/status/actions/loading/empty/error |
| PLATFORM-003 | Add tenant | YES | `features/tenants/tenant-form-sheet.tsx` (`Create Tenant`) | REVAMPED (frontend POC) | schema is POC-defined (name/email/domain/contact/phone); **real backend schema DEFERRED** |
| PLATFORM-004 | Edit tenant | YES | `features/tenants/tenant-form-sheet.tsx` (`Save Changes`) | REVAMPED (frontend POC) | authoritative row data; refresh directory after save |
| PLATFORM-005 | Enable / disable tenant | YES | `features/tenants/tenant-status-dialog.tsx` | REVAMPED (frontend POC) | consequence-aware confirm; **exact backend consequences unknown (GAP-004)** |
| PLATFORM-006 | Update tenant configuration | PARTIAL | — | NOT_PRESENT IN RUNTIME | no config surface or model exists; **DEFERRED** pending backend |
| PLATFORM-007 | Switch tenant context | YES | `features/tenants/*` + context indicator (Enter / Return to Platform) | REVAMPED (frontend POC) | context is POC state only; **no server-side switch exists — real switch DEFERRED** |
| PLATFORM-008 | View tenant context | YES | `features/tenants/tenant-detail-sheet.tsx` | REVAMPED (frontend POC) | read-only detail via `FlexDetailSheet` |
| PLATFORM-009 | Exit tenant context | PARTIAL | Return to Platform affordance (context indicator) | CONFIRMED_FRONTEND (POC) | no backend exit endpoint; **DEFERRED** — POC restores Platform context locally |

---

# 12. MODERN CURRENT EXTENSIONS (may exceed manual)

| ID | Feature | Manual | Evidence | Lifecycle | Notes |
|---|---|---|---|---|---|
| AI-001…005 | AI Center / Global AI Gateway / Knowledge Base / Agent Assist / Voice AI | YES | `/admin/ai/*`, `features/ai/*`, `data/ai.mock.ts` | SHIPPED (POC) | AI Operations workspace with sub-route IA (Overview, Knowledge Base, Agent Assist, Virtual Assistants, Usage & Costs, Providers & Models, Audit, Settings); shared `AdminShell` context sidebar; existing `StatusBadge` reused; honest DEFERRED/configuration-required states — no invented metrics, provider names, pricing, token formulas, precision scores, or Voice AI capabilities |
| SYS-001…004 | System & Infrastructure / Service Health / Server Resources / Backup Status | FAQ | `/admin/system`; `features/system/*`, `data/system.mock.ts` | CONFIRMED_FRONTEND → REVAMPED (POC) | refactored onto canonical feature boundary + `FlexStatus`/`FlexIcon`/`MetricCard`; honest DEFERRED states; mock nature surfaced (Uptime card labeled "Sample", page POC-mock disclosure) 2026-08-17 |
| SUPPORT-001…002 | Quick Support / Troubleshooting-Diagnostics | general | `/agent/support`, `/agent/troubleshooting`; `features/support/*`, `features/diagnostics/*` | CONFIRMED_FRONTEND → REVAMPED (POC) | extracted to feature boundaries; `StatusBadge`/`FlexStatus`/`FlexEmptyState`; diagnostic thresholds are POC-defined, not runtime-verified |

### 12b. Remaining module candidates — classification (Remaining Modules preflight)

Result of the completeness audit. No build performed beyond the SYS/SUPPORT rows above; kept truthful in the registry.

| Candidate (`domain/modules.ts`) | Classification | Rationale |
|---|---|---|
| `backups` → `/admin/backups` | ALIAS | Backup Status is covered by SYS-004 in `features/system/*`; no separate surface |
| `global-settings` → `/settings/profile` | ALIAS | Covered by Settings directory (profile/security/appearance) |
| `recordings` (settings) → `/admin/settings/recordings` | ALIAS | Covered by `/admin/recordings` feature |
| `security` (settings) → `/admin/settings/security` | ALIAS | Covered by account security + console Security & Audit is NOT_PRESENT |
| `cdr-config` → `/admin/settings/cdr-config` | ALIAS | Covered by `/admin/cdr` feature |
| `agents`, `call-stats`, `charts`, `survey-monitoring`, `tones`, `agent-states`, `departments`, `survey`, `global-config`, `moh` | NOT PRESENT | no runtime or mock surface; placeholders only (honest empty state via `module-placeholder`) |
| `inbound-routes`, `outbound-routes` | BLOCKED | telephony routing semantics — do not alter during visual modernization (plan §181) |

---

# 13. GAP REGISTER

Maintained during audits. Unresolved entries are kept (do not delete to look green).

| Gap | Type | Feature IDs | Description | Risk | Resolution |
|---|---|---|---|---|---|
| GAP-001 | BACKEND_CAPABILITY_UNKNOWN | SUP-MON-007…010 | Call Whispering has no proven backend/telephony capability | HIGH | telephony audit before any whisper UI |
| GAP-002 | NEEDS_PRODUCT_DECISION | AGENT-CALL-011 | Warm Transfer documented in manual, no runtime consultation state | HIGH | product + telephony decision |
| GAP-003 | EXTERNAL_BOUNDARY_UNKNOWN | CRM-001…012 | CRM family ownership (external vs embedded) unverified | HIGH | integration ownership audit |
| GAP-004 | TENANT_SCOPE_UNKNOWN | Tenants family | tenant switch/view/exit UX now a frontend POC (`features/tenants/*`, context indicator); **no tenant backend** — real switch, status semantics, authorization, isolation and telephony safety still unknown | HIGH | auth/tenant backend audit before real context switch |
| GAP-005 | ROUTE_MISMATCH | Management Console family | most `domain/modules.ts` routes resolve to placeholder pages (`admin/{module}`) — console directory itself is real; queues/ivr/time-groups/time-conditions/users/roles/recordings/subscriptions/mail-config now revamped | MEDIUM | surface-first evidence per module (remaining: tenants, agents, stats, charts, etc.) |
| GAP-006 | UNKNOWN_BACKEND | Agent metrics (AGENT-005…018), Subscriptions, Mail | Reports + Scheduled Reports + Subscriptions + Mail shipped as REVAMPED mock-adapter surfaces; backend still absent for these | MEDIUM | repository/runtime audit on backend rollout |
| GAP-007 | PLAN_EXISTS_NOT_IMPLEMENTED | none at baseline | all 7 prior revamps verified shipped | CLOSED | — |
| GAP-008 | Manual terminology | AGENT-STATE / wrap timer settings | "Wrap-Up" vs "Wrap Up" canonicalized; timer default location unresolved | LOW | resolve via real admin config surface |
| GAP-009 | COMPUTED_NOT_RENDERED | SUP-MON-002,003,005,006 | Agent Monitoring realtime rows (status/state-duration/performance/current-call) are computed in `use-agent-monitoring` but **no agent list/table surface renders them** — page shows only summary + "coming online" empty state | HIGH | **CLOSED 2026-08-17** — `agent-monitoring-roster.tsx` renders `filteredAgents` (canonical wallboard grammar) |
| GAP-010 | FEATURE_NOT_PRESENT | SUP-CAMP-005,007,008 | Campaign `purpose` field, manual contact-list entry, and Excel upload are documented in manual but absent from runtime (numeric counts + read-only contacts only) | MEDIUM | domain decision: build or mark DEFERRED |
| GAP-011 | TRACKER_OVERSTATE | AGENT-CALL-013,014,015 | Tracker claimed separate Recent/Missed/Outgoing history tabs; runtime has one flat Call History list (outcome badge only) | LOW | corrected to FRONTEND_ONLY (partial) 2026-08-17 |
| GAP-012 | FEATURE_NOT_PRESENT | CALLBACK-001,008 | "Callback Window" time-window concept absent (recovery data layer only); `markAttended` implemented but unreachable (no call site) | MEDIUM | domain decision / wire attended transition |
| GAP-013 | NON_FUNCTIONAL_AFFORDANCE | SUP-CDR-012, SUP-CDR-011 | CDR "Download Record"/"Export" buttons render with no handler; customer/number filter is free-text only (no dedicated field) | MEDIUM | wire export or hide; add customer filter |

---

# 14. MANAGEMENT CONSOLE READINESS GATE (plan §8)

After `MANAGEMENT_CONSOLE_PLAN.md` execution (`7827cb8` → `5a84f0d`):

| Readiness item | Status | Evidence |
|---|---|---|
| Console route/module registry | ✅ | `pages/admin/management-console.tsx`, `domain/modules.ts`, `features/management-console/*` |
| Search behavior | ✅ | `features/management-console/console-search.tsx` + `use-visible-modules.ts` |
| Module permission visibility | ⚠️ frontend only | `capabilities.tsx` Capability model; backend enforcement unverified |
| Tenant context behavior | ⚠️ frontend POC | `features/tenants/*` + context indicator; no tenant backend — real switch/authority deferred (GAP-004) |
| Tenants route | ✅ | `/admin/tenants` revamped (mock `TenantRepository`); `features/tenants/*` |
| Queue route | ✅ | `/admin/queues` revamped (mock `RoutingRepository`); `features/routing/queues/*` |
| IVR route | ✅ | `/admin/ivr` revamped; `features/routing/ivr/*` |
| Time Group / Time Condition route | ✅ | `/admin/time-groups` + `/admin/time-conditions` revamped; `features/routing/time-groups/*`, `time-conditions/*` |
| Users route | ✅ | `/admin/users` revamped (mock `AccessRepository`); `features/access-management/users/*` |
| Roles / Permissions route | ✅ | `/admin/roles` revamped; `features/access-management/roles/*` |
| Recordings route | ✅ | `/admin/recordings` revamped (mock `RecordingRepository`); `features/recordings/*` |
| Subscriptions route | ✅ | `/admin/subscription` revamped (mock `SubscriptionRepository`); `features/subscriptions/*` |
| Mail Configuration route | ✅ | `/admin/mail-config` revamped (mock `MailRepository`); `features/mail-config/*` |
| Default / Wrap-Up timer config location | ⬜ | unresolved (GAP-008) |
| Module navigation behavior | ✅ | every console module route resolves; Back/Enter/focus verified; `features/management-console/console-module-item.tsx` |

**Verdict:** ✅ CONSOLE DIRECTORY SHIPPED WITH AUDIT GAPS — the grouped, searchable, permission-aware directory is real and every module route resolves; the individual CRUD modules remain placeholder/audit items that must become evidenced (`REVAMP_PLANNED` per revamp-control rule) as they are modernized.

---

# 15. RECOMMENDED ROADMAP AFTER PARITY (default)

```text
1. ~~Management Console + Navigation Architecture~~ ✅ shipped (`7827cb8` → `5a84f0d`)
2. ~~Users / Roles / Permissions~~ ✅ shipped (access-management workspace; mock `AccessRepository` behind real capability model)
3. ~~Reports + Scheduled Reports~~ ✅ shipped (FLEX Reports v0.1; `features/reports/*`; mock `ReportRepository` + `ScheduledReportsRepository`)
4. ~~Queues / IVR / Routing / Time Groups / Time Conditions~~ ✅ shipped (FLEX Routing Configuration v0.1; `features/routing/*`; mock `RoutingRepository`)
5. ~~Callback + Voicemail (Customer Recovery)~~ ✅ shipped (`d990b9e` → `9474c81`)
6. ~~Recordings & Audio Prompts~~ ✅ shipped (`07ac7a1`)
7. ~~Subscription + Mail Configuration~~ ✅ shipped (`features/subscriptions/*`, `features/mail-config/*`)
8. ~~Tenant / Super Admin~~ ✅ frontend POC shipped (`features/tenants/*`, mock `TenantRepository`); backend authority/switch DEFERRED (GAP-004)
9. Agent Dashboard
10. Social / Omnichannel
11. AI Center / AI extensions
12. Remaining confirmed modules
13. ~~Whole-product parity audit~~ ✅ executed 2026-08-17 — see `FLEX_PARITY_AUDIT_REPORT.md`; corrected tracker truth (SUP-MON-002/003/005/006 computed-not-rendered, SUP-CAMP-005/007/008 absent, AGENT-CALL history tabs, CALLBACK-001/008, SUP-CDR-011/012). Gaps GAP-009…013 opened.
14. Whole-product quality sweep
```

Resolve whisper (GAP-001) and warm transfer (GAP-002) before any surface is offered — manually documented ≠ implemented. GAP-009 (Agent Monitoring list) was surfaced 2026-08-17 via `agent-monitoring-roster.tsx`.

---

# 16. UPDATE RULE

Before implementation: row exists → current behavior verified → `REVAMP_PLANNED`. During: `IMPLEMENTATION_IN_PROGRESS`. After local verification: `REVAMPED`. After preserved-functionality regression tests: `REGRESSION_VERIFIED`. After commit + push + remote verification: `SHIPPED` + commit hash.

**The goal is to make the tracker true, not green.**