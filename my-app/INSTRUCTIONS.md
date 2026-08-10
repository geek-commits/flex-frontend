# INSTRUCTIONS.md
# Flex Contact Center Frontend Revamp — OpenCode + ReUI + shadcn/ui

## 0. Mission

Revamp the existing **Flex Contact Center** frontend into a clean, modern, high-utility enterprise interface while preserving:

- the Flex brand and existing company design language;
- existing Laravel/backend behavior;
- authentication and authorization;
- SuperAdmin, Admin, and Agent role boundaries;
- telephony and realtime behavior;
- existing route semantics;
- the middle iframe integration regions;
- the separate Flex-owned Call Manager;
- current business terminology and workflows.

The project was already initialized with:

```bash
bunx --bun shadcn@latest init --preset b1aIuQ2XC --template laravel --pointer
```

Do **not** reinitialize shadcn and do **not** replace the preset.

This revamp should take **interaction inspiration from Pipedrive**—especially its navigability, working-list/table UX, global search, contextual sidebars, clear actions, progressive disclosure, and dense-but-readable enterprise layout—without cloning Pipedrive's branding or business model.

The UI implementation should preferentially use **free ReUI components/examples** and the existing shadcn setup.

---

# 1. OpenCode execution contract

## 1.1 OpenCode must actually load these project instructions

OpenCode natively uses `AGENTS.md` for project rules. The repository should contain an `AGENTS.md` that explicitly instructs OpenCode to read:

```text
INSTRUCTIONS.md
PHASES.md
```

before implementing this project.

If the project uses `opencode.json`, the instruction files may also be listed in its `instructions` array.

`INSTRUCTIONS.md` is the detailed implementation contract.
`PHASES.md` is the mandatory execution sequence.

Do not rely on OpenCode automatically discovering arbitrary Markdown files.

---

# 2. Anti-hallucination policy — mandatory

## 2.1 Execute one verified phase at a time

Do not attempt the full revamp in a single pass.

Follow `PHASES.md` in order.

At the end of every phase, output exactly one status:

```text
READY FOR NEXT PHASE
```

or:

```text
BLOCKED
```

Do not proceed when blocked.

## 2.2 Evidence hierarchy

Use this priority order:

```text
1. Existing repository code
2. Existing project configuration
3. Existing Laravel routes/controllers/contracts
4. Existing authorization/policies/middleware
5. Existing realtime/telephony implementation
6. Existing Flex assets and styles
7. Existing shadcn configuration
8. ReUI/shadcn MCP results and current component APIs
9. Supplied Flex/Pipedrive screenshots
10. General UI judgment
```

Screenshots are not API documentation.

## 2.3 Unknown means unknown

When something cannot be verified, write:

```text
UNKNOWN — requires repository verification
```

or:

```text
DEFERRED — future integration
```

Never invent:

- endpoints;
- route names;
- permissions;
- event names;
- websocket channels;
- telephony states;
- iframe protocols;
- external-system APIs;
- component props;
- framework versions;
- ReUI component APIs;
- table-server capabilities.

---

# 3. ReUI MCP is the required component discovery path

The ReUI MCP server is already installed.

Before building a major UI primitive, OpenCode must use the ReUI MCP to inspect the **actual current free components and examples**.

Do not code ReUI components from memory.

## 3.1 Free-only rule

Use only ReUI items that are available without a paid license.

ReUI's current product model distinguishes:

```text
Free:
- components
- examples
- free c-* registry items
- supporting public primitives required by those free items

Paid:
- blocks
- templates
- icon packs / paid icons
- license-gated assets/items
```

For this POC:

```text
NO paid ReUI blocks
NO paid templates
NO paid icon packs
NO license-key requirement
NO purchase requirement
```

If a candidate returned by MCP is paid or license-gated, skip it and search for a free component/example alternative.

## 3.2 Clean-design search workflow

For each major UX need:

1. Search ReUI MCP for the capability.
2. Inspect multiple free candidates when available.
3. Inspect the actual current API/props for the shortlisted candidates.
4. Prefer the cleanest, most restrained candidate that matches Flex.
5. Prefer composition of free components over a paid prebuilt block.
6. Validate compatibility with the existing project.
7. Install/fetch only the chosen items.
8. Read the installed source.
9. Normalize it to Flex semantic tokens.
10. Browser-test it.

Do not simply install the first search result.

## 3.3 ReUI candidates to investigate for this POC

Use MCP to verify actual availability/API before implementation:

```text
Data Grid
Filters
Sheet
Dialog
Command / searchable command surface
Autocomplete / searchable select
Date Selector / date-range controls
Tabs
Stepper where justified
File Upload only if a verified workflow needs it
Kanban only if a real workflow needs it
```

