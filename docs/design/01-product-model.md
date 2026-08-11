# 01 — Product Model

Defines the four primary FLEX product modes (workspaces) and what each user is trying to accomplish.

## The FLEX product model

FLEX is a multi-role contact-center operating system. It is not a conventional CRM and not a single-role dashboard. Four workspaces share one visual and technical design system while serving different information hierarchies and interaction models.

```text
AGENT           Handle customer interactions.
SUPERVISION     Monitor contact-center operations and intervene.
ADMINISTRATION  Configure how the contact center behaves.
PLATFORM        Operate the multi-tenant FLEX platform.
```

These map to the user roles in the *Flex CC User Manual* (Agent, Supervisor, Administrator, Super Administrator) and to the runtime capability model in `resources/js/auth/capabilities.tsx` (`super-admin | admin | agent`).

### Runtime mapping

| Workspace | Primary users | Runtime evidence | Core concerns |
|---|---|---|---|
| Agent | Agents | `pages/agent/*` (Agent Workspace, Missed Calls, Troubleshooting, Quick Support), `call-manager` | availability, call state, customer context, next action |
| Supervision | Supervisors, Admins | `pages/admin/contact-center-dashboard.tsx`, `pages/admin/agent-monitoring.tsx`, `features/agent-monitoring/*`, `features/cdr/*`, `features/campaigns/*`, Reports | exceptions, queue/SLA health, workforce state, intervention |
| Administration | Administrators | `pages/admin/management-console.tsx`, `pages/admin/system.tsx`, settings | configuration clarity, validation, consequence awareness, safe change |
| Platform | Super Administrators | `super-admin` role (all capabilities); tenant modules are placeholders only | tenant context, platform scope, cross-tenant support |

> The manual's **Supervisor** and **Administrator** roles are not distinct runtime shells: in the current POC the supervisor surfaces (Dashboard, CDR, Campaigns, Reports) live in the admin workspace, and `super-admin` is the POC default role. Supervisor Dashboard and Agent Dashboard are different surfaces — never collapse them.

## Agent experience model

> Agents handle customer interactions and must always understand current availability, current call state, customer context, and the required next action.

Core concepts (from the manual and `pages/agent/*`):

- Agent Dashboard;
- customer / CRM context;
- inbound and outbound calls;
- callback follow-up;
- voicemail;
- agent state (Ready / Not Ready / Break / Wrap Up);
- post-call workflow (Wrap Up timer, auto-return to Ready);
- softphone controls;
- support / diagnostics.

**Design implication:** Agent UI optimizes for immediate action and minimal cognitive switching. The incoming interaction, the agent's own state, and call actions outrank everything else (see `03-attention-hierarchy.md`).

## Supervisor experience model

> Supervisors monitor current contact-center health, workforce availability, queue/SLA performance, active interactions, and intervene when necessary.

Core concepts:

- Realtime Dashboard;
- Agent Monitoring (`/admin/monitoring` — realtime workforce state, live-call context, and the Call Whispering intervention, see `domain/agent-monitoring.md`);
- Agent Activity by State;
- Active Calls;
- SLA and Queue Stats;
- Call Volumes;
- Call Whispering (simulated in the POC; requires the Call Manager integration path for real media);
- CDR, Campaigns, Reports.

**Design implication:** Supervisor UI prioritizes exceptions, operational health, workforce state, and intervention (see `03-attention-hierarchy.md`). Operational data is the page, not decoration.

## Administrator experience model

> Administrators configure the rules and resources that determine how the contact center operates.

Core areas (manual + `domain/modules.ts`):

- Management Console;
- users, roles and permissions;
- agents;
- queues, IVR, time conditions;
- recordings;
- system configuration;
- subscriptions;
- mail.

**Design implication:** Administrator UI prioritizes configuration clarity, validation, consequence awareness, and safe changes (see `10-admin-safety.md`). Every configuration change is an operational risk; the UI must make current value, impact, and commit action explicit.

## Super Administrator experience model

> Super Administrators operate FLEX at platform level across multiple tenants and may switch tenant context.

Core responsibilities (manual "Super Administrator Features"):

- tenant management;
- tenant configuration;
- tenant context switching and view-as-tenant;
- platform support;
- global configuration;
- diagnosis.

**Design implication:** Tenant context and platform scope must always remain explicit (see `domain/tenant-context.md`). Never rely on a tiny avatar/menu alone.

> **Not implemented in the POC runtime:** tenant management and tenant context switching exist only as placeholder modules in `domain/modules.ts`. Do not document them as current behavior; treat them as desired future treatment until the backend provides them.

## Product-mode rule

Every page must identify which workspace it belongs to:

```text
Agent
Supervision
Administration
Platform
```

- Shared components are allowed across workspaces; a shared attention hierarchy is **not** automatic.
- A component may look identical in two workspaces while serving different priorities — verify the workspace before reasoning about prominence.
- If a new page cannot name its workspace, the page's scope is not yet understood. Stop and resolve before building.
