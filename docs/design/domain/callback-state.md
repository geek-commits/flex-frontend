# domain — Callback State (Customer Recovery)

Defines the UI treatment for FLEX's missed-call recovery + voicemail workflow. This is a **frontend revamp**, not a callback-engine rewrite. Ownership semantics, attempt counting, call outcomes, attended/resolved transitions, voicemail access, and telephony behavior are preserved.

## Workspace

**Agent** workspace (frontline recovery). Primary user: Agent. Secondary: Supervisor where permissions allow.

## Current runtime (baseline, 2026-08)

- Single route: `agent/missed-calls` → `pages/agent/missed-calls.tsx` (registered in `routes/web.php`, `name('agent.missed-calls')`), rendered inside `AgentShell`.
- The page is a **fully hardcoded table** — an inline `RECORDS` array (6 records) with no repository, no data file, no ownership/claim model, no Call Manager integration, and no voicemail playback. Columns: Phone Number, Missed At, Category, Queue, Attempts, Voicemail, Status, Action (Call Back).
- **Statuses observed (current screenshot):** `unhandled`, `callback-scheduled`, `resolved`. These are display labels; runtime authority must be confirmed.
- **Ownership / claim:** not present in the current frontend. No `claimedBy`/owner field or claim timing.
- **Attempts:** an integer count column. No attempt-history timeline. Increment semantics not modeled.
- **Voicemail:** a `hasVoicemail` boolean + a non-functional play button. No audio URL, no player.
- **Call Back:** a button with no handler. No telephony integration.
- **Backend:** no callback/voicemail backend exists. Parity tracker flags `CALLBACK-001…009` as `UNKNOWN`/`REVAMPED(partial)`; critical workflow rules (`CALLBACK-007` claimed ownership, `CALLBACK-008` attended) are `UNKNOWN`.
- **Canonical call pipeline (reuse):** `features/agent-workspace/state/mock-workspace-state.ts` exports a **module-level singleton `workspaceState`** with `dial(target: CallTarget)` (only valid from `callState === 'idle'`), `answer`, `endCall`, etc. `useWorkspaceState()` binds to it. A live call persists across navigation. Call Back must call `workspaceState.dial({ kind: 'phone', phone })` — never a second dialer.
- **Audio:** no shared audio player exists in the repo yet. The recovery voicemail player will be the first canonical one; reused by table + detail.
- **Tenant:** single implicit tenant (no switch UI). Recovery records stay tenant-scoped.
- **Privacy:** phone numbers are sensitive; masking rules must be preserved; never log voicemail URLs.

## Recovery workflow (manual intent, runtime-authoritative)

```text
Missed → Available for recovery → Callback attempted → Claimed by agent → Customer answers → Attended
```

Do not force this exact enum; the current display statuses are `unhandled | callback-scheduled | resolved`. `claimed`/`attended` are separate concepts from `status` unless the backend models them as one field.

## Status vs ownership

- **Status** is the record's recovery state (e.g. unhandled / callback-scheduled / resolved).
- **Ownership** is who currently holds the callback (Unclaimed / Claimed by you / Claimed by <name>).
- These must not be collapsed into one badge unless the runtime models them as one field.

## Preserved invariants

- No callback-engine rewrite; no new dialer; no status enum invented beyond the audited set.
- Attempt count, claim, and attended transitions are **backend/repository-authoritative** — never set client-side from assumptions.
- Do not mark a record attended on button-click, dial start, ringing, busy, no-answer, or failed attempt.
- Call Back reuses the canonical `workspaceState.dial` outbound pipeline.
- One shared voicemail audio player; no voicemail transcription/AI/summary.
- Ownership and callback status are concurrency-sensitive; stale data must not enable unsafe callback actions (revalidate before mutation).
- Deleted/missing queue renders a safe "Unknown queue" label; unknown status renders a neutral fallback (never treated as unresolved by default).
- Test data/fixtures/screenshots must use synthetic, dev-safe customer data — never real phone numbers or voicemail content.
