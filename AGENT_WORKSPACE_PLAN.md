# FLEX CRM — AGENT WORKSPACE & CALL MANAGER MODERNIZATION PLAN
## Phase 6 — Canonical FLEX Agent Transaction Workspace

**Document type:** Execution plan for implementation agent  
**Release target:** `FLEX Agent Workspace v0.1`  
**Primary objective:** Modernize the highest-frequency agent experience in FLEX: the workspace where an agent changes availability state, receives and places calls, works inside the external CRM integration boundary, handles the active call lifecycle, transfers/holds/mutes calls, completes Wrap Up, and reviews recent call context—while preserving existing telephony behavior, external CRM integration boundaries, permissions, agent-state semantics, and backend contracts.  
**Dependency:** `FLEX Craft Infrastructure v1.0`, `FLEX Agent Monitoring v0.1`, FLEX UI Foundation, CDR, Campaigns, and Contact Center Dashboard must already be completed, tested, committed, and pushed to GitHub.  
**Next planned phase:** `Management Console + Navigation Architecture`.

---

# 1. EXECUTIVE SUMMARY

The next modernization target is **Agent Workspace + Call Manager**.

This is the most important high-frequency interaction surface in FLEX. The FLEX User Manual describes the softphone as the heart of the call-handling experience: it is integrated into the CRM, uses the agent's headset and internet connection, and lets the agent place and receive calls directly inside the system.

The workspace must organize the real operational lifecycle:

```text
Prepare
→ Ready
→ Incoming / Outbound
→ Connected Call
→ Mute / Hold / Transfer as needed
→ End
→ Wrap Up
→ Ready
```

The agent should never have to wonder:

```text
Am I available?
Is telephony connected?
Is a call ringing?
Who is calling?
What actions are valid now?
Am I muted?
Is the caller on hold?
Is a transfer in progress?
How much Wrap Up time remains?
```

The UI must answer these questions through state, hierarchy, and behavior rather than through decorative UI.

---

# 2. DOMAIN SOURCE OF TRUTH

Use this source priority.

## 2.1 Runtime implementation

The code/backend is authoritative for:

- routes;
- actual agent states;
- actual call states;
- WebRTC/SIP behavior;
- signaling connection state;
- media permission state;
- incoming-call events;
- outbound call initiation;
- Answer/Decline;
- Hold/Resume;
- Mute/Unmute;
- Transfer;
- Warm Transfer;
- End Call;
- Wrap Up transition;
- timers;
- call history;
- permissions;
- CRM host integration;
- mock adapter boundaries.

Do not invent telephony behavior from screenshots or documentation.

## 2.2 FLEX Craft Infrastructure

Before implementation read:

```text
AGENTS.md

docs/design/README.md
docs/design/01-product-model.md
docs/design/02-navigation-model.md
docs/design/03-attention-hierarchy.md
docs/design/04-interaction-rules.md
docs/design/05-motion.md
docs/design/06-copy-language.md
docs/design/07-feedback-states.md
docs/design/08-accessibility.md
docs/design/09-realtime-data.md
docs/design/11-component-governance.md
docs/design/12-quality-gates.md

docs/design/domain/agent-state.md
docs/design/domain/call-state.md
docs/design/domain/data-freshness.md
docs/design/domain/permission-model.md
```

Also review Agent Monitoring because it is now a canonical consumer of agent/call state semantics.

## 2.3 FLEX User Manual

The manual establishes intended concepts including:

```text
Not Ready
Ready
Break
Wrap Up
Hold / Resume
Mute / Unmute
Decline
Transfer
Warm Transfer
Outbound Calls
Call History
```

Where runtime and manual differ:

1. preserve runtime behavior;
2. document the discrepancy;
3. update Craft Infrastructure if canonical terminology needs correction;
4. do not silently create missing features.

---

# 3. CRITICAL CRM INTEGRATION-BOUNDARY RULE

The existing Agent Workspace contains an external CRM integration host.

This boundary is **non-negotiable**.

Preserve the existing middle CRM/iframe region and its layout intent because it is tied to an external/separate system.

Do **not**:

- redesign the CRM contents;
- recreate external CRM screens;
- replace iframe behavior;
- invent CRM APIs;
- fake external navigation;
- put FLEX telephony logic inside the external CRM host;
- tightly couple the CRM implementation with Call Manager presentation.

Modernize only FLEX-owned surfaces:

```text
FLEX shell
Integration-boundary chrome
Agent state
Connection state
Call Manager
Call feedback
Workspace layout
```

---

# 4. CRM MOCK / CONFIGURATION RULE

Until the full external CRM integration is available, use an isolated mock/config boundary.

Preferred conceptual structure:

```text
features/agent-workspace/integration/
├── crm-integration-host.tsx
├── crm-host-config.ts
├── crm-integration-state.ts
└── mock-crm-host.json
```

The mock/config may describe:

```text
host URL
mode: mock | external
connection state
display name
version / adapter metadata if real
```

It must not invent external-system APIs or business behavior.

---

# 5. RELEASE OUTCOME

Release label:

```text
FLEX Agent Workspace v0.1
```

At completion:

- canonical FLEX Agent shell is used;
- availability state is first-class;
- telephony connection/media readiness is explicit;
- CRM integration boundary is preserved;
- Call Manager is state-driven;
- inbound call state is unmistakable;
- outbound dialing is deliberate;
- active call controls adapt to actual state;
- muted state is explicit;
- held state is explicit;
- transfer is contextual and safe;
- Warm Transfer uses real backend capability only;
- Wrap Up is a deliberate post-call mode;
- automatic return to Ready is represented correctly;
- call history is lightweight and clear;
- CRM failure does not automatically imply call failure;
- telephony failure does not automatically imply CRM failure;
- loading/error/disconnected/media states are explicit;
- responsive and keyboard behavior are verified;
- external CRM contents remain untouched;
- business behavior is preserved;
- every phase is tested, committed, pushed, and remotely verified before the next phase.

---

# 6. PRIMARY USER

Primary user:

```text
Agent
```

Do not optimize the workspace around Super Administrator test accounts.

The interface must prioritize repeated agent work during a shift.

---

# 7. AGENT ATTENTION HIERARCHY

Use the permanent FLEX Agent hierarchy:

```text
1. Incoming / current call
2. Agent availability state
3. Customer / CRM context
4. Required call action
5. Queue / callback pressure
6. Personal performance
7. Navigation / chrome
```

Within this workspace:

