# 04 — Interaction Rules

Defines how FLEX surfaces overlays, rows, actions, destructive operations, and spatial continuity. The proven CDR and Campaigns routes are the reference implementations (see `exemplars/`).

## Overlay decision model

```text
Dialog  → confirmation or a short, focused task
Sheet   → contextual inspection or quick edit
Full Page → complex workflow requiring multiple sections or steps
```

- A **Dialog** (`components/ui/dialog`, `alert-dialog`) is for confirmation or a single focused task that must block the current view.
- A **Sheet** (`components/flex/flex-detail-sheet`) is for contextual inspection (CDR record, campaign detail) or quick edit without leaving the list.
- A **Full Page** is for workflows with multiple sections or steps (creating a campaign with many fields, configuration flows).

Do not use Dialog for everything. A CDR record inspection in a dialog, or a delete confirmation in a sheet, is a misapplication.

## Row interaction

```text
Row → Detail Sheet
```

- **Hover indicates interactivity** — a hoverable row makes its clickability legible (background + cursor).
- **Nested controls do not trigger row open** — buttons inside a row (Pause, Edit, Play) act on their own, without opening the sheet.
- **A keyboard path exists** — rows are focusable and activate the sheet via Enter/Space (see `08-accessibility.md`).
- **An explicit View action may remain** alongside row-click, where discoverability demands it.
- **Closing restores focus** — focus returns to the invoker, never to `<body>`.
- **List context / scroll is retained where possible** — closing a sheet does not reset pagination, filters, or scroll position.

## Action hierarchy

```text
Primary contextual action → visible
Secondary actions         → overflow
Destructive action        → separated + confirmed
```

- Each row shows at most the primary contextual action; the rest live in an overflow menu.
- Avoid permanent clusters of every row action on every row (see CDR/Campaigns row action patterns).
- Destructive actions are visually separated from regular actions and always require confirmation.

## Destructive actions

Before a destructive action is allowed:

- **identify the object** — say exactly what will be affected ("Pause campaign 'Q3 Onboarding'", not "Pause");
- **explain the true consequence** — state the real effect, in domain terms;
- **require deliberate confirmation** — a confirm dialog with the object named; never a single click;
- **preserve backend restrictions** — the UI may not offer destructive options the backend rejects, and the UI must not bypass backend rules;
- **disable duplicate submit** — while the mutation is pending, the action cannot fire twice (the Campaigns pause/resume pending guard is the canonical example);
- **show failure accurately** — on failure, keep context, show the error, allow retry.

> **Never say `cannot be undone` unless that is actually true.** If the backend can restore or re-run, say what actually happens instead.

## Spatial continuity

- **Menus originate from their trigger** — popovers/overflow menus anchor to the control that opened them, never to a fixed screen location.
- **Detail sheets use a consistent direction** — a workspace opens its inspection sheets from the same side consistently.
- **Focus returns to the invoker** on any overlay close.
- **Local state is preserved where possible** — filters, search terms, and scroll survive open/close cycles.
- **Back preserves list position where feasible** — returning from a detail route restores the list context (pagination, filters, scroll) rather than landing at the top.
- **Avoid unexplained teleporting UI** — elements do not jump between containers without a reason; when content must move (e.g., an element promotes into a pinned bar), the change is meaningful and explained by context.

## Anti-patterns

- Dialog used as a detail viewer;
- row actions expanded into permanent action clusters;
- destructive actions without a named-object confirmation;
- focus lost on overlay close;
- sheet that resets filters/scroll on every open.
