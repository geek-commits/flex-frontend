# ADR-004 — Agent Assist Session Ownership

* Status: **Accepted** (call-scoped, backend-ready, live transcription)
* Date: 2026-08-21 · updated 2026-08-26
* Deciders: FLEX Agent Assist Live Transcription plan, FLEX Hardening §§7, 8, 11, 18, 26
* Supersedes: `AGENT_ASSIST_RUNTIME_AUDIT.md` (audit file removed; references deleted)

## Context

Agent Assist was previously configuration-only (`notModeled` — `AGENT-CALL-019` honest empty-state). Manual §18 and the product plan require `no call → no Assist`, `call connects → session starts`, `live transcript` on `/agent`, `Dynamic Island` continuity away, `same call → same session`, `call end → teardown`, `next call → new session`. Risks remain transcript persistence, segment desync, duplicate on reconnect, UI degrading telephony, and stale audit references.

## Decision

**Assist is call-scoped, active-call-owned, with replaceable transport and no idle persistence.**

* **Owner:** `workspaceState` (ADR-001) is the single call owner; `AgentAssistSessionProvider` subscribes to `callState === connected|hold|transferring` and `activeCall.id`. `no call → no session`, `same id → same`, `different id → teardown+start`, `call end → immediate clear (segments, suggestions, language, error, open/minimized)`. Minimizing preserves the same session for the call's lifetime but blocks auto-reopen for that call.

* **Contracts:** `AssistSessionState idle|starting|active|error|ended`, `AssistTransportState disconnected|connecting|streaming|reconnecting|stalled|offline`, `TranscriptSegment {id, speaker customer|agent, text, language{code,label}, status interim|final, startedAt, endedAt?}`, `AssistSuggestion {id, type recommended-response|knowledge|next-action, body, title?, sourceLabel?}`. Transport states and session states are separate — `active + reconnecting` is valid.

* **Transport:** `AgentAssistTransport {start, subscribe, stop}` + `AgentAssistEventHandlers` (`onTransportState/onTranscriptSegment/onLanguage/onSuggestion/onError`). UI never imports WebSocket/SSE. `AgentAssistMockTransport` is the POC implementation — deterministic fixtures (`swahili` Swahili · `english` · `french` · `code-switch` · `error` · `stalled`), interim→final same-id replacement, reconnect dedupe, language `Detecting language… → Swahili`.

* **Reconciliation:** by `segment.id`, replace interim, replace interim with final, ignore duplicate final, dedupe replay, sort by `startedAt`. Auto-follow at bottom; `Jump to live` when scrolled. Memory-only — never `localStorage/sessionStorage/URL`.

* **Presentation:** desktop `AgentAssistDock` `340–400 preferred 360 max 50vh` floating (not full-height column) composed from vendor primitives; mobile `Call Manager` is one Sheet with `Call ↔ Assist` modes and a compact `● Connected — [Call controls]` strip (no stacked Sheets). `Call Manager` Assist button toggles `Open↔Minimize` (presentation only — does not create session).

* **Dynamic Island:** compact `☎ name ✨ timer` sparkle when Assist live; expanded `✨ Assist live · Swahili` + latest finalized 1–2 lines (no interim) + `[Open Assist][Open Call]`; `Open Assist` restores session + `router.visit('/agent')` without reconnect.

* **Language:** header only `Detecting language… → Swahili · Live`; per-segment language exposed only on code-switch.

* **Suggestions:** informational `[Dismiss]` only; `Use` added only when a real note/composer target exists — no clipboard stub.

* **Vendor isolation:** AICSS primitives copied locally to `components/vendor/aicss/{streaming-text,thinking-state,text-response}.tsx` + license — FLEX composition stays in `features/agent-workspace/agent-assist/*`.

* **Privacy / observability:** never log transcript text; allowed masked events `assist_session_start_failed / transcript_stream_stalled / assist_reconnect_failed / assist_close_failed`; on call end `unsubscribe→stop→clear`.

* **Storage:** do not persist transcript/recording/customer content beyond product requirement (§14, §34). Future persistence needs privacy ADR gate.

## Consequences

* Agent Workspace shows live transcript when an eligible call streams; `pages/admin/ai/*` remains configuration-gated.
* Telephony never degrades if Assist faults — transport catches handler errors, call controls remain enabled per `callState`.
* CRM iframe `frameKey` and `mock-workspace-state` timers remain single-owner; no duplicate call provider.
* Observability stays masked-identifier-only; no transcript in logs or storage.

## Verification

* No transcript `localStorage/sessionStorage/URL` write (reducer + context have zero such calls).
* Lifecycle: `no call→no session`, `call start→starting→streaming→active`, `same id preserved`, `new id new session`, `call end→idle`.
* Interim→final replacement, duplicate ignored, reconnect replay deduped, ordering `startedAt`.
* Auto-open once per call, minimize respected, restore same session, new call may auto-open again.
* Away from `/agent`: island indicator + language + latest final + `Open Assist → /agent` same session.
* Regression §18 (Mute/Hold/Transfer/Conference/End/WrapUp, CRM no remount, timer stable, island hidden on `/agent` else visible).
