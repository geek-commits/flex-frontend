# FLEX Page Primitives — Phase 02

> **Program:** Plane-inspired pivot — compact page grammar, pilot-only migration.

## Compact header

`FlexPageHeader` via `AdminShell title/subtitle` — `title 20px semi/tight text-flex-text-primary`, `description 12px muted`, `meta 11px`, `eyebrow 12px brand`. Layout `flex-wrap gap-x-6 gap-y-3`, actions `gap-2`. No hero framing.

## Context tabs

`ui/tabs.tsx` `TabsList variant="line"` (`gap-1 bg-transparent`) for views inside a product area (e.g. Roles → Permissions). `TabsTrigger` `text-sm font-medium rounded-full` with `after h-0.5 bottom -5px` active underline. Use `line` for contextual views, `default pill bg-muted` for filter pills (CDR/campaigns). Do not merge URLs.

Pilot: `features/access-management/roles/roles-permissions-page.tsx` now `TabsList variant="line"`.

## Integrated toolbar

Host `FlexWorkbenchShell toolbar` (`shrink-0 border-b bg-flex-workspace-surface-muted px-3 py-2.5`). Composition `flex-col gap-3 lg:flex-row lg:items-center lg:justify-between` — left `scope/filters/date/queue gap-2 flex-wrap`, right `search lg:w-64 pl-8 Input size sm / columns / refresh / primary CTA size sm gap-1.5`. Reuse existing filter/search/query behavior. CDR and campaigns already canonical; queues/tenants inline filters remain debt for Phase 06 pilot.

## Layer-row

`DataGridTableBodyRow hover:bg-muted/40 selected:bg-muted/50 border-b border-flex-table-grid` → maps to `--flex-layer-hover/active/selected` (Phase 00 tokens). Custom tables (`scheduled-reports-table border-b hover:bg-muted/30`) mirror. Settings `Card` remains overlay, not row layer.

States: `default transparent → hover bg-flex-layer-hover → active bg-flex-layer-active → selected bg-flex-layer-selected border-flex-workspace-divider-strong → disabled opacity-50`.

## Action hierarchy

`ui/button.tsx cva` — `default bg-primary` (one per toolbar), `outline size sm gap-1.5 text-xs` (secondary: Filters/Clear/Columns/Refresh), `ghost -ml-2 / icon-xs size-6` (utility/overflow), `ghost text-destructive` (destructive — not `variant destructive`). Call-critical (`call-manager`) remains explicitly visible.

## Empty / loading / error

`FlexEmptyState py-10 gap-2 title sm semibold / desc xs muted max-w-sm` — `illustration empty-queues` for true empty, `icon empty-inbox` for filtered. `FlexErrorState` fixed `error xl danger` + `outline Refresh`. `Skeleton h-12 ×3` fallback for queues/ivr (not `FlexLoadingState`) — concise operational.

No query behavior changed; `Tabs` semantics `role=tab`, toolbar controls labeled, icon actions `aria-label`, visible `focus-visible:ring-2`.
