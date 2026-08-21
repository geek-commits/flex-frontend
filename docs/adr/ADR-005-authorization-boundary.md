# ADR-005 — Authorization Boundary (Permission Evaluation)

* Status: **Accepted — UI-only canonical, backend authority deferred**
* Date: 2026-08-21
* Deciders: FLEX Hardening plan §§7, 9, 43, 26

## Context

Baseline permissions are a **frontend-only POC** (`auth/capabilities.tsx:8-13` — "backend has no roles/permissions yet, Fortify session auth only, server authorization DEFERRED"). Single UI model: `Role = 'super-admin'|admin|agent`, `Capability` (19 values: `dashboard.view|monitor.view|…|support.view`), `ALL` + `ROLE_CAPABILITIES` + single `NAVIGATION: NavEntry[]` (workspace `admin|agent|shared`) consumed by `PrimaryRail`, `ContextSidebar`, `GlobalSearch` (`has(capability)` first). `Management Console` permission-aware visibility is honest but frontend-only (`FLEX_FEATURE_PARITY.md: ADMIN-CONSOLE-006`).

## Decision

**One canonical authorization source in UI:** `auth/capabilities.tsx`.

* `CapabilityProvider` wraps `app.tsx` (`AppProviders`); `useCapabilities().has(capability)` is the only gate in JSX. **No role-string scatter** (`role === 'admin'`) — migrate any remaining scatter to `has()`.
* `NAVIGATION` is single-source for rail + sidebar + search — no duplicated route lists.
* Frontend visibility is presentation, **not security.** Backend remains authoritative at the data source when it exists.
* Domain helpers to be tested in Vitest (Increment 2): permission selectors, role/tenant guards, `tenant-state invalidation helpers` (§2 Vitest targets), `status/error normalization`.
* Route/action matrices in `FLEX_ROLE_PERMISSION_TENANT_MATRIX.md` (Increment 2) drive Pest + Vitest coverage for: allowed route, forbidden route/redirect, `Create User / Delete Queue / Download Recording / Whisper / Conference / Agent Assist / Switch Tenant / Export` (§9). Where a test env permits, verify backend also rejects unauthorized actions.

## Consequences

* Until a backend role/permission service ships, matrices will contain `Backend authorization: NOT VERIFIED — POC mock environment` for every sensitive action — explicit, not pretending.
* Hardening §§31/43 blocker: `permission bypass` is P0 stop-the-line.
* No API/schema invent (§38): if a backend change is required, stop and document frontend need as a separate workstream.

## Verification

* Grep `has(` guards dominate over `role ===` at baseline (confirm in `FLEX_SHARED_PRIMITIVES_AUDIT.md`).
* Matrix coverage (Increment 2): every guarded route/action recorded as `visible|read|create|edit|delete|execute|export|whisper|conference|tenant switch` per role; automated forbidden-route `redirect|denied` behavior verified.
