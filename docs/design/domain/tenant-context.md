# domain — Tenant Context

Super Administrators operate FLEX across multiple tenants. Tenant context is a safety concern, not a cosmetic state.

> **Not implemented in the current POC runtime.** Tenant management and tenant context switching exist only as placeholder modules in `domain/modules.ts`. This document records the required UX rules as **desired future treatment** — do not present any of this as current behavior until the backend provides tenant context.

## Product intent (manual)

The *Flex CC User Manual* defines: a Super Administrator operates at platform level, manages all tenants, may switch or select tenant context to perform tasks, and can switch to a tenant's view ("view-as-tenant", eye icon) to see what that tenant can do.

## Tenant context rules (future treatment)

- **Current tenant always visible** in Super Admin context — explicit, persistent, never only a tiny avatar/menu.
- **Context switch is explicit** — changing tenant is a deliberate, confirmed action, not a side effect of navigation.
- **Tenant persists through navigation** — switching tenant does not lose the active module context.
- **Destructive actions identify the tenant** where relevant ("Delete tenant 'BRELA'", not "Delete").
- **A future command palette is tenant-aware** — search and actions respect the active tenant scope.
- **Data remains tenant-scoped** — every surface reflects the active tenant; cross-tenant leakage is a defect.
- **View-as-tenant state is visually distinct** — when acting inside a tenant view, the UI clearly signals the impersonated scope.
- **Exiting tenant context is obvious** — a clear, always-available exit from view-as-tenant.

## Example shape (conceptual)

```text
Tenant: BRELA ▾            ← always visible, explicit
```

When switched into a tenant's view:

```text
Viewing tenant: BRELA
[ Exit tenant context ]
```

Actual wording must follow runtime behavior once implemented; do not ship this copy before it is real.

## Anti-patterns

- Tenant indicated only by a small avatar menu;
- tenant context lost on navigation;
- destructive tenant actions confirmed without naming the tenant;
- view-as-tenant that looks identical to the tenant's normal view.
