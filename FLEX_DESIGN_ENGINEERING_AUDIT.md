# FLEX Design Engineering Audit

Whole-product design audit (emil-design-eng craft lens). Produced as part of the Emil Kowalski skills-integration plan (Phase 9). This report records what was actually reviewed and the decisions made; it does not invent findings.

## Overview

The FLEX frontend already embodies the craft principles this audit is designed to check: restraint, purpose-driven detail, honest feedback states, and a single shared primitive system rather than per-route copies. The surfaces below are the ones actually audited in this pass. A full line-by-line pass over every route in the plan's route list was not run; this audit focuses on the shared primitives and the surfaces central to this plan (Dynamic Island, Social, charts, tables, brand).

### Standard applied (emil-design-eng)

- Buttons must feel responsive to press.
- Never animate from `scale(0)`; start near visible with opacity.
- Popovers origin-aware (modals stay centered).
- UI durations under 300ms; fast exits, deliberate presses.
- Stagger short (30–80ms) and decorative-only.
- Only transform/opacity compositor properties.
- Restraint: don't animate things seen 100x/day (keyboard actions).

## Critical

None.

## High

None.

## Medium / Low

| Surface | Finding | Decision |
| --- | --- | --- |
| `AppHeaderLayout` logo | `app-header` renders the animated brand logo without the replay guard used by the other three shells | **Accept — no change.** `AppHeaderLayout` is defined but not referenced by any page, so the unguarded logo is not currently reachable. Latent inconsistency only; not worth changing dead code. |

## No-change decisions

- **Dynamic Island:** velocity-aware snap spring already implemented (`dd54161`); press-feedback and rubber-banding deferred as low-value/risky for a discrete-anchor control; expansion, reduced-motion, spatial continuity, and instant appear/disappear verified correct.
- **FLEX logo:** intro preserved as a guarded one-time brand moment; reduced-motion static; no loop/hover replay in shells.
- **Social:** provider brand confined to avatar badges and channel icons; FLEX primary on selected filter chips; subtle selected row; proper empty states; single primary action in composer.
- **Charts:** realtime-safe (`animate={false}` default); entry animation opt-in.
- **Tables:** shared ReUI `DataGrid` primitive; no per-route copies.

## Shared-system findings

- **Button:** press feedback present (`active:translate-y-px`), focus-visible ring, disabled/aria-invalid handled. Compliant.
- **Feedback states:** composers and data surfaces use explicit success/error/empty states with a next step, per `docs/design/07-feedback-states.md`.
- **Primitives:** FLEX components (`flex/*`) and ReUI data grid are the shared sources of truth; routes compose, never duplicate.

## Route-by-route findings

Only routes actually reviewed are listed.

| Route / surface | Verdict |
| --- | --- |
| Agent workspace / Call Manager (Dynamic Island) | PASS |
| Social workspace (composer, filter, rows, context pane) | PASS |
| Contact Center dashboard chart | PASS |
| CDR table | PASS |
| Auth / shell brand logo | PASS |

## Conclusion

**PASS.** No Critical or High findings. The product already applies the craft principles the skills teach — restraint, purpose-driven detail, shared primitives, honest feedback. No approved changes from this audit.