# FLEX CRM — MANAGEMENT CONSOLE + NAVIGATION ARCHITECTURE PLAN

**Document type:** Execution plan for implementation agent
**Release target:** `FLEX Management Console v1.0`
**Primary objective:** Modernize the Administration and Platform entry surface: a permission-aware, tenant-aware Management Console directory with search, a coherent navigation architecture (global shell + section/module navigation), and consistent module scaffold surfaces for the CRUD modules that follow — preserving every documented capability and the backend-authoritative permission model.
**Dependency:** FLEX Feature Parity Baseline v1.0 must be accepted (`docs/product/FLEX_FEATURE_PARITY.md`); Craft Infrastructure (`docs/design/*`, `AGENTS.md`) is the design source of truth.
**Next planned phases after this:** Users / Roles / Permissions → Reports + Scheduled Reports → Queues / IVR / Routing / Time → Callback + Voicemail → Recordings → Subscription + Mail → Tenant / Super Admin.

---

# 1. EXECUTIVE SUMMARY

The Contact Center Dashboard, Agent Monitoring, and Agent Workspace are modernized. The Management Console is the last primary shell surface that still relies on the module directory alone — its CRUD modules are placeholder routes (`admin/module-placeholder`), its module registry is not permission-filtered, and tenant context for Super Administrator is not represented.

This phase is **not** the individual CRUD module implementations (Queues, IVR, Users, etc. — those are separate roadmap items). It is the **architecture**: the console directory, navigation, permission-aware visibility, tenant context, and consistent module scaffold surfaces so every following module is built on the same operating model.

The governing invariant (from the parity plan):

```text
EXISTING CAPABILITY
        ↓
PRESERVE FUNCTIONALITY
        ↓
IMPROVE FRONTEND EXPERIENCE
        ↓
REGRESSION VERIFY
        ↓
SHIP
```

---

# 2. PRIMARY USERS

```text
Administrator         Configure how the contact center behaves.
Super Administrator   Operate the multi-tenant FLEX platform (tenant context).
```

Workspace: `Administration` (primary) and `Platform` (tenant context).

A page that cannot name its workspace is not ready to build (see `docs/design/01-product-model.md`).

---

# 3. SOURCE-OF-TRUTH ORDER

```text
1. CURRENT RUNTIME / BACKEND BEHAVIOR   (routes, permissions, tenant scope)
2. CURRENT FRONTEND SOURCE              (pages, module registry, capabilities)
3. FLEX CRAFT INFRASTRUCTURE            (docs/design/*, domain/*)
4. USER MANUAL                          (documented feature intent)
5. PREVIOUS PLANS / SCREENSHOTS
```

If manual and runtime disagree: document the discrepancy, preserve current runtime behavior, mark `NEEDS_PRODUCT_DECISION`.

---

# 4. CURRENT STATE (verified baseline)

## 4.1 Routes (backend authoritative)

From `my-app/routes/web.php`:

```text
GET /dashboard                admin/contact-center-dashboard
GET /admin/monitoring         admin/agent-monitoring
GET /admin/console            admin/management-console   ← this phase
GET /admin/cdr                admin/cdr
GET /admin/campaigns          admin/campaigns
GET /admin/reports            admin/reports
GET /admin/settings           admin/settings
GET /admin/system             admin/system
GET /admin/ai                 admin/ai
GET /admin/{module}           admin/module-placeholder   (catch-all)
GET /admin/settings/{module}  admin/module-placeholder   (catch-all)
```

## 4.2 Module registry

`my-app/resources/js/domain/modules.ts`:
- `CONSOLE_MODULES` (16 entries, 4 categories: Core Administration, Telephony & Operations, Analytics & Quality, System Configuration)
- `SETTINGS_MODULES` (14 entries, 5 categories: Telephony Settings, Routing & Trunks, Media & Audio, Operational Policies, System & Security)
- `ALL_MODULES`, `MODULE_INDEX` (href → entry)

Registry entries carry `id`, `href`, `title`, `description`, `icon`, `category`, optional `badge`, optional `capability`.

## 4.3 Permissions (frontend guard; backend remains authoritative)

`my-app/resources/js/auth/capabilities.tsx`:
- Roles: `super-admin` (ALL), `admin`, `agent`
- Capabilities: `dashboard.view`, `monitor.view`, `console.view`, `cdr.view`, `campaigns.view`, `campaigns.manage`, `reports.view`, `ai.view`, `system.view`, `settings.manage`, `security.view`, `roles.manage`, `agent.workspace`, `call.manager`, `missed-calls.view`, `troubleshooting.view`, `support.view`
- `NAVIGATION` model consumed by `PrimaryRail`, `ContextSidebar`, `Global Search`

## 4.4 Console surface

`pages/admin/management-console.tsx` renders `ModuleDirectory` with `CONSOLE_MODULES`. `components/flex/module-directory.tsx` provides search + category grouping. `pages/admin/module-placeholder.tsx` renders the catch-all placeholder using `MODULE_INDEX`.

## 4.5 Tenant context

