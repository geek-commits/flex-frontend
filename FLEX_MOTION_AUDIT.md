# FLEX Motion Audit

Whole-product motion audit. Produced as part of the Emil Kowalski skills-integration plan (Phase 10). This report records what was actually reviewed and the decisions made; it does not invent findings.

## Overview

The FLEX frontend already follows the product-design operating system in `docs/design/` — motion is restrained, compositor-first, reduced-motion-aware, and realtime-safe. Most motion review came back compliant. The full review of every route in the plan's route list was not exhaustively run; the surfaces below are the ones actually audited in this pass.

### Standard applied (review-animations)

- Feel-breaking regressions (Critical) and High findings must be zero to pass.
- Motion must have a purpose (spatial consistency, state indication, feedback, preventing jarring change) — never "just looks cool."
- UI durations under 300ms except for deliberate brand moments.
- Springs for interruptible/drag interactions; instant under reduced motion.
- Only transform/opacity compositor properties where possible.

## Critical

None.

## High

None.

## Medium / Low (accepted)

| Surface | Finding | Decision |
| --- | --- | --- |
| Bklit bar chart entry | Grow animation animates SVG `width`/`height` (layout-triggering, not compositor-only) rather than transform/opacity | **Accept — no change.** The animation is opt-in (`animate={false}` default), off for realtime dashboards, and lives in the vendored chart boundary, which is an integration boundary the plan forbids reworking. A transform-only bar grow is not cleanly achievable without reworking the chart library. |
| Dynamic Island snap spring | 0.4s velocity-aware spring (vs. strict <300ms) | **Accept.** Deliberate, critically damped, matches apple-design move/reposition timing; direct manipulation warrants a slightly longer settle than a generic UI toggle. |

## No-change decisions

These were reviewed against the skills' findings and deliberately left unchanged:

- **Dynamic Island (Phase 4):** F3 expansion overflow (already correct), F4 press-feedback + F5 rubber-banding (deferred), F6 reduced-motion (instant snap verified), F7 spatial continuity (verified), F8 instant appear/disappear (verified). F1 velocity-aware spring implemented in `dd54161`.
- **FLEX logo (Phase 5):** Intro (5.2s) kept — plays once per session via `useBrandIntroReplayGuard` (sessionStorage), so it is a deliberate one-time brand moment, not a frequently-seen replay. Reduced motion shows the static source. No loop, no hover replay in production shells. App-header logo is unguarded but `AppHeaderLayout` is currently unused by any page, so it is not a live replay.
- **Social workspace (Phase 6):** Provider brand confined to avatar badges / channel icons, never filter backgrounds or nav; FLEX primary on selected filter chips; selected row is a subtle tinted surface; proper empty states; single primary action in the composer. Button primitive already has press feedback (`active:translate-y-px`).
- **Tables (Phase 8):** All tables are thin ReUI `DataGrid` compositions (dense layout, skeleton loading) — craft owned by the shared primitive, no per-route noise.

## Shared-system findings

- **Button primitive:** already has `:active` press feedback and `:focus-visible` ring. Compliant.
- **Chart system:** realtime-safe by default (`animate={false}`); entry animation opt-in; reduced-motion handled by `motion/react`. Compliant.
- **Brand system:** replay guard centralised; intro-once-per-session; reduced-motion static. Compliant.

## Route-by-route findings

Only routes actually reviewed are listed.

| Route / surface | Verdict |
| --- | --- |
| Agent workspace / Call Manager (Dynamic Island) | PASS |
| Social workspace | PASS |
| Contact Center dashboard chart | PASS (entry anim opt-in) |
| CDR table | PASS |
| Auth / shell logo | PASS |

## Conclusion

**PASS.** No Critical or High findings. Motion is restrained, purposeful, compositor-first, reduced-motion-aware, and realtime-safe. No approved changes from this audit.