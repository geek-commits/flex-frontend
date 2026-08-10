# PHASE 0 — Repository + OpenCode + MCP Verification

> Phase 0 deliverable per `PHASES.md`. Read-only audit + instruction plumbing. No feature changes, no component installs, no dependency additions, no backend changes.

## Architecture

- **Application**: Laravel 13 (`laravel/react-starter-kit`), PHP 8.3+ (docs target 8.5), SQLite.
- **Auth**: Laravel Fortify (session auth, email verification, two-factor, passkeys). Routes gated by `auth` + `verified` middleware.
- **Frontend**: Inertia v3 SPA + React 19.2 + Vite 8 + TypeScript 5.7 + Tailwind CSS v4.
- **Routing**: `Route::inertia(...)` named routes in `routes/web.php`; Wayfinder generates typed helpers under `resources/js/routes/**` and `resources/js/actions/**`.
- **Backend ownership**: no CDR / queue / campaign / agent domain models or controllers exist. All operational data is currently inline synthetic arrays inside page components.

## Frontend stack

| Concern | Value | Evidence |
| --- | --- | --- |
| React | 19.2.0 | `package.json` |
| Tailwind | v4.0.0 + `@tailwindcss/vite` | `package.json`, `vite.config.ts` |
| shadcn | 4.16.2 | `package.json` |
| shadcn style/base | `base-luma` / `base` (Base UI) | `components.json`, `shadcn info` |
| shadcn preset | `b1aIuQ2XC` (theme blue, chart blue, remixicon, raleway, radius large, menu default-translucent/subtle) | `shadcn info --json` |
| Icon library | `@remixicon/react` (project), `lucide-react` (inside shadcn primitives) | `components.json`, imports |
| UI primitives | Radix-based shadcn (24 installed: alert, avatar, badge, breadcrumb, button, card, checkbox, collapsible, dialog, dropdown-menu, input-otp, input, label, navigation-menu, select, separator, sheet, sidebar, skeleton, sonner, spinner, toggle-group, toggle, tooltip) | `components/ui/*.tsx` |
| Bundler | Vite 8, laravel-vite-plugin, React compiler Babel plugin, Wayfinder | `vite.config.ts` |
| Alias | `@` → `resources/js` | `components.json`, `tsconfig.json` |
| Types | Inertia shared props: `auth.user`, `name`, `sidebarOpen` | `app/Http/Middleware/HandleInertiaRequests.php` |
| Database | SQLite, migrated; 1 seeded user `Super Administrator` (admin@flex.com); no domain tables | `database/database.sqlite` |
| Tests | Pest: 39 passing / 39 (auth, settings, dashboard); no frontend test runner | `php artisan test --compact` |
| Typecheck | `tsc --noEmit` passes | verified |
| Lint | ESLint baseline: 100 pre-existing errors (import/order + stylistic padding) in untouched files | `npm run lint:check` |

## shadcn info (verified)

```
framework: laravel
tailwindVersion: v4
style: base-luma, base: base
iconLibrary: remixicon
importAlias: @
preset: b1aIuQ2XC -> { style: luma, baseColor: stone, theme: blue, chartColor: blue,
                      iconLibrary: remixicon, font: raleway, fontHeading: inherit,
                      radius: large, menuAccent: subtle, menuColor: default-translucent }
components: 24 installed
```

## MCP status

- **ReUI MCP — available & usable.** `reui_search` returns real, scored registry data. `data-grid` confirmed **free** (`npx shadcn@latest add @reui/data-grid`), TanStack v9 based; requires `@tanstack/react-table`, `@tanstack/react-virtual`, `@dnd-kit/*`, `@base-ui/react` (already installed). Free = 20 components + all c-* examples, no license. Project surface: **card**. Project base: **base** (matches `base-luma`).
- **shadcn MCP — tools present; registry search inert.** The search tools report "No registries configured" because `components.json` has `registries: {}`. Adding an explicit registry entry (string or object form) is rejected by this shadcn CLI version (`Invalid configuration`). Resolution: use the CLI (`npx shadcn@latest view/search/docs`) and direct registry fetches at `https://ui.shadcn.com/r/styles/base-luma/{name}.json`. Verified available in base-luma style: `command` (cmdk), `table` (presentational); **no** `date-range-picker` (404).
- **laravel-boost MCP — configured** in `opencode.json` / `.mcp.json` (`php artisan boost:mcp`). Used for backend verification only.

## ReUI compatibility

