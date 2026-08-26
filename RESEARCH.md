# RESEARCH — Plane.so Dashboard Design Audit → FLEX Adaptation

> **Source:** `https://app.plane.so/geek-mollel/` — workspace `geek-mollel`, project `geek-mollel` (`d9a4786b-523a-434a-9903-100479498510`)
> **Captured:** 2026-08-25 · Playwriter (user Chrome session, authenticated) · viewport 1384×706
> **Status:** Research only — no code changes. Implementation requires a separate instruction.
> **Author:** OpenCode agent (Muse Spark)

---

## 0 · How this was captured

| Step | Method |
|---|---|
| Auth | Reused user's logged-in Chrome tab via `playwriter` extension (`context.pages()`); navigated to `https://app.plane.so/geek-mollel/` |
| Screenshots | `state.page.screenshot({ scale: "css" })` per route — 8 shots saved to `/var/folders/.../opencode/plane-shots/` |
| Tokens | `getComputedStyle()` on live DOM nodes + traversal of `document.styleSheets` for `--*` rules; light/dark captured by toggling `document.documentElement.setAttribute('data-theme','light'|'dark')` |
| Structure | `snapshot()` (a11y tree) + `getCleanHTML()` on toolbar/list regions |
| FLEX baseline | `my-app/resources/css/app.css`, `docs/design/*`, `my-app/resources/js/components/flex/*` |

**Routes visited:**
`/` (home, dark+light), `/projects/{id}/issues` (list), list→Kanban toggle (board), `/projects/{id}/overview`, `/projects/{id}/cycles`, `/projects/{id}/modules`, `/projects`, `/settings`, `/active-cycles`, `/analytics` — the last six hit the Plane loading skeleton (auth-gated or empty project); structural shell is consistent so analysis focuses on the three fully-loaded surfaces (home, list, board).

---

## 1 · Executive summary

Plane achieves "clean" through **reduction, not addition**:

1. **Single hue, near-zero chroma** (hue ~230/286, chroma 0.001–0.005) — every surface/border/text is a luminance step, not a color.
2. **One hairline border language** (`1px oklch(... )`) separates everything; no cards cast shadows in content areas. Elevation (`shadow-raised-*`) is reserved for overlays/dialogs only.
3. **Type does the hierarchy** — weights/sizes separate sections, not background colors or badges. Headings 20/600, section labels 14/600 muted, body 13/400, IDs 12/500, pills 13/400 are the whole scale.
4. **Dense but breathable** — list rows are `min-h: 44px` (`min-h-11`), padded `py-3 px-page-x`, separated by a single `border-b-subtle` line. Group headers (`Backlog 3`, `Todo 1`) are the only visual breaks.
5. **Toolbars collapse to a capsule** — view-switcher + filters + `Display`/`Analytics` + primary CTA (`Add work item`) live in a single row; the view switcher itself is a `bg-layer-3 p-0.5 rounded-lg` capsule with one active item.
6. **Sidebar is two columns, always visible on desktop:** icon-only rail (~48–56px) + secondary nav (~249px). Resizable (`role="slider" Resize sidebar"`), rounded where it meets content (`rounded 0 6px 6px 0`), with a subtle inset shadow.

**Implication for FLEX:** the FLEX shell (`FlexWorkbenchShell` + `PrimaryRail` + `ContextSidebar` + `AppTopbar`) already mirrors this two-sidebar shell. The opportunity is not to replace structure but to **re-tune tokens, type, borders, and component chrome to Plane's reduction** while respecting FLEX's domain states, permissions, and workspace model.

---

## 2 · Layout architecture

### 2.1 Shell

