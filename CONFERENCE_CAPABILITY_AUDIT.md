# CONFERENCE CAPABILITY AUDIT

> **SUPERSEDED.** See `CONFERENCE_IMPLEMENTATION_AUDIT.md` — the call-scoped modernization plan reclassified Conference as **documented but MISSING PARITY** (parity defect → NEEDS_PRODUCT_DECISION), rather than "unsupported/hypothetical". Outcome is unchanged (no Conference UI), but the framing is now parity-defect. This file is retained for history only.

Audit performed against the current FLEX frontend POC + Laravel backend. Outcome: **UNSUPPORTED**.

## Supported

**UNSUPPORTED** — the current stack has no conference-calling capability and no telephony SDK at all.

## Runtime source

There is **no real telephony runtime**. The entire call layer is a deterministic in-memory mock adapter:

- Owner: `MockWorkspaceState` — `my-app/resources/js/features/agent-workspace/state/mock-workspace-state.ts` (module-scoped singleton pub/sub class). Header: *"the POC's single canonical owner for agent state, telephony connection, call state, the active call, mute/hold, transfer, wrap-up, and call history."*
- `my-app/resources/js/features/agent-workspace/state/workspace-types.ts:3–9`: *"The POC telephony is a deterministic mock… No external system contract is invented here."*
- React binding: `useWorkspaceState()` — `state/use-workspace-state.ts`.

## SDK support

**None.** No telephony/WebRTC/SIP SDK in the dependency graph:

- `my-app/package.json` — no `@twilio/voice-sdk`, no `sip.js`, no `webrtc`, no voice SDK. All deps are UI/utility libraries.
- `my-app/composer.json` — Laravel/Inertia/Fortify/Passkeys only; no telephony packages.
- `node_modules` — no twilio/vonage/sip/webrtc/voice packages.

## Backend endpoint

**None.** The Laravel `app/` contains only auth/settings controllers (`HomeController`, `Settings/*`, Fortify actions). `routes/` has only `web.php`, `settings.php`, `console.php`. There are no call, telephony, conference, or media controllers or routes.

## Conference ID

**Not present.** No `conferenceId` field anywhere in runtime or backend.

## Participant events

**None.** No conference/participant events in the runtime.

## Participant states

**None defined.** The only call model is a single `ActiveCall` (`workspace-types.ts:25–35`) with a single `target` — no multi-party leg, no `participants[]`, no `consult`/`merge`/`bridge` state.

## Add participant

**Unsupported.**

## Remove participant

**Unsupported.**

## Merge/bridge

**Unsupported.** Repo-wide token search for `merge|bridge|conference|multiParty|callLeg|threeWay|addParticipant|removeParticipant` finds only generic JS/UI utilities (`tailwind-merge`, `Inertia.merge`, data-grid `mergeProps`) and negative documentation. No call-merge code.

## Relationship to warm transfer

Warm transfer is explicitly **not offered** because the runtime has no consultation state:

- `docs/design/domain/call-state.md:48`: *"Direct transfer only — the runtime has no consultation state, so Warm Transfer is not offered (§43)."*
- `docs/product/FLEX_FEATURE_PARITY.md:95` (AGENT-CALL-011): Warm Transfer = `NEEDS_PRODUCT_DECISION` — *"NO runtime consultation state — not offered (§43)."*
- `docs/product/FLEX_FEATURE_DEPENDENCIES.md:41`: *"no warm transfer (no consultation state)."*

Conference is a superset of consultation; since consultation does not exist, conference cannot either.

## Permissions

No conference-specific permission exists (no capability). Nothing to gate.

## Tenant constraints

N/A — no conference state exists to scope. Existing call state is tenant-scoped through the agent workspace; a real conference feature would need to preserve that.

## Known limitations

- Transfer is **direct-only**; the `transfer` flow ends the agent's call with the customer (see `features/agent-workspace/call-manager/active-call-surface.tsx` transfer copy: *"Direct transfer to X will end your call with the customer."*).
- There is no in-call DTMF dialpad and no consult leg.
- Tracked gap: **GAP-002 / AGENT-CALL-011 (NEEDS_PRODUCT_DECISION)** in `docs/product/FLEX_FEATURE_PARITY.md` — warm transfer documented in manual but not implemented, runtime has no consultation state. `docs/product/FLEX_PARITY_AUDIT_REPORT.md` lists "Resolve … Warm Transfer before offering any surface."

## Decision

**Do not ship Conference UI.** Per the implementation plan §46 (outcome C), conference calling is documented **unsupported** and all Conference controls (Add Participant, participant view, participant actions, conference-aware Dynamic Island) are **omitted** from the current scope.

Enabling conference requires a **product + telephony/backend decision**: introduce a real telephony adapter (replacing the mock internals behind the existing production-facing interface), add a consultation/multi-party call state, `conferenceId`/`participants` fields, and conference commands. This is tracked as a separate product/backend task and is explicitly blocked by the AGENTS.md rule against inventing domain states or backend capabilities the runtime does not implement.