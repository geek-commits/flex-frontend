# FLEX Workspace Surfaces

> **FLEX Craft Infrastructure v1.0 — Workspace Partition** (Phase B of the White Workspace visual redesign).

Defines how FLEX work surfaces are constructed: neutral canvas, continuous work surface, selective dividers, split panes, and the card-reduction policy. This extends the metric/token rules in `13-visual-language.md`.

## 1. Principle

Every operational surface follows this grammar:

```text
neutral canvas  →  continuous white work surface  →  selective separators  →  flat internal sections
```

- The **canvas** is the neutral page background behind everything.
- The **work surface** uses white surface color and clipping without a page-level perimeter outline. Page-level workbenches stay square and borderless; semantic cards and contained panels keep a restrained radius and outline when that boundary distinguishes a separate unit.
- **Dividers** separate table rows and distinct persistent panes when they improve scanning.
- Internal sections are **flat** unless they are true cards (such as isolated metrics or diagnostics) or distinct embedded panels. Use one rounded frame for a semantic unit; avoid nested duplicate frames.
- The sidebar and work surface share a continuous edge with no full-height seam or inset shadow.
- The global header and work surface share a continuous edge without a decorative bottom rule.
- Shadows stay minimal; nested frames are removed.

Do not add decorative frames, gradients, or per-section borders to structural surfaces.

## 2. Tokens

All surfaces and dividers are driven by semantic tokens (light/dark equivalents; no hardcoded light hexes). See the `:root` / `.dark` blocks in `my-app/resources/css/app.css`.

| Token | Light value | Dark equivalent | Role |
|---|---|---|---|
| `--flex-workspace-canvas` | `var(--background)` (near-white neutral `#F7F8FA`-family) | canvas | page background |
| `--flex-workspace-surface` | `#FFFFFF` | elevated dark surface | primary work surface |
| `--flex-workspace-surface-muted` | `#FBFBFC` | slightly raised | toolbars / headers within a surface |
| `--flex-workspace-divider` | `oklch(0.93 0.0025 250)` — hairline 1px achromatic (Plane pivot, chroma <0.004) | `oklch(1 0 0 / 0.10)` | quiet structural divider |
| `--flex-workspace-divider-strong` | `#DDE1E7` | `oklch(1 0 0 / 0.20)` | stronger divider |

Tailwind utilities are exposed as `bg-flex-workspace-canvas`, `bg-flex-workspace-surface`, `bg-flex-workspace-surface-muted`, `border-flex-workspace-divider`, `border-flex-workspace-divider-strong`.

### When to use which

- **Canvas** = page background (the `AdminShell` / `AgentShell` `bg-background`).
- **Surface** = the continuous white workspace (a table, a pane, a workbench).
- **Surface-muted** = a toolbar or header strip attached to the top of a surface.
- **Divider** = distinct pane boundaries, toolbar bottom edge, and table row separators.
- Do not use surface tokens inside a true semantic card (those stay `bg-card`).

## 3. Primitive: `FlexWorkbenchShell`

`my-app/resources/js/components/flex/flex-workbench-shell.tsx` is the canonical continuous work surface.

- Renders: white surface + clipping + optional toolbar slot. No page-level outline or shadow.
- **Height is opt-in**: pass `h-full min-h-0` for a full-height workspace (e.g. Social); omit it for a growing page surface (e.g. a table on a scrolling admin page).
- Internal panes stay flat inside the shell; do not nest another framed surface inside it.

### When NOT to use it

- Dashboards / KPI canvases (keep metric cards; only operational tables get the surface).
- Configuration form grids (keep content-section cards).
- Auth pages, highly specialized telephony control surfaces.

### Integrated table toolbar

For DataGrid workspaces, the table toolbar is rendered **inside** the shell via the `toolbar` slot, so the toolbar and table read as one continuous surface, not a stack of floating cards. See section 5 for the card-reduction rationale.

```text
<FlexWorkbenchShell toolbar={<DataWorkspaceToolbar … />}>
  <DataTable … />
</FlexWorkbenchShell>
```

The toolbar groups controls by intent:

- **Left group — scope & filters:** quick-filter segmented control (e.g. status/All/Active), `DateRangeSelect`, Filters, and a contextual `Clear` only when a filter is active.
- **Right group — search, columns, actions:** a compact search input, the `DataGridColumnVisibility` Columns control, and real per-route actions (Refresh, Add/New) — never invented create/export buttons.

