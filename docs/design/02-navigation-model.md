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
- `FlexAppShell` (`resources/js/components/flex/flex-app-shell.tsx`) — the structural shell for Agent, settings, detail, and utility layouts.
- `AppShell` (`resources/js/components/app-shell.tsx`, adapted from `@efferd/app-shell-3`) — universal signed-in shell: fixed desktop icon rail plus merged header. `AppSidebar` derives workspace switching and the active area's groups from `FLEX_NAVIGATION_AREAS` with render-time capability filtering; `AppHeader` hosts the mobile navigation trigger, breadcrumbs, global search, agent operational controls, language, tenant context, and profile. `AdminShell`, `AgentShell` (Call Manager / Assist dock beside the workspace via `rightPanel`/`assistPanel`), and `AppLayout` (settings) all render it. The legacy `FlexAppShell` rail + context sidebar stays on disk as reference only.

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
└─ Fixed icon rail (64px) → work surface
```

- The header owns the canonical full FLEX wordmark, global search, language,
  real tenant treatment, profile, and Agent operational controls where applicable.
- The rail exposes capability-filtered product workspaces and Settings without
  persistent text labels; Settings stays in its registry-defined position.
- The fixed desktop rail shows workspace switching and all visible routes for the
  active area. Icon-only links expose localized tooltips and accessible names;
  the active destination remains visually distinct. Desktop controls, keyboard
  shortcuts, and saved preferences cannot expand the rail.
- The route sidebar is the sole shell-level route navigation. Horizontal tabs
  are reserved for real, runtime-backed subviews within a page.
- On mobile the two navigation levels become one hierarchical drawer sourced
  from the identical registry; the header menu control opens it.
- **Universal shell.** All signed-in routes (`AdminShell`, `AgentShell`,
  `AppLayout`) use the same fixed desktop icon rail and mobile navigation drawer.
  Navigation derivation, capability gating, tenant treatment, breadcrumbs, and
  route paths remain unchanged.

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
