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
| Avatar account fallback | layered blue/cyan/violet/magenta | `--flex-account-avatar-gradient` (alias `--flex-avatar-gradient`) | `app.css:350` (pending Phase 3 layered update) + `components/ui/avatar.tsx:48` / `components/flex/account-avatar.tsx` |
| Motion slow | 300ms | `--flex-duration-slow` | `app.css:287` |

## Token Migration

| Old | New | Affected | Status |
|-----|-----|----------|--------|
| `h-9` buttons | `h-8` 32px `rounded-[10px]` | `Button` primitive | Done (`644918f`) |
| `rounded-md` badge success | `h-5 rounded-[6px] bg-[#CAFACE] text-[#15B042]` | `Badge success variant` | Done |
| missing switch tokens | `24/14/10 #0077E6` + `Switch` component | `Switch` | Tokens done, component done this batch |
| `AvatarFallback bg-muted` | `AvatarFallback var(--flex-avatar-gradient)` fallback-only | `Avatar` | Done but name/gradient pending Phase 3 |
| `text-muted-foreground oklch(0.55)` as subtle | `#777777` light + dark theme-aware oklch equivalents | `app.css` + charts/surfaces | Done (duplicate def intentional) |
| `--flex-font-size-section 0.75rem` | `0.875rem 600` | group headers | Done (`62dbbcb`) |
| `--flex-workspace-divider 0.935 0.003` | `0.93 0.0025` | shell dividers | Done |
| `--font-heading alias` | removed (Inter only via `font-sans`) | `app.css @theme inline` | Pending Phase 4 |
| row tokens unused | DataGrid `h-10` + `FlexListRow min-h-11` + `data-grid-table-virtual 48→40/44` | tables | Tokens present, DataGrid wiring pending Phase 5 |

## Compact Filter Exception (explicit, not drift)

`Input size="sm"` and `Select size="sm"` remain `h-7 28px rounded-[6px] text-[13px] font-medium` per `docs/design/13-visual-language.md:Filter` and existing product filter density. This is an **approved compact exception** to the `32px/10px` control rule. Do not mix `h-7` and `h-8` accidentally; document new filters as `compact` or migrate to `32/10` explicitly. Filters in `features/social/components/social-channel-filter.tsx:14` already carry spec comment.

## Affected Components

- `resources/css/app.css` — single source of truth, semantic variables over literals (§5)
- `components/ui/button.tsx`, `badge.tsx`, `switch.tsx`, `avatar.tsx`, `input.tsx`, `select.tsx`, `dialog.tsx`, `sheet.tsx`
- `components/flex/primary-rail.tsx`, `context-sidebar.tsx` (`w-[250px]` canonical, `flex-app-shell.tsx` wrapper `248px` → fix pending), `app-topbar.tsx`, `agent-operational-header.tsx`, `flex-workbench-shell.tsx`, `flex-view-switcher.tsx`, `flex-group-header.tsx`, `flex-list-row.tsx`, `flex-kanban-card.tsx`, `flex-status.tsx`, `status-badge.tsx`
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

## Remaining (per Zero-Backtrack §4)

- **Phase 3:** replace simple `linear-gradient` with layered triple radial/linear per §1 canonical token + scope to `AccountAvatar` only + regression test
- **Phase 4:** remove `--font-heading` alias, lock hierarchy `page 16/20 500 → section 14/600 muted → label 13/16 500 → body 14/400`
- **Phase 5:** wire `DataGrid` rows to `40/44` via density prop `density="data"|"object"` and header `13/16M`; fix `FlexAppShell 248→250` and `GroupHeader 500→600`
- **Phases 6-13:** localization tails, runtime cleanup, export boundary, performance/soak, Call Manager, deep audit, independent verifier

## Verification

Per-batch (§26): `bun run types:check / lint:check / test / build / git diff --check` all PASS (Phase 1 snapshot). Browser computed-style evidence deferred to Phase 2-5 implementation per verification matrix (§29-30).