The highest-value candidates are:

```text
ReUI Data Grid
ReUI Filters
Sheet
Command
Sidebar / navigation primitives
```

## 3.4 ReUI compatibility gate

Before installing ReUI components, verify the actual repository versions.

Current ReUI documentation targets:

```text
React 19
Tailwind CSS v4
```

If the repository does not meet a candidate's prerequisites, do not upgrade the whole application merely to use that component.

Instead:

```text
1. report incompatibility;
2. search ReUI/shadcn for a compatible alternative;
3. use existing project primitives when necessary.
```

Do not turn the frontend POC into an infrastructure migration.

---

# 4. shadcn MCP / CLI rule

The existing shadcn project is the implementation foundation.

Before using or adding a shadcn primitive:

```bash
bunx --bun shadcn@latest info --json
```

Then inspect the current component through the shadcn MCP/current docs.

Do not assume:

- Base UI vs Radix;
- icon library;
- aliases;
- Tailwind version;
- installed components;
- component API.

Never re-run `init`.

Never blindly `add --all`.

---

# 5. Visual direction

## 5.1 Preserve Flex identity

The final POC must still look like Flex.

Preserve/normalize:

- Flex blue as the primary accent;
- white operational surfaces;
- cool light-gray application background;
- dark neutral primary text;
- muted blue-gray secondary text;
- thin cool borders;
- pale-blue selected states;
- restrained status colors;
- compact enterprise density;
- low/subtle elevation;
- restrained radii.

Do not copy Pipedrive's purple rail, green brand buttons, logo, illustrations, or sales-specific language.

## 5.2 Target character

The POC should feel:

```text
clean
calm
fast
professional
modern
data-dense
highly navigable
high-utility
not decorative
```

Avoid:

```text
glassmorphism
neon
huge rounded cards
oversized whitespace
landing-page typography
gratuitous gradients
bento-grid everywhere
animations for decoration
```

---

# 6. Pipedrive inspiration to adopt

Borrow the following interaction traits:

## 6.1 Stable primary navigation

Use one persistent primary rail for top-level product domains.

## 6.2 Contextual second-level sidebar

For Settings, Reports, System, AI Center, and other nested domains:

```text
Primary Rail
+
Context Sidebar
+
Main Workspace
```

All important permitted options should be visible/searchable in the sidebar.

Do not hide core Flex administration behind a `More` menu.

## 6.3 Global search / command surface

Use a persistent search affordance in the top bar.

Conceptual:

```text
Search Flex...                         Ctrl/Cmd + K
```

## 6.4 Working lists/data grids

Tables should be active workspaces, not passive dumps.

## 6.5 Clear primary action

Each page should have one obvious primary action.

## 6.6 Progressive disclosure

Use table + Sheet + Dialog appropriately rather than opening giant modal forms for everything.

---

# 7. Role-aware navigation

Do not hardcode the whole UI around:

```tsx
role === "admin"
```

Prefer capability-driven navigation.

Conceptually:

```text
Role
 ↓
verified permissions/capabilities
 ↓
visible modules
 ↓
visible actions
 ↓
visible data
```

## 7.1 SuperAdmin

Potential top-level areas, only where backend permissions confirm them:

```text
Dashboard
Agents / Users
Queues
Calls / CDR
Campaigns
Reports
Telephony / IVR
Settings
Security / Roles
System
AI Center
Integrations
Support
```

## 7.2 Admin

Potential operational areas, only where authorized:

```text
Dashboard
Agents
Queues
CDR
Campaigns
Reports
Operational Settings
Survey
Support
```

## 7.3 Agent

Potential agent workspace, only where authorized:

```text
Agent Dashboard
Calls / Call Manager
CRM iframe workspace
Missed Calls / Voicemail
Queue information
Troubleshooting
Quick Support
Profile / permitted preferences
```

### Critical rule

Role may define a default workspace, but **permissions define actual visibility**.

Navigation and global search must use the same authorization source.

---

# 8. Application-shell architecture

Use related but distinct shells.

```text
FlexShell
├── AdminShell
└── AgentShell
```

## 8.1 Admin shell

Target structure:

```text
Primary Rail
Context Sidebar when applicable
Top Bar
Main Content
```

## 8.2 Agent shell

Target structure:

```text
Primary Rail
Top Bar
Agent Presence
Session Timer
Middle iframe / agent workspace
Separate Call Manager
```

Do not create one giant component full of role conditionals.

---

# 9. Middle iframe boundary — frozen

The existing central/middle iframe regions are connected to other systems that will be integrated later.