**NOT implemented.** Super Administrator has no visible tenant context, no switch, no exit. Manual documents: tenant list, add/edit tenant, "You are currently navigating as Tenant: X", "Restore to Super Admin", eye-icon to view as tenant.

## 4.6 Gap register entries this phase resolves

| Gap | Status after this phase |
|---|---|
| GAP-005 ROUTE_MISMATCH (placeholder pages, plan != surface) | Module scaffold surfaces + navigation parity |
| GAP-004 TENANT_SCOPE_UNKNOWN (tenant switch/view/exit) | Tenant context represented in shell + console |
| GAP-008 Wrap-Up/default timer config location | If a console settings module exposes it, mark it; otherwise record explicitly |
| ADMIN-CONSOLE-003/006 permission-aware visibility | Module directory gates by capability |

---

# 5. NON-NEGOTIABLE OUTCOME

At the end of this phase:

- Management Console is permission-aware: a module the role cannot see is not shown or searchable.
- Navigation is coherent: global rail, section navigation, and module navigation follow one model (`role × permission × tenant × workspace`).
- Every CRUD module has a consistent scaffold surface (name, workspace, capability, state) instead of a blank page.
- Super Administrator sees explicit tenant context in the admin shell; tenant switching is represented exactly as the runtime supports (POC: no backend switch — document rather than invent).
- No route is renamed/removed for visual consistency (route path and grouping are separate, `docs/design/02-navigation-model.md`).
- Every phase is tested, visually + functionally verified, committed, pushed, and remote-verified before the next.

---

# 6. OUT OF SCOPE (this phase)

- Full CRUD implementations for Queues, IVR, Time Groups/Conditions, Recordings, Users, Roles/Permissions, Subscriptions, Mail, Tenants — separate roadmap items; only their scaffold surfaces and navigation entry points land here.
- Backend permission enforcement / API work — backend remains authoritative.
- Realtime architecture changes.
- Reports engine redesign.

---

# 7. PHASES

Every phase follows:

```text
IMPLEMENT → TEST → RUN APP → VERIFY EXPECTED RESULT
→ FIX → RETEST → REVIEW GIT DIFF → COMMIT → PUSH → VERIFY GITHUB → NEXT PHASE
```

Invariant: **Never begin the next phase with untested, uncommitted, or unpushed work.**

---

# 8. PHASE 0 — PREFLIGHT & ARCHITECTURE AUDIT

## Work

- verify `git status` clean baseline; confirm parity tracker accepted
- read `docs/design/README.md`, `01-product-model.md`, `02-navigation-model.md`, `10-admin-safety.md`, `domain/permission-model.md`, `domain/tenant-context.md`
- inventory current module registry, capabilities, navigation, console page
- read the User Manual Management Console / Roles / Tenants sections
- confirm every module in the registry maps to a manual capability or is flagged as modern extension

## Test

- run app; open `/admin/console`, `/admin/{module}` placeholder, `/admin/settings/{module}` placeholder
- verify current permission behavior (role switch hides nav) actually applies to console modules

## Commit

No commit if investigation only.

## Push

N/A unless committed.

---

# 9. PHASE 1 — PERMISSION-AWARE MODULE DIRECTORY

## Implement

- `ModuleDirectory` filters by capability: a module whose `capability` the role lacks is excluded from grid **and** search results
- the console page passes a capability-aware subset (extend `useCapabilities().has`)
- modules without a `capability` entry default to visible to `console.view` (document the decision in the registry)
- empty result state when every module is filtered or search matches nothing (`flex-empty-state` pattern)

## Test

- as `admin`: Telephony modules (queues/ivr/recordings/tenants/users/roles/security/backups) hidden; CDR/Campaigns/Reports visible
- as `super-admin`: all visible
- search respects the same filter
- `ModulePlaceholderPage` direct-URL access still guarded (module capability check)

## Commit

```text
feat(console): make module directory permission-aware
```

## Push

Push and verify.

---

# 10. PHASE 2 — NAVIGATION ARCHITECTURE

## Implement

- audit `NAVIGATION` (`capabilities.tsx`) against the admin shell (`AdminShell`, `PrimaryRail`, `ContextSidebar`)
- ensure Management Console is reachable per role; ensure section grouping reflects product model (Supervision vs Administration vs Platform)
- add module-level navigation breadcrumb/context on placeholder + console surfaces ("Management Console → Queues")
- keyboard: `Cmd/Ctrl + K` or `/` if a command palette already exists; otherwise no new accelerator
- no route renames; grouping only

## Test

- each role sees only permitted nav entries
- active route clearly indicated
- breadcrumb path correct on placeholder pages
- global search surfaces only permitted modules

## Commit

```text
refactor(shell): align console navigation with role and workspace model
```

## Push

Push and verify.

---

# 11. PHASE 3 — MODULE SCAFFOLD SURFACES

## Implement

- replace the generic catch-all placeholder body with a **module scaffold surface** for each CRUD module: title, workspace badge, capability badge, canonical description (from registry), module state (`placeholder`), and a "not part of the current POC" note where true
- add a stable `module-state` field to `ModuleEntry` (`planned | placeholder | active`) and render accordingly
- ensure every scaffold declares: route, workspace, capability, reachable states (loaded/empty/error)

