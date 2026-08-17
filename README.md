# FLEX Contact Center

Modernized contact-center operations, supervision, administration, omnichannel
engagement, and platform management.

FLEX is an operational contact-center platform covering agent call handling,
supervision, routing, reporting, administration, tenant management, omnichannel
engagement, and selected AI/system capabilities.

The frontend has been modernized around a shared FLEX application shell, design
system, semantic iconography, responsive behavior, accessibility, and consistent
operational workflows while preserving existing backend contracts, permissions,
tenant boundaries, telephony semantics, and external integrations. This is a
frontend/product-experience modernization, not a backend rewrite. Runtime and
backend behavior remain authoritative.

## Product Areas

### Agent
- Agent Dashboard
- Agent Workspace / Call Manager
- Customer Recovery / Callback
- Diagnostics / Support

### Supervision
- Contact Center Dashboard
- Agent Monitoring
- Call Records (CDR)
- Call Campaigns
- Reports / Scheduled Reports

### Administration
- Management Console
- Users / Roles / Permissions
- Queues / IVR / Time Groups / Time Conditions
- Recordings
- Subscriptions / Mail Configuration

### Platform
- Tenant Management
- Super Administrator context

### Engagement
- Social / Omnichannel

### AI
- AI Center and runtime-confirmed AI capabilities

### System / Support
- System & Infrastructure
- Service Health
- Server Resources
- Backup
- Troubleshooting / Diagnostics

## Modernization Principles

The modernization follows several non-negotiable rules:

- Runtime/backend behavior is authoritative.
- Existing routes and business logic are preserved.
- Backend permissions remain the security authority.
- Tenant-scoped data must never leak across tenant context switches.
- Agent availability and telephony connection are separate concepts.
- External CRM/iframe regions remain integration boundaries.
- Reusable FLEX components are preferred over route-local UI systems.
- New frontend behavior must not invent backend/provider capabilities.

## Frontend Architecture

UI is layered so route components reuse shared building blocks instead of
reimplementing them per page:

```text
shadcn/ui primitives
        ↓
FLEX design components
        ↓
domain components
        ↓
route/page implementations
```

The application shell is composed from `AppShell`, `AppSidebar`, `AppContent`,
and `AppSidebarHeader`:

```text
AppShell
├── AppSidebar
├── AppContent
│   ├── AppSidebarHeader
│   └── route/page
└── overlays (dialogs, sheets)
```

## Canonical FLEX Components

Reusable primitives live in `my-app/resources/js/components/flex/` and are the
preferred building blocks over route-local UI. Notable components:

```text
FlexPageHeader     FlexPageContent   FlexMetricCard
FlexStatus         StatusBadge       FlexDetailSheet
FlexEmptyState     FlexLoadingState  FlexErrorState
FlexLiveDataStatus FlexIcon          FlexIllustration
PrimaryRail        ContextSidebar    AppTopbar
```

Brand components live in `my-app/resources/js/components/flex/brand/`.

## FLEX Design System

- FLEX blue is the brand and primary interaction color, not a substitute for
  semantic status.
- Success, warning, destructive, and informational states use semantic tokens.
- Operational screens favor clear sections, dense tables, and task hierarchy
  over decorative cards.
- Motion is restrained and respects `prefers-reduced-motion`.
- Responsive layouts reflow by task priority instead of simply shrinking desktop
  layouts.
- Design tokens are defined in `my-app/resources/css/app.css` under `--flex-*`
  and `--status-*`; pages consume these rather than hardcoding values.

## Branding

- The full FLEX wordmark is primary.
- The official monogram is used for compact/collapsed navigation.
- `AnimatedFlexLogo` is the animation engine; `FlexBrandLogo` owns production
  presentation policy.
- Logo animation plays once according to production policy. Route changes,
  sidebar toggles, and tenant switches must not replay it.
- Reduced motion shows the static final mark.
- Source SVG geometry must remain untouched.

## Iconography

A four-layer strategy:

```text
Product / Navigation → curated icon set
System / Controls     → precise icon set
Illustrative          → selected illustrations
Feature identity      → selected solid icons, used sparingly
```

- Pages consume semantic `FlexIcon` names rather than importing arbitrary SVGs
  into route components.
- Telephony controls prioritize clarity over visual uniformity.

## Telephony and Agent State

