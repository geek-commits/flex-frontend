# 11 — Component Governance

Defines how FLEX components are layered, when a shared component is justified, and what is prohibited.

## Component layering

```text
shadcn / Radix / TanStack
↓
FLEX primitives
↓
domain composition
↓
route
```

```text
Button           → shared shadcn primitive
FlexStatus       → shared FLEX primitive
CampaignProgress → domain component
CampaignsPage    → route composition
```

- **Base layer:** shadcn/Radix/TanStack primitives (`components/ui/*`, `@tanstack/react-table`, `recharts`).
- **FLEX primitives:** shared FLEX-level components that encode product-system rules (`components/flex/*` — `flex-status`, `flex-live-data-status`, `flex-detail-sheet`, `flex-empty-state`, `flex-loading-state`, `flex-error-state`, `flex-page-header`, `flex-page-content`, `back-link`, `context-sidebar`, `primary-rail`, `metric-card`, `trend-charts`).
- **Domain composition:** feature-specific components composed from primitives (`features/cdr/*`, `features/campaigns/*`, `features/dashboard/*`).
- **Route:** the page composes domain components (`pages/admin/*`).

## New component decision test

Before creating a FLEX-level shared component, ask:

1. Does it appear in multiple domains?
2. Is its behavior stable?
3. Does it represent a product-system rule?
4. Can its API remain small?
5. Would duplication otherwise be immediate?

If not all hold, keep it domain-specific.

## Generic component anti-pattern

Avoid god-components that try to cover every domain through flags:

```tsx
<FlexDataTable
    domain="campaigns"
    realtime
    queueMode
    specialActions
    adminVariant
/>
```

Prefer small shared pieces composed by domain code:

```text
small shared primitives
+
domain composition
```

## Visual primitive rules

- Use semantic tokens (`--flex-*` in `resources/css/app.css`); no arbitrary new colors.
- No arbitrary radii or shadows — use the token set (`--flex-radius-*`, `--flex-shadow-*`).
- Minimal icon backplates — colored circle/square behind icons only when it carries meaning.
- Semantic colors are reserved for semantic states (success/warning/danger/info/neutral via `FlexStatus`).
- Fewer containers — prefer spacing and dividers over nested cards (see the FLEX UI foundation rules).
- No generic purple "AI" styling and no gradients unless they are genuinely part of the brand system.

## Anti-patterns

- Route-specific copies of a shared pattern (a second "status badge" component);
- abstraction for abstraction's sake — a wrapper with one consumer;
- page-specific CSS for things the tokens already cover;
- duplicating `flex-status` semantics with an `AnsweredBadge`-style clone per route.
