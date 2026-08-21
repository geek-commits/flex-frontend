# ADR-004 — Agent Assist Session Ownership

* Status: **Accepted** (call-scoped, runtime-driven)
* Date: 2026-08-21
* Deciders: FLEX Hardening plan §§7, 8, 11, 18, 26

## Context

Agent Assist is `CALL-SCOPED PRESENTATION` in parity (`FLEX_FEATURE_PARITY.md:AGENT-CALL-019` — no assist runtime, panel shows config-only honest state via `ASSIST_PANEL_META` in `features/agent-workspace/agent-assist/*` and `features/ai/*`). Manual §18 expects `no call → no Assist`, `eligible call → Assist spins up`, waiting/starting, transcript, suggestions, minimize/restore same session, `call end → teardown`, `next call → new session`. Risks: transcript persistence, segment desync, duplicate transcript on reconnect.

## Decision

**Assist is call-scoped, telephony-owned lifecycle — no permanent idle owner.**

* Session owner is the active call (ADR-001) via `workspaceState`. Assist panel subscribes to `isAssistEligible` (derived from `callState`) and `assistState` (`idle|waiting|active|error`).
* No idle `AssistProvider` that survives across calls. `minimize/restore` preserves same session only within the same call.
* Transport (when runtime exists): `segment ID + interim/final reconciliation`, ordering, `reconnect` without duplicate transcript, `transcriptStreamStalled/assistReconnectFailed` observability events (§11). **Never log transcript text** (§11, §14, §34).
* Storage: **do not persist transcript/recording/customer content** (`localStorage/sessionStorage/query cache`) beyond explicit product/runtime requirement (§14).

## Consequences

* Current POC remains honest: `pages/admin/ai/*` (Overview/Knowledge/Assist/Voice/Providers/Usage/Audit/Settings) is configuration-gated; Agent Workspace Assist shows `configuration-required` when no runtime.
* Future stream that adds persistence must justify it via privacy ADR (§48 gate).
* Observability (Increment 2 scaffolding, §11): `assist_session_start_failed`, `transcript_stream_stalled`, `assist_reconnect_failed`, `assist_close_failed` — masked identifiers only.

## Verification

* Parity audits `AGENT_ASSIST_PREFLIGHT.md`, `AGENT_ASSIST_RUNTIME_AUDIT.md`, `CALL_MANAGER_PARITY_MAP.md` confirm no runtime Voice AI bot builder (telephony-safe config required).
* Regression matrix §18 is the acceptance suite (no-call→no-Assist, eligible→spins up, minimize/restore, call-end teardown).