```text
CURRENT CALL
↓
VALID CALL ACTIONS
↓
CUSTOMER / CRM CONTEXT
↓
AGENT STATE + CONNECTION
↓
CALL HISTORY / SECONDARY WORK
↓
GLOBAL NAVIGATION
```

During incoming ringing, Answer/Decline dominate.
During active call, call state and controls dominate.
During Wrap Up, CRM work and Wrap Up timing dominate.

---

# 8. OUT OF SCOPE

Do not expand this phase into:

- CRM replacement;
- CRM redesign;
- callback/voicemail redesign;
- social inbox redesign;
- supervisor monitoring;
- Call Whispering redesign;
- CDR redesign;
- queue configuration;
- campaign management;
- reporting;
- SIP/WebRTC backend replacement;
- new recording features;
- new conference functionality;
- AI transcription/summarization;
- Agent Assist;
- sentiment analysis;
- new CRM objects;
- new customer backend;
- new agent-state enum;
- new mobile softphone product.

If a capability is absent in runtime, do not add it because the manual mentions it.

---

# 9. MANDATORY PREFLIGHT

Run:

```bash
git status
git branch --show-current
git log -25 --oneline
git remote -v
```

Confirm:

- [ ] Craft Infrastructure is present.
- [ ] Agent Monitoring is complete.
- [ ] agent-state docs reflect runtime.
- [ ] call-state docs reflect runtime.
- [ ] previous work is pushed.
- [ ] worktree is clean or fully understood.

Run and sanity-check:

```text
Agent Workspace
Agent Dashboard
Agent Monitoring
Dashboard
CDR
```

Stop if state semantics already conflict across these routes.

---

# 10. IMPLEMENTATION AUDIT

Map the current architecture before editing.

```text
CONCERN                     CURRENT OWNER
---------------------------------------------
Agent state                 ?
State duration              ?
Signaling connection        ?
WebRTC media                ?
Active call                 ?
Call duration               ?
Dialed number               ?
Hold                        ?
Mute                        ?
Transfer                    ?
Warm Transfer               ?
Wrap Up timer               ?
Call history                ?
CRM host                    ?
CRM integration mode        ?
```

Also inspect:

- event listeners;
- subscriptions;
- timers;
- route cleanup;
- persistence across route navigation;
- permissions;
- error handling;
- current mocks.

Do not begin large UI changes until the map is understood.

---

# 11. BASELINE FUNCTIONAL TEST

Before changing code verify:

- [ ] workspace route loads;
- [ ] external CRM host renders;
- [ ] current mock/config works;
- [ ] state selector works;
- [ ] Not Ready works;
- [ ] Ready works;
- [ ] Break works;
- [ ] Wrap Up behavior can be observed safely;
- [ ] connection status is accurate;
- [ ] microphone permission flow works;
- [ ] inbound call can be simulated/tested;
- [ ] Answer works;
- [ ] Decline works;
- [ ] outbound dial works;
- [ ] active call connects;
- [ ] Mute/Unmute works;
- [ ] Hold/Resume works;
- [ ] Transfer works where supported;
- [ ] Warm Transfer works where supported;
- [ ] End Call works;
- [ ] Wrap Up starts after call where intended;
- [ ] automatic Ready transition works;
- [ ] call history works;
- [ ] route leave/re-enter does not duplicate listeners;
- [ ] no unexplained console errors.

Record pre-existing defects separately.

---

# 12. BASELINE SCREENSHOTS

Capture dev/test-safe states:

```text
01-agent-workspace-before-idle.png
02-agent-workspace-before-incoming.png
03-agent-workspace-before-active-call.png
04-agent-workspace-before-wrap-up.png
05-agent-workspace-before-narrow.png
```

If safely reproducible:

```text
06-agent-workspace-before-held.png
07-agent-workspace-before-transfer.png
08-agent-workspace-before-error.png
```

Do not use real customer calls merely for screenshots.

---

# 13. TARGET WORKSPACE STRUCTURE

```text
FlexAgentShell
└── AgentWorkspace
    ├── AgentOperationalHeader
    │   ├── AgentStateControl
    │   ├── State / Session Timer
    │   ├── TelephonyConnection
    │   └── Account
    │
    └── WorkspaceLayout
        ├── ExternalCRMIntegrationHost
        │   ├── IntegrationBoundaryHeader
        │   └── Existing iframe / host
        │
        └── CallManager
            ├── CallManagerHeader
            ├── CallStateSurface
            ├── CustomerCallContext
            ├── Dialer / History
            └── StateValidControls
```

This is conceptual. Reuse existing components where appropriate.

---

# 14. DESKTOP LAYOUT RULE

Target:

```text
┌──────────────────────────────────────────────────────────────┐
│ Agent state · connection · timer · account                  │
├─────────────────────────────────────────┬────────────────────┤
│                                         │                    │
│ External CRM / Customer Workspace       │ Call Manager       │
│                                         │                    │
│ PRESERVE EXISTING INTEGRATION BOUNDARY  │ FLEX OWNED         │
│                                         │                    │
└─────────────────────────────────────────┴────────────────────┘
```

Call Manager remains visible while the agent works in CRM.

Do not move the primary Call Manager into a modal.

---

# 15. INTEGRATION-BOUNDARY HEADER

Keep the boundary visible but quiet.

Production example only if accurate:

```text
Customer Workspace
External CRM · Connected
```

Development may expose:

```text
Mock integration
```

Do not expose internal adapter details to production users unnecessarily.

---

# 16. CRM HOST FEEDBACK STATES

Support localized states:

```text
loading
connected
unavailable
retrying
mock
configuration missing
```

If CRM fails and telephony can continue, Call Manager must remain usable.

Never blank the entire Agent Workspace because one integration failed.

---

# 17. AGENT OPERATIONAL HEADER

This is not a generic SaaS topbar.

Operational priority:

```text
Agent State
Telephony Connection
Call / Wrap Up state
Timer
```

before generic search/account chrome.

---

# 18. AGENT STATE CONTROL

Use canonical agent-state semantics.

Do not make system-driven states manually selectable.

Inspect runtime to determine which states the agent may choose. For example, Wrap Up may be entered automatically rather than through the dropdown.

State mutation rules:

- prevent duplicate submissions;
- preserve server-authoritative current state;
- indicate pending transition;
- show failure clearly;
- do not silently switch state on failure.

---

# 19. AGENT STATE SEMANTICS

Keep these concepts distinct:

```text
Ready
Not Ready
Break
Wrap Up
Connection status
Call status
```

`Ready` is not the same thing as `Connected`.
`Not Ready` is not the same thing as `Offline`.
`Break` is not an error.
`Wrap Up` is not an error.