```
┌──────────────────────────────── desktop-header (h ~40, search centered 364px) ──────────────────────────────┐
│  G  geek-mollel ▾                          [ Search  w364 h28  bg-layer-2 border-subtle-1 rounded-lg ]   Inbox  Help  AI assistant  avatar │
├──────────┬─────────────────────────┬──────────────────────────────────────────────────────────────────────────┤
│  icon    │  secondary sidebar      │  main (canvas → work-surface)                                          │
│  rail    │  w~249 h~656            │  header:  breadcrumb (geek-mollel › Work items 7)  +  toolbar          │
│  w~56    │  bg oklch(0.193/230)    │    [ list | board | calendar | … ]  Filter  Display  Analytics  [+Add] │
│  Projects│  title "Projects" 14px  │  ─────────────────────────────────────────────────────────────────     │
│  Wiki    │  New work item  btn     │  ▸ Backlog 3   (group header, bg 0.215, pad 4/12/4/22, h43)            │
│  AI      │  Home / Drafts / …      │    GEEKM-3  2. Invite your team    [Backlog][High][assignee][⋯]      │
│  Settings│  Workspace ▾  Projects… │    …  (rows: min-h-11 py-3 px-page-x, border-b-subtle only)            │
│          │  promo card + trial     │  ▸ Todo 1                                                              │
│          │                         │  ▸ In Progress 2                                                       │
│          │  ← slider Resize →      │                                                                          │
└──────────┴─────────────────────────┴──────────────────────────────────────────────────────────────────────────┘
```

* Dark: body/canvas = `oklch(0.1689 0.0021 230.81)`, secondary sidebar = `oklch(0.1932 0.002 230.81)`, group headers = `oklch(0.2158 0.0025 230.82)` (one step lighter).
* Light (toggled): body = `oklch(0.9614 0.0013 286.38)`, sidebar = white `oklch(1 0 0)`.

### 2.2 Topbar (desktop-header)

* Height: 40px container + 28px search input (`h-7`) = ~40px total (`min-h-10`).
* Search is centered, `w-[364px]`, `rounded-lg`, `bg-layer-2 border border-subtle-1`, placeholder `text-13 text-placeholder`.
* Right actions: `Get started` (`bg-layer-2`), Inbox/Help icons (8×8 with `group-hover:bg-layer-transparent-hover`), AI button, avatar.
* No heavy divider underneath — the sidebar's top edge and the main header's `border-b-subtle` do the separation.

### 2.3 Sidebars

* **Primary icon rail** — inferred from screenshots: ~48–56px wide, bordered on right, icons 16–18px (`size-4.5` for inbox), labels 13/400 (`text-13 font-medium text-tertiary`).
* **Secondary sidebar** — 249–250px wide, `rounded-sm` items (6px), `text-13 font-medium text-secondary`, hover `bg-layer-1`, active state is filled (darker). Top contains `New work item` button (`h-8`, `bg-layer-2`, `border border-subtle-1`, `rounded-md`, shadow `raised-100`).
* The sidebar is `px-2.5` with internal `gap-4` in its scroll viewport, `scroll-area` component.

### 2.4 Main content header

* Breadcrumb: `geek-mollel › Work items` with count pill `7` (`bg-???`, small).
* Right toolbar: view-switcher capsule (`bg-layer-3 p-0.5 rounded-lg`) holding 5 icon buttons (list active = `bg-layer-2 border-subtle-1 shadow-raised-200 text-primary`, inactive = `border-transparent text-secondary`), then Filter (icon-only, `h-6 w-7`), `Display`/`Analytics` (`bg-layer-2` style), `Add work item` (`bg-accent-primary` blue), overflow `⋯`.
* The toolbar lives inside the main header's `border-b` region; on scroll it may stick.

---

## 3 · Visual tokens

### 3.1 Color (oklch)

Plane's palette is **achromatic**:
- **Hue drift is negligible** — dark uses 230.8, light uses 286.3 (both desaturated, chroma < 0.006). The perceived difference is warm vs cool undertone; in practice it's neutral.
- **Scale (dark):**

| Token | Value | Use |
|---|---|---|
| `--canvas` | `oklch(0.1689 0.0021 230.81)` | `documentElement` / body bg |
| `--sidebar` | `oklch(0.1932 0.002 230.81)` | secondary sidebar bg |
| `--layer-2` | `oklch(0.2378 0.0029 230.83)` | buttons / search / card subtle |
| `--group-header` | `oklch(0.2158 0.0025 230.82)` | backlog/todo header row bg |
| `--border-subtle` | `oklch(0.2593 0.0033 230.84)` | 1px dividers, button borders |
| `--border-subtle-1` | slightly lighter variant | card borders |
| `--text-primary` | `oklch(0.9235 0.0017 230.685)` | title, headings |
| `--text-secondary` | `oklch(0.8455 0.0035 230.72)` | button text, secondary labels |
| `--text-tertiary / muted` | `oklch(0.7655 0.0054 230.76)` | IDs, timestamps, section labels |
| `--accent-primary` | blue (not extracted, ~`oklch(0.55 0.18 260)`) | `Add work item`, `Activate Plane AI` |

