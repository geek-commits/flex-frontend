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

The frontend has a single navigation source of truth — `FLEX_DOMAINS` in `resources/js/auth/nav-domains.ts` — a domain-tree owning label, icon, landingHref, hrefPrefixes, groups and per-item `capability`. Consumers derive from it consistently:

- `FlexNavigationTree` (`resources/js/components/flex/flex-navigation-tree.tsx`) — one permission-filtered tree rendered inside the shadcn off-canvas sidebar; domains, groups, and routes share the same hierarchy on desktop and mobile;
- `GlobalSearch` — navigation index derived from the domain tree with `Domain · Group` muted subtitles (no LIVE/AGENT suffix clutter);
- `FlexAppShell` (`resources/js/components/flex/flex-app-shell.tsx`) — shared structural shell with one off-canvas navigation sidebar and topbar boundary, reused by both `AgentShell` and `AdminShell`.

`NAVIGATION` in `resources/js/auth/capabilities.tsx` is now derived flat from `FLEX_DOMAINS` (plus a small explicit shared route for Settings) for consumers that need a list — manual entries are not maintained. Every entry still declares `title`, `href`, `icon`, and `capability`; visibility is derived via `ROLE_CAPABILITIES[role]`; the backend has no roles/permissions yet (see `domain/permission-model.md`). Boundary-aware matching (`isActiveRoute`) is used for active state (exact or slash-boundary) — broad `startsWith` is prohibited.

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

Actual visibility always depends on existing permissions. The current runtime ships these contextual groups derived from the domain tree:

```text
Agent          Overview (Agent Dashboard, Agent Workspace) · Engagement (Social Inbox, Callback & Voicemail) · Support (Troubleshooting, Quick Support)
Supervision    (Overview: Contact Center Dashboard, Agent Monitoring) · Operations (CDR, Campaigns, Reports)
Administration Overview (Management Console) · People (Users, Roles & Permissions*) · Routing (Queues, IVR, Time Groups, Time Conditions) · Media (Recordings) · System (Subscriptions*, Mail Configuration*, System & Infrastructure*, AI Center*)
Platform       Tenant Management*
* capability-gated; Administration System and Platform domain discriminate Supervisor vs Administrator vs Super Administrator
```

## Navigation rules

1. **Current route clearly indicated.** The active page must be identifiable in the rail/sidebar (e.g., active-item treatment). Users must never have to guess where they are.
2. **Inaccessible routes excluded.** Entries the role cannot reach are removed, not shown disabled. Do not render dead navigation.
3. **Global shell consistent.** The topbar/tree chrome stays consistent across pages within a workspace so orientation does not reset on navigation.
4. **Agent mode prioritizes telephony state above generic navigation.** In the agent workspace, call state and availability may occupy the space generic admin navigation occupies elsewhere.
5. **Super Admin tenant context always visible.** When tenant context exists, the current tenant is shown explicitly, not tucked into an avatar menu alone.
6. **Identity is a single top-right control.** A canonical avatar + dropdown (`FlexProfileMenu`) owns account identity and access everywhere; the avatar never duplicates to the rail or sidebar footer. The menu separates identity (avatar, name, role) from role & access inspection and from tenant/platform context, which stays as an adjacent visible trigger (rule 5).
7. **Canonical labels only.** Use `Call Records (CDR)`, `Call Campaigns`, `Contact Center Dashboard` — never rename modules per page (`CDR Logs`, `Campaign Tool`, etc.).
8. **Icon-only navigation has a tooltip/accessibility name.** Every icon-only target must expose its label (tooltip + accessible name).
9. **Keyboard navigation remains possible.** Rail, sidebar, and menus are reachable and operable by keyboard (see `08-accessibility.md`).
10. **A future command palette must use the same permission model.** Global search already filters by capability; any palette keeps that behavior.

## Route stability

Do not rename or move routes simply to make navigation grouping prettier.

- Route path and navigation grouping are separate concerns; regrouping can be done without touching routes.
- Renaming a route breaks bookmarks, stored links, and integration boundaries.
- When a route must change, keep the old path resolving (redirect or alias) and flag the change for product review.
- Renaming a display label (e.g. route `/agent/missed-calls` displaying as **Callback & Voicemail**) is permitted without changing the path — labels are presentation, routes are integration boundaries.
