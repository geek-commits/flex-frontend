# Domain — Agent Workspace

The Agent workspace supports customer interactions, agent availability, call
handling, and customer context. Its primary user is an agent working a shift.

## Runtime ownership

`features/agent-workspace/state/mock-workspace-state.ts` owns the proof-of-
concept agent and call state. `useWorkspaceState()` exposes that state to the
workspace and Call Manager. The owner is a local mock; it does not establish
backend call control or authorization.

The state owner covers agent availability, telephony connection, call state,
active call, mute and hold, direct transfer, wrap-up, and recent call history.
UI components render this state and dispatch supported transitions through the
workspace interface.

## Product boundaries

- Agent availability and telephony connection are separate facts. `Ready` does
  not imply a connected phone session.
- Only runtime-supported agent states can be selected. System-driven call
  states are displayed as they occur; the interface must not let an agent set
  them manually.
- The current transfer flow is direct transfer. Do not present warm transfer
  without a supported consultation state and runtime capability.
- The external CRM host owns CRM content and behavior. FLEX owns the surrounding
  workspace and integration boundary; CRM failures must not imply call failures.
- Call-scoped Agent Assist follows the active-call ownership model in
  [ADR-004](../../adr/ADR-004-agent-assist-session-ownership.md).

## Interaction guidance

- Keep the current call and valid call actions at the top of the hierarchy.
- Show transition progress and preserve the current state when a transition
  fails.
- Keep loading, failure, and recovery feedback visible without fabricating
  successful backend behavior.
- Use capability-filtered navigation and retain the backend as the
  authorization authority.
