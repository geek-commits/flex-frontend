# FLEX Canonical UI Baseline

**Starting SHA:** `62dbbcb65c94d0dd922d7e78b90416a039f47c20`
**Status:** Code-complete baseline (tokens → primitives → shell). See `docs/quality/FLEX_CURRENT_HEAD_COMPLETION_BASELINE.md` for gate snapshot.

## Canonical Values (locked per Zero-Backtrack §7)

| Role | Value | Token | Source |
|------|-------|-------|--------|
| Typography — Inter | Inter Variable | `--font-sans` | `app.css:13` |
| Title | 16px / 20px / 500 | `--flex-font-size-page-title` / `--flex-font-size-page-title-line` / `--flex-font-weight-title` | `app.css:316-318` |
| Label | 13px / 16px / 500 | `--flex-font-size-label` / `--flex-font-size-label-line` / `--flex-font-weight-label` | `app.css:326-328` |
| Body | 14px / 400 | `--flex-font-size-body` / `--flex-font-weight-body` | `app.css:323-325` |
| Section (Plane pivot) | 14px / 600 / muted | `--flex-font-size-section` / `--flex-font-weight-section` | `app.css:320-321` |
| Buttons | 32px / 10px | `--flex-button-height` / `--flex-button-radius` | `app.css:336-337` + `components/ui/button.tsx:24 h-8 rounded-[10px]` |
| Rows — data | 40px | `--flex-row-height-data` | `app.css:338` |
| Rows — object | 44px | `--flex-row-height-object` | `app.css:339` |
| Badge success | 20px / 6px / #CAFACE / #15B042 | `--flex-badge-success-*` | `app.css:340-343` + `components/ui/badge.tsx:21 h-5 rounded-[6px] bg-[#CAFACE] text-[#15B042]` |
| Switch | 24×14 / 10px thumb / #0077E6 | `--flex-switch-*` | `app.css:344-347` + `components/ui/switch.tsx` |
| Text light primary | #333333 | `--flex-text-primary` | `app.css:348` |
| Text light subtle | #777777 | `--flex-text-muted` | `app.css:349` |
| Avatar account fallback | layered blue/cyan/violet/magenta | `--flex-account-avatar-gradient` (alias `--flex-avatar-gradient`) | `app.css:350` layered triple-gradient + `components/flex/account-avatar.tsx` (scoped) |
| Motion slow | 300ms | `--flex-duration-slow` | `app.css:287` |

## Token Migration

| Old | New | Affected | Status |
|-----|-----|----------|--------|
| `h-9` buttons | `h-8` 32px `rounded-[10px]` | `Button` primitive | Done (`644918f`) |
| `rounded-md` badge success | `h-5 rounded-[6px] bg-[#CAFACE] text-[#15B042]` | `Badge success variant` | Done |
| missing switch tokens | `24/14/10 #0077E6` + `Switch` component | `Switch` | Tokens done, component done this batch |
| `AvatarFallback bg-muted` | `AvatarFallback var(--flex-avatar-gradient)` fallback-only | `Avatar` | Done (Phase 3: generic bg-muted, AccountAvatar layered) |
| `text-muted-foreground oklch(0.55)` as subtle | `#777777` light + dark theme-aware oklch equivalents | `app.css` + charts/surfaces | Done (duplicate def intentional, dark overrides added Phase 4) |
| `--flex-font-size-section 0.75rem` | `0.875rem 600` | group headers | Done (`62dbbcb`, weight fixed 500→600 Phase 4) |
| `--flex-workspace-divider 0.935 0.003` | `0.93 0.0025` | shell dividers | Done |
| `--font-heading alias` | removed (Inter only via `font-sans`) | `app.css @theme inline` | Done Phase 4 |
| row tokens unused | DataGrid `h-10` + `FlexListRow min-h-11` + `data-grid-table-virtual 48→40` + density prop | tables | Done Phase 5 (header 13/16M, virtualizer 40) |

## Compact Filter Exception (explicit, not drift)

`Input size="sm"` and `Select size="sm"` remain `h-7 28px rounded-[6px] text-[13px] font-medium` per `docs/design/13-visual-language.md:Filter` and existing product filter density. This is an **approved compact exception** to the `32px/10px` control rule. Do not mix `h-7` and `h-8` accidentally; document new filters as `compact` or migrate to `32/10` explicitly. Filters in `features/social/components/social-channel-filter.tsx:14` already carry spec comment.

## Affected Components

- `resources/css/app.css` — single source of truth, semantic variables over literals (§5)
- `components/ui/button.tsx`, `badge.tsx`, `switch.tsx`, `avatar.tsx`, `input.tsx`, `select.tsx`, `dialog.tsx`, `sheet.tsx`
- `components/flex/primary-rail.tsx`, `context-sidebar.tsx` (`w-[250px]` canonical, `flex-app-shell.tsx` wrapper fixed `248→250`), `app-topbar.tsx`, `agent-operational-header.tsx`, `flex-workbench-shell.tsx`, `flex-view-switcher.tsx`, `flex-group-header.tsx` (600), `flex-list-row.tsx` (44px object), `flex-kanban-card.tsx`, `flex-status.tsx` (20/12), `status-badge.tsx`, `account-avatar.tsx`
- `components/reui/data-grid/*` — density prop `dense` wired but not token-driven

## Exceptions (§33)

| Component | Baseline rule | Exception | Reason | Approved behavior |
|-----------|---------------|-----------|--------|-------------------|
| Large KPI / metric | title 16/20 500 | `.flex-metric 18/24 600 -0.1px` + `flex-numeric` | large metric hierarchy | `docs/design/13-visual-language.md:metric` |
| Auth / welcome hero | title 16/20 500 | `text-2xl` display headings in `welcome.tsx:16`, `auth-split-layout.tsx:32,67` | marketing/hero display | allowed if documented, Inter only |
| Brand / logo | 16/20 500 | brand treatment | identity | — |
| Dynamic Island compact chrome | 16/20 500 | compact 12/13 text | space-constrained telephony | documented per island spec |
| Compact filters | 32/10 controls | `28px/6px 13/16M` `size="sm"` | filter density, existing rollout | explicit exception above |
| `textarea` / multiline | 32px height | content-driven | multiline | — |

## Export Boundary (§31) — DEFERRED

`exportReport()` currently waits and produces no real file (mock delay). Per §8 decision gate, real export is **explicitly DEFERRED** for this code-completion program. Backend contract (reportId/format/filters/locale/tenant+auth) and tenant isolation will be defined in a future release plan. No server/deployment change in this plan.

## Remaining Browser Verification (§9-§10) — documented deferred, FLEX host only

- Performance (§9): Chrome traces + 30-transition leak + Assist soak browser evidence to be captured locally/dev before final verifier. Build artefact baseline: app 333kB gzip 104kB. No regression introduced (shared CSS/token/component changes, one CSS gradient).
- Phase E (§10): 30-route soak + shell/provider/Dynamic Island/call continuity browser evidence — FLEX host PASS expected, external CRM/social embed DEFERRED (server frame policy).

## Completion

Phases 1-8 complete per gates §27-31; Phases 9-10 evidence capture and Phases 11-13 (Call Manager stakeholder refinement, deep UI/UX audit, independent final verifier) remain as next code-completion batches before DONE (§36-37). No production/server deployment performed.

## Verification

Per-batch (§26): `bun run types:check / lint:check / test / build / git diff --check` all PASS (Phase 1 snapshot). Browser computed-style evidence deferred to Phase 2-5 implementation per verification matrix (§29-30).
