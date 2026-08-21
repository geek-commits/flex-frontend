# FLEX Shared Primitives Audit — Increment 1

> **Increment:** 1 — Baseline + Architecture Truth (no broad redesign)
> **Method:** Scanned `resources/js/components/{flex,ui,reui}`, `layouts/`, `features/*/components`, `hooks/`, `domain/` + `docs/design/*` exemplars. Classified per hardening §6.

## Classification legend

```
CANONICAL    — one owner, reused across workspaces, exemplar-aligned
PARTIAL      — exists but missing canonical contract (a11y, tenant, permission, or realtime)
DUPLICATED   — two+ implementations of same primitive
ROUTE-LOCAL  — correct locality but should delegate to shared primitive
LEGACY       — pre-Craft primitive kept for compat, not for new routes
MISSING      — documented in design system / manual but no shared owner
```

## Audit

| Primitive | Implementation(s) | Canonical candidate | Duplicates / route-locals | Known inconsistencies | Risk | Priority | Class |
|---|---|---|---|---|---|---|---|
| **FlexAppShell** | `layouts/app-layout.tsx`, `layouts/app/app-header-layout.tsx`, `layouts/app/app-sidebar-layout.tsx` | `app-layout.tsx` (`AppProviders` + `FlexLiveDataStatus` truth) | `agent-shell.tsx` / `admin-shell.tsx` thin wrappers | Shell nesting differs per workspace; LIVE/STALE badge is UI-only without reconnect semantics | Medium | P2 | PARTIAL |
| **FlexSidebar — PrimaryRail** | `components/flex/primary-rail.tsx` | `primary-rail.tsx` | — | Uses `NAVIGATION` + `has(capability)` filtering; `duration-flex-fast` silent fallback (KD-002) | Low | P2 | CANONICAL |
| **FlexSidebar — ContextSidebar** | `components/flex/context-sidebar.tsx` | `context-sidebar.tsx` | — | Permission filter before search required per parity §11 | Low | P2 | CANONICAL |
| **FlexTopBar / AppTopBar** | `components/flex/app-topbar.tsx` (clock `setInterval`) | `app-topbar.tsx` | — | Clock tick is isolated `setInterval` (harmless duplicate) | Low | P3 | CANONICAL |
| **PageHeader / PageContent** | `components/flex/flex-page-header.tsx`, `flex-page-content.tsx` | both | `features/*/ *-page.tsx` headers replicate spacing | Some pages bypass `FlexPageContent` padding | Low | P2 | PARTIAL |
| **FlexWorkbenchShell / SplitPane** | `components/flex/flex-workbench-shell.tsx` | `flex-workbench-shell.tsx` | — | Used by agent-workspace + social; divider semantics stable | Low | P2 | CANONICAL |
| **DataTable / DataGrid** | `components/reui/data-grid/*` (`data-grid.tsx`, `data-grid-column-header.tsx`) + `features/*/ *-table.tsx` wrappers | `reui/data-grid` as canonical operational layer | Per-feature table wrappers (CDR, campaigns, tenants, recovery, reports) replicate toolbar wiring | Alignment partly by convention not enforced: text/start, numeric/end, checkbox/center (§6 DataTable standard) not mechanically verified | **High** | **P1** | PARTIAL |
| **IntegratedTableToolbar** | `features/cdr/cdr-toolbar.tsx`, `features/campaigns/campaign-toolbar.tsx`, `features/tenants/tenants-toolbar.tsx`, `features/routing/*/toolbar` | `cdr-toolbar.tsx` (exemplar-aligned white workspace → controls left / search-actions right) | 6+ toolbar variants stack filter/search/table as separate cards | Avoid stacked cards unless structurally necessary (§6 Integrated toolbar) | Medium | P1 | DUPLICATED |
| **Filters / Search** | `components/flex/date-range-select.tsx`, `search-highlight.tsx`, per-feature `*-filter.tsx` | `date-range-select.tsx` + `DataGrid` toolbar slots | ChannelFilter, queue filter, tenant status filter all route-local | `SocialChannelFilterControl` uses correct `duration-[var(--flex-duration-*)]` (KD-002 proven fix) vs rail/cdr still `duration-flex-*` | Medium | P1 | DUPLICATED |
| **Status chips / Badge** | `components/flex/status-badge.tsx`, `flex-status.tsx`, `lib/status-styles.ts` | `status-badge.tsx` + `status-styles.ts` as mapping | `FlexStatus` duplicates badge semantics | Token `FlexStatus` vs `StatusBadge` naming overlap | Low | P2 | PARTIAL |
| **Buttons / ButtonGroup** | `components/ui/button.tsx`, `button-group.tsx` | `ui/button.tsx` (shadcn + `--flex-*` tokens) | — | — | Low | P3 | CANONICAL |
| **Dialogs / Sheets** | `components/ui/dialog.tsx`, `alert-dialog.tsx`, `sheet.tsx`, `flex-detail-sheet.tsx` | `ui/dialog.tsx` + `flex-detail-sheet.tsx` (exemplar: detail sheets) | AlertDialog overlays dialog | Sheet `data-open:duration-500/300` over-range vs overlay 200 ms (§6, audit) | Medium | P1 | PARTIAL |
| **Dropdowns** | `components/ui/dropdown-menu.tsx` | `ui/dropdown-menu.tsx` | — | `backdrop-blur-2xl` removed in 4fe4, but `animate-none!` still defeats enter/exit (KD-001) + `duration-flex-*` no-op (KD-002) | Medium | P1 | PARTIAL |
| **Tooltips** | `components/ui/tooltip.tsx` | `ui/tooltip.tsx` | — | `duration-100` / slide — dense icon controls need fast+subtle per audit | Low | P2 | CANONICAL |
| **Toasts / Sonner** | `hooks/use-flash-toast.ts`, `components/ui/sonner.tsx`, `lib: sonner` | `use-flash-toast.ts` | — | Flash toast wired to Inertia flash | Low | P3 | CANONICAL |
| **Empty / Loading / Error** | `components/flex/flex-empty-state.tsx`, `flex-loading-state.tsx`, `flex-error-state.tsx`, `flex-live-data-status.tsx` | trio + `flex-live-data-status.tsx` | Per-feature `FlexEmptyState` with route-local empty copy | Async states not standardized (§F): cold loading vs refreshing vs reconnecting vs offline vs permission-denied not distinguished | **High** | **P1** | PARTIAL |
| **Avatars** | `components/ui/avatar.tsx`, `components/flex/social/social-channel-avatar.tsx` | `ui/avatar.tsx` | Social avatar duplicates with channel badge overlay | — | Low | P3 | PARTIAL |
| **SocialChannelIcon** | `components/flex/social/social-channel-icon.tsx` (`@assets/social/*.svg?react` via `vite-plugin-svgr`) | `social-channel-icon.tsx` | — | Approved icons in `resources/assets/flex/icons/social/`; validated via `icons:audit` | Low | P3 | CANONICAL |
| **Forms** | `components/ui/{input,select,checkbox,radio,textarea,label,calendar}.tsx` + `react-hook-form` + `zod` | `ui/*` primitives | `features/*/ *-form-sheet.tsx` sheets replicate form wiring (6+ sheets) | No shared `FlexForm` wrapper for consistent error/help + focus order | Medium | P2 | PARTIAL |
| **Pagination / Date-Range** | `components/reui/data-grid/data-grid-pagination.tsx`, `components/flex/date-range-select.tsx` | both | — | — | Low | P3 | CANONICAL |
| **Permission guards** | `auth/capabilities.tsx` (`CapabilityProvider`, `ROLE_CAPABILITIES`, `NAVIGATION`) | `capabilities.tsx` single source | `components/flex/my-role-access.tsx`, `flex-profile-menu.tsx` guard via `has()` | Role-string checks do NOT scatter — `has(capability)` is canonical, but backend enforcement is DEFERRED | **High** | **P0** | PARTIAL |
| **Tenant context** | `features/tenants/tenant-context.tsx` | `tenant-context.tsx` | `TenantContextIndicator` + platform/tenant UI | Not scoping data, not persisted, single in-memory context — see ADR-002 | **High** | **P0** | PARTIAL |
| **Icons** | `resources/assets/flex/icons/**`, `resources/assets/flex/brand/**` via `vite-plugin-svgr` | `iconography.md` + `validate-flex-icons.py` | `lucide-react` secondary set, `@assets/social` separate root | Freeze per `iconography-sources.md` — validated | Low | P3 | CANONICAL |

## Prioritized migration

| Priority | Focus | Deliverable |
|---|---|---|
| **P0** | Tenant context scoping + permission boundary (no refactor in Inc.1 — ADRs only) | ADR-002, ADR-005 (Inc.1) → fixes in Inc.3 |
| **P1** | DataTable alignment enforcement, IntegratedTableToolbar consolidation, async-state standardization, tooltip/dialog/sheet token alignment, `duration-flex-*` → `duration-[var(--flex-duration-*)]` sweep, dropdown `animate-none!` disposition | Inc.4 primitive consolidation |
| **P2** | PageHeader/PageContent adherence, form wrapper, FlexAppShell nesting | Inc.4 |
| **P3** | Button/toast/avatar/icon docs only | — |

## Notes

* No new visual language or route renaming in this audit (§37 freeze). Visual changes only when tied to reliability/a11y/perf.
* `MISSING` primitives at baseline: shared `FlexForm` error/focus contract, shared `AsyncState` primitive (cold/refreshing/reconnecting/offline/empty/no-results/permission-denied/partial-failure/stale/retrying — §6).
