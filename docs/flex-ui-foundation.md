# FLEX UI Foundation v0.1

> Pilot: Call Detail Records (CDR)

Introduced the first canonical FLEX UI foundation: shared visual tokens, application shell, status language, operational data-table patterns, feedback states, and contextual record inspection. CDR is the first route migrated to the new foundation. Existing business behavior and integration boundaries are preserved.

## FLEX UI rules

1. Use semantic tokens.
2. Do not hardcode arbitrary brand colors in pages.
3. Prefer spacing/dividers over unnecessary cards.
4. FLEX blue is the primary interaction color.
5. Semantic colors are reserved for semantic states.
6. Use the shared shell.
7. Use shared status variants.
8. Reuse table primitives.
9. Use sheets for contextual inspection.
10. Preserve iframe/integration boundaries.
11. Keep UI copy concise and operational.
12. Add loading/empty/error states to data views.
13. Ensure visible keyboard focus.
14. Avoid decorative animation.
15. Do not create route-specific duplicates of global patterns.

## Where things live

- Design tokens (color, type, radius, shadow, spacing, motion, focus): `my-app/resources/css/app.css` (`--flex-*`, `--duration-flex-*`, `.flex-focus-visible`, `.flex-numeric`)
- Shell: `my-app/resources/js/layouts/admin-shell.tsx` composing `PrimaryRail`, `ContextSidebar`, `AppTopbar`, `FlexPageHeader`, `FlexPageContent`
- Status primitive: `my-app/resources/js/components/flex/flex-status.tsx`
- Detail sheet: `my-app/resources/js/components/flex/flex-detail-sheet.tsx`
- Feedback states: `flex-empty-state.tsx`, `flex-loading-state.tsx`, `flex-error-state.tsx`
- CDR workspace: `my-app/resources/js/features/cdr/`
