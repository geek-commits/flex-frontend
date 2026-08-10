# PHASE 1 — Free ReUI Design Discovery + Candidate Ledger + Visual Concept

> Phase 1 deliverable per `PHASES.md`. ReUI MCP discovery for every major POC need, free-only filter, compatibility gate, and one coherent visual concept.

## Free-only proof

All selected items are **free** (ReUI components + c-* examples + shadcn components). No paid blocks, no paid templates, no paid icon packs, no license key. ReUI searches were run with the free plan; premium blocks/icons were rejected.

## Compatibility gate result

- **ReUI prerequisites met**: React 19 ✓, Tailwind v4 ✓, base library `base` (project `base-luma`) ✓.
- **Primitive-base finding**: the repository shipped a mixed set — `button` (Base UI), `select/checkbox/dropdown-menu/separator/tooltip/dialog/sheet` (Radix), pure-HTML (`input/skeleton/spinner`). ReUI's variant is Base UI and imports those primitives internally.
- **Decision**: accept ReUI's Base UI variants (8 files overwritten: checkbox, dropdown-menu, input, select, separator, skeleton, spinner, tooltip) to make the app consistent with its declared `base-luma` base, then fix the bounded set of consumer usages (see Changes). This was required for ReUI components to work; it is not an upgrade of the whole application.

## Candidate ledger

| Need | Candidate | Free? | API inspected? | Compatibility | Dependencies | Visual fit | Selected / Rejected | Reason |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Data Grid | ReUI `data-grid` (TanStack v9) | yes | yes (MCP inline API) | React 19, TW4, base ✓ | `@tanstack/react-table`, `@tanstack/react-virtual`, `@dnd-kit/*` | dense layout, sortable, column visibility, pagination, skeleton/empty | **SELECTED** | Reference working-list; sortable/dense/columnsVisibility/pagination/isLoading/empty built in |
| Data Grid (fallback) | Enhance custom `FlexDataTable` | n/a | n/a | n/a | none | — | rejected | Only a fallback; ReUI grid is compatible |
| Filters | ReUI `filters` | yes | yes | base ✓ | `@base-ui/react`, cva (present) | chips + operators + field types | **SELECTED** | Structured field/operator/value model maps to `{id, field, operator, values}` |
| Date range | ReUI `date-selector` | yes | yes | base ✓ | `date-fns`, `react-day-picker` | period + between operator | **SELECTED** | Free range control for CDR; maps to `DateSelectorValue` |
| Date range (fallback) | Native `<input type="date">` | n/a | n/a | n/a | none | — | rejected | date-selector is free and richer |
| Command / global search | shadcn `command` (cmdk) | yes | yes (registry item) | base-luma ✓ | `cmdk` (+ dialog, input-group) | proven command palette | **SELECTED** (install in Phase 2) | No free ReUI command exists; cmdk is the standard keyboard-nav surface |
| Primary navigation | Existing Flex `PrimaryRail` | n/a | n/a | n/a | none | already Flex | **SELECTED** (enhance) | Keep Flex identity; make it capability-aware |
| Context sidebar | Existing Flex `ContextSidebar` | n/a | n/a | n/a | none | already Flex | **SELECTED** (enhance) | Add search (`Search settings...`), capability filtering |
| Sheet / Dialog | Existing shadcn `sheet` + `dialog` | n/a | n/a | n/a | none | — | **SELECTED** | Already installed; used per policy (Sheet=5-8 fields, Dialog=confirm) |
| Autocomplete | ReUI `autocomplete` | yes | not needed yet | base ✓ | — | — | deferred | No POC screen needs it yet |
| Stepper | ReUI `stepper` | yes | no | base ✓ | — | — | deferred | Complex IVR config is out of POC scope |
| Kanban | ReUI `kanban` | yes | no | base ✓ | — | — | rejected | No POC workflow needs a board |
| Skeleton / empty / error | ReUI grid `isLoading`/`emptyMessage` + shadcn `skeleton`/`spinner`/`alert` | yes | yes | ✓ | none | — | **SELECTED** | Built into data-grid; no custom empty states |

## Installed items (Phase 1)

```
bunx --bun shadcn@latest add @reui/data-grid @reui/filters @reui/date-selector --yes
```

Free. Installed ReUI source under `resources/js/components/reui/**` (data-grid feature bundle, filters, date-selector, badge). Overwrote 8 primitives to Base UI (see compatibility result). Appended ~18 color tokens to `resources/css/app.css` (`--color-{info,warning,success,invert,...}`) which map to base vars defined in `:root`/`.dark`.

