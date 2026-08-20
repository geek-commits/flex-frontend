# CONFERENCE IMPLEMENTATION AUDIT

Audit of Conference Call capability, per the call-scoped modernization plan §37–§40/§91. Supersedes `CONFERENCE_CAPABILITY_AUDIT.md`. Outcome: **MISSING PARITY** — documented in the manual but absent from runtime (no SDK, no backend, no consultation/merge state).

## Status

Conference Call is **documented softphone functionality** (`Flex CC User Manual`) but is **not implemented** in the POC. This is a **parity defect** per plan §40: the manual documents it, the runtime does not implement it → record as MISSING PARITY (NEEDS_PRODUCT_DECISION). **No Conference UI is shipped.**

## Runtime source

There is **no real telephony runtime**. The entire call layer is a deterministic in-memory mock adapter:

- Owner: `MockWorkspaceState` — `my-app/resources/js/features/agent-workspace/state/mock-workspace-state.ts` (module-singleton pub/sub class).
- `workspace-types.ts:3–9`: *"The POC telephony is a deterministic mock… No external system contract is invented here."*
- React binding: `useWorkspaceState()` — `state/use-workspace-state.ts`.

## SDK support

**None.** No telephony/WebRTC/SIP SDK in the dependency graph:

- `my-app/package.json` — no `@twilio/voice-sdk`, `sip.js`, `webrtc`, or voice SDK.
- `my-app/composer.json` — Laravel/Inertia/Fortify/Passkeys only; no telephony packages.

## Backend endpoint

**None.** No call, telephony, conference, or media controllers/routes in `app/` or `routes/`.

## Conference model

**Not present.** No `conferenceId`, no `participants[]`, no multi-party leg, no `consult`/`merge`/`bridge` state. The only call model is a single `ActiveCall` (`workspace-types.ts:25–35`) with a single `target`.

## Relationship to warm transfer

Conference is a superset of consultation; since consultation does not exist, conference cannot either:

- `docs/design/domain/call-state.md:48`: *"Direct transfer only — the runtime has no consultation state, so Warm Transfer is not offered (§43)."*
- `docs/product/FLEX_FEATURE_PARITY.md:95` (AGENT-CALL-011): Warm Transfer = `NEEDS_PRODUCT_DECISION` — *"NO runtime consultation state — not offered (§43)."*

## Parity defect

Documented but missing controls (see `CALL_MANAGER_PARITY_MAP.md`): **Conference Call**, **Show Key Pad** (in-call DTMF), **Settings**, **Assist**, **Warm Transfer**. Recorded in `docs/product/FLEX_FEATURE_PARITY.md` as MISSING → NEEDS_PRODUCT_DECISION.

## Decision

**Do not ship Conference UI** (plan §40/§117). No Conference control is added to the Call Manager. The parity defect is recorded in the tracker. Enabling conference requires a product + telephony/backend decision: a real telephony adapter, a consultation/multi-party call state, `conferenceId`/`participants` fields, and conference commands — none of which the runtime implements.