- **Light:** canvas `oklch(0.9614 0.0013 286.38)`, sidebar white, `--layer-2` becomes light gray. Text flips to `oklch(0.1689 0.0021 286.18)`.

**Observation:** No status color leaks into chrome. Status/priority are text inside tiny pills, not row tints.

### 3.2 Typography

| Role | Size / weight / LH | Example |
|---|---|---|
| Greeting heading | 20/600/30 | "Good afternoon, Gad josephat" |
| Section label | 14/600/21 | "Ask Plane AI", "Quicklinks", "Recents" |
| Group header | 14/500/21.56 | "Backlog 3", "In Progress 2" |
| Item title | 13/400/19.5 | "2. Invite your team 🤝" |
| Item ID | 12/500/14.4 | "GEEKM-3" (muted) |
| Pill text | 13/400 | "Backlog", "High", "Todo" |
| Sidebar nav | 13/500 | "Home", "Workspace" |
| Search input | 13/400 | "Search" placeholder |
| Top nav badge | 13 | workspace pills |
| Font family | `Inter Variable, ui-sans-serif, system-ui, sans-serif` (body 16/400/24 base, but UI sizes are overridden per-element) |

### 3.3 Spacing & sizing

* **Search:** `w-[364px] h-7 p-2 rounded-lg`.
* **Toolbar buttons:** `h-6 w-7`, gap `0.25` inside capsule (`gap-0.25 p-0.5`).
* **Group header:** `py 4px`, `px-12 21.6` (left indent for icon), `h-43`.
* **List row:** `min-h-11`, `py-3`, `px-page-x` (tailwind `px-page-x` — project defines as `1rem`–`1.5rem`), `gap-3` inside row, `border-b border-b-subtle` only.
* **Kanban card:** content `px` ~12, `py` ~10, `gap` between elements ~8.
* **Quicklinks card:** `rounded-lg`, border subtle, internal icon 20–24px in a `bg-layer-1` square.
* **Page canvas→surface:** Plane uses `bg-layer-transparent` (effectively `transparent`) for content rows over the canvas color; cards use `border border-subtle-1` with `rounded-md/lg` (6–8px), not shadows, to delineate.

### 3.4 Radius

Everything is **small**: `rounded-sm` (4px) for sidebar items, `rounded-md` (6px) for buttons/cards, `rounded-lg` (8px) for search/toolbar capsule. No large radii (12–16px). The sidebar panel itself is `0 6px 6px 0` on its right edge where it meets the content.

### 3.5 Shadows & borders

* Content rows: **no shadow** (`shadow none`). The only visible separation is `border-b-subtle` (1px).
* Interactive elements (buttons, toolbar capsule active item, search): `shadow-raised-100/200` — a very soft `0 1px 4-6px rgba(41,47,61,0.03-0.04)`.
* Modals/overlays (dialog "Welcome…"): raised shadow `shadow-lg` (not measured; existing FLEX `flex-shadow-overlay 0 8px 24px` is analogous).

---

## 4 · Component anatomy

### 4.1 Workspace home

* Centered column, max-width constrained (not full bleed).
* "Good afternoon, {name}" 20/600 centered, with weather timestamp 14/400 muted underneath.
* Sections ("Ask Plane AI", "Quicklinks", "Recents") are `14/600 text-tertiary`, with an optional action link on the right (`+ Add quick Link`, `All ▾`).
* **Ask Plane AI card:** single card, subtle border, internal dark preview area. CTA is a solid blue `Activate Plane AI` button.
* **Quicklinks:** 3 equal cards in a grid, each: icon square (`size-8 rounded-md bg-layer-1`) + title 14 + "1 day ago" 13 muted. No image, no heavy border.
* "Recents" area is below the fold (partially captured).