- React 19 ✓ (ReUI targets React 19)
- Tailwind CSS v4 ✓
- Base library: project is `base` (base-luma) ✓ matches ReUI base variant
- TanStack: **not currently installed** — ReUI `data-grid` would add `@tanstack/react-table` + `@tanstack/react-virtual` (+ `@dnd-kit/*`). Acceptable per INSTRUCTIONS §21 only if the grid is selected in Phase 1; otherwise enhance the existing custom `FlexDataTable` with zero new deps.

## Existing dependencies (relevant)

- `@base-ui/react`, `@radix-ui/react-*` (dialog, select, dropdown-menu, tooltip, collapsible, toggle*, avatar, checkbox, label, separator, navigation-menu, slot), `@remixicon/react`, `lucide-react`, `@inertiajs/react`, `sonner`, `next-themes`, `tw-animate-css`, `class-variance-authority`, `tailwind-merge`, `input-otp`, `cmdk` **absent**, `@tanstack/*` **absent**, `react-day-picker`/`date-fns` **absent**.

## Auth model

- Fortify sessions + verified middleware. **No roles, no permissions, no policies, no permission package.** `auth.user` carries only standard user fields. Admin vs agent route gating is currently `auth+verified` only (pre-existing; not introduced here).
- POC approach (agreed): frontend **capability registry** keyed by role (SuperAdmin / Admin / Agent), driven by a clearly-labeled POC role switcher, used by navigation + global search. Server-side RBAC is `DEFERRED` (documented as such; not invented).

## Realtime / telephony model

- No realtime or telephony integration exists. `CallManager`, presence, and connection statuses are UI state + synthetic timers. Real telephony ownership is `UNKNOWN — requires repository verification` (out of scope for this POC; not fabricated).

## Iframe model

- `EmbeddedWorkspace` renders a frozen iframe boundary (`about:blank` fallback) with loading/error host states; separate `CallManager` panel.
- `public/mocks/integrations/crm-primary.json` holds **synthetic** host integration config (vendor, iframeConfig, hostBridge). `EmbeddedWorkspace` receives `mockConfigPath` but does not yet consume it (Phase 5 item).
- Rules enforced: no external APIs, no auth/token exchange, no postMessage protocol, no production URL invented.

## Instruction plumbing (completed in Phase 0)

- `INSTRUCTIONS.md`, `PHASES.md`, `KICKSTART_PROMPT.md` copied into repo root (from project source).
- `opencode.json` now has `"instructions": ["INSTRUCTIONS.md", "PHASES.md"]` (durable mechanism — survives any AGENTS.md regeneration).
- `AGENTS.md` prepended with the OpenCode project-rules block (Laravel Boost guidelines preserved below; boost may regenerate that lower section).
- `components.json` left **unchanged** (reverted experimental registry edit that the CLI rejects).

## Known risks

1. shadcn MCP registry search is inert (registry field unsupported by this CLI version) — mitigated via CLI + direct fetches.
2. `command` (cmdk) install pulls a new `dialog`/`input-group` (base-luma variants) that may differ from installed `dialog.tsx` — review diff before install in Phase 1/2; fallback is a custom Dialog-based command surface.
3. `AGENTS.md` lower section may be regenerated by `php artisan boost:update`; the `opencode.json` instructions array is the source of truth.
4. Pre-existing ESLint baseline (100 errors) is unrelated to this POC; changed files will be kept lint-clean.

## Unknowns

- `UNKNOWN — requires repository verification`: real CDR/campaign backend contract, realtime/telephony ownership, external iframe host API, production integration URLs.
- `DEFERRED — future integration`: real CDR/queue/campaign APIs, server-side RBAC, realtime channels, iframe host integration, external search backend.

## Blockers

- None. ReUI MCP confirmed usable; fallback paths confirmed.

## Acceptance checklist

- [x] repo architecture confirmed
- [x] shadcn configuration confirmed (preset preserved, `registries` untouched)
- [x] ReUI MCP usable (verified live search)
- [x] free-only requirement understood (search passed `free: true`; paid blocks/icons rejected)
- [x] compatibility known (React 19, Tailwind v4, base library)
- [x] iframe boundary identified (EmbeddedWorkspace + mock JSON; frozen)
- [x] auth model identified (Fortify; no RBAC — capability registry approach agreed)
- [x] instruction plumbing in place (opencode.json + AGENTS.md + INSTRUCTIONS/PHASES/KICKSTART in repo)
- [x] baselines verified: `tsc --noEmit` OK, 39 Pest tests pass

## Status

READY FOR NEXT PHASE
