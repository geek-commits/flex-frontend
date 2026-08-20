# AGENT ASSIST RUNTIME AUDIT

Audit of the Agent Assist runtime, per the call-scoped modernization plan §1/§7/§9/§10/§57. Supersedes `AGENT_ASSIST_PREFLIGHT.md`. Outcome: **NO call-scoped Assist runtime — MISSING PARITY (NEEDS_PRODUCT_DECISION).**

## Summary

The manual documents **Assist** as a Call Manager control, but the POC has **no assist runtime**: no session, no transcript, no suggestions, no problem source, and — critically — **no call-scoped trigger** that spins Assist up from the call lifecycle. The only assist-adjacent state is the admin **configuration** toggle (`Administration → AI Center`).

## Component

**Admin configuration-only surface** — not a live agent feature:

- `my-app/resources/js/pages/admin/ai/assist.tsx` — `AiAssistPage` (Administration workspace): enablement toggle + runtime metrics (Status / Adoption Rate) + explicit empty state:
  > *"Agent Assist suggestions are not modeled — Suggestion content, feedback, and latency require a real Agent Assist runtime. This POC exposes configuration only."*

There is **no** call-scoped Assist runtime in the agent workspace. The agent-side surface added under this plan is a **call-scoped presentation only** (an "Assist" control on the active call + a panel that appears during an active call). It is gated on the canonical `callState` — it does **not** invent a session, transcript, or suggestions feed.

## Call-scoped lifecycle trigger

**None.** No assist session state owner, provider, hook, store, query, subscription, WebSocket, or SSE — and no event wired to `dial`/`answer`/`connect`/`endCall`. There is nothing that "spins Assist up" when an eligible call begins (§9 premise is **false** in this runtime).

The agent Assist panel is therefore driven purely by the existing **telephony** mock state (`callState !== 'idle'`), not by an assist lifecycle.

## Session / transcript / suggestions / problem source

**None.** Repo-wide grep for `transcript|interim|isFinal|suggest|answer|problem|CustomerProblem|EventSource|WebSocket|Server-Sent` returns no agent-facing assist runtime (matches are admin config, audio `speakerDevice` settings, and knowledge semantic search).

## Dynamic Island

`FlexCallIsland` is a pure projection of active-call presentation (`useActiveCallPresentation()`). It never owns call or assist state. Per plan §33–35/§118, the island only reflects a real Assist session — which never exists — so **no island Assist surface is added** (documented N/A).

## Relationship to telephony

- Owner: `MockWorkspaceState` — `features/agent-workspace/state/mock-workspace-state.ts` (deterministic mock, module singleton). `WorkspaceState.callState` (`types/flex.ts:10–21`) and `activeCall` gate the call-scoped Assist panel.
- `callState` values: `idle | dialing | ringing | connecting | connected | hold | muted | transferring | wrap-up | ended | failed`.

## Permissions

No assist-specific capability exists. The only assist control is the admin `assistConfig.enabled` toggle (Administration scope). The agent-side Assist control is gated on telephony `callState`, not on a permission.

## Risks

- Building a transcript/suggestions feed against no runtime fabricates behavior the repo explicitly refuses to model (AGENTS.md: never invent domain states or backend capabilities).
- The call-scoped panel must not create a second telephony store and must not remount the CRM iframe (`CrmIntegrationHost` `key`/`src`).

## Decision

Ship the **call-scoped Assist control + honest panel** (parity), gated on `connected`/`hold`/`transferring`. The panel renders a single truthful state: Assist is **configuration-only** in this POC (no transcript/session runtime). Record the missing runtime as a parity defect → **NEEDS_PRODUCT_DECISION** in `docs/product/FLEX_FEATURE_PARITY.md` (AGENT-CALL-016).

Enabling a real Agent Assist feed requires a product/backend decision: a transcript/stream source, suggestions and problem generation, and a call-scoped lifecycle trigger — none of which the runtime implements.