---

# 20. WRAP UP AS A FIRST-CLASS MODE

The manual describes the post-call workflow as:

```text
Call ends
→ Wrap Up
→ Agent updates CRM
→ supervisor-set timer expires
→ Ready
```

The UI must communicate this workflow directly.

Potential presentation if timer data is real:

```text
Wrap Up
02:34 remaining
Complete customer notes before returning to Ready.
```

During Wrap Up:

- CRM remains primary;
- active call controls recede;
- outbound calling obeys actual backend rules;
- automatic return to Ready is driven by authoritative state.

Do not invent timer values.

---

# 21. CONNECTION STATUS

Connection is a separate operational axis.

Potential runtime states:

```text
Connected
Connecting
Reconnecting
Disconnected
Error
```

Use actual values.

A Ready agent with disconnected telephony must see both facts clearly.

---

# 22. MEDIA READINESS

Audit:

- microphone permission;
- microphone device;
- speaker device;
- WebRTC/media readiness.

Do not rebuild the entire Troubleshooting & Diagnostics module here.

When relevant, provide a contextual link/action such as:

```text
Run Diagnostics
```

only if the route exists.

---

# 23. CALL MANAGER PRINCIPLE

Call Manager must be **state-driven**.

Do not show all actions disabled all the time.

The current call state determines:

```text
primary action
secondary actions
visible context
disabled/unavailable actions
timer
status
```

---

# 24. CALL STATE MODEL

Inspect `docs/design/domain/call-state.md` and runtime.

Potential conceptual states:

```text
Idle
Dialing
Incoming
Ringing
Connecting
Connected
Held
Transferring
Ending
Ended
Error
```

Only implement real states.

If runtime includes multi-call or consultation states not yet documented, stop and update the domain model before redesigning.

---

# 25. IDLE CALL MANAGER

When idle, focus on:

```text
Dialer
Recent / Call History
Missed
Outgoing
```

according to current product support.

Do not show active-call controls as a sea of disabled buttons.

---

# 26. DIAL INPUT

Requirements:

- keyboard-friendly;
- paste-friendly;
- readable phone number;
- validation based on existing backend rules;
- disabled Call action when target is unusable;
- duplicate-click prevention;
- no invented normalization rules.

---

# 27. DIALPAD

Keep the numeric dialpad if agents use it.

Modernization goals:

- compact;
- clear;
- good hit targets;
- no skeuomorphic telephone styling;
- not visually dominant over customer context.

---

# 28. CRM CLICK-TO-CALL BOUNDARY

If the existing CRM integration already sends click-to-call events:

- preserve the existing event contract;
- Call Manager receives the dial target through the existing adapter;
- do not invent a new iframe API.

If click-to-call is not currently integrated:

> Do not fake it in this phase.

---

# 29. OUTBOUND CALL FLOW

Use actual runtime states, conceptually:

```text
Idle
→ target entered
→ Dialing
→ Connecting / Ringing
→ Connected
→ End
→ Wrap Up
```

During dialing:

- show the target;
- show only valid cancel/end behavior;
- prevent duplicate calls;
- do not start talk timer before real connection.

---

# 30. INCOMING CALL EXPERIENCE

Incoming call is the highest-priority event.

Potential layout using real available data:

```text
Incoming call

Customer Name
+255 ...
Customer Support

[Decline]                 [Answer]
```

If no customer name is known, show the number only.

Do not fabricate CRM identity.

---

# 31. INCOMING CALL MOTION

Use restrained motion only.

No:

- pulsing full panel;
- bouncing phone icons;
- glow loops;
- animated gradients.

The ringtone + hierarchy already communicate urgency.

---

# 32. ANSWER ACTION

Answer must be:

- visually primary;
- accessible;
- large enough to hit quickly;
- duplicate-click safe;
- pending-aware;
- server/media authoritative.

Do not show `Connected` before the media/call state confirms it.

---

# 33. DECLINE ACTION

Decline must be deliberate but fast.

Do not require a confirmation dialog for every declined ring.

Use actual backend semantics for routing/missed behavior.

---

# 34. CONNECTING STATE

Between Answer and Connected:

```text
Connecting…
```

Controls requiring established media remain unavailable.

Talk duration begins only from the real connected timestamp.

---

# 35. ACTIVE CALL SURFACE

Primary content:

```text
Customer / number
Queue / direction if real
Call duration
Current call state
Mute
Hold
Transfer
End Call
```

Do not duplicate the full CRM customer profile.

---

# 36. CALL DURATION

If client-computed:

- derive from authoritative connected timestamp;
- isolate one-second updates to small timer component;
- clean timers;
- correct from new server state.

Never rerender the entire workspace every second just for a timer.

---

# 37. MUTE / UNMUTE

Use explicit toggled labels.

```text
Mute
→
Unmute
```

When muted, also show text state such as:

```text
Muted
```

Do not rely on icon color alone.

---

# 38. HOLD / RESUME

Use explicit state:

```text
Hold
→
On Hold
→
Resume
```

When held, the UI must be unmistakable.

Only show controls backend permits while held.

---

# 39. END CALL

End Call must remain easy to find during active-call states.

Use destructive semantic styling without making the whole call panel red.

Do not add routine confirmation; that would slow every call unless current product has a real reason.

If termination is asynchronous:

```text
Ending call…
```

before entering Wrap Up.

---

# 40. TRANSFER PRINCIPLE

Transfer is contextual and stateful.

Do not permanently display target-selection controls.

Recommended:

```text
Active Call
→ Transfer
→ choose/search target
→ choose supported transfer mode
→ confirm
→ backend state
```

---

# 41. TRANSFER TARGETS

Use only real supported targets:

```text
agents
queues
connected FLEX contact centers
```

or actual backend types.

Do not invent placeholder target categories.

---

# 42. DIRECT TRANSFER

If supported, make consequence clear.

Do not describe exact behavior unless confirmed by backend.

---

# 43. WARM TRANSFER

Implement only if runtime supports it.

Possible conceptual lifecycle:

```text
Start warm transfer
→ consultation
→ Complete Transfer
or
→ Return to customer
```

Inspect the actual telephony state machine first.

If additional consultation states are discovered, update `call-state.md` in the same phase.

---

# 44. TRANSFER FAILURE

Backend remains authoritative.

If original customer call is still active after a failed transfer, say so only when confirmed.

Potential:

```text
Transfer failed
You're still connected to the customer.
```

Do not force the UI into Wrap Up on transfer failure.