Agent availability and telephony connectivity are separate state domains. An
agent may be marked `Ready` while telephony is disconnected. UI code must not
collapse these concepts into a single "online" state.

Call lifecycle, wrap-up behavior, hold/mute/transfer, and realtime ownership are
runtime-authoritative and must be preserved.

## External CRM Integration

FLEX intentionally preserves its external CRM/iframe integration boundary. The
host application owns layout, context, and integration state around that surface
but must not invent or duplicate external CRM behavior. Mock JSON/config may
represent host/integration state during incomplete integration.

## Tenant and Platform Scope

Tenant switching is a high-consequence operation. Tenant-scoped queries, caches,
forms, realtime subscriptions, and route availability must rehydrate for the
target tenant. Frontend code must never implement its own security bypass for
Super Administrator access.

## Realtime and Data Ownership

Each realtime/polling data domain has one clear owner (for example agent state,
active call, monitoring, dashboard, social messages, system health). Do not
create per-card polling, duplicate WebSocket connections, or route-local copies
of authoritative telephony state when a canonical owner already exists.

## Theme Support

FLEX supports light, dark, and system theme modes. Charts and SVG UI must use
shared theme tokens; axis, grid, series, and tooltip colors cannot be hardcoded
to light-mode values. See `docs/design/` for theme and motion guidance.

## Development

Requirements: PHP (project targets PHP 8.5), Composer, Node.js, and a database
configured for the application.

```bash
# Install dependencies and configure the environment
composer run setup

# Run the application (dev server)
composer run dev
```

For frontend-only work, `my-app/` provides the Vite tooling:

```bash
cd my-app
npm install
npm run dev
```

## Environment Configuration

Copy the repository-provided `.env.example` and configure the values required for
your environment. Never commit API keys, SMTP passwords, SIP credentials,
provider tokens, or private keys.

## Testing and Verification

Under `my-app/`:

```bash
npm run lint:check
npm run types:check
npm run build
```

Backend tests use Pest:

```bash
php artisan test
```

A combined CI gate is available via Composer:

```bash
composer run ci:check
```

Every implementation phase follows this gate: implement, test, run the app,
visually verify, functionally verify, fix, retest, review the git diff, commit,
push, and verify the remote.

## Responsive and Accessibility Expectations

- Responsive behavior is verified at desktop, laptop, tablet, and mobile widths.
- Layouts reflow by task priority; do not simply shrink desktop layouts.
- Accessibility requirements include keyboard operation, visible focus, ARIA and
  semantic labeling, contrast, screen-reader support, reduced motion, and no
  color-only meaning.

## Security and Sensitive Configuration

- The backend is the permission authority; capabilities are gated accordingly.
- Do not expose or log secrets, tokens, or passwords.
- Protect private media and sensitive domains (mail, SIP, AI providers,
  integrations, certificates).
- Tenant isolation and direct-route checks must be preserved.

## Product and Release Documentation

Product, design, and release documentation lives in the repository:

- Design operating system and domain models: `docs/design/README.md`
- Feature parity tracker: `docs/product/FLEX_FEATURE_PARITY.md`
- Parity audit: `docs/product/FLEX_PARITY_AUDIT_REPORT.md`
- Quality sweep: `docs/product/FLEX_QUALITY_SWEEP_REPORT.md`
- Final issue report: `docs/product/FLEX_FINAL_20_ISSUE_REPORT.md`
- Known issues: `docs/product/FLEX_KNOWN_ISSUES.md`
- Release notes: `docs/product/FLEX_RELEASE_NOTES.md`
- Release candidate report: `docs/product/FLEX_RELEASE_CANDIDATE_REPORT.md`

Feature status is tracked using runtime evidence. A documented or planned
capability must not be treated as shipped until its implementation and
verification state are confirmed.

## Contribution Guidelines

See `AGENTS.md` for the engineering operating rules and `my-app/AGENTS.md` for
POC-specific rules. Preserve backend contracts, reuse FLEX components and
semantic `FlexIcon` names, do not invent status values or realtime owners,
preserve full-brand source geometry, and verify responsive and dark mode before
submitting.

## Release Status

Release readiness is documented in
[`docs/product/FLEX_RELEASE_CANDIDATE_REPORT.md`](docs/product/FLEX_RELEASE_CANDIDATE_REPORT.md).
Deployment status must be verified through the project's actual release process.