# ADR-002 — Tenant Cache Invalidation

* Status: **Accepted — contract deferred to Increment 3** (Increment 1 records baseline truth, no invalidation code yet)
* Date: 2026-08-21
* Deciders: FLEX Hardening plan §§7, 9, 26

## Context

Tenant boundaries are a safety concern (`AGENTS.md:8`). Baseline: `features/tenants/tenant-context.tsx` provides a single in-memory context `{mode:'platform'} | {mode:'tenant', tenant}` with `enterTenant()` / `returnToPlatform()` — but **no module is tenant-scoped** (`tenant-context.tsx:12` comment; `domain/tenant-repository.ts` POC mock on `TENANTS_MOCK_RECORDS t1–t12`). 12 synthetic tenants, role-gated tenants surface (`/admin/tenants` via `roles.manage`), navigation filtered by `has(capability)`. Real backend tenant switch/isolation is NOT VERIFIED.

## Decision

**One authoritative tenant context** — `TenantContextProvider` remains the sole owner. Tenant switching **must re-scope/invalidate**:

```
queries, realtime subscriptions (once WS exists), cached data,
route selections (activeId/filters), permission scopes
```

Contract (to be implemented in Increment 3, proved by `A→B→A` rapid-switch stress per §9):

1. `enterTenant(tenant)` / `returnToPlatform()` emit a tenant-change signal.
2. All tenant-scoped consumers tear down old subscriptions + queries + cache, suppress stale flashes (no `old rows` reappear), open new subscription, refresh counts, re-scope permissions.
3. The invalidator is a single helper/module — not scattered `clear*` calls in JSX.
4. No persistence of sensitive tenant data beyond explicit product requirement (privacy §14 — audit `localStorage/sessionStorage/query cache`).

Domain layout preference preserving current repo structure (§26):

```
features/tenants/        — already exists (12 files)
domain/tenant-repository — mock boundary
future: tenant/ domain helpers (+ test harness in Vitest, Inc.2)
```

## Consequences

* Until Increment 3, POC mocks do NOT prove backend isolation. Baseline records `Query/cache invalidation: GAP`, `Realtime isolation: GAP`, `Backend authorization: NOT VERIFIED` (see `FLEX_HARDENING_BASELINE.md:4`).
* Frontend mock exercise `Platform → Tenant A → Tenant B → Tenant A` (rapid) will show UI context flips but data does not re-scope — which is expected at Increment 1 and scheduled for fix.
* Backend isolation will be tested only against an approved real multi-tenant environment/branch if one is supplied (none identified at baseline).

## Verification

* Baseline `grep`: `tenant-context.tsx`, `domain/tenant-repository.ts`, `data/tenants.mock.ts` confirmed tenant-POC.
* Increment 3 gate: automated tenant-switch race tests (500ms/rapid), no stale B data after returning to A.
