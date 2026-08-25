# domain — Permission Model

Defines the UI implications of the current permission implementation. Do not invent new authorization architecture.

## Current runtime

- Roles: `super-admin | admin | supervisor | agent` (`resources/js/auth/capabilities.tsx`).
- Capabilities: a fixed set of `*.view` / `*.manage` tokens (`dashboard.view`, `cdr.view`, `campaigns.view`, `campaigns.manage`, `reports.view`, `console.view`, `settings.manage`, `roles.manage`, `system.view`, `security.view`, `ai.view`, `agent.workspace`, `call.manager`, `missed-calls.view`, `troubleshooting.view`, `support.view`).
- `ROLE_CAPABILITIES` maps each role to its capability set; `FLEX_DOMAINS` (and the derived `NAVIGATION` / mobile / search indices) filter by capability.
- Administration route gates: `console.view` (Management Console, Users, Queues, IVR, Time Groups, Time Conditions, Recordings) vs `roles.manage` (Roles & Permissions) vs `settings.manage` (Subscriptions, Mail Configuration) vs `system.view` (System & Infrastructure) vs `ai.view` (AI Center) vs `tenants.manage` (Platform/Tenant Management) — this separation discriminates Supervisor from Administrator.
- `CONSOLE_MODULES` in `domain/modules.ts` uses the same capability vocabulary as navigation; `Settings` remains a shared non-domain route (`settings.manage`).
- The role switcher (Global Search footer) is a POC demo control — it changes visible UI only and grants/restricts nothing; on switch, if the current route becomes inaccessible, the POC redirects via Inertia to the role's safe landing (`agent → /agent/dashboard`, `supervisor → /dashboard`, `admin → /admin/console`, `super-admin → /admin/tenants`); if still accessible, it stays (see `lib/role-routing.ts`).

> **Backend reality:** the backend currently uses Fortify session auth with **no roles/permissions model**. The capability registry is a frontend-only proof-of-concept. Server-side authorization is deferred and must be enforced at the data source in a later rollout. The backend remains authoritative for actual access.

## UI permission rule

Permissions affect:

```text
Navigation
Command palette (global search today, palette later)
Page actions
Row actions
Forms
Detail sheets
Sensitive data
```

- Visibility and action availability are derived from the capability model, never guessed per-page.
- Avoid scattered local permission guessing — a route must not re-derive access with bespoke logic when the capability registry exists.
- Hidden features are excluded, not shown disabled (see `02-navigation-model.md`).
- **Backend remains authoritative** — the UI may hide what the user cannot do, but the backend must also refuse it.

## Non-goals

- Do not add `supervisor` as a fourth role until the backend defines it; the manual's supervisor surfaces map to the admin workspace today (see `01-product-model.md`).
- Do not document permission behavior the backend does not implement.