Rules:

- The toolbar uses `bg-flex-workspace-surface-muted` and one subtle bottom divider.
- Each page passes the live `Table` instance into its toolbar so column-visibility and actions share one source of truth.
- On narrow widths the groups stack (scope left, then search/actions) via responsive utilities; there is no separate filter card.
- `FlexDataWorkspaceToolbar` owns this responsive two-group layout. Routes pass their live scope controls and actions into it instead of recreating the outer toolbar frame.
- Realtime DataGrid surfaces (e.g. Agent Monitoring) use the same integrated toolbar but without pagination, and with `loadingMode="spinner"` (the skeleton path requires `pagination.pageSize`). Realtime raw tables that keep native controls (e.g. recovery triage) are not forced into this toolbar — never duplicate realtime controls or polling.

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

- Panes are flat; one subtle divider may mark a distinct persistent pane boundary.
- Mobile/tablet flow collapses to list → detail (single pane) via responsive `lg:` utilities.
- Do not invent a pane the runtime does not support (e.g. an AI context panel).

### Vertical call workspaces

Call-scoped Agent surfaces may stack when the primary call task and its
supporting context share the same desktop work surface:

```text
<div className="grid h-full min-h-0 grid-rows-[minmax(0,3fr)_1px_minmax(0,2fr)]">
  <section>Call Manager</section>
  <div className="h-px bg-flex-workspace-divider" />
  <section>Agent Assist</section>
</div>
```

- The primary call surface occupies roughly 60% of the height; supporting
  context occupies roughly 40%.
- Use the semantic workspace divider token for the horizontal boundary.
- Collapse the supporting pane to an explicit restore bar when the agent hides
  it; keep its call-scoped runtime session alive.
- On mobile, prefer the owning surface's single-pane mode rather than mounting
  a second stacked pane.

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

- Tables sit on the continuous white surface, not inside a Card or outlined workbench.
- Toolbars on the canvas keep compact segmented control groups (fine as small clusters).
- Detail pages: entity header and section blocks are content sections — flatten a table-in-card to a bare surface.

## 7. Divider consistency

Use semantic divider tokens only for useful structural boundaries:

- vertical pane boundaries
- horizontal toolbar boundaries
- table row separators

Keep control outlines, status borders, focus rings, and the boundary of a true card or contained panel. Use rounded corners to distinguish those semantic units; do not round or outline the page-level workbench.

Do not draw vertical table column rules or a full-height sidebar/content partition. `border-border` remains valid for controls, focus states, status treatments, and true cards. Useful row and pane separators use `border-flex-workspace-divider`.

## 8. Plane pivot primitives

- `FlexViewSwitcher` — capsule view toggle (RESEARCH §7.3).
- `FlexGroupHeader` — `h-[43px] bg-flex-workspace-surface-muted` group bar, label 14/500 muted + count pill.
- `FlexListRow` — `min-h-11 py-3 px-[var(--flex-space-list-x)] border-b` row, title 13/400, ID 12/500 muted, hover `bg-flex-layer-hover`.
- `FlexKanbanCard` / `FlexKanbanColumn` — `rounded-md border p-3` card, board column `w-[280px]`.
- Shell geometry: full-width 56px global header above a fixed icon rail and work surface. Do not draw a full-height hard rule or inset shadow at the rail boundary.
- Keep horizontal row separators. Remove vertical table rules and page-level work-surface outlines.

Topbar search: centered `w-[364px] h-7 rounded-lg bg-flex-workspace-surface-muted border-flex-workspace-divider` (`GlobalSearchTrigger`) within the full-width global header.

## 9. Quality gates

Apply this document when building or refactoring an operational surface:

- [ ] The surface uses canvas → continuous work surface → selective separator grammar.
- [ ] Surface height is opt-in (`h-full` only for full-height workspaces).
- [ ] No nested card frames inside a work surface.
- [ ] Row and persistent pane separators use semantic divider tokens; no vertical table rules or rail seam.
- [ ] DataGrid toolbar renders inside the shell slot, scope/filters left + search/columns/actions right.
- [ ] Columns are aligned by kind via the shared resolver (header mirrors body).
- [ ] True semantic cards (KPI clusters, summaries, alerts) are preserved.
- [ ] No hardcoded light hexes in dark mode.
- [ ] Routes, behavior, permissions, tenant scope, APIs, iframe boundary, and telephony are unchanged.
- [ ] Verified in light + dark + desktop + mobile.
