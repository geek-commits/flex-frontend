# AGENT ASSIST PREFLIGHT

> **SUPERSEDED.** See `AGENT_ASSIST_RUNTIME_AUDIT.md` — the call-scoped modernization plan reclassified Assist as call-scoped (gated on `callState`, not a permanent panel) and the "Waiting / Unavailable" two-state model below no longer applies. This file is retained for history only.

Preflight audit of the current Agent Assist runtime, per the modernization plan §95. This records the **truth** of what exists today so UI work never fabricates unsupported behavior.

## Agent Assist component

**Admin configuration-only surface** — not a live agent feature:

- `my-app/resources/js/pages/admin/ai/assist.tsx` — `AiAssistPage` (Administration workspace). Renders an enablement toggle, runtime metrics (Status / Adoption Rate), and an explicit empty state:
  > *"Agent Assist suggestions are not modeled — Suggestion content, feedback, and latency require a real Agent Assist runtime. This POC exposes configuration only."*

There is **no** Agent Assist component in the agent workspace. `features/agent-workspace/` owns only `CallManager`, `CrmIntegrationHost`, `AgentOperationalHeader`, `SessionTimer`, `ConnectionStatus`.

## Session source

**None.** No assist session state owner, provider, hook, store, query, subscription, WebSocket, or SSE. Grep for `EventSource|WebSocket|Server-Sent|addEventListener('message')` returns no matches.

The only assist-adjacent state owner is the admin AI-center config:
- `features/ai/use-ai-center.ts` (`AiCenterState` via `aiRepository`)
- `features/ai/ai-repository.ts` — module-singleton mock (`ai-repository.ts:31`)
- `features/ai/ai-types.ts:50–55` — `AgentAssistConfig { enabled; latencyMs; adoptionRate }` (config only)

## Transcript source

**None.** Grep for `transcript|interim|isFinal` returns zero matches. No transcript type, stream, or interim/final field exists.

## Speaker metadata

**None.** Grep for `speaker` matches only audio hardware settings (`pages/agent/troubleshooting.tsx:31` — `speakerDevice`) and diagnostics types. No `Customer`/`Agent`/`System` speaker-label enum.

## Suggestions source

**None.** Grep for `suggest`/`answer` finds nothing agent-facing. The admin "Knowledge" surface (`pages/admin/ai/knowledge.tsx`) is semantic search, explicitly not an agent suggestions feed.

## Customer problem source

**None.** Grep for `problem|CustomerProblem` returns zero matches.

## Clear semantics

**N/A.** No transcript exists to clear. The only assist mutation is `setAssistEnabled` (`ai-repository.ts:91–96`), which flips the `enabled` boolean and clears nothing.

## Minimize semantics

**N/A.** No assist panel exists to minimize.

## Close semantics

**N/A.** No assist panel exists to close. (Call Manager panels have their own unrelated close/idle transitions.)

## Telephony owner

`MockWorkspaceState` — `features/agent-workspace/state/mock-workspace-state.ts` (deterministic mock, module singleton). Call is a single `ActiveCall` (`workspace-types.ts:25–35`); `CallState` enum in `types/flex.ts:10–21`. Call state **survives route leave/re-enter** (`mock-workspace-state.ts:404–405`).

## Conference evidence

**Unsupported.** See `CONFERENCE_CAPABILITY_AUDIT.md` — no SDK, no backend, no consultation/merge/bridge state (GAP-002 / AGENT-CALL-011).

## Participant events

**None.** Single-party call model only; no `participants[]` or conference events.

## Dynamic Island

`FlexCallIsland` (`components/flex/flex-call-island.tsx`) + `call-island/` module. A pure projection of active-call presentation via `useActiveCallPresentation()` (`features/agent-workspace/state/use-active-call-presentation.ts`). Mounted in `app-providers.tsx:15–25`. Draggable with persisted semantic anchor (`flex.callIsland.anchor`). It never owns call state.

## Iframe owner

`CrmIntegrationHost` (`features/agent-workspace/integration/crm-integration-host.tsx`), rendered by `AgentWorkspacePage`. The iframe is the **CRM integration**, not telephony. `key={frameKey}` bumps only on config load/retry. It must **not** remount on panel/route changes.

## Permissions

No assist-specific capability exists. The only assist control is the admin `assistConfig.enabled` toggle (Administration scope).

## Risks

- Building agent-facing Assist UI against no runtime risks fabricating transcript/suggestion/problem behavior the repo explicitly refuses to model (AGENTS.md: never invent domain states or backend capabilities).
- Any assist panel must not create a second telephony/timer store and must not remount the CRM iframe.
- Conference is out of scope (unsupported) — no assist+conference compatibility exists to claim.

## Truthfully mappable states (for UI)

Only two can be rendered without inventing runtime behavior:

```text
Waiting        — assist is enabled (admin config), no active assisted call
Unavailable    — assist is disabled in config
```

All other candidate states from the plan (§8: Starting / Listening / Live / Ended) have **no runtime source** and must not be shown.