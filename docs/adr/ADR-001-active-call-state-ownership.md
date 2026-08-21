# ADR-001 — Active Call State Ownership

* Status: **Accepted** (Increment 1 — audit only, no code change)
* Date: 2026-08-21
* Deciders: FLEX Hardening (Whole-Product Reliability plan §7, §26)

## Context

Agent Workspace call lifecycle is the highest-risk state in FLEX (§31 — stop-the-line: call-state desync, duplicate telephony command). The baseline has 23 files in `features/agent-workspace/` plus `flex-call-island`, `agent-assist`, and legacy telephony boundaries. Two risks dominate: (a) call state fragmented across route store + context + local copy + island copy; (b) telephony commands executed via UI animation path.

## Decision

**One authoritative frontend owner:** `features/agent-workspace/state/mock-workspace-state.ts` — `MockWorkspaceState` singleton `workspaceState`.

* All lifecycle mutations live there: `agentState` transitions (`WORKSPACE_TIMINGS.agentStateTransitionMs` 450 ms), `dial/simulateIncomingCall/answer/decline/toggleMute/toggleHold/endCall`, `transfer` (pending 900 ms), `beginWrapUp` / `wrapUpReturnMs` 6000 ms, `connection` + `media.mic`, `history` (capped 50).
* React binding `useWorkspaceState()` subscribes once (`useEffect(() => workspaceState.subscribe(setState), [])`) and exposes stable action callbacks via `useMemo`. Components never mutate state directly and never schedule fake transitions.
* Consumers **observe/present/navigate only:** `AgentWorkspacePage`, `CallManager` surfaces (`Idle/Incoming/Active/WrapUp`), `Dynamic Island` (`flex-call-island.tsx`), `Agent Assist launcher`, conference presentation. **Island never owns call, timer, assist, conference, or telephony commands** (§7).
* Call survives route leave — timers in `timers Set` are not cleared on navigation (persistence audit §51).

## Consequences

* Telephony commands execute immediately; UI animation (Mute/Hold icon-swap 0.15 s, `active-call-surface.tsx:4beb635`) never gates commands.
* Timers (`SessionTimer`, `useWrapUpCountdown`, `useCallTimer` — each `setInterval 1000 ms`) derive from owner state; whole-page rerenders must be profiled in Increment 4 (React profiling §13: unstable props, over-broadcasting contexts).
* Future real adapter (SIP/WebRTC) replaces `MockWorkspaceState` behind the same interface — no consumer change.
* Agent Assist session lifecycle remains **call-scoped, runtime-driven** (ADR-004).

## Verification

* Subscribe dedupe verified: `useWorkspaceState.ts:1` comment "Subscribes once (no duplicate subscriptions)".
* No duplicate command paths at baseline — prove before any realtime dedupe (§8).
