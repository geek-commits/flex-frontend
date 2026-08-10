# Exemplar — Call Detail Records (CDR)

Route: `/admin/cdr` · `features/cdr/*` · page `pages/admin/cdr.tsx`

## What this page proves

- **Operational table density** — a high-volume records table with dense but scannable rows; more data per screen, fewer decorative elements.
- **Search/filter hierarchy** — toolbar search plus quick filters drive the same query model; controls sit above the table, not scattered in it.
- **Status treatment** — call outcomes render as `FlexStatus` (dot + label); color is never the only cue.
- **Row inspection** — hover indicates interactivity; clicking a row opens the contextual **detail sheet** (`flex-detail-sheet`).
- **Detail sheet** — contextual inspection of a single record without leaving the list; closing restores focus and list context.
- **Pagination and result metadata** — explicit page controls and "shown of total" text; the table is an active workspace, not a dump.
- **Loading / empty / error** — skeleton loading, a real empty state, and a resilient error state with recovery; each uses the shared feedback primitives.

## Patterns to reuse

- Row → detail sheet interaction model (`04-interaction-rules.md`);
- shared feedback primitives for loading/empty/error (`07-feedback-states.md`);
- `FlexStatus` for all status display;
- the Supervision + Operations contextual sidebar groups (`02-navigation-model.md`).

## What not to copy blindly

- CDR-specific filters and columns — queue/outcome fields belong to call records, not to every table.
- The detail sheet's specific fields — reuse the sheet *pattern*, not the CDR field set.
- Keep pagination semantics matched to the actual data source when new tables are built.
