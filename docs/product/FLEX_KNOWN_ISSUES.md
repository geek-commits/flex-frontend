# FLEX Known Issues

**Release Candidate 1** — 2026-08-17
**Branch:** `main` · **Commit:** `f59b08fdc9e6ca839a51e75d6f552527e641e77b`

Each issue: **ID · route · severity · description · workaround · owner · release impact.**

Severity key: `BLOCKER` (security / cross-tenant / broken auth or core / data
corruption / crash / permission bypass), `HIGH`, `MEDIUM`, `LOW`.

**No BLOCKER known issues.** Release impact for all items below is
`NON-BLOCKING` unless noted.

---

## Product Gaps (from Feature Parity Audit)

| ID | Route | Sev | Description | Workaround | Owner | Release Impact |
| --- | --- | --- | --- | --- | --- | --- |
| GAP-001 | Agent workspace | HIGH | Whisper (agent assistance) documented but backend capability unknown; not implemented | Not offered in UI | Backend | NON-BLOCKING |
| GAP-002 | Agent workspace | MEDIUM | Warm transfer not implemented | — | Backend | NON-BLOCKING |
| GAP-003 | Agent workspace | MEDIUM | CRM boundary not integrated | — | Backend/Integrations | NON-BLOCKING |
| GAP-004 | Platform-wide | MEDIUM | Frontend-only POC; no tenant-boundary backend enforcement | Documented DEFERRED; tenant context is a UI safety boundary only | Backend/Platform | NON-BLOCKING |
| GAP-008 | Administration (wrap-up) | LOW | Wrap-up configuration location unresolved | — | Product | NON-BLOCKING |
| GAP-010 | Campaigns | MEDIUM | Campaign purpose/manual-entry/Excel import absent | POC mock adapter supplies data | Backend | NON-BLOCKING |
| GAP-011 | Reports (Agent) | LOW | Agent history is a single flat tab | — | Product | NON-BLOCKING |
| GAP-012 | Routing (Callback) | MEDIUM | Callback window configurable; `markAttended` unreachable | — | Backend | NON-BLOCKING |
| GAP-013 | CDR | MEDIUM | Export is a no-op; free-text customer filter not wired | POC mock adapter supplies data | Backend | NON-BLOCKING |

## POC Mock Adapter Boundaries

Data-backed workspaces use local mock adapters at their repository boundaries.
These are intentionally honest POC placeholders; each page discloses this
(`POC mock adapter — <Repository> boundary; replace with the real <domain>
backend in rollout.`).

- **Routes:** Campaigns, CDR, Users/Roles, Tenants, Routing (Queues/IVR/Time
  Groups/Time Conditions), Access Management, System & Infrastructure, AI
  Center, Subscriptions.
- **Severity:** LOW–MEDIUM.
- **Workaround:** Mock data is deterministic and sufficient for POC/demo.
- **Release impact:** NON-BLOCKING for the frontend POC.

## Vendor / Environment Diagnostics

| ID | Route | Sev | Description | Workaround | Owner | Release Impact |
| --- | --- | --- | --- | --- | --- | --- |
| VEND-001 | All shell pages | LOW | Base UI console diagnostic: "component that acts as a button expected a native `<button>`" (`nativeButton`). Pre-existing in the preserved shadcn preset. Non-fatal; rendered controls retain native semantics | None required; no functional impact | Vendored preset (preserved) | NON-BLOCKING |
| ENV-002 | Development | LOW | Vite dev server (port 5173) serves a 404 shell; production surface is the Laravel app on port 8000 | Use `http://localhost:8000` | Tooling | NON-BLOCKING |
| REPO-003 | Repo-wide lint | LOW | ~362 pre-existing lint errors in third-party vendored `reui/` and `ui/` (not from this work) | Lint gate scoped to changed files | Vendored deps | NON-BLOCKING |

## Deferred Polish (deliberate, non-blocking)

- Agent Monitoring deliberately exposes no trailing action column (Whisper /
  Inspect / View) until a real runtime capability exists — no invented actions.
- Status filter buttons in Campaigns expose lowercase accessible names
  (display is capitalized via `capitalize`). Cosmetic.