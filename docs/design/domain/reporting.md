# domain — Reports & Scheduled Reports

Defines the UI treatment for the Reports & Scheduled Reports surfaces. This is a **frontend modernization**, not a reporting-engine rewrite. Report calculations, backend contracts, permissions, tenant boundaries, and generation logic are preserved.

## Workspace

**Administration** (configure and operate the contact center). Primary users: Supervisor, Administrator, Super Administrator per actual permission. Reports is a high-density operational analysis workspace, not a decorative catalog.

## Current runtime (FLEX Reports v0.1, shipped)

- Single route: `/admin/reports` → `features/reports/reports-page.tsx` (route registered in `routes/web.php`, permission surface `reports.view`).
- **Report Library**: a compact grouped directory (PERFORMANCE / AGENTS / QUEUE & IVR / TELEPHONY & QUALITY) with search over real report metadata; loads metadata only, never report datasets.
- **Report Viewer**: canonical in-page surface with a shared filter bar (date period + report-specific filters), loading/empty/error states, and a contextual Export menu (supported formats only, with Preparing/success/failure states).
- **Viewers** (`features/reports/viewers/*`): section-first Contact Center & Yearly Performance, table-first Agent reports (Performance / State Log / Outgoing), IVR & Customer End to IVR, multi-section Outgoing Calls, high-density Queue Logs, and Recordings.
- **Scheduled Reports** (`features/reports/scheduled/*`): dense schedules table with **separate schedule status and execution state**, search/filters, create/edit sheet (Report / Schedule / Recipients / Status), execution history with stage detail, delete confirmation, and Failed-only retry.
- **Backend:** no reporting/scheduling backend exists. Parity tracker flags REPORT-* and SCHED-* as `REVAMPED` mock-adapter surfaces (gap `GAP-006`); the backend remains authoritative for generation and authorization.
- **Permission:** only `reports.view` exists (`auth/capabilities.tsx`), held by `super-admin` and `admin`, not `agent`. There is **no** `reports.manage`; do not invent one.
- **Tenant:** single implicit tenant. No tenant-switching UI exists; `tenant-context.md` records it as future treatment only.

## Baseline matrix — reports

Report definitions are the manual's canonical inventory (runtime names were non-canonical mock labels; reconciliation recorded in `FLEX_FEATURE_PARITY.md`).

| REPORT | CATEGORY | FILTERS | EXPORTS | PERMISSION |
|---|---|---|---|---|
| Contact Center Performance | PERFORMANCE | period | PDF/Excel/CSV | `reports.view` |
| Yearly Contact Center Performance | PERFORMANCE | year | PDF/Excel/CSV | `reports.view` |
| Agent Performance | AGENTS | period, agent | PDF/Excel/CSV | `reports.view` |
| Agent State Log | AGENTS | period, agent | PDF/Excel/CSV | `reports.view` |
| Agent Outgoing | AGENTS | period, agent | PDF/Excel/CSV | `reports.view` |
| IVR Report | QUEUE & IVR | period, IVR | PDF/Excel/CSV | `reports.view` |
| Customer End to IVR | QUEUE & IVR | period, customer | PDF/Excel/CSV | `reports.view` |
| Queue Logs | QUEUE & IVR | period, queue | PDF/Excel/CSV | `reports.view` |
| Outgoing Calls | TELEPHONY & QUALITY | period, agent, provider | PDF/Excel/CSV | `reports.view` |
| Recordings | TELEPHONY & QUALITY | period | PDF/Excel/CSV | `reports.view` |

## Baseline matrix — scheduler

Scheduled reports are a dedicated operational workspace with a distinct domain: **schedule status** (`Active` / `Inactive` / `Disabled`) is separate from **execution state** (`Scheduled` / `Running` / `Completed` / `Failed` / `Retrying`). The UI must never merge them into one ambiguous badge.

| FIELD / ACTION | SOURCE | VERIFIED |
|---|---|---|
| Report type | mock repo | POC mock |
| Output format | mock repo | POC mock |
| Schedule type (Daily/Weekly/Monthly/Custom) | mock repo | POC mock |
| Schedule time / timezone | mock repo | POC mock (server timezone) |
| Target type (Emails/Users/Roles/Departments) | mock repo | POC mock |
| Recipients | mock repo | POC mock |
| Status (Active/Inactive/Disabled) | mock repo | POC mock |
| Execution state (Scheduled/Running/Completed/Failed/Retrying) | mock repo | POC mock |
| Last Run / Next Run | mock repo | POC mock |
| Create / Edit / Delete | mock repo | POC mock |
| View logs / Execution history | mock repo | POC mock |
| Retry | mock repo | POC mock |

## Data rule

Report Library loads **metadata only** — never every report result. Report results load only when a report is opened/run, per current architecture. Mock data lives behind the `ReportRepository` boundary (`domain/report-repository.ts`) and is deterministic; the backend remains authoritative.

## Preserved invariants

- No report calculations reimplemented in the frontend.
- No report removed for being visually awkward; no scheduling field simplified away.
- Exports only shown where supported; no browser-only fake exports.
- Permission awareness applied consistently (library, viewer, export, schedule, retry, logs) — server remains authoritative.
- Tenant boundaries never broadened.
- Unknown report type / format / execution state / status render safe fallbacks — never default to a false "Active"/"Completed".
- Queue Logs keeps raw telephony event semantics (`ENTERQUEUE`, `CONNECT`, `ABANDON`, `COMPLETECALLER`, `TRANSFER` examples).
- Recordings Report stays distinct from CDR recordings and Management Console recordings configuration.
