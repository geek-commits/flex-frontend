# FLEX UI Foundation v0.1

FLEX UI rules. Keep this short and practical. When in doubt, follow the rules below over an ad-hoc decision.

## FLEX UI rules

1. **Use semantic tokens.** Consume `--flex-*` tokens (or the shadcn semantic tokens they alias) from `resources/css/app.css`. Do not hardcode arbitrary brand/visual values in pages.
2. **Do not hardcode arbitrary brand colors in pages.** FLEX blue is `--flex-brand-primary`. Semantic colors are reserved for semantic states.
3. **Prefer spacing/dividers over unnecessary cards.** Solve hierarchy with spacing, typography, dividers, alignment, and restrained background contrast before adding another container.
4. **FLEX blue is the primary interaction color.** FLEX cyan/light-blue (`--flex-brand-secondary`) is a secondary accent where justified. No generic lavender/purple decoration.
5. **Semantic colors are reserved for semantic states.** success = live/healthy, warning = attention, danger = error/destructive, info = informational. Pair color with a readable label/dot; never color alone.
6. **Use the shared shell.** Pages render inside `AdminShell`/`AgentShell` (canonical FLEX shell). Do not build per-page chrome.
7. **Use shared status variants.** Map domain states to `FlexStatus` semantic variants; do not create `AnsweredBadge`/`OnlineServerBadge` clones.
8. **Reuse table primitives.** Build tables from the shared operational table pieces (ReUI data-grid + `features/cdr` composition patterns). Do not create route-specific table systems.
9. **Use sheets for contextual inspection.** `FlexDetailSheet` for record detail; keep focus trap, Escape-to-close, and focus return.
10. **Preserve iframe/integration boundaries.** Never redesign or invent behavior inside external CRM/iframe content regions.
11. **Keep UI copy concise and operational.** Prefer "Handles tier-1 inbound calls" over marketing prose. Direct labels: Search, Filters, Columns, Date range, Recording, No recording, Try again, Clear filters.
12. **Add loading/empty/error states to data views.** Skeleton matching the table columns; empty state explains what/why/next; error state explains what failed and offers recovery.
13. **Ensure visible keyboard focus.** Every interactive element gets the shared focus ring (`.flex-focus-visible`); never remove focus outlines.
14. **Avoid decorative animation.** Fast, purposeful transitions (`--flex-duration-*`); respect `prefers-reduced-motion`.
15. **Do not create route-specific duplicates of global patterns.** If a component already exists (shadcn/ReUI/flex), reuse it. Ask: primitive → FLEX component → domain composition → page.

## Token layout

`resources/css/app.css` → `:root` / `.dark` define the `--flex-*` vocabulary; `@theme inline` maps them to Tailwind utilities (`bg-flex-surface`, `text-flex-text-secondary`, `shadow-flex-overlay`, `duration-flex-fast`).

Categories: brand, surfaces, borders, text hierarchy, status (success/warning/danger/info/neutral), radius (`sm/md/lg/pill`), shadow (`none/overlay/modal`), motion (`fast/default/overlay`), focus ring, spacing, typography, numeric (`flex-numeric` utility for tabular numerals).
