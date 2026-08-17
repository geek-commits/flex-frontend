# FLEX Final 20-Issue Quality Report

**Date:** 2026-08-17
**Candidate:** `main` @ `2a85e096ec6193f651dc04dadb4106f0836584ff`

> **Honesty note:** The sweep plan asked for ≥20 issues to prove the sweep was
> active, not superficial. The product yielded **8 genuine, confirmable
> issues** (all verified and fixed). Reporting 8 is truthful; padding to 20
> with invented issues would violate the sweep's own integrity rules. The 8
> are enumerated below in the mandated format.

Format: **Issue · Route · Severity · Before · Fix · Verification · Commit**

---

| # | Issue | Route | Severity | Before | Fix | Verification | Commit |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Raw `amber-*` warning boxes | User form sheet | Minor/Token | `amber-200/50/800` helper text bypassed token system | FLEX `flex-status-warning*` tokens | tsc + eslint + Pest; runtime | `5fdf5ac` |
| 2 | Raw `amber-*` warning boxes | Role form sheet | Minor/Token | same, 2 boxes | FLEX status tokens | tsc + eslint + Pest | `5fdf5ac` |
| 3 | Theme toggle no accessible name | Global shell (primary rail) | A11y | icon-only button, tooltip only | `aria-label` added | accessibility snapshot shows "Switch to dark mode" | `f59b08f` |
| 4 | Brand mark WAAPI keyframe warnings | Global shell (primary rail) | Console noise | 36 "invalid keyframe value"/page | standalone `scale`/`translate` props | console audit: 0 fresh warnings | `d28dabe` |
| 5 | Recording drop zone not keyboard-accessible | Recordings | A11y | click-only `<div>` + hidden input | label-associated control | sheet opens; focus ring present | `3b91275` |
| 6 | Module-directory search no accessible name | Management Console | A11y | no `aria-label` | `aria-label` added | snapshot shows named searchbox | `f59b08f` |
| 7 | Roster call-state text-size inconsistency | Agent Monitoring | Polish | `text-[10px]` in cell vs `text-xs` | normalized to `text-xs` | roster renders 8 columns | `f59b08f` |
| 8 | SLA card presented POC data as live | System | Honesty | `Uptime (30d)` / "Platform availability SLA" | `Uptime (30d) — Sample` + POC disclosure | runtime text shows corrected labels | `be995b9` |

---

### Count reconciliation (8 vs 20)

- GAP-009 (Agent Monitoring roster) is a **feature-resolution**, not a quality
  issue; it is recorded in the sweep report and release notes, not padded here.
- The parity audit had already corrected many quality defects before the sweep
  began; the sweep's remaining surface was small and healthy.
- No issue was invented to reach the numeric target. All 8 above are real,
  diff-backed, and verified.

### Verification evidence

- **Tests:** Pest 39/136 green (unchanged baseline — no regression).
- **Types:** `tsc --noEmit` exit 0.
- **Lint:** clean on all changed files.
- **Build:** `npm run build` succeeds.
- **Runtime:** 20 core routes render without app-code errors; primary release
  surfaces console-clean.
- **Commits:** all 8 fixes land on `main`, remote-verified at
  `2a85e096ec6193f651dc04dadb4106f0836584ff`.

### Unresolved (documented, non-blocking)

See `FLEX_KNOWN_ISSUES.md` — vendored Base UI `nativeButton` console
diagnostic (VEND-001), Vite :5173 404 shell (ENV-002), pre-existing vendored
lint errors (REPO-003). None are product-code quality defects.