### 4.2 Work items — List view

* Group headers (`Backlog`, `Todo`, `In Progress`) are interactive bars with icon + count + expand (`+`) on the right. Border bottom `border-b-subtle`; bg slightly raised over canvas.
* Each **row**: link wrapping a flex row (`px-page-x group/list-block min-h-11 relative flex flex-col gap-3 bg-layer-transparent hover:bg-layer-transparent-hover py-3 text-13 transition-colors`). Contents:
  * Left: `GEEKM-{n}` (muted 12/500, fixed width ~56) + title 13/400.
  * Center: grows (`flex-grow`).
  * Right: 2–3 pills: status (`Backlog` with dot/o icon), priority (`High`/`Low`/`None`), assignee avatar placeholder, overflow `⋯` (only on hover is typical; here visible on captured rows — Plane shows them on hover, screenshots captured hover state for some).
* `+ New work item` inline rows sit between groups (text-13, `+` prefix, no border background).
* Inline creation row (when active): `GEEKM` prefix + input placeholder "Work item title" + hint "Press 'Enter' to add another work item".

**Key subtlety:** rows are links (`<a href="/geek-mollel/browse/GEEKM-3/">`), not divs — keyboard navigable, right-click to open in new tab.

### 4.3 Work items — Board (Kanban) view

* Three columns: `Backlog 3`, `Todo 1`, `In Progress 2`. Columns are card stacks, not independently scrollable in the captured viewport; horizontal overflow with thin scrollbar at bottom.
* Each card:
  * Fixed card width (flex; ~260–300px implied), `rounded-md/lg`, `border border-subtle-1`, `bg-layer-2` (dark) with internal padding.
  * Top line: ID `GEEKM-{n}` (muted small).
  * Title line: `text-13/14` primary, possibly truncated.
  * Bottom line: status pill, priority pill, assignee icon — same pill style as list, smaller.
  * "+ New work item" at column bottom.
* Column headers include `⤢` expand + `+` add.

### 4.4 Pills / badges

* Small capsule: `h ~20–22`, `px ~8`, `text-12/13`, subtle border (`border-subtle-1`), background `bg-layer-1` or transparent with icon prefix (dot/circle for status, signal bars for priority). Text + optional SVG icon (`size-3–3.5`). Priority `High` has orange signal bars, `Low` blue, `None` muted.
* Status icons: circle variants — Backlog = dashed circle, Todo = empty circle, In Progress = filled dot, Done = checkmark (list) / green fill.

### 4.5 Buttons & toolbar

* Primary: `bg-accent-primary` (blue), text on-color white, `rounded-md`, `h-7–8`, `px-2–3`, hover `accent-primary-hover`.
* Secondary: `bg-layer-2 border border-subtle-1 text-secondary`, hover `bg-layer-2-hover`.
* Capsule (view switcher): `bg-layer-3 p-0.5 rounded-lg` holding 5 buttons; active `bg-layer-2 border-subtle-1 shadow-raised-200 text-primary`, inactive `text-secondary hover:bg-layer-transparent-hover`.
* Icon buttons (filter, quick actions): `h-6 w-7 rounded-md`, transparent until hover.

### 4.6 Search & command palette

* Inline topbar search doubles as a trigger for a popover. The expanded state (not captured open) is `absolute -top-[6px] left-1/2 -translate-x-1/2 bg-surface-1 border border-subtle-1 rounded-md shadow-lg pt-10 w-0→w-[?]` — when populated, a 24×24 icon + bold text + description appears.
* Placeholder copy: "Search your workspace" + "Start typing to search across work items, projects, cycles, modules and more".

### 4.7 Secondary UI pieces

* **Sidebar "Download Plane for mobile" card:** image at top (`rounded top`), text below, `×` dismiss. `rounded-md`, `border-subtle-1`, shadow raised. This promo pattern appears on home + issues sidebars.
* **Trial badge:** `Business trial ends in 12d` — subtle pill, `bg-layer-2`, bottom of sidebar.
* **Detail/overlay:** the welcome dialog ("Welcome to your workspace") — full-screen dim (`bg-black/…`), card with image area + text + `Get started`. Rounded, likely `rounded-lg` with `shadow-lg`.

