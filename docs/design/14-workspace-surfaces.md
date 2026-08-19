# FLEX Workspace Surfaces

> **FLEX Craft Infrastructure v1.0 — Workspace Partition** (Phase B of the White Workspace visual redesign).

Defines how FLEX work surfaces are constructed: neutral canvas, white work surface, structural dividers, split panes, and the card-reduction policy. This document is the visual-system truth for workspace geometry; it extends the metric/token rules in `13-visual-language.md`.

## 1. Principle

Every operational surface follows the same grammar:

```text
neutral canvas  →  white primary workspace  →  1px structural dividers  →  flat internal sections
```

- The **canvas** is the neutral page background behind everything.
- The **work surface** is a bounded white surface that owns the outer border, radius, and clipping.
- **Dividers** separate panes, toolbars, table rows, and sidebars.
- Internal sections are **flat** — they do not get their own card frames.
- Shadows stay minimal; nested cards are reduced.

Do not add decorative frames, gradients, or per-section card borders to surfaces that are structural.

## 2. Tokens

All surfaces and dividers are driven by semantic tokens (light/dark equivalents; no hardcoded light hexes). See the `:root` / `.dark` blocks in `my-app/resources/css/app.css`.

| Token | Light value | Dark equivalent | Role |
|---|---|---|---|
| `--flex-workspace-canvas` | `var(--background)` (near-white neutral `#F7F8FA`-family) | canvas | page background |
| `--flex-workspace-surface` | `#FFFFFF` | elevated dark surface | primary work surface |
| `--flex-workspace-surface-muted` | `#FBFBFC` | slightly raised | toolbars / headers within a surface |
| `--flex-workspace-divider` | `#E7E9EE` | translucent white | quiet structural divider |
| `--flex-workspace-divider-strong` | `#DDE1E7` | stronger translucent white | stronger divider |

Tailwind utilities are exposed as `bg-flex-workspace-canvas`, `bg-flex-workspace-surface`, `bg-flex-workspace-surface-muted`, `border-flex-workspace-divider`, `border-flex-workspace-divider-strong`.

### When to use which

- **Canvas** = page background (the `AdminShell` / `AgentShell` `bg-background`).
- **Surface** = the bounded white workspace (a table, a pane, a workbench).
- **Surface-muted** = a toolbar or header strip attached to the top of a surface.
- **Divider** = pane boundaries, toolbar bottom edge, table row/column separators.
- Do not use surface tokens inside a true semantic card (those stay `bg-card`).

## 3. Primitive: `FlexWorkbenchShell`

`my-app/resources/js/components/flex/flex-workbench-shell.tsx` is the canonical bounded work surface.

- Renders: white surface + 1px divider border + `rounded-lg` (14px) + clipping + optional toolbar slot.
- **Height is opt-in**: pass `h-full min-h-0` for a full-height workspace (e.g. Social); omit it for a growing page surface (e.g. a table on a scrolling admin page).
- Internal panes stay flat inside the shell; do not nest another bordered surface inside it.

### When NOT to use it

- Dashboards / KPI canvases (keep metric cards; only operational tables get the surface).
- Configuration form grids (keep content-section cards).
- Auth pages, highly specialized telephony control surfaces.

### Integrated table toolbar

For DataGrid workspaces, the table toolbar is rendered **inside** the shell via the `toolbar` slot, so the toolbar and the table are one bounded surface (a single `rounded-lg` frame, not a stack of floating cards). See section 5 for the card-reduction rationale.

```text
<FlexWorkbenchShell toolbar={<DataWorkspaceToolbar … />}>
  <DataTable … />
</FlexWorkbenchShell>
```

The toolbar groups controls by intent:

- **Left group — scope & filters:** quick-filter segmented control (e.g. status/All/Active), `DateRangeSelect`, Filters, and a contextual `Clear` only when a filter is active.
- **Right group — search, columns, actions:** a compact search input, the `DataGridColumnVisibility` Columns control, and real per-route actions (Refresh, Add/New) — never invented create/export buttons.