---

# 45. CUSTOMER CONTEXT SEPARATION

Call Manager answers:

```text
Who is this call with?
What is the call state?
What can I do?
```

External CRM answers:

```text
What do we know about the customer?
What work/notes/tasks should I perform?
```

Do not duplicate rich CRM content inside Call Manager.

---

# 46. CALL HISTORY

Call History is a lightweight agent convenience, not CDR.

Keep actual supported tabs such as:

```text
All
Recent
Missed
Outgoing
```

Rows may include:

```text
name/number
direction/outcome
time
callback action if supported
```

Do not add supervisor-only analytics.

---

# 47. CALL HISTORY VS CALLBACK WORKFLOW

Keep separate concepts:

```text
Simple Call History
```

vs.

```text
Missed Calls & Voicemail / Callback workflow
```

The dedicated callback workflow has attempt counts, claiming/ownership, queue context, voicemail, and attended resolution semantics.

Do not recreate that workflow in the Call Manager.

---

# 48. AGENT DASHBOARD RELATIONSHIP

Agent Dashboard remains the place for:

- profile;
- personal performance;
- skills/proficiency;
- queue status;
- provider minutes;
- waiting-service context.

Agent Workspace is the transaction surface.

Do not fill Call Manager with Agent Dashboard KPIs.

---

# 49. TAB / LOCAL STATE PERSISTENCE

Realtime refreshes must not reset the selected call-history tab or dial input unnecessarily.

An incoming/active call may intentionally override the idle tab with the active call surface.

After the call, follow actual product behavior rather than inventing surprising navigation.

---

# 50. REALTIME / TELEPHONY DATA OWNER

Use one canonical owner for:

```text
agent state
connection state
call state
active call
media state
Wrap Up state
```

If an application-global telephony store already exists, reuse it.

Do not create route-local call state if calls must survive navigation.

---

# 51. CALL PERSISTENCE AUDIT

Determine:

```text
Does an active call survive navigation?
Is Call Manager globally mounted?
Does callback navigation keep a call alive?
Does route unmount terminate media?
```

Do not change these semantics accidentally.

If existing architecture is globally persistent, preserve it.

---

# 52. EVENT / TIMER CLEANUP

Verify:

- listeners registered once;
- media tracks cleaned only when appropriate;
- timers cleaned;
- transfer listeners cleaned;
- reconnect does not duplicate events;
- ended calls release state correctly.

---

# 53. TELEPHONY STALE-STATE RULE

Do not apply dashboard-style stale-data behavior blindly to active call controls.

When high-consequence state cannot be trusted:

- indicate uncertainty;
- disable risky actions where appropriate;
- let backend capability/state remain authoritative.

---

# 54. MEDIA / CONNECTION ERROR STATES

Distinguish:

```text
CRM unavailable
Telephony disconnected
Microphone blocked
Audio device unavailable
Call failed
Transfer failed
Agent-state update failed
```

Do not collapse all failures into `Something went wrong`.

---

# 55. TROUBLESHOOTING INTEGRATION

Where appropriate and existing:

```text
Run Diagnostics
```

should link to the existing Troubleshooting & Diagnostics route.

Do not duplicate its full device/network suite in Call Manager.

---

# 56. DEVELOPMENT / MOCK TELEPHONY

If real telephony is unavailable in the modernization environment:

- use an existing mock adapter, or
- add a clearly isolated adapter behind the same production-facing interface.

Do not put fake state-transition `setTimeout` logic in presentational components.

---

# 57. DETERMINISTIC MOCK SCENARIOS

Support dev/test scenarios where practical:

```text
Idle
Not Ready
Ready
Incoming
Connecting
Active
Muted
Held
Outbound Dialing
Transfer
Transfer Failure
Wrap Up
Connection Lost
Microphone Denied
CRM Unavailable
```

Warm Transfer only if real.

Keep test states reproducible rather than random.

---

# 58. RESPONSIVE STRATEGY

Primary target:

```text
desktop / laptop
```

because the agent needs CRM + Call Manager simultaneously.

Test:

```text
large desktop
standard laptop
narrow laptop
tablet-ish failure check
```

Full phone optimization is out of scope.

---

# 59. NARROW-WIDTH RULE

At narrower widths, consider only patterns supported by current architecture:

```text
CRM + collapsible Call Manager
```

or:

```text
Call Manager drawer while idle
persistent active-call controls while on call
```

Do not hide essential active-call controls.

Do not prioritize CRM width over call safety.

---

# 60. ACCESSIBILITY REQUIREMENTS

Mandatory:

- agent-state selector labeled;
- connection status readable without color;
- dial input labeled;
- dialpad accessible;
- incoming caller context accessible;
- Answer/Decline clearly named;
- Mute/Unmute clearly named;
- Hold/Resume clearly named;
- Transfer accessible;
- End Call accessible;
- transfer target list keyboard-friendly;
- visible focus;
- logical tab order;
- state changes communicated without excessive announcements;
- reduced motion;
- sufficient contrast;
- adequate hit targets.

---

# 61. SCREEN-READER LIVE EVENTS

Useful announcements may include:

```text
Incoming call
Call connected
Call ended
Muted
Unmuted
On hold
Resumed
Transfer failed
Connection lost
Wrap Up started
```

Do not announce call timer ticks every second.

---

# 62. FOCUS SAFETY

Incoming calls must become immediately actionable but should not destroy CRM editing context unnecessarily.

Do not make Escape end an active call.

Overlay rules:

```text
Escape closes transfer menu/sheet
Escape does NOT hang up
```

---

# 63. MOTION

Use canonical FLEX timing only.

Avoid:

- pulsing call panels;
- glowing mic icons;
- animated call timers;
- bouncing ring symbols;
- constantly animated state pills.

Urgency comes from hierarchy and actual audio, not visual gimmicks.

---

# 64. VISUAL LANGUAGE

Use:

- FLEX blue;
- semantic state colors only where meaningful;
- quiet surfaces;
- compact spacing;
- strong text hierarchy;
- restrained separators.

Avoid:

- generic purple AI accents;
- glassmorphism;
- giant KPI tiles;
- gradient Call buttons;
- colored icon circles everywhere;
- fake Apple translucency.

`Apple-class` means clarity, confidence, state coherence, and detail—not frosted glass.

---

# 65. CALL CONTROL DESIGN

High-frequency/high-consequence controls should generally use:

```text
icon + label
```

when space permits.

Do not force agents to memorize a row of ambiguous icon-only actions.

Toggled actions should change labels:

```text
Mute → Unmute
Hold → Resume
```

---

# 66. COPY RULES

Prefer canonical operational wording:

```text
Agent Workspace
Customer Workspace
Call Manager
Ready
Not Ready
Break
Wrap Up
Connected
Connecting
Reconnecting
Disconnected
Incoming call
Answer
Decline
Call
Calling
Mute
Unmute
Hold
Resume
Transfer
End Call
Dialer
Call History
Recent
Missed
Outgoing
Start Transfer
Complete Transfer
Cancel Transfer
```

Avoid vague/overformal wording when simpler language exists:

```text
Initiate Call
Execute Transfer
Terminate
Change Status
```

unless established product language requires it.

---

# 67. COMPONENT REUSE AUDIT

Before adding components:

```text
NEED                        FIRST CHOICE
--------------------------------------------------------
Shell                       canonical FLEX / Agent shell
State                       canonical AgentState
Connection                  existing status primitive
Button                      shared Button
Tabs                        shared Tabs
Dialog                      shared Dialog
Sheet                       shared Sheet
Search                      shared Search
Loading                     shared Skeleton
Error                       FlexErrorState
Tooltip                     shared Tooltip
```

Expected domain compositions:

```text
AgentOperationalHeader
CRMIntegrationHost
CallManager
IncomingCallSurface
ActiveCallSurface
CallControls
TransferFlow
WrapUpSurface
CallHistory
```

---

# 68. COMPONENT GOVERNANCE

Do not add props such as:

```text
agentWorkspaceMode
callManagerVariant
telephonySpecial
crmLayout
```

to unrelated generic components.

Prefer domain composition from small shared primitives.

---

# 69. PROPOSED FILE STRUCTURE

Adapt to the repository.

```text
src/
└── features/
    └── agent-workspace/
        ├── agent-workspace-page.tsx
        ├── agent-operational-header.tsx
        ├── agent-state-control.tsx
        ├── connection-status.tsx
        │
        ├── integration/
        │   ├── crm-integration-host.tsx
        │   ├── crm-host-config.ts
        │   ├── crm-integration-state.ts
        │   └── mock-crm-host.json
        │
        ├── call-manager/
        │   ├── call-manager.tsx
        │   ├── idle-call-surface.tsx
        │   ├── incoming-call-surface.tsx
        │   ├── active-call-surface.tsx
        │   ├── call-controls.tsx
        │   ├── dialer.tsx
        │   ├── call-history.tsx
        │   ├── transfer-flow.tsx
        │   └── wrap-up-surface.tsx
        │
        ├── use-agent-workspace.ts
        ├── agent-workspace-skeleton.tsx
        └── types.ts
```

Only create justified files.

---

# 70. IMPLEMENTATION PHASE RULE

Every phase follows:

```text
IMPLEMENT
→ TEST
→ RUN APP
→ VISUALLY VERIFY
→ FUNCTIONALLY VERIFY
→ FIX
→ RETEST
→ REVIEW GIT DIFF
→ COMMIT
→ PUSH
→ VERIFY GITHUB
→ NEXT PHASE
```

A phase is not complete until its tested commit is pushed successfully.

---

# 71. PHASE 0 — PREFLIGHT & ARCHITECTURE AUDIT

## Implement / investigate

- verify repository state;
- read Craft docs;
- inspect Agent Monitoring;
- inspect Agent Workspace;
- map telephony and agent state;
- inspect CRM boundary;
- inspect mock adapter;
- inspect route persistence;
- document pre-existing defects;
- capture baseline.

## Test

Run full current dev-safe flow.

## Commit

No commit if investigation only.

If tracked baseline docs are added:

```text
docs(agent-workspace): capture modernization baseline
```

## Push

If committed, push and verify before Phase 1.

---

# 72. PHASE 1 — WORKSPACE SHELL & CRM BOUNDARY

## Implement

- canonical Agent shell;
- operational header region;
- preserve existing CRM iframe host;
- preserve integration layout intent;
- modernize boundary chrome only;
- establish Call Manager panel sizing.

Do not redesign Call Manager internals yet.

## Test

- route;
- CRM host;
- mock host;
- Call Manager visibility;
- iframe regression;
- desktop;
- narrow;
- Agent Monitoring regression;
- lint;
- typecheck;
- build if practical.

## Commit

```text
refactor(agent-workspace): establish canonical FLEX workspace shell
```

## Push

Push and verify.

---

# 73. PHASE 2 — AGENT OPERATIONAL HEADER

## Implement

- AgentState control;
- state/session timer where real;
- connection status;
- correct hierarchy;
- existing account controls.

## Test

- Not Ready;
- Ready;
- Break;
- Wrap Up display;
- transition pending/failure;
- Connected;
- Reconnecting;
- Disconnected;
- keyboard;
- narrow;
- lint/typecheck.

## Commit

```text
refactor(agent-workspace): prioritize agent state and connection controls
```

## Push

Push and verify.

---

# 74. PHASE 3 — CRM INTEGRATION RESILIENCE

## Implement

- integration-state owner;
- loading;
- unavailable;
- retry if real;
- missing config;
- mock isolation.

No CRM-content redesign.

## Test

- external host;
- loading;
- failed host;
- retry;
- mock;
- missing config;
- Call Manager independent behavior;
- no invented API;
- lint/typecheck.

## Commit

```text
feat(agent-workspace): harden external CRM integration boundary
```

## Push

Push and verify.

---

# 75. PHASE 4 — CANONICAL CALL STATE ORCHESTRATION

## Implement

- reuse application-global telephony owner if one exists;
- centralize route consumption;
- expose call capability/state cleanly;
- expose media/connection state;
- eliminate duplicate subscriptions;
- preserve call persistence semantics.

## Test

- idle;
- incoming;
- answer;
- connected;
- end;
- route leave/re-enter;
- listener cleanup;
- call persistence;
- connection loss;
- console/network;
- lint/typecheck/tests.

## Commit

```text
refactor(agent-workspace): align call manager with canonical telephony state
```

## Push

Push and verify.

---

# 76. PHASE 5 — IDLE CALL MANAGER & DIALER

## Implement

- quiet idle state;
- dial input;
- dialpad;
- Call action;
- history/tabs shell;
- validation.

## Test

- keyboard input;
- paste;
- empty target;
- invalid target;
- valid dial;
- duplicate-click prevention;
- real/mock adapter;
- responsive;
- keyboard;
- lint/typecheck.

## Commit

```text
refactor(call-manager): modernize idle dialer experience
```

## Push

Push and verify.

