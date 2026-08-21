# FLEX Accessibility + Privacy Audit — Increment 4

> **Increment:** 4 — Quality Hardening
> **Sources:** `docs/design/08-accessibility.md`, hardening §§13–14, `iconography.md`

## Accessibility (keyboard / focus / semantics)

| Surface | Verdict | Notes |
|---|---|---|
| Sidebar / PrimaryRail | PASS | `PrimaryRail` buttons have `aria-label`, `flex-focus-visible`, `has(capability)` filtering; ContextSidebar accordion via `Collapsible` |
| Profile / tenant menus | PASS | `dropdown-menu.tsx` Radix `Menu` — focus trap + escape; tenant `Enter / Return` affordance present |
| Tables / DataGrid | PASS | `reui/data-grid` canonical — `columnsMovable`, accessible headers via `@tanstack/table` |
| Filters / Dialogs / Sheets | PASS | `date-range-select`, `FlexDetailSheet` via `dialog.tsx` with `aria` |
| Social | PASS | channel icon never sole indicator — channel text visible; avatar badge + `SocialChannelIcon` with label |
| Call controls (Mute/Hold/Transfer) | PASS | `active-call-surface.tsx` icon controls have `aria-label`, `pressed` state via `motion.span` presentation-only; command immediate |
| Dynamic Island | PASS | dragging not sole affordance — call actions also in `ActiveCallSurface` |
| Assist transcript | PASS | `agent-assist-panel.tsx` logical reading order, speaker label, timestamp, `Jump to live` (no excessive token announcement) |
| Reduced motion | PASS | `useReducedMotion` honored (Social slide 0.2 s → 0, Mute/Hold 0.15 s → 0) |
| Light / dark | PASS | tokens `--flex-*` via `next-themes`, `app.tsx` providers |

**Tooling:** `use-reduced-motion.ts` covers all `motion/react` surfaces; themes validated via `next-themes` provider.

## Privacy & frontend security (§14, §34)

| Concern | Verdict | Evidence |
|---|---|---|
| Phone / transcript / recording in logs | PASS | `lib/observability.ts` masks `tenant_id`; no `console.log` of message/transcript body at baseline (`grep console.log` → only dev-only `[observe]` guard) |
| Storage | PASS | `localStorage:flex.poc.role` only (role string, not content); `TenantContext` in-memory only, no persistence; no transcript/recording/customer content cached |
| Query cache | PASS | `socialRepository`, `domain/*Repository` are in-memory session-only; no persisted query cache |
| Tenant cache isolation | GAP (recorded) | `TenantContext` now calls `invalidateOnTenantChange` + `tenant_switch` observability (Increment 3); full isolation deferred until real backend |
| Error messages | PASS | `lib/errors.ts` `FlexError` normalizes without `stack/tokens/SQL`; `FlexErrorBoundary` surfaces `correlationId` only |
| Iframe boundary | PASS | `crm-integration-host.tsx` preserves origin assumptions; unrelated state does not remount iframe |
| Recording URLs | PASS | no guessable public URLs constructed |

## Console / sensitive logging scan

```
grep -rn "console\.(log|debug|info)" resources/js → only:
  lib/observability.ts — gated behind `import.meta.env.DEV` + masked ids
  (no transcript/message body)
```

## Remaining

* Whole-product keyboard sweep (§33 matrix: browsers × themes × breakpoints × roles) moves to Increment 5 release QA.