Rules:

- The toolbar uses `bg-flex-workspace-surface-muted` and the shell's bottom divider (already provided by `FlexWorkbenchShell`).
- Each page passes the live `Table` instance into its toolbar so column-visibility and actions share one source of truth.
- On narrow widths the groups stack (scope left, then search/actions) via responsive utilities; there is no separate filter card.
- Realtime raw tables (e.g. Agent Monitoring, recovery triage) keep their native controls — do not force them into this toolbar, and never duplicate realtime controls or polling.

## 4. Semantic column alignment

Align table columns by data kind, not by guessing. Column meta declares an alignment and the grid resolves it consistently across header and body cells.

- `DataGridColumnMeta` carries `kind` (identity, text, status, numeric, currency, percentage, date, time, duration, selection, action, icon) and an optional explicit `align` (`start` | `end` | `center`).
- Explicit `align` wins; otherwise the kind implies a default (`start` unless the kind is a numeric/currency/percentage/duration, which are right-aligned).
- Alignment is applied through a single resolver shared by the header and both body-cell render paths, so a column never reads left-aligned in one state and right-aligned in another.
- Raw `flex-table-grid` tables use a matching `alignClass('start' | 'end' | 'center')` helper over their `{ label, align }` header arrays.
- Never center-align by default; actions and icons use `center`, text/identity/status use `start`.

## 5. Split panes

Split-pane workspaces use flat panes separated by the divider token:

```text
<FlexWorkbenchShell className="h-full min-h-0">
  <div className="flex h-full">
    <aside className="w-[360px] shrink-0 border-r border-flex-workspace-divider">…list…</aside>
    <div className="flex-1 min-w-0 border-l border-flex-workspace-divider">…detail…</div>
  </div>
</FlexWorkbenchShell>
```

- Panes are flat (no per-pane card border beyond the divider).
- Mobile/tablet flow collapses to list → detail (single pane) via responsive `lg:` utilities.
- Do not invent a pane the runtime does not support (e.g. an AI context panel).

## 6. Card-reduction policy

Classify every surface:

```text
A. workspace        → white work surface (FlexWorkbenchShell)
B. persistent pane  → flat, divider-separated
C. content section  → flat section inside a surface
D. true card        → keep card treatment
E. overlay          → sheet / dialog / toast
```

**Keep cards for:** isolated KPI clusters, standalone summaries, small alert/config entities, compact empty-state action blocks.

**Do not card-wrap by default:** sidebars, conversation lists, conversation threads, persistent detail panes, tables, workspace toolbars.

Concretely:

- Tables sit on the white surface (shell or surface tokens), not inside a Card.
- Toolbars on the canvas keep compact segmented control groups (fine as small clusters).
- Detail pages: entity header and section blocks are content sections — flatten a table-in-card to a bare surface.

## 7. Divider consistency

All structural boundaries use semantic divider tokens:

- vertical pane boundaries
- horizontal toolbar boundaries
- table row separators
- table column separators
- sidebar/content partitions

`border-border` (→ `--flex-border`) remains valid for non-structural borders and true cards; structural dividers inside a work surface use `border-flex-workspace-divider`.

## 8. Quality gates

Apply this document when building or refactoring an operational surface:

- [ ] The surface uses canvas → surface → divider grammar.
- [ ] Surface height is opt-in (`h-full` only for full-height workspaces).
- [ ] No nested card frames inside a work surface.
- [ ] Dividers use semantic divider tokens.
- [ ] DataGrid toolbar renders inside the shell slot, scope/filters left + search/columns/actions right.
- [ ] Columns are aligned by kind via the shared resolver (header mirrors body).
- [ ] True semantic cards (KPI clusters, summaries, alerts) are preserved.
- [ ] No hardcoded light hexes in dark mode.
- [ ] Routes, behavior, permissions, tenant scope, APIs, iframe boundary, and telephony are unchanged.
- [ ] Verified in light + dark + desktop + mobile.