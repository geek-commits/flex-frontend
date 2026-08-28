# FLEX Phase E — Operational Soak (Post-Baseline, Post-Lint PASS)

**Branch:** `main` @ `882490f` (lint PASS 0e/0w, canonical UI baseline, performance post-baseline)
**Gate prerequisite per sequencing correction:** lint PASS achieved (`2d9a41c`), UI baseline `644918f` applied — soak now tests final visual system (not pre-baseline).

## Checklist (per FLEX_PHASE_E_OPERATIONAL_SOAK_RELEASE_GATE_PLAN)

| # | Assertion | Tool | Status |
|---|---|---|---|
| 1 | 30 routes: `/dashboard` `/agent/dashboard` `/agent` `/agent/social` `/admin/cdr` `/admin/campaigns` `/admin/reports` `/admin/console` `/settings/profile` etc x30 | Playwright + Chrome | PENDING browser |
| 2 | Structural `[data-flex-shell]=1` `[data-flex-primary-rail]=1` `[data-flex-topbar]=1` `[data-flex-workspace]=1` each route | Playwright | PENDING |
| 3 | Provider single instance: `GlobalSearchProvider=1` `AgentAssistSessionProvider=1` `Toaster=1` `FlexCallIsland` lifecycle correct | Chrome | Code-verified single via `app-providers.tsx` single `WorkspaceProvidersLayout`; browser pending |
| 4 | `FlexCallIsland` lifecycle: no call 0 / active away 1 / back `/agent` 0 | Chrome | PENDING |
| 5 | Locale 5× `EN→SW→FR→EN` on `/dashboard` and `/agent` no refresh, tables translate, iframe not reload | Chrome | PENDING browser (code: `i18n.changeLanguage` only, no remount) |
| 6 | Active call continuity across `/agent`→`/dashboard`→`/admin/cdr`→`/agent/social`→`/agent` same `callId/connectedAt` | Chrome | PENDING |
| 7 | Assist continuity same session, no duplicate transport | Chrome | PENDING |
| 8 | Island continuity timer same | Chrome | PENDING |
| 9 | Global Search single dialog `Cmd+K` no double-toggle | Chrome | PENDING |
| 10 | CRM frame stability (locale/sidebar/timer/Assist no reload) | Chrome Network | **BLOCKED** — server XFO still `SAMEORIGIN` (see `FLEX_EXTERNAL_IFRAME_POST_BASELINE_RETEST.md`) |
| 11 | Social frame stability | Chrome | **BLOCKED** — invalid XFO |
| 12 | Console clean (zero React exceptions, frame-policy refusals) | Chrome Console | PENDING (expect frame-policy errors until server fix) |
| 13 | Network clean (no retry loops, no config refetch loops) | Network | PENDING |
| 14 | DOM/memory no monotonic growth (0/10/20/30 checkpoints) | Chrome Performance | PENDING |
| 15 | Auth isolation `/login` no operational providers | Playwright | PENDING |

## Current Code-Level Verifications (without browser)
- `ExternalWorkspaceHost` `frameKey` stable (see `use-external-workspace-state.ts:32` — bumps only on `fetchConfig` success/`retry`)
- `wallboardColumnsTranslated`/`activeCallColumnsTranslated` reactive via `t` dep, no `key` remount hack
- `setFlexLocale` does `i18n.changeLanguage` + `localStorage` + `cookie` + `html lang`, no provider remount
- `GlobalSearchProvider` single listener with cleanup (`removeEventListener` on unmount)
- `FLEX_LINT_BASELINE.md` now 0e/0w, `FLEX_PERFORMANCE_POST_BASELINE.md` build 333kB

## Blockers
- **Iframe server header** must be deployed before Phase E can fully PASS (items 10-12). All other items can be browser-verified post-baseline while iframe remains BLOCKED, but final `Phase E PASS` requires `X-Frame-Options` removed and `frame-ancestors` precise.

## Next
- Deploy Apache `Header unset X-Frame-Options` + `Header set Content-Security-Policy "frame-ancestors ..."` on `demo-crm`/`demo-chat`.
- Retest iframe render+login+session per `FLEX_EXTERNAL_IFRAME...:22` and record `iframe document request count` =1.
- Run 30-route soak with `Playwright` + manual `Chrome DevTools` traces, record `DOM nodes / shell counts / console / network` at 0/10/20/30.
- Independent verifier per `FLEX_SUBAGENT_ORCHESTRATION...:9` audits `main` @ final SHA, tries to disprove completion.

**Phase E not yet PASS — pending browser soak and iframe server deploy.**
