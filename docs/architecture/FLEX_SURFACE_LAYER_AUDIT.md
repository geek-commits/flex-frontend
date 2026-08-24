# FLEX Surface / Layer Audit — Phase 00

> **Program:** Plane-inspired pivot — Foundation (no route redesign)
> **Date:** 2026-08-21
> **Method:** inspected `resources/css/app.css` tokens + `resources/js/pages/*` + `features/*` surface/card usage.

## Canon (already in repo)

* **Canvas:** `--flex-workspace-canvas` (`--background` `oklch 0.982`) — neutral root, applied once at shell (`body bg-background`). Pages must not reintroduce canvas containers.
* **Surface:** `--flex-workspace-surface` (`--card` white), `--flex-workspace-surface-muted` (`oklch 0.986`) — primary work surface per workspace section.
* **Dividers:** `--flex-workspace-divider` `0.926`, `--flex-workspace-divider-strong` `0.896`, `--flex-table-grid` `0.926` — 1px structural, not decorative shadows.
* **Text:** `--flex-text-primary` `0.29` (`#333`), `--flex-text-secondary` `0.42`, `--flex-text-muted` `0.55` (`#777`).
* **Typography:** Inter Variable globally — metrics 18/24 Semi -0.1 already in `.flex-metric`, labels 12/16 `.flex-label`.

## Per-route audit

| Route | Canvas instances | Primary surface count | Nested Card count | Toolbar treatment | Table treatment | Action hierarchy | Visual debt |
|---|---|---|---|---|---|---|---|
| `agent` (Workspace) | 1 (shell) | 2 (CallManager + CRM host `crm-integration-host.tsx:51` `bg-flex-workspace-surface` + `agent-assist-panel` layer) | 0 decorative — CallManager uses surface layers, correct | Call controls explicit (telephony-critical) | — | primary Call + compact secondary | — |
| `agent/social` (`SocialWorkspacePage`) | 1 | 1 workbench (`FlexWorkbenchShell`) — correct sibling surfaces (list/detail/context) | 0 at shell; items are layers (`ConversationRow` hover) | `SocialChannelFilterControl` integrated | layers with `flex-table-grid` dividers | — | mobile list→detail now motion-aware (Phase 00 preserve) |
| `social` mobile | — | same shell, `lg:hidden` swap | — | — | — | — | — |
| `dashboard` (Contact Center) | 1 | 1 content surface (`FlexPageContent`) containing 4 `bg-flex-workspace-surface` blocks (`active-calls`, `queue-health`, `traffic-chart`, `operations-summary`) — each is a `border rounded-lg` block, not `Card` | 0 `Card` — correct (no nested-card debt here) | — | — | — | — |
| `admin/monitoring` (`AgentMonitoringRoster`) | 1 | 1 (`DataGridContainer`) | 0 | DataGrid toolbar | `flex-table-grid` vertical dividers + row dividers — canonical | — | — |
| `admin/cdr` | 1 | 1 (`DataGridContainer`) + toolbar separate | 0 | `cdr-toolbar` separate (integrated white workspace → controls left / search right — per exemplar) | canonical grid | Export non-functional (KD-005) but not visual | — |
| `admin/campaigns`, `admin/reports`, `admin/tenants` | 1 | 1 + toolbar | 0 | similar | canonical | — | — |
| `admin/management-console` | 1 | 1 directory (`ModuleDirectory`) | `console-module-item` uses `border bg-card` layers (3× `duration-flex` → now fixed) | `console-search` integrated | — | — | — |
| `admin/system`, `admin/health`, `customers/show` | 1 | `FlexPageContent` + **1 Card** (`Card`/`CardContent`) per section | 1 per section — **nested-card debt** to migrate to `layer` in Phases 3–6 | — | — | — | `customers/show` Timeline + `health` list intentionally Card at foundation; migrate to `surface → layer` in Phase 7 (Operational Modules) |
| `settings/*` | 1 | `SettingsCard` per section (Card wrapper) | 1 per section — debt | — | — | — | settings is out-of-scope for pivot Phase 0 |

**Totals (quick grep):** `Card` imports in `features` 84 hits — majority are report/queue/ivr `feature/*` form sheets and `MetricCard` (not page-level cards). Page-level debt is 5 routes above; form sheets remain `Card` as overlay content (correct — overlay, not nested workspace card).

## Migration inventory (pilot-first, §7)

| Primitive | Current | Target (§6) | Pilot | Risk |
|---|---|---|---|---|
| Dashboard blocks | `border rounded-lg bg-flex-workspace-surface` | `surface → layer` (keep as `layer`) | already `layer`-like — keep | Low |
| `customers/show`, `admin/health`, `admin/system` sections | `Card` | `surface-primary → layer-1` | Phase 7 Operational Modules | Low/Medium |
| Table shells | `DataGridContainer` decorative wrapper | remove decoration, rows + dividers + typography convey structure (§6 `Data should become the interface`) | Phase 3 Monitoring/CDR pilot | Medium |
| Toolbars | `IntegratedTableToolbar` duplicated per feature | single toolbar primitive (controls left / search right) | Phase 2 Page Primitives | Medium |

## Guardrails (no change in Phase 00)

* Canvas only once at root; surfaces as siblings; nested content uses layers.
* Headers stay compact (`FlexPageHeader` 12/16 metadata, 28px filters).
* No decorative DataGrid shells; color only for meaning; no new UI library.

No runtime behavior, routes, permissions, tenant, telephony, realtime, or CRM iframe changes in this phase.
