# KICKSTART_PROMPT.md
# OpenCode Kickstart Prompt — Flex Contact Center ReUI/shadcn POC

You are operating inside an existing Laravel-based **Flex Contact Center** repository.

Your task is to **implement a proof of concept**, not merely produce another plan.

The frontend has already been initialized with:

```bash
bunx --bun shadcn@latest init --preset b1aIuQ2XC --template laravel --pointer
```

The **ReUI MCP server is already installed**.

Read these project files first:

```text
AGENTS.md
INSTRUCTIONS.md
PHASES.md
```

Treat them as mandatory.

---

## Goal

Build a beautiful, clean, modern, high-utility Flex frontend POC using:

```text
Flex brand
+
Pipedrive-inspired interaction patterns
+
free ReUI components/examples
+
existing shadcn preset
```

The POC must prove **UX**, not just visual styling.

It should demonstrate:

```text
role-aware navigation
contextual sidebars
global search
dynamic searchable tables
safe search highlighting
filters
column controls
table-first CRUD
Sheet-based Add/Edit
clear Dialog confirmations
loading/empty/error states
Agent iframe + Call Manager layout preservation
```

---

## Critical free-only ReUI rule

Use the installed ReUI MCP to search for and inspect actual current components/examples.

For this project:

```text
USE:
- free ReUI components
- free ReUI examples
- free c-* registry items
- public supporting primitives

DO NOT USE:
- paid ReUI blocks
- paid templates
- paid icon packs
- license-gated items
- anything requiring a purchase/license key
```

If MCP returns a paid item:

```text
REJECT IT
```

and find a free composable alternative.

Do not ask me to buy a ReUI license for this POC.

---

## Do not hallucinate ReUI APIs

Do not write component props from memory.

For every major UI need:

```text
1. search ReUI MCP;
2. inspect multiple free candidates;
3. inspect actual component API;
4. verify compatibility;
5. select the cleanest restrained candidate;
6. install/fetch;
7. read generated source;
8. adapt to Flex;
9. browser-test.
```

Use shadcn MCP/current docs similarly for shadcn primitives.

---

## Start with Phase 0

Run:

```bash
bunx --bun shadcn@latest info --json
```

Inspect the repository architecture and dependencies.

Verify:

```text
Laravel frontend architecture
React version
Tailwind version
shadcn base/style
aliases
icon library
existing table libs
existing TanStack packages
existing auth/permissions
realtime/telephony ownership
iframe host
ReUI compatibility
```

Current ReUI documentation targets React 19 and Tailwind v4.

Do not upgrade the application blindly if the repo differs.

If there is incompatibility, search for a compatible free alternative and report the decision.

---

## Pipedrive inspiration rules

Borrow:

```text
persistent primary navigation
contextual second sidebar
global search
working-list/data-grid UX
clear primary action
visible filters
column controls
progressive disclosure
context-preserving edits
```

Do not copy:

```text
Pipedrive purple
Pipedrive green branding
Pipedrive logo
Pipedrive copy
Pipedrive illustrations
sales-specific terminology
```

The result must look like **Flex**.

---

## Design direction

Create one coherent design.

Target:

```text
Flex blue
white surfaces
cool neutral background
thin borders
subtle elevation
restrained radii
compact controls
medium/high information density
strong navigation states
clear typography
clear action hierarchy
```

Avoid:

```text
glassmorphism
neon
huge cards
marketing whitespace
oversized headings
random gradients
decorative animation
```

The UX should feel fast and enterprise-grade.

---

## Required POC screens

### 1. Admin Shell

Implement:

```text
Primary Rail
Top Bar
Context Sidebar
Search settings/modules
Global Search / Ctrl+K shell
role/capability-aware navigation
```

All important permitted module options should remain visible/searchable.

Do not hide core modules in `More`.

### 2. CDR Dynamic Data Grid

Use as the first high-value table POC.

Implement:

