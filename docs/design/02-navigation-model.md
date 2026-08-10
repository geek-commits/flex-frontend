# 02 — Navigation Model

Defines how FLEX navigation is derived, grouped, and kept stable.

## Navigation is computed, not static

```text
Visible Navigation =
Role
× Permission
× Tenant Context
× Current Workspace
```

Navigation is not a hard-coded list of routes. It is the intersection of the signed-in role's capabilities, the active tenant context, and the current workspace shell.

## Runtime model

The frontend has a single navigation source of truth — `NAVIGATION` in `resources/js/auth/capabilities.tsx` — consumed consistently by:

- `PrimaryRail` (workspace rail; `activeWorkspace: 'admin' | 'agent'`);
- `ContextSidebar` (contextual groups, each item carries a `capability`);
- `GlobalSearch` (filters `NAVIGATION` by `has(capability)`).

Every nav entry declares `title`, `href`, `icon`, `capability`, and `workspace`. Visibility is derived via `ROLE_CAPABILITIES[role]`; the backend has no roles/permissions yet (see `domain/permission-model.md`).

> Tenant context is **not implemented** in the current runtime, so navigation is not yet tenant-aware. The model below documents the intended design; tenant-aware navigation ships only when the backend provides tenant context (see `domain/tenant-context.md`).

## Navigation groups (design model)

The following grouping is a design model, **not** a mandate to migrate routes this phase. Route path and navigation grouping are separate concerns.

```text
SUPERVISION
Dashboard
Agent Monitoring
CDR
Campaigns
Reports

TELEPHONY & ROUTING
Queues
IVR
Inbound Routes
Time Groups
Time Conditions
Recordings

PEOPLE & ACCESS
Users
Agents
Roles & Permissions

SYSTEM
System & Infrastructure
Subscriptions
Mail Configuration
Security & Audit
Backups

PLATFORM
Tenants
Global Settings
```

Actual visibility always depends on existing permissions. The current runtime ships the two canonical contextual groups on supervision surfaces:

```text
SUPERVISION    Dashboard
OPERATIONS     CDR · Campaigns · Reports
```

## Navigation rules

1. **Current route clearly indicated.** The active page must be identifiable in the rail/sidebar (e.g., active-item treatment). Users must never have to guess where they are.
2. **Inaccessible routes excluded.** Entries the role cannot reach are removed, not shown disabled. Do not render dead navigation.
3. **Global shell consistent.** The topbar/rail chrome stays consistent across pages within a workspace so orientation does not reset on navigation.
4. **Agent mode prioritizes telephony state above generic navigation.** In the agent workspace, call state and availability may occupy the space generic admin navigation occupies elsewhere.
5. **Super Admin tenant context always visible.** When tenant context exists, the current tenant is shown explicitly, not tucked into an avatar menu alone.
6. **Canonical labels only.** Use `Call Records (CDR)`, `Call Campaigns`, `Contact Center Dashboard` — never rename modules per page (`CDR Logs`, `Campaign Tool`, etc.).
7. **Icon-only navigation has a tooltip/accessibility name.** Every icon-only target must expose its label (tooltip + accessible name).
8. **Keyboard navigation remains possible.** Rail, sidebar, and menus are reachable and operable by keyboard (see `08-accessibility.md`).
9. **A future command palette must use the same permission model.** Global search already filters by capability; any palette keeps that behavior.

## Route stability

Do not rename or move routes simply to make navigation grouping prettier.

- Route path and navigation grouping are separate concerns; regrouping can be done without touching routes.
- Renaming a route breaks bookmarks, stored links, and integration boundaries.
- When a route must change, keep the old path resolving (redirect or alias) and flag the change for product review.