## Dependencies added (and why)

- `@tanstack/react-table`, `@tanstack/react-virtual` — ReUI data-grid engine (single table lib; none existed).
- `@dnd-kit/core|modifiers|sortable|utilities` — ReUI data-grid column/row DnD (unused features can be left off; installed as grid deps).
- `date-fns`, `react-day-picker` — ReUI date-selector (single date lib; none existed).
- `cmdk` — to be added in Phase 2 with shadcn `command`.
- No duplicate table/date/icon/state libraries introduced.

## Visual concept (recorded, single source of truth)

- **Shell geometry**: fixed `w-16` PrimaryRail (collapsed icon rail, Flex brand); optional `w-56` ContextSidebar; `h-14` sticky TopBar; main workspace `flex-1` with `p-4 md:p-6`. Agent shell reserves a `w-80 md:w-96` CallManager panel on the right.
- **Content max behavior**: operational pages span the workspace (no max-width cage); welcome/settings keep their existing widths.
- **Control density**: compact. Toolbar controls `h-9`, table cells `py-2.5/3`, text `text-xs`; ReUI grid `dense` table layout; MetricCard `p-4`.
- **Table density**: dense, thin `divide-y divide-border`, sticky header off by default, horizontal scroll for wide grids.
- **Radius philosophy**: restrained — `rounded-md`/`rounded-lg` on controls, `rounded-lg` on cards/grid; the luma preset's larger radii are toned down for enterprise surfaces where it matters.
- **Border/elevation**: thin cool borders (`border-border`), `shadow-2xs` on cards only; no large shadows, no glass except the existing popover treatment.
- **Typography**: Raleway Variable (preset), 13px base UI, `text-xs` denser data, uppercase tracking labels for section headers, mono for numbers/timers/phone.
- **Icon family**: `@remixicon/react` (outline style) everywhere in Flex UI; lucide only inside untouched shadcn primitives.
- **Action hierarchy**: one primary (solid `bg-primary`) per page; secondary = outline; quiet = ghost; destructive = destructive variant only for delete/end. Icons in buttons use the Flex convention (icon + label, `gap-1.5`).
- **Hover/focus/selected**: `hover:bg-muted/70`, active nav = `bg-primary text-primary-foreground`, context nav active = `bg-primary/10 text-primary`; focus rings via ring token.
- **Status**: Flex domain tokens (`--status-*`/`StatusBadge`) for agent/connection/campaign/AI; non-color indicator = status dot.
- **Empty/loading/error**: grid `isLoading` skeleton rows, `emptyMessage`, error row; MetricCard skeleton; no-match distinct from empty.
- **Search**: three scopes (global `Search Flex...`, sidebar `Search settings...`, page `Search calls...`), safe `SearchHighlight` with `<mark>`.
- **Motion**: minimal — transitions on hover/focus only; respect reduced motion via tw-animate-css.

## Changes made (Phase 1)

- `components.json` — left unchanged (experimental registry edits rejected by this CLI version).
- `resources/css/app.css` — ReUI tokens appended (auto).
- `resources/js/components/ui/{checkbox,dropdown-menu,input,select,separator,skeleton,spinner,tooltip}.tsx` — Base UI variants (auto install).
- `resources/js/components/ui/spinner.tsx` — fixed remixicon typing (`Omit<SVGProps,'children'>`).
- Consumers converted to Base UI APIs:
  - `app.tsx` — `TooltipProvider delayDuration` → `delay`; **layout resolver now returns `null` for `admin/*` and `agent/*`** so `AdminShell`/`AgentShell` are the true shells (removed double sidebar).
  - `primary-rail.tsx` — `TooltipTrigger asChild` → `render`; `delayDuration` → `delay`.
  - `app-header.tsx`, `nav-user.tsx`, `sidebar.tsx`, `user-menu-content.tsx` — `asChild` → `render`.
  - `cdr.tsx`, `agent/support.tsx`, `agent/troubleshooting.tsx` — `Select onValueChange` handles `string | null`.
- **Verification**: `tsc --noEmit` clean, `npm run build` succeeds, 39 Pest tests pass, browser smoke-test of dashboard/CDR/campaigns/agent pages (no console errors, Base UI Select interaction verified).

## Rejected paid items

- ReUI `data-grid-*` premium blocks, premium templates, Motion Icons — all rejected (license-gated).

## Status

READY FOR NEXT PHASE