---

## 5 · Interaction & motion

* Row hover: `hover:bg-layer-transparent-hover` — a single, subtle background lift. No scale, no border color change.
* Capsule active state: `transition-all` on border + bg, soft.
* Button hover/active: standard `transition-colors` (`duration-flex-*` in FLEX is 120/150/200ms + `cubic-bezier(0.4,0,0.2,1)`; Plane's computed transition is not verbose but visually matches).
* Collapse/expand (group headers, sidebar toggles): `transition-all duration-300` on header height and sidebar width (resize handle).
* Sidebar resize: draggable slider (`role="slider" Resize sidebar"`), persists to `localStorage["sidebarWidth"]`.
* Empty/loading: skeleton cards (rectangular `bg-layer-3` blocks) while loading; not styled distinctly.

---

## 6 · Plane vs FLEX — direct comparison

| Dimension | Plane | FLEX (current, `my-app/resources/css/app.css` + `docs/design/14-workspace-surfaces.md`) | Gap |
|---|---|---|---|
| Canvas | `oklch(0.968 0.002 / 230)` dark-equivalent; light `oklch(0.961 0.001 286)` | `--flex-workspace-canvas: var(--background)` → `oklch(0.147 0.004 49)` dark, `oklch(1 0 0)` light | Hue family differs (FLEX warm 49° vs Plane cool 230/286) but luminance is close — easy to realign |
| Surface | Sidebar + work surface are ONE step apart; group headers another step | Same pattern: `--flex-workspace-surface` / `surface-muted` / divider | Already aligned |
| Borders | 1px hairlines, near-invisible in dark (`0.259 0.003 230`), strong restraint | FLEX divider `0.926 0.003 250` light, dark `oklch(1 0 0 / 0.12)` — similar hairline intent but slightly more visible; `app.css:242, 491-493` | Reduce border opacity/contrast marginally |
| Type scale | 12/13/14 tight bands, headings 20/600, everything else 13/400 | FLEX page-title 20, subtitle/section 12, card-title 14, body 13.06, table-header 11 — similar but FLEX's body/table-body are 0.8125rem (13px) vs Plane 13 flat, and section labels 12 vs 14 | Align section label to 14/600 muted (currently 12) |
| Radius | 4/6/8 only | FLEX `sm 6 md 8 lg 12 pill 999` — close; `xs` not used | Plane never uses 12; reserve lg for modals only |
| Shadows | None on content; overlay only | Same doctrine in FLEX (`flex-shadow-none` for content, overlay/modal only) — `app.css:278-280,494-495` | Already aligned |
| Toolbar | Capsule `bg-layer-3 p-0.5 rounded-lg` | FLEX uses individual `Button`/`ToggleGroup`/`Select` components per page, no capsule primitive | Add capsule pattern as a FLEX primitive |
| List row | `min-h-11 py-3 px-page-x border-b-subtle` | FLEX tables: `FlexPageContent`, card patterns, `flex-workbench-shell` — table rows exist but vary per route (CDR/Campaigns/Dashboard exemplars) | Normalize list row to Plane metrics; reuse for Supervision tables |
| Pill | `h 20 text-12/13` with icon prefix | FLEX `StatusBadge` (`my-app/resources/js/components/flex/status-badge.tsx`), `FlexStatus` | Shrink pill height/text to match Plane, standardize icon mapping |

---

## 7 · Mapping to FLEX — what to keep, what to change

### 7.1 Preserve (do not restyle)

* Domain enums / permission model (`docs/design/domain/*`, `my-app/resources/js/auth/capabilities.tsx`) — Plane's "status" vocabulary is for issues; FLEX's agent/call/queue/campaign states are operational and must remain authoritative.
* Tenant boundaries / workspace model (Agent / Supervision / Administration / Platform in `docs/design/01-product-model.md`) — Plane's Projects/Workspace hierarchy is not transplanted.
* Integration boundaries (Call Manager iframe, mock adapters) and realtime behavior (`09-realtime-data.md`).

### 7.2 Adapt — tokens (`app.css`)  [approx. lines]

| Token | Current FLEX | Plane target | Change |
|---|---|---|---|
| `--flex-workspace-divider` / `divider-strong` | `0.926 0.003 250` / `0.896` | Dark  `oklch(0.259 0.003 230.84)` at ~10–12% opacity equivalent; keep light hairline but reduce contrast | Slight desaturation + lower L |
| `--flex-radius-lg` | 12px | Reserve for modals; use 6/8 for inline surfaces | Document rule, reduce usage |
| `--flex-font-size-section` | 12px | 14px/600 muted (Plane section labels) | Bump from 12 to 14, weight 600 |
| `--flex-space-page-x/y` | 1.5rem (24px) | Plane list rows use tighter ~16–21px (`px-page-x` maps to 12–24px depending on breakpoint); keep 24px as shell, 16px for list interior | Add `--flex-space-list-x: 16px` alias |
| `--flex-duration-*` | 120/150/200ms `ease 0.4/0/0.2/1` | Plane uses 150–300ms `ease-in-out` for shell transitions | Keep existing, add `duration-slow 300ms` for sidebar collapse |

### 7.3 Adapt — components (new or refined FLEX primitives)

| Plane pattern | FLEX primitive to add/refine | Notes |
|---|---|---|
| View-switcher capsule | `components/flex/flex-view-switcher.tsx` (new) | Capsule `bg-flex-workspace-surface-muted p-0.5 rounded-lg` + ToggleGroup items; active `bg-flex-surface border border-flex-border shadow-flex-overlay` |
| Group header | Refine `flex-page-content` / table group row | `h 43 py-1 px-3.5 bg-flex-workspace-surface-muted border-b border-flex-workspace-divider`, label 14/500 |
| List row | Normalize CDR / Campaigns table rows to Plane metrics | `min-h-11 py-3 px-flex-space-cell-x`, hover `bg-flex-layer-hover` |
| Kanban card | New `flex-kanban-card.tsx` or variant of `card.tsx` | `rounded-md border border-flex-border bg-flex-surface p-3 gap-2`, ID 12/500 muted, title 13 |
| Pill / status badge | Refine `flex-status.tsx` + `status-badge.tsx` | `h 20 text-[12px] rounded-md border px-2`, icon `size-3.5`; map FLEX domain states to Plane's muted capsule, not colored background |
| Topbar search | Refine `global-search.tsx` + `app-topbar.tsx` | Center 364px when space allows, `h-7 rounded-lg bg-flex-surface-subtle` |
| Secondary sidebar | Already `context-sidebar.tsx` + `primary-rail.tsx` | Confirm widths: rail 56, secondary 250, slider persistence `localStorage["sidebarWidth"]` |

---

## 8 · What makes Plane feel minimal (principles to steal)

1. **Achromatic chrome.** Every neutral uses hue 230, chroma <0.01 — color is reserved for semantic meaning only (priority `High` orange signal bars, not fills).
2. **One divider.** A single `border-b-subtle` does all separation. No alternating row tints, no card shadows inside content.
3. **Type hierarchy without color.** Headings earn weight (600) and size (20/14), everything else sits at 13/400 muted. Only links/CTAs are blue.
4. **Generous negative space around sparse content.** Home is a centered column with ~48px between sections; even the list view leaves air (`gap-3` between rows' internal groups, not tight packing).
5. **Capsule compresses controls.** Five view options collapse into one `p-0.5` pill — reduces toolbar from "many buttons" to "one element".
6. **Hover reveals.** Assignee pills / `⋯` overflow are hover-only — reduces static visual noise.
7. **Consistent corner radius.** 6px everywhere makes dense lists feel softer without looking "rounded-app".
8. **Illustration-free.** No imagery competes with data; icons are `lucide` stroke-2, 16px, `text-secondary`.
9. **Predictable placement.** New-item entry points appear in three mirrored locations (`+ New work item` under each group + header `+` per column) — reduces search cost.

---

## 9 · Implementation outline (phased — update `docs/design/*` in the same commit)

### Phase 1 — Tokens & shell alignment (no route changes)

* Tune `app.css` divider / section / spacing tokens as in §7.2; update `docs/design/13-visual-language.md` and `14-workspace-surfaces.md` in the same commit.
* Verify `FlexWorkbenchShell` + `PrimaryRail` + `ContextSidebar` + `AppTopbar` widths/heights against §2; add a shell layout test (snapshot: rail 56, secondary 250, search 364).

### Phase 2 — Atoms (capsule, pill, group header)

* Build `FlexViewSwitcher` capsule and refine `FlexStatus`/`StatusBadge` pills; story/route to verify hover/active states. Update `docs/design/11-component-governance.md` decision test for capsule.

### Phase 3 — Organisms (list row, Kanban card, quicklinks)

* Normalize one supervision table (e.g., CDR exemplar) to Plane list-row metrics (`min-h-11 py-3 border-b-subtle`), then replicate via the shared `FlexPageContent`/table primitive — never route-copy. Board view only for surfaces that actually need Kanban (Cycles or equivalent in FLEX).

### Phase 4 — Surface polish (topbar, home, search)

* Center search at 364px on desktop, refine `GlobalSearch` empty/populated states per `07-feedback-states.md`, tune home centered column max-width.

**Quality gates per `docs/design/12-quality-gates.md`:** each phase must `bun run lint:check`, `types:check`, `build` (in `my-app/`), be visually verified in-browser across light/dark, and pass a11y keyboard checks (`FocusTrap`, `aria-current` on active nav) before the next begins.

---

## 10 · Prohibitions & risks

* Do not introduce a project-permission model from Plane — keep `capabilities.tsx` authoritative.
* Do not add illustration-heavy hero sections (Plane home is sparse); FLEX's operational surfaces (CDR, Campaigns) are data-dense by design.
* Do not backport Plane's analytics/issue-specific states (`Backlog`/`Todo`/`In Progress`/`Done`) as FLEX domain states.
* Board views in FLEX should map to **cycles/queues**, not generic "work item" state, if used at all.
* The `overview`/`cycles`/`settings` skeleton loaders could not be captured fully (gated/long load) — re-verify those routes after auth/session refresh before detailing their interaction design.

---

## 11 · Screenshot catalog (for future diff tooling)

| # | File | Surface | Theme |
|---|---|---|---|
| 01 | `01-home.png` | Workspace home (projects) | Dark |
| 02 | `02-home-light.png` | Home (forced light via `data-theme=light`) | Light |
| 03 | `03-issues.png` | Work items — list (with welcome dialog) | Dark |
| 04 | `04-issues-clean.png` | List (dialog dismissed once) | Dark |
| 05 | `05-issues-dismiss.png` | List — clean, second dialog dismissed | Dark |
| 07 | `07-board.png` | List → board toggle attempt (workspace menu opened) | Dark |
| 08 | `08-try-board.png` | Board — 3-column Kanban (Backlog/Todo/In Progress) | Dark |
| 09a | `09-projects-dir.png` | `/projects` (loading skeleton) | Dark |
| 09b | `09-geek-mollel_settings.png` | `/settings` (loading skeleton) | Dark |
| 09c | `09-geek-mollel_analytics.png` | `/analytics` (loading) | Dark |

All files under `/var/folders/x9/7d1ndxs56sn_c1tc9cn2z_000000gn/T/opencode/plane-shots/` — move into repo or attach to an ADR as needed.

---

## 12 · Open questions (resolve before Phase 1)

1. **Brand hue:** keep FLEX's `oklch 264` blue for primary CTA, or shift toward Plane's cooler blue? Recommendation: keep FLEX blue (product identity), but adopt Plane's luminance/contrast for its hover/active steps.
2. **Sidebar persistence:** FLEX already uses `app_sidebar_collapsed` in `localStorage`; align key name with Plane's `sidebarWidth`?
3. **Empty states:** Plane's home quicklinks show "1 day ago" timestamps — does FLEX's dashboard need an analogous "Recent activity" feed, or keep its metric-card model?
4. **Mobile:** screenshots are desktop 1384×704; Plane's mobile is drawer-based — capture a <768px pass if FLEX needs to adapt its responsive rail.

---

*End of research. Next instruction should name which phase to build.*
