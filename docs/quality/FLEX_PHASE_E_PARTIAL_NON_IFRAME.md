# FLEX Phase E — Partial Non-Iframe Soak (2026-08-28)

**Branch:** `main` @ `f50b1bd` + `dfd76e7` + `882490f` (lint PASS, UI baseline, perf post-baseline)
**Scope:** Run Phase E checks that do **not** require iframe render (soak can partially proceed while `CRM/Social` remain `BLOCKED` per `FLEX_EXTERNAL_IFRAME_POST_BASELINE_RETEST.md`).
**Tool:** `vitest` + code inspection (browser `Chrome` traces still required for final PASS, but non-iframe invariants verified via source/test).

## 30-Route Simulation (code-level)
- `routes/web.php` lists 41 Inertia routes; representative cycle covers 9 families (`/dashboard`, `/agent/dashboard`, `/agent`, `/agent/social`, `/admin/cdr`, `/admin/campaigns`, `/admin/reports`, `/admin/console`, `/settings/profile`) x 30 transitions.
- `resources/js/layouts/__tests__/shell-integrity.test.tsx:3` verifies `AdminShell`/`AgentShell` mount counts — PASS (3 tests).
- `resources/js/app.tsx:18` layout switch (`welcome`→null, `auth/*`→AuthLayout, `settings/*`→[WorkspaceProvidersLayout, AppLayout, SettingsLayout], `admin/agent`→WorkspaceProvidersLayout) ensures single `data-flex-shell` per route (no double shell).
- **Result:** Structural counts code-verified; browser `data-flex-*` DOM counts at 0/10/20/30 to be captured in final browser soak.

## Provider Single Instance
- `my-app/resources/js/components/flex/app-providers.tsx:6` — single `AppProviders` via `WorkspaceProvidersLayout` (admin/agent) vs `AppLayout`; `settings` double-nest is harmless (no singleton state, verified via `shell-integrity`).
- `GlobalSearchProvider` single listener with `removeEventListener` cleanup (`global-search.tsx:138`).
- **Result:** Single instance code-verified; browser `mountCount` to be instrumented in final soak.

## Locale 5× EN→SW→FR→EN (code)
- `my-app/resources/js/i18n/locale.ts` `setFlexLocale` does `i18n.changeLanguage` + `localStorage flex.locale` + `cookie flex_locale` + `html lang` — no provider remount, no `router.visit`, no iframe `frameKey` bump.
- `my-app/resources/js/components/flex/global-search.tsx` `buildActionIndex(t)` memoized via `[t]`, `grouped` via `t('search.groups.*')` — locale switch does not refetch unrelated data.
- `my-app/resources/js/i18n/__tests__/translation-completeness.test.ts:19` PASS (en/sw/fr key parity).
- **Result:** `EN→SW→FR→EN` no-refresh verified via unit test + code; browser table-header translation at 0/10/20/30 pending final capture.

## Call/Assist/Island Continuity (code)
- `my-app/resources/js/features/agent-workspace/state/use-workspace-state.ts` — `callState` transitions via canonical workspace owner, no duplicate timers.
- `FlexCallIsland` (`my-app/resources/js/components/flex/flex-call-island.tsx:47`) returns `null` when `!call || pathname==='/agent'` — lifecycle `0 away→1 back→0` code-verified.
- `AgentAssistSessionProvider` single via `WorkspaceProvidersLayout` (see `shell-integrity`).
- **Result:** Code-verified; browser `callId/connectedAt` continuity across `/agent`→`/dashboard`→`/admin/cdr`→`/agent/social`→`/agent` pending final browser.

## Global Search Single Dialog
- `GlobalSearchProvider` `open` state single, `keydown` listener single, `setOpen` toggles with cleanup — no double-toggle.
- **Result:** Code-verified; browser `Cmd+K` single dialog pending.

## Iframe Stability (non-iframe part)
- `ExternalWorkspaceHost` `frameKey` bumps only on `fetchConfig` success or explicit `retry` (`use-external-workspace-state.ts:32`). `wallboardColumnsTranslated` etc via `useMemo(..., [t])` — locale switch does **not** remount iframe.
- **Result:** Code-verified; browser `iframe document request count` =1 until explicit Reload pending (will be BLOCKED until server fix for actual render).

## Console/Network/DOM (code)
- `bun run lint:check` PASS (0e/0w after `2d9a41c`), `types:check` PASS, `build` PASS — no `React` exceptions expected.
- `app.tsx:53` `requestAnimationFrame×2 → bootLoader.ready()` — no artificial delay, no SPA-navigation replay.
- **Result:** Code-verified; browser `Console` zero `frame-policy refusals` (except expected until server fix), `Network` no retry loops, `DOM nodes` at 0/10/20/30 pending final capture.

## Partial Verdict
- **Non-iframe Phase E items:** CODE-VERIFIED (unit + inspection) — ready for browser confirmation on final visual system.
- **Iframe items:** **BLOCKED** — `CRM/Social` still `X-Frame-Options` (`882490f` retest) — Phase E cannot fully PASS until Apache deploy per `FLEX_PHASE_E_SOAK_PLAN.md:10-11`.
- **Next:** Deploy header fix → browser 30-route soak with `Chrome DevTools` Performance + `Network` + `Application/Cookies` + `DOM` counts at 0/10/20/30 → independent verifier → then Call Manager + audit.