They must remain as integration boundaries.

Do not:

- remove them;
- replace them with native ReUI/shadcn screens;
- recreate external-system UIs from screenshots;
- invent external APIs;
- invent auth/token exchange;
- invent postMessage protocols;
- merge iframe content into Call Manager.

Preserve:

- the middle workspace placement;
- the iframe boundary;
- the relationship between iframe area and Call Manager;
- the practical workspace dimensions.

Until full integration:

```text
Flex iframe host
      ↓
isolated mock JSON integration config/state
      ↓
future real integration provider
```

Mock JSON must contain only synthetic development data.

---

# 10. Search architecture

Flex should have three distinct search layers.

## 10.1 Global search

Scope:

```text
Navigation
accessible actions
accessible records/entities where backend supports search
```

Must be permission-aware.

## 10.2 Sidebar search

Scope:

```text
current contextual module/navigation
```

Example:

```text
Search settings...
```

## 10.3 Data-grid search

Scope:

```text
current table/list
```

Example:

```text
Search calls...
Search agents...
Search campaigns...
```

---

# 11. Dynamic search behavior

For server-backed search:

- debounce;
- cancel stale requests;
- show loading state;
- preserve latest-query correctness;
- show clear no-match state;
- preserve filters and sorting;
- keep permission enforcement at the data source;
- do not fetch huge datasets for client-only search.

Recommended interaction starting point:

```text
2+ characters → remote search where appropriate
200–350ms debounce → tune after measurement
```

Do not treat those timing values as backend contracts.

---

# 12. Search highlighting

Create a reusable safe helper/component:

```text
SearchHighlight
```

Requirements:

- case-insensitive match;
- preserve original case;
- safe text splitting;
- semantic `<mark>`;
- Flex semantic highlight token;
- accessible contrast;
- no `dangerouslySetInnerHTML`.

Use in:

```text
global search
sidebar search
data-grid visible matches
```

---

# 13. Table-first management rule

The supervisor requirement is mandatory:

> For modules that manage collections of records, when each record has roughly 6–7 meaningful fields, the primary surface should be a searchable data grid, not a giant modal-first form workflow.

Use:

```text
Data Grid = management surface
Sheet     = Add/Edit record
Dialog    = confirmation / tiny form
Page/Stepper = complex configuration
```

Do not literally force every 7-field edit into inline table cells.

---

# 14. Flex Data Grid requirements

Use ReUI Data Grid if the compatibility gate passes and its actual MCP/API fits the repository.

For the POC, target the appropriate subset of:

```text
search
structured filtering
sorting where backend supports it
pagination
result count
column visibility
sticky header
wide-table horizontal scroll
row actions
loading skeleton
empty state
error state
search highlighting
```

Optional only when justified:

```text
resizable columns
saved views
bulk actions
safe inline editing
column pinning
virtualization
```

Do not enable every grid feature just because it exists.

---

# 15. Filters

Use a clean two-level model.

## Quick filters

Visible everyday filters:

```text
Today
Answered
Missed
Active
Completed
My Queue
```

only where they are real domain concepts.

## Advanced filters

Use ReUI Filters or a compatible structured filter surface after MCP verification.

Conceptual:

```text
field
operator
value
```

Do not invent backend filter operators.

---

# 16. Dialog / Sheet / Page policy

## Dialog

Use for:

```text
confirmation
1–4 simple fields
short focused task
```

## Sheet

Use for:

```text
5–8 related fields
Add/Edit from a table
record details
advanced filters
```

Target layout:

```text
Sheet Header
Scrollable form
Sticky footer: Cancel | Save
```

## Dedicated page / Stepper

Use for:

```text
complex IVR
routing
telephony
advanced permissions
integration setup
many dependent fields
```

---

# 17. Proof-of-concept scope

The POC must prove both UI **and UX**, not just styling.

Minimum POC surfaces:

## 17.1 Admin Shell

Implement:

- primary rail;
- top bar;
- contextual sidebar;
- role/capability-aware nav;
- global search shell;
- searchable context sidebar.

## 17.2 CDR Data Grid

Implement the clean Pipedrive-inspired working-list pattern:

```text
Page header
Search
Date range
Quick/advanced filter trigger
Column controls
Dynamic Data Grid
Pagination
Loading
Empty
No-match
Error
Row actions
Search highlighting
```

Do not invent backend features.

If backend data is not ready for the POC, use a clearly isolated local mock adapter with synthetic data and document the replacement boundary.

## 17.3 One 6–7-field CRUD module

Use a verified module such as Queues, Campaigns, Users, or another suitable existing entity.

