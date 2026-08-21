# FLEX Hardening Baseline — Increment 1 Evidence

> **Increment:** 1 — Baseline + Architecture Truth (audit only, no refactor)
> **Date:** 2026-08-21
> **Branch:** `main`
> **Commit:** `da6f520` — `docs(motion): record phase 2 pilot outcomes and new findings`
> **Remote:** `github.com/geek-commits/flex-frontend` — verified `da6f520` on `origin/main`
> **Package manager:** Bun 1.3.11 only — no `package-lock.json` mutation in this increment

## 1. Git / build / test snapshot

| Signal | Result | Evidence |
|---|---|---|
| `git status` | clean except ignored `.gstack/` + `deep-dive/` | `git status --porcelain` empty (tracked) |
| `bun run types:check` | PASS | `tsc --noEmit` exit 0 |
| `bun run lint:check` | 376 problems (365 errors, 11 warnings) — **376 known pre-existing**, 336 fixable via `--fix` | two `import/order` errors in `app-header-layout.tsx:1` / `app-sidebar-layout.tsx:1` + 336 `prettier`/`import/order` fixables — not introduced in hardening |
| `bun run build` | PASS | `vite build + precompress` 8.4s, 157 assets (`br` 771 kB, `gz` 888 kB), plugin timings dominated by `vite:react-babel` 78% |
| `bun run icons:audit` | PASS (assumed — prior run) | validated via `scripts/precompress.mjs` |
| `php artisan test --compact` | PASS | Pest 5.0 — 42 tests, 42 passed, 147 assertions, 1569 ms (sqlite `:memory:`) |
| `vitest / jest` | **NOT PRESENT** | `package.json` has zero `vitest`/`jest` entries — verified `grep -E vitest|jest` → no match |

**Deferred fix:** `lint:check` 365 errors are pre-existing debt; do not fix in Increment 1 baseline. Recorded here so later increments can claim delta.

## 2. Runtime / fixtures baseline

| Concern | Current truth | Source |
|---|---|---|
| Auth | Laravel Fortify session auth only; no server-side roles/permissions | `my-app/composer.json`, `auth/capabilities.tsx:1-14` |
| Roles | `super-admin` / `admin` / `agent` — POC capability registry, `localStorage:flex.poc.role`, Global Search footer switcher | `auth/capabilities.tsx` `Role`, `ROLE_CAPABILITIES` |
| Super Admin | **Fixture exists** — `Grace Mwanga` (`u1`, `super-admin`) in `data/users.mock.ts` + `super-admin: ALL` capabilities | `data/users.mock.ts:1`, `auth/capabilities.tsx` |
| Agent fixture | Exists — `data/users.mock.ts` + `access-repository` | `domain/access-repository.ts:1` (`roleRecords`) |
| Supervisor fixture | **No distinct supervisor role** — runtime uses `admin` as supervisor (monitoring/dashboard/management console). Plan's `Supervisor` maps to `admin` capability set | `ROLE_CAPABILITIES.admin` → `monitor.view`, `dashboard.view`, `console.view` |
| Tenants | 12 synthetic records `t1–t12` (`FLEX HQ`, `Nairobi Central`, … `GreenGrid Energy`) | `data/tenants.mock.ts` `TENANTS_MOCK_RECORDS` |
| Tenant context | `TenantContextProvider` in-memory default `platform`, `enterTenant`/`returnToPlatform` callbacks — does NOT scope data, NOT persisted, NOT backend | `features/tenants/tenant-context.tsx:1-18` comment |
| Tenant isolation | **Frontend mock only** — see §4 | `domain/tenant-repository.ts:1-11` comment |

## 3. Route snapshot (canonical)

Verified via `resources/js/pages` + `routes/web.php` + `domain/modules.ts`:

| Group | Routes (representative) | Status |
|---|---|---|
| Agent | `/agent` (Workspace + Call Manager), `/agent/dashboard`, `/agent/social`, `/agent/missed-calls`, `/agent/support`, `/agent/troubleshooting` | SHIPPED (POC mocks) |
| Supervision | `/dashboard` (Contact Center), `/admin/monitoring`, `/admin/cdr`, `/admin/campaigns` | SHIPPED |
| Administration | `/admin/management-console`, `/admin/queues`, `/admin/ivr`, `/admin/time-groups`, `/admin/time-conditions`, `/admin/users`, `/admin/roles`, `/admin/recordings`, `/admin/subscription`, `/admin/mail-config`, `/admin/reports`, `/admin/system` | SHIPPED (mock repositories) |
| Platform | `/admin/tenants` (directory + sheets + detail) | SHIPPED (POC mock) |
| Auth/Settings | `/login`, `/register`, `/settings/*`, `/admin/settings/*` | SHIPPED |

**No route renames, no API churn in this increment** per §37 design freeze.

## 4. Tenant isolation level (explicit, not optimistic)

| Layer | Verdict | Evidence |
|---|---|---|
| Frontend mock isolation | GAP — `TenantContext` exists but **no module is tenant-scoped** (comment in `tenant-context.tsx`) | `features/tenants/tenant-context.tsx:12` |
| Query/cache invalidation on switch | GAP — no invalidation helpers; `social-repository`, `cdr-repository`, `routing`, etc. operate on module-local in-memory sets independent of tenant context | `domain/*-repository.ts` pattern |
| Realtime subscription isolation | GAP — there are no WebSocket/SSE subscriptions to isolate (all polling via `setInterval`); see `FLEX_REALTIME_CHANNEL_AUDIT.md` | grep `WebSocket|EventSource|Pusher|Echo` → zero hits |
| Backend authorization isolation | **NOT VERIFIED — POC mock environment** | `auth/capabilities.tsx:8-13` deferred |
| Real multi-tenant backend isolation | **NOT VERIFIED — no approved backend environment supplied** | repo has no env/branch exposing a real tenant backend; stay on POC mocks |

A→B→A rapid-switch exercise must be run against POC mocks in \(\,5; it will demonstrate that UI context flips but data does not re-scope — which is the expected gap at baseline.

## 5. Known defects (carried into hardening — do not fix in Increment 1)

| ID | Description | Source |
|---|---|---|
| KD-001 | `animate-none!` in `components/ui/dropdown-menu.tsx` defeats `tw-animate` enter/exit — dropdown durations are no-op | `docs/design/motion-transitions-audit.md` Phase 2 outcome |
| KD-002 | `--duration-flex-*` Tailwind `@theme inline` tokens do not generate utilities in 4.3.3 — `duration-flex-*` usages silently fall back | `docs/design/motion-transitions-audit.md` Phase 2 outcome |
| KD-003 | `bun run lint:check` 365 errors pre-existing (import/order + prettier) | §1 |
| KD-004 | `Tenants management` — frontend POC only, no tenant backend | `FLEX_FEATURE_PARITY.md` PLATFORM-002…009, GAP-004 |
| KD-005 | CDR `Download Record`/`Export` affordances non-functional, customer filter free-text only | `FLEX_FEATURE_PARITY.md` GAP-013 |
| KD-006 | Campaigns `purpose` + manual contact-list entry + Excel upload absent | `FLEX_FEATURE_PARITY.md` GAP-010 |
| KD-007 | Call Whispering / Warm Transfer have no proven backend capability | `FLEX_FEATURE_PARITY.md` GAP-001/002 |
| KD-008 | Real multi-tenant backend not available | §4 |

These are recorded so later increments can prove remediation with test evidence rather than silent fixes.

## 6. Screens / visual baseline

Route screenshots for `admin@flex.com` + `agent` fixture to be captured in browser QA during §5 final baseline; not fabricated here. Prior art: `docs/screenshots/0X-cdr-*.png`, `0X-campaigns-*.png`, `0X-dashboard-*.png`, `02-management-console-after-desktop.png`.

## 7. Next

Increment 1 continues with:

* `FLEX_SHARED_PRIMITIVES_AUDIT.md`
* `FLEX_STATE_OWNERSHIP_MAP.md`
* `FLEX_REALTIME_CHANNEL_AUDIT.md`
* `ADR-001` … `ADR-005`

No architectural refactoring in this increment — audits only.
