# FLEX Craft — Product-Design Operating System

> **FLEX Craft Infrastructure v1.0**
>
> The permanent product-design operating system for FLEX Contact Center. The repository now defines role-aware product architecture, permission-aware navigation, attention hierarchy, interaction and motion rules, copy and feedback standards, realtime behavior, administrative safety, component governance, domain state models, tenant-context guidance, canonical CDR / Campaigns / Dashboard exemplars, agent implementation guidance, and feature quality gates. Future UI work uses these standards as the default source of product-design behavior.

This directory turns the design reasoning proven across the FLEX UI Foundation, CDR, Campaigns, and Contact Center Dashboard revamps into permanent, implementation-relevant rules.

## Why this exists

FLEX is a multi-role contact-center operating system, not a conventional CRM. Every future surface — Agent Monitoring, Call Whispering, Management Console, and beyond — must be built from the same operating model instead of rediscovering design decisions page by page.

Without permanent guidance, implementation drifts into generic SaaS dashboards, inconsistent agent-state terminology, route-specific status colors, duplicate components, incorrect permission visibility, duplicated realtime polling, arbitrary animation, and unsafe admin configuration flows. This directory prevents that drift.

## Source of truth hierarchy

Use this order when a rule in one source conflicts with another:

1. **Runtime truth** — the source code is authoritative for real enum values, routes, API contracts, permissions, supported state transitions, enabled features, backend behavior, and realtime mechanisms.
2. **Visual-system truth** — the modernized FLEX routes and canonical components are the reference for spacing, typography, tokens, table behavior, shell, statuses, feedback states, detail sheets, and motion.
3. **Product-domain truth** — the *Flex CC User Manual* defines the intended product model, terminology, and operational workflows.

If the manual and the runtime implementation differ: do not silently choose one; document the discrepancy; preserve current runtime behavior unless explicitly instructed otherwise; flag the discrepancy for product review.

Never encode uncertainty as certainty. If runtime behavior cannot be safely inferred, stop and investigate.

## Document index

```text
docs/design/
├── README.md                    ← this file
├── 01-product-model.md          ← workspaces: Agent / Supervision / Administration / Platform
├── 02-navigation-model.md       ← Role × Permission × Tenant Context × Workspace
├── 03-attention-hierarchy.md    ← what earns visual prominence in each workspace
├── 04-interaction-rules.md      ← overlays, rows, actions, destructive safety, spatial continuity
├── 05-motion.md                 ← durations, what may animate, prohibitions
├── 06-copy-language.md          ← canonical terminology, anti-patterns, error copy
├── 07-feedback-states.md        ← reachable-state matrix, loading, empty, partial failure
├── 08-accessibility.md          ← keyboard, focus, status accessibility, hit targets
├── 09-realtime-data.md          ← polling, websocket, freshness, no fake live state
├── 10-admin-safety.md           ← safe configuration change management
├── 11-component-governance.md   ← layering, decision test, anti-patterns
├── 12-quality-gates.md          ← how FLEX UI work is tested and accepted
├── domain/
│   ├── agent-state.md
│   ├── agent-workspace.md
│   ├── call-state.md
│   ├── queue-state.md
│   ├── campaign-state.md
│   ├── agent-monitoring.md
│   ├── data-freshness.md
│   ├── permission-model.md
│   └── tenant-context.md
└── exemplars/
    ├── cdr.md
    ├── campaigns.md
    └── dashboard.md
```

## How to use these docs

Before modifying any UI:

1. Read this `README.md`.
2. Identify the workspace the change belongs to: **Agent**, **Supervision**, **Administration**, or **Platform**.
3. Read the relevant product-model section and any applicable domain spec (`domain/`).
4. Inspect existing FLEX primitives and the relevant exemplar before writing new components.
5. Preserve runtime behavior, permissions, tenant boundaries, and integration boundaries.
6. Identify every reachable state for the surface you are changing (see `07-feedback-states.md`).
7. Plan before large changes; follow the quality gates in `12-quality-gates.md`.

## Documentation style

Each document is concise, rule-oriented, implementation-relevant, example-driven, and easy to scan. Where useful, rules use the shape:

```text
Rule
Why
Example
Anti-pattern
```

Where practical, documents link to component source paths, domain types/enums, and feature source paths. Avoid brittle line-number references.

## Update expectations

> When a canonical pattern changes, update the relevant design document in the same code change.

Documentation drift is a defect. If a rule stops matching the codebase, fix the document in the same commit that changes the pattern.

## Tooling notes

- **Component gallery:** a dedicated dev UI gallery is intentionally **deferred** for this release. The repository has no Storybook / Ladle / component-gallery tooling, and this phase must not add tooling "for fashion". Gallery needs are served today by the canonical routes themselves (Dashboard, CDR, Campaigns), the shared FLEX primitives, and browser-based visual verification. Revisit only when a low-cost, existing-pattern-friendly gallery becomes available.
- **Tests:** the frontend has no JS test framework; quality gates rely on `npm run lint:check`, `npm run types:check`, and `npm run build` (under `my-app/`), plus browser verification. The Laravel backend uses Pest.