Target:

```text
Data Grid
+
Add/Edit Sheet
+
Delete confirmation Dialog
```

Choose the module based on actual repository evidence.

## 17.4 Agent Shell proof

Create enough of the Agent shell to validate:

- shared Flex visual system;
- presence/session region;
- middle iframe boundary;
- separate Call Manager region;
- responsive layout.

Do not redesign iframe contents.

---

# 18. POC UX standards

The POC must demonstrate:

```text
discoverability
fast navigation
clear hierarchy
predictable actions
good empty states
good loading states
good error states
keyboard support
focus visibility
responsive behavior
permissions-aware visibility
no stale search results
```

It must not be a static screenshot implementation.

---

# 19. Responsive priorities

Primary operational targets:

```text
1280
1366
1440
1920
```

Secondary:

```text
1024
768
```

Functional fallback:

```text
375–430
```

Desktop information density has priority.

Do not turn all enterprise tables into card stacks on mobile.

Use horizontal scrolling when that is the honest representation of complex data.

---

# 20. Accessibility

Target WCAG AA where practical.

Verify:

- keyboard navigation;
- visible focus;
- semantic table headers;
- sort announcements where applicable;
- accessible Sheet/Dialog titles;
- button labels;
- filter removability;
- non-color status indicators;
- safe search highlighting;
- reduced motion;
- focus return after overlays close.

---

# 21. Dependency discipline

Before installing any dependency:

1. inspect `package.json`;
2. check whether an equivalent already exists;
3. prefer existing dependencies;
4. document why a new one is needed;
5. avoid duplicate table/chart/date/state/icon libraries.

ReUI Data Grid is TanStack-based; check existing TanStack packages before adding/duplicating anything.

---

# 22. Design discovery requirement

Before implementing the POC, OpenCode must perform a **free component design discovery pass** with the ReUI MCP.

For each of these needs:

```text
primary navigation
context sidebar
command/global search
data grid
filters
sheet
dialog
date range
autocomplete where needed
```

Create a short candidate ledger:

```text
Need
Free ReUI/shadcn candidate
Why selected
Compatibility
Dependencies
Rejected alternatives
```

Selection criteria:

```text
clean
neat
restrained
high readability
enterprise appropriate
low visual noise
works with Flex tokens
free
compatible
```

Do not use paid blocks to shortcut composition.

---

# 23. Visual concept rule

The POC should use the component discovery pass to define one coherent visual concept before implementing screens.

Record:

- shell geometry;
- sidebar widths;
- content max behavior;
- control density;
- table density;
- radius philosophy;
- border/elevation philosophy;
- typography hierarchy;
- icon family from the existing project;
- primary/secondary/destructive action hierarchy;
- hover/focus/selected states;
- empty/loading/error treatments.

Do not let each page invent its own look.

---

# 24. Browser verification

After each POC surface:

1. run the application;
2. open the actual route;
3. test interactions;
4. test search/filter behavior;
5. capture browser screenshots;
6. compare against the visual direction and Flex references;
7. fix spacing, density, alignment, typography, states, and responsiveness.

A passing build is not enough.

---

# 25. Required phase report

At the end of each phase:

```markdown
# Phase N Completion Report

## Scope
## Evidence inspected
## ReUI/shadcn MCP items inspected
## Free components selected
## Paid components rejected
## Changes made
## Dependencies added
## Backend changes
## Mock adapters introduced
## Assumptions
## Unknowns
## Blockers
## Tests
## Browser QA
## Acceptance criteria
## Status
READY FOR NEXT PHASE / BLOCKED
```

Backend changes should normally be `none`.

---

# 26. Final POC acceptance criteria

The POC is successful when:

```text
[ ] Flex still looks like Flex
[ ] Pipedrive is inspiration, not a clone
[ ] only free ReUI components/examples are used
[ ] no license key / paid asset is required
[ ] OpenCode used ReUI/shadcn MCP instead of guessing component APIs
[ ] role/capability-aware nav is demonstrated
[ ] all important context options are searchable/visible
[ ] global search shell is demonstrated
[ ] CDR is a dynamic working Data Grid
[ ] search highlighting works safely
[ ] one CRUD module demonstrates table + Sheet + Dialog
[ ] Agent shell preserves iframe + Call Manager boundaries
[ ] loading/empty/error/no-match states are designed
[ ] desktop UX is excellent
[ ] responsive fallback works
[ ] keyboard/focus behavior works
[ ] no backend or realtime behavior was hallucinated
```

The north star:

> **Use free ReUI/shadcn components to build a beautiful Flex interface, but make the experience faster and easier to operate before making it prettier.**
