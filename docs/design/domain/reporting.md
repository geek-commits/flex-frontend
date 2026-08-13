# domain — Reports & Scheduled Reports

Defines the UI treatment and baseline for the Reports & Scheduled Reports surfaces. This is a **frontend modernization**, not a reporting-engine rewrite. Report calculations, backend contracts, permissions, tenant boundaries, and generation logic are preserved.

## Workspace

**Administration** (configure and operate the contact center). Primary users: Supervisor, Administrator, Super Administrator per actual permission. Reports is a high-density operational analysis workspace, not a decorative catalog.

## Current runtime (baseline, 2026-08)

- Single route: `/admin/reports` → `pages/admin/reports.tsx` (route registered in `routes/web.php`, permission surface `reports.view`).
- The page is **fully hardcoded** — an inline `reportCatalog` (9 reports across 7 categories), a `scheduledReports` array (3 jobs), and a date-range card. There is **no repository, no data file, no capability filtering, no context sidebar, and no report detail route**.
- **Backend:** no reporting/scheduling backend exists. Parity tracker flags `REPORT-002…013`, `REPORT-014…017`, `SCHED-001…030` as `MANUAL_ONLY`; gap `GAP-006` confirms no runtime/API mapping.
- **Permission:** only `reports.view` exists (`auth/capabilities.tsx`), held by `super-admin` and `admin`, not `agent`. There is **no** `reports.manage`; do not invent one.
- **Tenant:** single implicit tenant. No tenant-switching UI exists; `tenant-context.md` records it as future treatment only. Reports data, schedules, recipients, and logs remain scoped to the single tenant.

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