---

# 77. PHASE 6 — INCOMING CALL

## Implement

- incoming-call surface;
- caller identity if available;
- queue context if real;
- Answer;
- Decline;
- connecting state.

## Test

- known caller;
- unknown caller;
- Answer;
- pending Answer;
- Decline;
- ring ends;
- missed;
- duplicate event;
- focus/accessibility;
- narrow;
- lint/typecheck.

## Commit

```text
feat(call-manager): standardize incoming call handling
```

## Push

Push and verify.

---

# 78. PHASE 7 — ACTIVE CALL SURFACE

## Implement

- call context;
- connected timer;
- state-valid controls;
- End Call;
- stable hierarchy.

## Test

- connection;
- timer;
- known/unknown customer;
- active controls;
- end;
- remote end;
- connection loss;
- lint/typecheck.

## Commit

```text
refactor(call-manager): modernize active call surface
```

## Push

Push and verify.

---

# 79. PHASE 8 — MUTE / HOLD / RESUME

## Implement

- explicit toggle labels;
- muted state;
- held state;
- pending state;
- server-authoritative updates.

## Test

- mute;
- unmute;
- mute failure;
- hold;
- resume;
- hold failure;
- call end while muted/held;
- keyboard;
- accessibility;
- lint/typecheck.

## Commit

```text
feat(call-manager): standardize mute and hold controls
```

## Push

Push and verify.

---

# 80. PHASE 9 — TRANSFER FLOW

## Implement

First inspect actual transfer support.

Then implement only real behavior:

- enter transfer;
- target search;
- target selection;
- direct transfer if real;
- Warm Transfer if real;
- pending;
- cancel;
- failure.

## Test

- no target;
- agent/queue target as supported;
- unavailable target;
- direct transfer;
- warm transfer states if supported;
- cancel;
- failure;
- original-call continuity;
- call end mid-transfer;
- keyboard/focus;
- lint/typecheck.

## Commit

```text
feat(call-manager): modernize call transfer workflow
```

## Push

Push and verify.

---

# 81. PHASE 10 — CALL END & WRAP UP

## Implement

- authoritative end transition;
- Wrap Up mode;
- remaining timer if real;
- CRM-work emphasis;
- automatic Ready transition.

## Test

- normal end;
- remote end;
- Wrap Up start;
- timer;
- CRM stays usable;
- automatic Ready;
- manual state change if allowed;
- route behavior;
- no duplicate timer;
- lint/typecheck.

## Commit

```text
feat(agent-workspace): formalize post-call wrap-up workflow
```

## Push

Push and verify.

---

# 82. PHASE 11 — CALL HISTORY

## Implement

- lightweight history;
- existing tabs;
- outcome/direction;
- time;
- call-back action where currently supported.

Do not recreate CDR.

## Test

- All;
- Recent;
- Missed;
- Outgoing;
- empty;
- long list;
- call from history;
- refresh;
- active-call interaction;
- responsive;
- lint/typecheck.

## Commit

```text
refactor(call-manager): simplify agent call history
```

## Push

Push and verify.

---

# 83. PHASE 12 — MEDIA & CONNECTION FEEDBACK

## Implement

- microphone denied;
- missing/unavailable device where detectable;
- telephony disconnected;
- reconnecting;
- call failure;
- diagnostics action if existing.

## Test

Where safely reproducible:

- mic denied;
- no device;
- disconnect;
- reconnect;
- call failure;
- CRM remains usable;
- diagnostics route;
- accessibility;
- lint/typecheck.

## Commit

```text
feat(agent-workspace): add resilient telephony and media feedback
```

## Push

Push and verify.

---

# 84. PHASE 13 — RESPONSIVE & ACCESSIBILITY

## Implement

- desktop layout;
- narrow behavior;
- active-call visibility;
- hit targets;
- focus;
- restrained live announcements;
- reduced motion;
- contrast.

## Test

Viewports:

```text
large desktop
standard laptop
narrow laptop
tablet-ish failure check
```

Keyboard:

```text
Tab
Shift+Tab
Enter
Space
Escape
Arrow keys in tabs/menus
```

Run:

- lint;
- typecheck;
- automated tests;
- build where practical.

## Commit

```text
fix(agent-workspace): complete responsive and accessibility polish
```

## Push

Push and verify.

---

# 85. PHASE 14 — MANDATORY QUALITY PASS

Find at least 5–10 craft issues such as:

- dialer alignment;
- number typography;
- call-control label consistency;
- state indicator hierarchy;
- CRM-boundary padding;
- divider weight;
- muted-state clarity;
- hold-state clarity;
- transfer spacing;
- timer alignment;
- focus behavior;
- tooltip copy;
- Call Manager scrolling;
- layout shift.

Fix them.

## Test

Run the full dev-safe call flow.

## Commit

```text
fix(agent-workspace): complete FLEX quality pass
```

## Push

Push and verify.

---

# 86. PHASE 15 — FINAL QA & RELEASE GATE

Run:

```text
Agent Workspace
Agent Dashboard
Agent Monitoring
Dashboard
CDR
```

Verify:

- agent-state terminology;
- call-state terminology;
- telephony behavior;
- CRM boundary;
- mock boundary;
- call persistence;
- Wrap Up;
- responsiveness;
- accessibility;
- media/connection feedback.

Any fix must follow:

```text
FIX
→ RETEST
→ COMMIT
→ PUSH
→ VERIFY
```

Suggested:

```text
fix(agent-workspace): resolve release QA issues
```

Release is complete only when the latest tested commit exists on GitHub.

---

# 87. MANDATORY TEST → VERIFY → COMMIT → PUSH GATE

Applies to every phase.

```text
IMPLEMENT PHASE
      ↓
TEST
      ↓
RUN APPLICATION
      ↓
VISUAL VERIFY
      ↓
FUNCTIONAL VERIFY
      ↓
EXPECTED?
  NO → FIX → RETEST
  YES
      ↓
git status / git diff
      ↓
COMMIT
      ↓
PUSH
      ↓
VERIFY GITHUB
      ↓
NEXT PHASE
```

Invariant:

> **Never start the next phase with untested, uncommitted, or unpushed work.**

---

# 88. REQUIRED TESTS PER PHASE

Run all applicable:

1. Agent Workspace;
2. external CRM host;
3. mock host;
4. agent state;
5. call state;
6. signaling connection;
7. media permissions;
8. incoming call;
9. outbound call;
10. Mute/Unmute;
11. Hold/Resume;
12. Transfer;
13. Warm Transfer if real;
14. Wrap Up;
15. call history;
16. route navigation/persistence;
17. responsive;
18. keyboard/focus;
19. lint;
20. typecheck;
21. automated tests;
22. build;
23. browser console;
24. event/listener behavior;
25. Git diff.

