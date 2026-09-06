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

The frontend has a single navigation source of truth — `FLEX_NAVIGATION_AREAS` in `resources/js/auth/nav-domains.ts`. It contains the four product workspaces plus the non-workspace Settings utility area. `FLEX_DOMAINS` remains the compatible workspace-only export. Each area owns its label, icon, landing route, groups, routes, aliases, placeholder status, and per-item `capability`. Consumers derive from it consistently:

- `PrimaryRail` — visible workspaces plus Settings, filtered by capability;
- `ContextSidebar` — the active area's complete groups filtered by item capability;
- `GlobalSearch` — navigation index derived from the domain tree with `Domain · Group` muted subtitles (no LIVE/AGENT suffix clutter);
- Mobile Sheet — domain/group/route hierarchy identical to desktop (not a flat list);
- `FlexAppShell` (`resources/js/components/flex/flex-app-shell.tsx`) — the only signed-in structural shell, reused by Admin, Agent, settings, detail, and utility layouts.

`NAVIGATION` in `resources/js/auth/capabilities.tsx` is derived flat from the area registry for consumers that need a list — manual entries are not maintained. Account settings have no product capability requirement; operational settings retain their existing capability gates. Boundary-aware matching plus longest-route resolution ensures detail routes inherit one canonical parent rather than activating several prefixes.

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

Actual visibility always depends on existing permissions. The runtime ships these contextual areas:

```text
Agent          Overview (Agent Dashboard, Agent Workspace) · Engagement (Social Inbox, Callback & Voicemail) · Support (Troubleshooting, Quick Support)
Supervision    (Overview: Contact Center Dashboard, Agent Monitoring) · Operations (CDR, Campaigns, Reports)
Administration Overview (Management Console) · People (Users, Roles & Permissions*) · Routing (Queues, IVR, Time Groups, Time Conditions) · Media (Recordings) · System (Subscriptions*, Mail Configuration*, System & Infrastructure*, AI Center*)
Platform       Tenant Management*
Settings       Account (Profile, Security, Appearance) · Contact Center · Routing & Trunks · Media & Audio · Operational Policies · System & Security*
* capability-gated; Administration System and Platform domain discriminate Supervisor vs Administrator vs Super Administrator
```

## Navigation rules

### Desktop shell anatomy

Every signed-in product route renders one full-width header above three body columns:

```text
GlobalHeader (56px, full width)
└─ PrimaryRail (72px) → ContextSidebar (256px or collapsed) → work surface
```

- The header owns the canonical full FLEX wordmark, global search, language,
  real tenant treatment, profile, and Agent operational controls where applicable.
- `PrimaryRail` exposes capability-filtered product workspaces with persistent
  icon labels; Settings is pinned at the bottom. The rail contains no monogram.
- `ContextSidebar` renders all visible groups for the active area. It is open by
  default on desktop and may collapse without unmounting the workspace; selecting
  a rail area navigates to its first accessible route.
- `SidebarToggleIcon` is the shared collapse control: it appears in the contextual
  header while open and at the top of `PrimaryRail` while closed. The choice is
  persisted locally; the hidden route tree is inert and excluded from the
  accessibility tree.
- The route sidebar is the sole shell-level route navigation. Horizontal tabs
  are reserved for real, runtime-backed subviews within a page.
- On mobile the two navigation levels become one hierarchical drawer sourced
  from the identical registry.

1. **Current route clearly indicated.** The active page must be identifiable in the rail/sidebar (e.g., active-item treatment). Users must never have to guess where they are.
2. **Inaccessible routes excluded.** Entries the role cannot reach are removed, not shown disabled. Do not render dead navigation.
3. **Global shell consistent.** Header, rail, contextual tree, and page-header band stay consistent across all signed-in pages so orientation does not reset on navigation.
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