```text
PageHeader
Search calls...
matched-text highlighting
Date range
Filters
Columns
Result count
Data Grid
Pagination
Loading skeleton
Empty
No matches
Error
Row actions
```

Use ReUI Data Grid/Filters if the MCP confirms a free compatible implementation.

### 3. One CRUD Module

Select a real existing module with roughly 6–7 meaningful record fields.

Use:

```text
Data Grid
+ Add/Edit Sheet
+ confirmation Dialog
```

Do not use a giant modal as the main management experience.

### 4. Agent Shell proof

Implement enough to validate:

```text
Agent rail
top bar
presence/session region
middle iframe host
separate Call Manager
responsive layout
```

Do not redesign iframe contents.

---

## Iframe constraint

The middle iframe is a frozen external integration boundary.

Preserve it.

Until full integration, use only isolated synthetic mock JSON for host/integration state.

Do not invent:

```text
external API
external login/auth
token exchange
postMessage protocol
production URL
```

---

## Role model

Do not scatter `role === ...` checks everywhere.

Prefer:

```text
Role
 ↓
verified capabilities
 ↓
navigation
 ↓
actions
 ↓
data visibility
```

Demonstrate appropriate SuperAdmin/Admin/Agent workspace differences using the existing authorization model.

Do not weaken server-side authorization.

---

## Search behavior

Implement three scopes:

```text
Global: Search Flex...
Sidebar: Search settings...
Page: Search calls...
```

For dynamic remote search:

```text
debounce
cancel stale requests
loading state
latest-query correctness
permission-aware results
no-match state
keyboard navigation
```

Search highlighting must be safe and must not use unsafe HTML injection.

---

## Table behavior

Treat the grid as a working surface.

Use the appropriate subset of:

```text
search
filters
sorting
pagination
column visibility
sticky header
wide-table scrolling
row actions
loading
empty
error
highlight
```

Only enable backend-supported behavior.

Do not invent sorting/filter endpoints.

If a backend integration is not POC-ready, isolate synthetic local JSON behind a repository/adapter boundary and label it clearly.

Do not fake an HTTP API.

---

## Forms

Use:

```text
Dialog → confirmation / 1–4 small fields
Sheet  → 5–8 field Add/Edit
Page/Stepper → complex interdependent configuration
```

For repeatable record management, the **table is the primary surface**.

Use a sticky Sheet footer:

```text
Cancel | Save
```

---

## Anti-hallucination phase rule

Follow `PHASES.md` in exact order.

At the end of each phase output:

```text
READY FOR NEXT PHASE
```

or:

```text
BLOCKED
```

If blocked, stop.

Do not code around missing architecture by guessing.

---

## Continue automatically through the POC

After Phase 0, continue through the POC phases automatically **only when each previous phase is READY**.

Stop only for a material blocker such as:

```text
unknown frontend architecture
ReUI incompatibility with no safe alternative
unclear authorization boundary
unknown realtime ownership where changes are required
backend contract missing for required behavior
legacy CSS blast radius
iframe ownership ambiguity
```

Do not stop merely to ask which free component looks nicer; use the documented selection criteria and make a justified choice.

---

## Verification

Browser-test each major surface.

Check:

```text
1280
1366
1440
1920
1024
768
375–430 fallback
```

Test real interactions:

```text
navigation
search
filter
columns
pagination
Sheet open/save/cancel
Dialog confirm/cancel
keyboard focus
empty/error states
```

Refine until the POC looks deliberate and production-oriented.

---

## Final POC deliverable

Produce:

```text
implemented POC
phase reports
free ReUI component selection ledger
dependencies added and why
mock-vs-real integration ledger
browser QA notes
screenshots
known limitations
recommended next rollout phases
```

The POC is complete only if:

```text
Flex still looks like Flex
+
navigation is easier
+
tables are more powerful
+
forms are more usable
+
search is genuinely useful
+
the UI is clean and beautiful
+
no paid ReUI requirement exists
+
no backend behavior was invented
```

Start now with **Phase 0** and then proceed through the approved POC phases.