Do not commit just because the page renders.

---

# 89. GIT SAFETY

Before commit:

```bash
git status
git diff
```

Check for:

- external CRM code accidentally copied;
- hardcoded CRM host URLs that belong in config;
- SIP credentials;
- WebRTC auth tokens;
- API secrets;
- `.env` files;
- debug logs;
- temporary mock hacks;
- generated noise;
- unrelated formatting.

Never commit credentials.

---

# 90. PUSH RULE

After accepted commit:

```bash
git push
```

If upstream is missing:

```bash
git push -u origin <current-branch>
```

Do not routine force-push.

---

# 91. PUSH FAILURE RULE

If push fails:

1. stop;
2. inspect exact error;
3. resolve auth/permissions/branch protection/divergence/network safely;
4. rerun tests if conflict resolution changed code;
5. push again;
6. verify remote;
7. only then continue.

---

# 92. TEST FAILURE RULE

If a relevant test fails:

```text
DO NOT COMMIT
DO NOT PUSH
DO NOT CONTINUE
```

unless the failure is confirmed pre-existing and unrelated.

Document any accepted pre-existing failure.

---

# 93. PHASE REPORT FORMAT

After every pushed phase:

```text
PHASE: <name>

IMPLEMENTED
- ...

TESTED
- Agent Workspace
- CRM integration boundary
- agent state
- call state
- telephony/media where applicable
- responsive
- accessibility
- lint
- typecheck
- tests/build

RESULT
- PASS

COMMIT
- <hash> <message>

PUSH
- Successfully pushed to <remote>/<branch>

NOTES
- ...
```

Do not claim tests that were not run.

---

# 94. REGRESSION MATRIX — AGENT STATE

- [ ] Not Ready.
- [ ] Ready.
- [ ] Break.
- [ ] Wrap Up.
- [ ] transition pending.
- [ ] transition error.
- [ ] automatic Ready after Wrap Up.
- [ ] canonical terminology.

---

# 95. REGRESSION MATRIX — CONNECTION

- [ ] Connected.
- [ ] Connecting.
- [ ] Reconnecting if real.
- [ ] Disconnected.
- [ ] recovery.
- [ ] Ready remains distinct from Connected.

---

# 96. REGRESSION MATRIX — INBOUND CALL

- [ ] incoming event.
- [ ] known caller.
- [ ] unknown caller.
- [ ] Answer.
- [ ] connecting.
- [ ] connected.
- [ ] Decline.
- [ ] missed.
- [ ] remote cancellation.

---

# 97. REGRESSION MATRIX — OUTBOUND CALL

- [ ] number entry.
- [ ] paste.
- [ ] validation.
- [ ] Call.
- [ ] dialing.
- [ ] connecting.
- [ ] connected.
- [ ] failed.
- [ ] cancel/end.
- [ ] call from history if supported.

---

# 98. REGRESSION MATRIX — ACTIVE CALL

- [ ] duration.
- [ ] Mute.
- [ ] Unmute.
- [ ] Hold.
- [ ] Resume.
- [ ] Transfer.
- [ ] Warm Transfer if real.
- [ ] End Call.
- [ ] remote end.
- [ ] media/connection loss.

---

# 99. REGRESSION MATRIX — WRAP UP

- [ ] starts after call.
- [ ] CRM remains visible.
- [ ] timer correct if real.
- [ ] automatic Ready.
- [ ] no duplicated timer.
- [ ] navigation behavior.

---

# 100. REGRESSION MATRIX — CRM BOUNDARY

- [ ] external host unchanged.
- [ ] only boundary chrome modernized.
- [ ] loading state.
- [ ] error state.
- [ ] mock state.
- [ ] configured host.
- [ ] Call Manager independence where supported.
- [ ] no invented CRM APIs.

---

# 101. REALTIME QA

- [ ] one call-state owner.
- [ ] no duplicate listeners.
- [ ] no duplicate pollers.
- [ ] route persistence correct.
- [ ] timer cleanup.
- [ ] media cleanup.
- [ ] reconnect does not duplicate streams.
- [ ] no obvious memory leak after repeated navigation.

---

# 102. VISUAL QA

## Hierarchy

- [ ] incoming call dominates when ringing.
- [ ] active call controls dominate while connected.
- [ ] Wrap Up dominates after call.
- [ ] CRM remains primary work canvas.
- [ ] agent state and connection are always clear.

## Density

- [ ] Call Manager compact.
- [ ] no oversized dead space.
- [ ] no generic KPI cards.
- [ ] dialpad proportionate.
- [ ] history readable.

## Brand

- [ ] FLEX blue is primary.
- [ ] semantic colors have meaning.
- [ ] no arbitrary purple.
- [ ] no glassmorphism.
- [ ] no gratuitous gradients.

---

# 103. ACCESSIBILITY QA

- [ ] state selector.
- [ ] connection status.
- [ ] dial input.
- [ ] dialpad.
- [ ] incoming caller context.
- [ ] Answer.
- [ ] Decline.
- [ ] Mute/Unmute.
- [ ] Hold/Resume.
- [ ] Transfer.
- [ ] End Call.
- [ ] focus management.
- [ ] no color-only state.
- [ ] live announcements restrained.
- [ ] reduced motion.
- [ ] contrast.
- [ ] hit targets.

---

# 104. PERFORMANCE QA

Inspect:

- Call Manager rerenders;
- call timer;
- state timer;
- iframe reload behavior;
- listeners;
- transfer search;
- history list.

Avoid:

- whole-workspace rerender every second;
- iframe reload during routine call state changes;
- independent call-state polling from child components;
- duplicated stores;
- heavy dependency additions without need.

---

# 105. EDGE CASE — CALL ARRIVES WHILE TYPING IN CRM

Incoming call must become obvious and immediately actionable without unnecessarily destroying CRM focus/context.

Inspect current product behavior and preserve safe semantics.

---

# 106. EDGE CASE — CRM FAILS DURING CALL

If architecture permits, Call Manager continues working.

Do not end a call because the iframe failed.

---

# 107. EDGE CASE — CRM RELOADS DURING CALL

CRM host reload must not recreate or reset telephony state.

Keep integration and telephony boundaries separate.

---

# 108. EDGE CASE — READY + DISCONNECTED

Show both:

```text
Ready
Disconnected
```