## Test

- visit every `admin/{module}` and `admin/settings/{module}` route; each renders scaffold with correct metadata
- direct-URL access respects capability (no leak via catch-all)
- keyboard + responsive sanity

## Commit

```text
feat(console): add consistent module scaffold surfaces
```

## Push

Push and verify.

---

# 12. PHASE 4 — SUPER ADMIN TENANT CONTEXT

## Implement

- add a tenant-context indicator to the admin shell visible to `super-admin` only (no invented data — show tenant label only when the runtime provides one)
- if the runtime has no tenant model in the POC, render the indicator in a **documented-not-implemented** state (per `domain/tenant-context.md`), never a fake switch
- represent "viewing tenant" vs "super admin" distinction exactly as supported

## Test

- super-admin sees the indicator; admin does not
- no fabricated tenant switching behavior is offered
- indicator is a11y-visible (not avatar-only)

## Commit

```text
feat(console): surface Super Admin tenant context
```

## Push

Push and verify.

---

# 13. PHASE 5 — WRAP-UP / DEFAULT TIMER CONFIG SURFACE

## Implement

- confirm whether a default-timers surface exists in the runtime/settings registry; if the registry entry exists (e.g. Queues & Wrap-up → `/admin/settings/queues`), mark it in the parity tracker as `REVAMP_PLANNED` with the manual reference (FAQ: wrap-up 2–5 minutes)
- do not invent a new timer-config module the runtime lacks

## Test

- tracker entry updated; no phantom module added

## Commit

```text
docs(parity): record wrap-up timer configuration surface
```

## Push

Push and verify.

---

# 14. PHASE 6 — RESPONSIVE & ACCESSIBILITY PASS

## Implement

- module directory grid collapses correctly at narrow widths
- focus-visible, overlay focus return, keyboard nav on search + directory
- status conveyed by text + semantic cue, not color alone (`08-accessibility.md`)
- `prefers-reduced-motion` respected

## Test

- narrow/laptop/desktop widths; tab/enter/escape; screen-reader labels on search and module links

## Commit

```text
fix(console): responsive and accessibility polish
```

## Push

Push and verify.

---

# 15. PHASE 7 — MANDATORY QUALITY PASS

## Implement

- craft pass over every touched surface: spacing, alignment, cursor, hover, focus, icon consistency, copy, scroll, loading layout shift (`12-quality-gates.md`)
- update `docs/product/FLEX_FEATURE_PARITY.md`: mark Management Console family `REVAMPED` (locally verified), leave `SHIPPED` until push verified
- update `docs/design/domain/permission-model.md` / `tenant-context.md` / `02-navigation-model.md` if a canonical pattern changed (same commit rule)

## Test

- full lint/typecheck/build; console error sweep on `/admin/console`

## Commit

```text
fix(console): resolve management console QA issues
```

## Push

Push and verify.

---

# 16. PHASE 8 — FINAL QA & RELEASE GATE

## Implement

- regression: console, placeholders, dashboard, monitoring, agent workspace unaffected
- permission QA: admin vs super-admin vs agent role toggles
- tenant QA: indicator behavior
- realtime QA: no new polling/ws introduced
- update parity tracker: `SHIPPED` + commit hash for Management Console family

## Commit

```text
docs(parity): mark Management Console shipped
```

## Push

Push and verify.

---

# 17. REQUIRED CHECKS PER PHASE

1. affected routes render without console errors
2. terminology matches `docs/design/domain/*`
3. permissions verified (frontend guard; backend authoritative)
4. tenant behavior verified where relevant
5. no route regression
6. `npm run lint:check`, `types:check`, `build` (under `my-app/`)
7. `git status` / `git diff` review; stage intended files only
8. commit → push → `git fetch origin` → verify `origin/main` head

---

# 18. PHASE REPORT FORMAT

```text
PHASE: <name>

IMPLEMENTED
- ...

VALIDATED
- routes, permissions, tenant context, lint, typecheck, build, browser

RESULT
- PASS / BLOCKED

COMMIT
- <hash> <message>

PUSH
- verified on origin/main

NOTES
- ...
```

---

# 19. RELEASE NOTE

Suggested:

> **FLEX Management Console v1.0** — permission-aware, tenant-aware administration entry surface with coherent navigation and consistent module scaffolds. The console directory respects the role × permission model, Super Administrator tenant context is explicit, and every CRUD module has a documented scaffold ready for its dedicated phase. No route was renamed; backend remains authoritative.

---

# 20. NEXT PHASE

After this release is tested, committed, pushed, and verified, begin:

```text
USERS_ROLES_PERMISSIONS_PLAN.md
```

Feature IDs: `ADMIN-USER-001..006`, `ADMIN-AUTH-001..006` (see `docs/product/FLEX_FEATURE_PARITY.md`).

---

# 21. NORTH STAR

Future FLEX administration work is built from the same operating model: permission-aware, tenant-aware, workspace-named, scaffolded before implementation, and always preserved before improved.

**Do not skip the gates.**
