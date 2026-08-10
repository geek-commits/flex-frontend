# PHASES.md
# Flex Contact Center POC — OpenCode Phased Execution Plan

## Why phases are mandatory

This POC is intentionally phase-gated to prevent:

- hallucinated architecture;
- guessed ReUI APIs;
- accidental paid-component usage;
- dependency sprawl;
- broken backend contracts;
- permission regressions;
- iframe/realtime mistakes;
- visually polished but unusable screens.

Every phase ends with:

```text
READY FOR NEXT PHASE
```

or:

```text
BLOCKED
```

Do not skip phases.

---

# PHASE 0 — Repository + OpenCode + MCP Verification

## Objective

Verify the real project before designing.

## Inspect

```text
components.json
package.json
bun.lock / bun.lockb
vite config
resources/js/**
resources/css/**
resources/views/**
routes/**
auth/policies/middleware
existing layouts
existing API clients
existing realtime/telephony code
existing iframe host
existing table/chart libs
existing design tokens/assets
```

Run:

```bash
bunx --bun shadcn@latest info --json
```

## Verify OpenCode

Confirm:

- project `AGENTS.md` exists;
- `AGENTS.md` requires reading `INSTRUCTIONS.md` and `PHASES.md`;
- ReUI MCP is connected;
- shadcn MCP is available if configured;
- only necessary MCP servers are active for this workflow.

Do not reconfigure a working ReUI MCP unless it is actually broken.

## Verify ReUI compatibility

Determine:

```text
React version
Tailwind version
shadcn base
shadcn style
aliases
icon library
TanStack dependencies
```

Compare against current ReUI requirements before selecting components.

## Deliverable

`PHASE-0-AUDIT.md` containing:

```text
architecture
frontend stack
shadcn info
MCP status
ReUI compatibility
existing dependencies
auth model
realtime model
iframe model
known risks
unknowns
```

## Prohibited

- feature redesign;
- installing components;
- adding dependencies;
- backend changes.

## Acceptance

```text
[ ] repo architecture confirmed
[ ] shadcn configuration confirmed
[ ] ReUI MCP usable
[ ] free-only requirement understood
[ ] compatibility known
[ ] iframe boundary identified
[ ] auth model identified or explicitly blocked
```

---

# PHASE 1 — Free ReUI Design Discovery

## Objective

Use the ReUI MCP to find a coherent set of **free**, clean, enterprise-suitable components/examples.

## Search needs

Investigate actual current MCP results for:

```text
Data Grid
Filters
Sheet
Dialog
Command/search
Sidebar/navigation
Date range
Autocomplete/searchable select
Tabs
Skeleton/empty patterns
```

## Free-only filter

Reject:

```text
paid blocks
paid templates
paid icon packs
license-gated items
```

Prefer:

```text
free components
free examples
free c-* items
public supporting primitives
```

## Candidate ledger

Create:

`PHASE-1-COMPONENT-SELECTION.md`

For each need:

```text
Need
Candidate
Free? yes/no
API inspected? yes/no
Compatibility
Dependencies
Visual fit
Selected/rejected
Reason
```

## Visual direction

Define one POC visual system:

```text
Flex blue
white surfaces
cool neutral background
thin borders
subtle elevation
restrained radius
compact controls
medium/high data density
strong active navigation
clear hierarchy
```

## Pipedrive traits to preserve as inspiration

```text
persistent primary navigation
context sidebar
global search
working lists
clear primary action
progressive disclosure
```

## Prohibited

- implementation of full screens;
- paid item use;
- cloning Pipedrive colors/layouts;
- selecting first result without comparison.

## Acceptance

```text
[ ] all selected ReUI items are free
[ ] actual APIs were inspected
[ ] compatibility is confirmed
[ ] design concept is coherent
[ ] no paid/license dependency
```

---

# PHASE 2 — Flex Design Foundation + Shell

## Objective

Build the structural and visual foundation.

## Implement

```text
semantic Flex tokens
typography hierarchy
spacing/density rules
focus states
status presentation
PrimaryRail
AdminShell
AgentShell foundation
TopBar
ContextSidebar
searchable context sidebar
global search trigger/shell
```

## Navigation

Implement permission/capability-driven configuration.

Do not hardcode hidden modules into client-only role checks.

## Global search POC

Demonstrate:

```text
Ctrl/Cmd + K trigger
grouped results shell
keyboard navigation
safe search highlighting
permission-aware sample/result adapter
loading/no-results
```

Do not invent production search endpoints.

If search backend is absent, isolate mock search data behind a clearly named POC adapter.

## Acceptance

```text
[ ] shell looks like Flex
[ ] Admin and Agent are related but distinct
[ ] context sidebar is searchable
[ ] global search UX is usable
[ ] role/capability navigation pattern exists
[ ] focus/keyboard behavior works
```