Do not let green Ready hide connection failure.

---

# 109. EDGE CASE — CALL ARRIVES WHILE BREAK / NOT READY

Backend truth wins.

If a call arrives despite local expectations:

- show it;
- allow valid call handling;
- do not suppress it because UI state says it 'should not happen';
- log/document discrepancy in development.

---

# 110. EDGE CASE — UNKNOWN CALL STATE

- do not crash;
- render neutral fallback;
- disable risky controls unless backend capability says otherwise;
- log in development where appropriate.

---

# 111. EDGE CASE — WRAP UP TIMER DRIFT

If authoritative expiry exists:

- resync from server/state owner;
- do not trust a purely local countdown indefinitely.

---

# 112. EDGE CASE — MULTIPLE CALLS

The manual broadly mentions handling multiple calls, but this plan must not infer a multi-call UI.

If runtime supports multiple simultaneous/parked calls:

> **STOP. Document the actual call state model and expand this plan before redesigning that interaction.**

Do not improvise a multi-call tab system.

---

# 113. EDGE CASE — BROWSER REFRESH DURING ACTIVE CALL

Test dev-safe behavior.

Preserve existing telephony semantics.

Do not attempt to solve call persistence across browser refresh unless it is already supported or explicitly in scope.

---

# 114. DOCUMENTATION UPDATE RULE

If implementation discovers canonical docs are incomplete or wrong, update in the same phase:

```text
docs/design/domain/agent-state.md
docs/design/domain/call-state.md
docs/design/09-realtime-data.md
docs/design/04-interaction-rules.md
```

Then test, commit, push, and verify.

---

# 115. FINAL SCREENSHOT SET

Capture dev/test-safe states:

```text
01-agent-workspace-before.png
02-agent-workspace-idle.png
03-agent-workspace-ready.png
04-agent-workspace-incoming.png
05-agent-workspace-connecting.png
06-agent-workspace-active-call.png
07-agent-workspace-muted.png
08-agent-workspace-held.png
09-agent-workspace-transfer.png
10-agent-workspace-wrap-up.png
11-agent-workspace-crm-error.png
12-agent-workspace-disconnected.png
13-agent-workspace-narrow.png
```

Capture Warm Transfer only if actually supported.

---

# 116. STOP CONDITIONS

Stop and investigate if:

- CRM iframe/integration boundary would need replacement;
- telephony state model is unclear;
- agent-state model conflicts with Craft docs;
- call persistence is unclear;
- call controls require backend changes;
- transfer behavior is unclear;
- Warm Transfer behavior is unclear;
- multiple-call behavior exists but is undocumented;
- listeners duplicate;
- media leaks;
- call state accidentally becomes route-local;
- external CRM APIs would need to be invented;
- credentials appear in source;
- Agent Monitoring regresses;
- canonical CDR/agent terminology regresses.

Do not improvise around high-consequence unknowns.

---

# 117. PRIORITY IF TIME IS LIMITED

## Must ship

1. architecture audit;
2. shell;
3. CRM integration preservation;
4. operational header;
5. canonical call-state orchestration;
6. idle dialer;
7. incoming call;
8. active call;
9. Mute/Hold/Resume;
10. End + Wrap Up;
11. media/connection feedback;
12. regression QA;
13. phase-by-phase commit/push.

## Strongly preferred

14. Transfer;
15. Warm Transfer if already supported;
16. call history;
17. responsive/accessibility;
18. quality pass.

## Defer if risky

19. new global keyboard shortcuts;
20. new persistent-call architecture;
21. new multi-call UX;
22. new media-device management UI.

Never defer CRM-boundary safety.

---

# 118. FINAL DELIVERABLES

## Code

- canonical Agent Workspace shell;
- preserved external CRM host;
- integration loading/error/mock states;
- agent operational header;
- canonical state control;
- state-driven Call Manager;
- dialer;
- incoming call;
- active call;
- Mute/Unmute;
- Hold/Resume;
- Transfer;
- Warm Transfer only if real;
- Wrap Up;
- lightweight call history;
- media/connection feedback;
- responsive/accessibility polish.

## Documentation

- architecture audit;
- phase reports;
- Craft-domain corrections if needed;
- screenshot set.

## Git

- focused commit per phase;
- every commit pushed;
- push verified;
- final worktree clean;
- final tested commit visible on GitHub.

---

# 119. FINAL GIT CHECK

Before release:

```bash
git status
git branch --show-current
git log -25 --oneline
git remote -v
```

Expected:

- correct branch;
- no unexplained changes;
- all Agent Workspace commits present;
- all pushes successful;
- latest tested commit exists remotely.

---

# 120. RELEASE NOTE

Suggested:

> **FLEX Agent Workspace v0.1**
>
> Modernized FLEX's core agent transaction workspace while preserving the external CRM integration boundary and existing telephony behavior. The release introduces clearer agent-state and connection controls, resilient CRM integration states, a state-driven Call Manager, refined inbound and outbound call flows, explicit mute/hold/resume behavior, safer transfer handling, structured post-call Wrap Up, simplified call history, telephony/media recovery states, and responsive/accessibility improvements. No unsupported external CRM APIs or call capabilities were introduced.

---

# 121. NEXT PHASE

After this release is accepted, tested, committed, pushed, and verified on GitHub, create:

```text
MANAGEMENT_CONSOLE_PLAN.md
```

The next phase should modernize the administrative discovery layer:

```text
Management Console
├── module search
├── permission-aware visibility
├── Telephony & Routing
├── People & Access
├── Reporting & Quality
├── System
├── Platform context
├── recent/favorite modules if justified
└── future Cmd/Ctrl+K command architecture
```

The Management Console should become a searchable administrative directory, not another dashboard of equal-weight cards.

Do not begin Management Console work until the final Agent Workspace commit exists on GitHub.

---

# 122. NORTH STAR

The Agent Workspace succeeds when an agent can always answer:

```text
Am I ready?
Is telephony connected?
Who is calling?
What state is the call in?
What can I do now?
Am I muted?
Is the customer on hold?
What happened to my transfer?
What should I do after the call?
```

without hunting through the UI.

The workspace should feel:

```text
immediate
quiet
precise
state-driven
trustworthy
high-frequency
```

Execution rhythm:

```text
inspect actual telephony behavior
→ preserve CRM boundary
→ reuse FLEX infrastructure
→ implement small phase
→ test
→ visually verify
→ functionally verify
→ fix
→ retest
→ commit
→ push
→ verify GitHub
→ continue
```

**Do not skip the gates.**
