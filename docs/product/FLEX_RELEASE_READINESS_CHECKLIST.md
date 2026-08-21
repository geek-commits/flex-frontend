# FLEX Release Readiness Checklist — Increment 5 (evidence-backed)

> **Governing:** hardening §32, §49. Critical blockers: broken call lifecycle, tenant data leak, permission bypass, missing documented critical capability, Social send failure, Assist session leak, conference crash.

## Build / tests (this increment)

| Signal | Result |
|---|---|
| Commit | `169855e` → this checklist on `main` |
| `bun run types:check` | PASS (`tsc --noEmit`) |
| `bun run build` | PASS — 157 assets, `br 771 kB` |
| `bun run test` (Vitest) | 20/20 (capabilities, status-styles, utils, social-repo, social-dedupe) |
| `php artisan test --compact` | 42/42, 147 assertions |
| `bun run icons:audit` | validated (flex/icons + social) |

## Role / tenant matrices

| Axis | Coverage | Evidence |
|---|---|---|
| Roles | `super-admin` (Grace Mwanga `u1` fixture verified), `admin` → supervisor, `agent`; `SUPER ADMIN fixture available? YES→verify` | `auth/capabilities.tsx`, `FLEX_ROLE_PERMISSION_TENANT_MATRIX.md` |
| Tenants | Platform + Tenant A (`t1` FLEX HQ) + Tenant B (`t2` Nairobi Central), `A→B→A` rapid exercised via POC mock | `data/tenants.mock.ts`, `tenant-context.tsx` + `tenant-invalidation.ts` |

## Isolation level (explicit)

```
Frontend mock isolation:          GAP — TenantContext does not yet scope data (wired invalidator in 169855e, full scoping deferred)
Query/cache invalidation:         PARTIAL — helper registered, not all consumers wired
Realtime subscription isolation:  GAP — no WS at baseline (polling only)
Backend authorization isolation:  NOT VERIFIED — POC mock environment
Real multi-tenant backend:        NOT VERIFIED — no approved backend supplied
```

## Feature parity (§44, §49)

`FLEX_FEATURE_PARITY.md` canonical — `VERIFIED|PARTIAL|MISSING|…` per feature; critical manual features tracked including Agent Assist (call-scoped) and Conference (unsupported boundary, no fabricated UI). `MISSING|BROKEN|UNKNOWN` block release unless explicitly accepted — none accepted at baseline.

## Observability / privacy (§45, §48)

* High-risk failures now have event names defined (`connection_lost`, `call_command_failed`, `tenant_switch`, `message_send_failed`, etc. — `FLEX_FRONTEND_OBSERVABILITY_EVENTS.md`).
* Sensitive payloads not logged (§34); `observability.ts` masks tenant ids; `errors.ts` preserves `correlationId`.

## Remaining blockers before GA

* Tenant-cache real isolation (Increment 3 contract → Increment 5 real backend if supplied)
* `permission bypass` is P0 stop-the-line — route/action matrices now defined, backend enforcement still `NOT VERIFIED`
* No `lighthouse` run on `:8000` with Chrome at this commit (headless interstitial) — budget to be set in follow-up QA

## Browser / theme / responsive matrix (§33 intent)

| Dimension | Planned matrix for follow-up QA |
|---|---|
| Browsers | Chrome latest, Edge latest |
| Themes | light, dark (next-themes) |
| Motion | normal, reduced (`useReducedMotion` honored) |
| Network | normal, slow, offline, reconnect |
| Responsive | 1440 / 1280 / 1024 / 768 / 430 / 390 / 375 / 360 |
| Contexts | platform, Tenant A, Tenant B |
| Roles | super-admin, admin, agent (all runtime-supported) |

## Verdict

**Hardening increments 1–4 evidence assembled; release readiness remains `NOT READY FOR GA`** — foregoing blockers are honest and must be cleared in verified follow-ups, not pretended. Latest push verified on `origin/main`.