---

# PHASE 3 — CDR Dynamic Data Grid POC

## Objective

Create the reference working-list experience.

## Use

Prefer the selected free ReUI Data Grid + Filters components from Phase 1 if compatible.

## Implement

```text
CDR PageHeader
local search
safe search highlighting
date range
filters
column controls
result count
Data Grid
sorting where backend supports it
pagination
sticky/wide table handling
row actions
loading skeleton
empty state
no-match state
error state
```

## Search rules

- debounce remote search;
- cancel stale requests;
- preserve filters/sort;
- do not treat error as zero results;
- do not fetch massive datasets client-side.

## Data

Use the real current CDR backend if available.

If not POC-ready, create:

```text
cdr.mock.json
+
CdrRepository/adapter boundary
```

with synthetic data only.

Do not invent a fake HTTP API.

## Acceptance

```text
[ ] CDR feels like an active working surface
[ ] search/filter/pagination interact correctly
[ ] loading/empty/no-match/error differ
[ ] table remains dense and readable
[ ] horizontal overflow is honest on small screens
[ ] no unsupported backend capability is invented
```

---

# PHASE 4 — Table + Sheet + Dialog CRUD POC

## Objective

Prove the supervisor's 6–7-field management pattern.

## Choose one module

Use repository evidence to select a suitable existing collection such as:

```text
Queues
Campaigns
Users
Agents
another verified CRUD entity
```

Do not choose based only on screenshot convenience.

## Implement

```text
searchable Data Grid
filters where useful
primary Add action
row Edit action
Add/Edit Sheet
Delete/critical confirmation Dialog
validation
loading/save state
success/error feedback
```

## Form rule

Approximately 5–8 related fields:

```text
Sheet
```

Small confirmation:

```text
Dialog
```

Complex interdependent config:

```text
do not force into this POC pattern
```

## Acceptance

```text
[ ] users can scan records before editing
[ ] Add/Edit retains table context
[ ] sticky action footer works
[ ] confirmation is clear
[ ] form validation is accessible
[ ] no giant modal-first workflow
```

---

# PHASE 5 — Agent Shell + Iframe Boundary POC

## Objective

Prove that the modern design works without breaking the external integration boundary.

## Implement only host-owned UI

```text
Agent PrimaryRail
TopBar
presence/status area
session timer
middle iframe host
separate Call Manager region
host loading/mock/unavailable state
responsive behavior
```

## Iframe rule

Do not redesign the iframe's internal app.

Use isolated:

```text
integration.mock.json
```

for deferred host/integration state only.

Do not invent:

```text
external auth
API contract
postMessage contract
production URL
```

## Acceptance

```text
[ ] iframe remains central
[ ] Call Manager remains separate
[ ] Flex shell is modernized around it
[ ] mock integration is isolated
[ ] no external system behavior is fabricated
```

---

# PHASE 6 — POC UX + Visual QA

## Objective

Turn the implementation from "working" into "convincing".

## Browser-test

Widths:

```text
1280
1366
1440
1920
1024
768
375–430 fallback
```

## Review

```text
navigation clarity
sidebar discoverability
search usability
table density
filter clarity
Sheet usability
button hierarchy
typography
spacing
alignment
focus
keyboard behavior
loading
empty
error
responsive behavior
```

## Pipedrive inspiration check

Ask:

```text
Is navigation obvious?
Can users find a module quickly?
Can they search a dataset without friction?
Are actions near the data they affect?
Can users stay oriented while editing?
```

Do not ask whether it "looks like Pipedrive."

## Acceptance

```text
[ ] no major visual roughness
[ ] no clipped primary UI
[ ] no giant whitespace on operational pages
[ ] no unreadable density
[ ] search is obvious and useful
[ ] forms are context-preserving
[ ] Flex branding is intact
```

---

# PHASE 7 — POC Handoff

## Objective

Produce a reviewable proof of concept for supervisor sign-off.

## Deliver

```text
POC routes/screens implemented
component selection ledger
free-component proof
phase reports
browser screenshots
known limitations
mock boundaries
next rollout recommendations
```

## Explicitly list

```text
What is production-connected
What is mock
What is deferred
What is UI-only
What needs backend work later
```

## POC completion status

```text
POC READY FOR REVIEW
```

only when previous phases pass.

---

# FULL ROLLOUT — only after POC approval

After supervisor approval, migrate the rest in this order:

```text
8. Remaining Admin tables
9. Reports redesign
10. Settings/System migration
11. AI Center
12. Remaining Agent surfaces
13. Realtime hardening
14. Accessibility/responsive regression
15. Final product-wide QA
```

Do not begin full rollout before POC review unless explicitly authorized.
