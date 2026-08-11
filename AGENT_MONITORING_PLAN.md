# FLEX — Agent Monitoring & Call Whispering Plan

> **Status: APPROVED — implementation in progress (Phase 1 of 12).**
>
> This is the authoritative execution roadmap for the **Supervision** workspace's Agent Monitoring + Call Whispering surface (`FLEX Agent Monitoring v0.1`). It supersedes the earlier draft and adapts the product team's detailed spec to the verified POC runtime. Follow the repo quality gates (`docs/design/12-quality-gates.md`) for every phase.

## 1. Purpose

Build a realtime supervisory workspace where a supervisor can answer:

```text
Who is available?
Who is handling a call?
Who has been in a state for a long time?
Which agent needs attention?
Can I safely intervene?
Am I currently whispering?
```

Not another dashboard. A control surface combining realtime workforce visibility, agent state + state duration, workforce distribution, current-call context, permission-aware **Call Whispering**, and resilient feedback — without turning into a noisy wallboard or a generic analytics page.

Operating flow: `Observe → Identify → Inspect → Intervene → Confirm → Monitor outcome`.

**Workspace:** Supervision (admin shell). Not a new role, not a new shell, not a fourth product mode.

## 2. Source-of-truth grounding

1. **Runtime** — authoritative for routes, enums, realtime mechanism, permissions, tenant scope, backend errors.
2. **FLEX Craft Infrastructure** (`docs/design/`) — read before implementation.
3. **FLEX User Manual** — intended terminology/behavior; where it differs from runtime, document the discrepancy, preserve runtime behavior.

### Verified runtime facts (checked against the working tree)

- **Greenfield:** no Agent Monitoring route, page, module, or capability exists anywhere. Only "monitoring" hits are the `survey-monitoring` placeholder module and a System-page daemon row. → this is a **build**, not a migration; commits use `feat(...)`.
- **Realtime:** one pipeline — `features/dashboard/dashboard-context.tsx` (5s polling, mock adapter `dashboard-data.ts`, `isRefreshingRef` guard, `checkStale` 30s, hidden-tab pause, unmount cleanup). No websockets/SSE.
- **Types** (`features/dashboard/dashboard-types.ts`): `AgentRosterEntry` (id, name, extension, queue, state, callsToday, aht, stateSince), `ActiveCall` (customer, agent{id,name}, queue, direction, state, durationSeconds, startedAt). **No declared join key** between roster and active calls — derive by agent id.
- **States:** `AgentState = ready | talking | ringing | wrap-up | break | not-ready | offline`. Canonical display label for `talking` is **"Talking (On Call)"** (`docs/design/domain/agent-state.md:10`); the Dashboard wallboard currently renders raw `talking` as "Talking" (`lib/status-styles.ts:51`) — a documented discrepancy we fix globally (decision 3).
- **No telephony/media:** Call Manager is a local simulation; the CRM iframe boundary is a mock; no `WebSocket`. → **Whisper ships as a simulated affordance** (decision 2).
- **Permissions:** UI-only registry (`auth/capabilities.tsx`, Fortify session auth, no backend roles). Backend remains authoritative.

## 3. Locked decisions (user-approved)

| # | Decision |
|---|---|
| 1 | **Greenfield build** at a new route; `feat(...)` commits; the plan's "migrate/refactor" framing is dropped |
| 2 | **Whisper simulated only** — mock adapter, explicit "Simulated" labeling; real media deferred to the Call Manager integration path |
| 3 | **Canonical labels** on monitoring, and the Dashboard wallboard label is fixed to canonical ("Talking (On Call)") globally, with Dashboard regression |
| 4 | Route **`/admin/monitoring`** (nav label "Agent Monitoring" disambiguates) |

## 4. Scope

### In scope

1. Agent Monitoring route + realtime roster surface (state, state duration, queue, current call context, performance context).
2. Search / state / queue filters + sort.
3. Agent detail sheet with live-call context and the whisper intervention.
4. `monitor.view` capability + role wiring + navigation entry.
5. `docs/design/domain/agent-monitoring.md` + `docs/design/exemplars/agent-monitoring.md`.
6. Promotion of `LiveDataStatus` → `components/flex/flex-live-data-status.tsx` (second realtime consumer justifies the shared primitive).

### Explicitly out of scope (do not build or claim)

- No new role / shell / product mode; no `supervisor` runtime role.
- **No barge/join** — the manual names only Agent Monitoring + Call Whispering.
- No real audio / telephony / websockets / postMessage protocol invented.
- No backend capabilities invented (the capability registry remains the documented UI mirror).
- No route renames/moves; no websockets; no new polling.
- No invented metrics (only `callsToday`, `aht`, and queue-level SLA exist — **no per-agent SLA adherence**).
- No fixing pre-existing smells (e.g., duplicate `AGENT_ROSTER` copies) this phase.
- No coaching-notes backend, QA scoring, scheduling, sentiment, AI suggestions, dark mode, recording changes.

## 5. Design decisions (fixed)

| Decision | Choice | Why |
|---|---|---|
| Workspace | Supervision, `AdminShell` | Manual maps supervisor surfaces to the admin workspace; no new shell |
| Capability | `monitor.view` on `Capability`; `super-admin` + `admin`, **not** `agent` | Existing noun-dot naming; no fourth role |
| Route | `admin/monitoring` (new) | Mirrors CDR/Campaigns under `/admin`; label "Agent Monitoring" |
| Navigation | `NAVIGATION` entry `/admin/monitoring`, `monitor.view`, workspace `admin` | Capability-filtered sidebar → appears in SUPERVISION group for admin/super-admin only |
| Data | Reuse `DashboardProvider` + `useDashboardData`; `useAgentMonitoring()` derivation (join roster↔activeCalls, summary counts, filters) | One pipeline per domain; no duplicate polling (`09-realtime-data.md`) |
| Shared status | Promote `LiveDataStatus` → `components/flex/flex-live-data-status.tsx`; dashboard import updated; no visual change | Second realtime consumer satisfies the component decision test (`11-component-governance.md`) |
| Table | ReUI data-grid + search + state/queue filters + sort (proven in CDR/Campaigns) | Larger roster than the wallboard; reuse over a second hand-rolled table |
| Detail | `FlexDetailSheet` | Overlay decision model: contextual inspection → sheet (`04-interaction-rules.md`) |
| Intervention | Single action: **Whisper** (no barge, no monitor-as-action) | Manual names only Agent Monitoring + Call Whispering; actions stay runtime-truthful |

## 6. Canonical state language

Use `docs/design/domain/agent-state.md`:

| Runtime | Display |
|---|---|
| `ready` | Ready |
| `talking` | Talking (On Call) |
| `ringing` | Ringing |
| `wrap-up` | Wrap Up |
| `break` | Break |
| `not-ready` | Not Ready |
| `offline` | Offline |

`break` and `wrap-up` are normal states — never danger-styled by default. Do not equate `not-ready` with `offline`. Duration only becomes "overdue" against a real configured threshold (none exists in the POC → show duration, never label overdue).

## 7. Product definition

### Agent Monitoring

A supervision surface answering *what is every agent doing right now?*

- Realtime roster: name, extension, queue, state (canonical label + tone), state duration (ticking), current call context, calls today, AHT.
- Search (name/extension), state filter, queue filter, sort.
- Row → detail sheet: identity, state + duration, live call context, performance, whisper.
- Freshness surfaced via shared live-data status; all feedback states per `07-feedback-states.md`.
- Supervisor attention order (`03-attention-hierarchy.md`): operational context and intervention opportunity above trends/chrome.

### Call Whispering

Supervisor coaches an agent during a live call; supervisor hears the call, agent hears the supervisor, **caller does not**.

In the POC this is **simulated**, labeled as such everywhere:

- Offered only when the agent's state is `talking` on a supported active call (an action the runtime could perform — never offered for idle/not-ready agents).
- Session states: idle → available → initiating (simulated) → active → ended.
- Supervisor may type a coaching note (simulated).
- Always states: "Simulated — real whisper requires the Call Manager integration path." No audio, no invented protocol.

### Whisper safety (non-negotiable)

- Eligibility = `monitor.view` + agent `talking` + healthy connection + not already whispering; revalidated at mutation time.
- Stale data → preserve rows, mark stale, **do not** present stale `talking` as confidently current, disable whisper if it cannot be safely validated.
- No false active state before the simulated connection confirms; call-ended during connect → no forced success.
- Call ends during whisper → whisper terminates, active state clears, concise feedback.
- Single whisper session (enforced); Stop Whisper obvious, immediate, keyboard-accessible, never hidden in overflow.
- Permission + call capability + tenant scope respected; backend remains authoritative.

## 8. Data architecture

- One feature-level data owner (`useAgentMonitoring()` deriving from `useDashboardData`). Consumers (summary, table, detail, whisper) never poll independently.
- Presentation components hold local display state (search/filter/sort, selected agent) — the pipeline owns domain data.
- Stable row identity = agent `id`.
- Duration timers tick only the timer cell (reuse `useStateTimer`); no full-table rerender per second.
- Live updates preserve search/filter/selection and open detail where sensible.

## 9. Phases

Each phase: implement → `npm run lint:check`, `npm run types:check`, `npm run build` (under `my-app/`) → browser verify affected routes (console errors included) → `git status`/`git diff` review → commit → push → verify on GitHub → output `READY FOR NEXT PHASE` or `BLOCKED`. Follow `12-quality-gates.md` (phase report format, test-failure rule, push rules). Never begin the next phase with untested/uncommitted/unpushed work.

| Phase | Deliverables | Commit |
|---|---|---|
| **1 Scaffold** | `domain/agent-monitoring.md`; `monitor.view` (union + admin + super-admin, not agent); `NAVIGATION` entry; route + page skeleton (header + empty state); update `01-product-model.md`, `02-navigation-model.md` | `feat(agent-monitoring): scaffold supervision surface and capability` |
| **2 Realtime orchestration** | Promote `LiveDataStatus` → `components/flex/flex-live-data-status.tsx` (dashboard import updated); `useAgentMonitoring()` on `useDashboardData` (join, summary counts, filters, stable ids); update `11-component-governance.md` | `feat(agent-monitoring): centralize realtime monitoring data` |
| **3 State summary** | `AgentStateSummary` — compact counts, canonical labels, loading, responsive reflow | `feat(agent-monitoring): add realtime workforce state summary` |
| **4 Toolbar & filters** | Search (name/ext), state + queue filters, clear/reset, filtered-empty, live-while-filtered | `feat(agent-monitoring): add monitoring search and filters` |
| **5 Table + duration** | ReUI data-grid: Agent, State, State Duration, Queue, Current Call (privacy), Calls Today, AHT; unknown-state fallback; responsive overflow | `feat(agent-monitoring): build realtime agent monitoring table` |
| **6 Detail sheet** | `FlexDetailSheet`: identity, state+duration, current call, performance (callsToday/AHT only), focus return, live-while-open | `feat(agent-monitoring): add contextual agent monitoring detail` |
| **7 Whisper eligibility** | `monitor.view` + agent `talking` + healthy connection + not already whispering; stale-data gating; no action on unavailable rows | `feat(agent-monitoring): enforce call whisper eligibility` |
| **8 Whisper initiation** | Preflight dialog (agent + call context + "customer does not hear you"), connecting state, duplicate-click guard, mock-adapter call, no false-success | `feat(agent-monitoring): add simulated whisper initiation` |
| **9 Active whisper control** | Unmistakable active banner (agent, elapsed, **Stop Whisper** visible), call-ended + disconnect cleanup, single-session rule, failure recovery | `feat(agent-monitoring): add active whisper control and termination` |
| **10 Feedback states** | Loading skeleton, no-agents, filtered-empty, stale (preserve rows), localized partial failure, error+retry | `feat(agent-monitoring): add resilient monitoring feedback states` |
| **11 Responsive + a11y** | Summary reflow, table overflow, full-width detail, whisper/Stop reachable on narrow, keyboard/focus, labels, reduced motion, restrained live regions | `fix(agent-monitoring): complete responsive and accessibility polish` |
| **12 Quality pass + release** | Fix wallboard label to canonical (Dashboard regression), `exemplars/agent-monitoring.md`, README/doc-tree + `09` + `agent-state` updates, screenshot set, final cross-route validation + git check + release note | `fix(agent-monitoring): resolve FLEX quality pass` + `fix(dashboard): canonicalize agent-state labels` |

## 10. QA matrices (apply per phase)

- **Functional:** route, shell, header, freshness; every agent state; unknown-state fallback; duration increment/reset/format; search/filters/clear/combined/filtered-empty; detail correctness/focus/live-update; whisper eligible/ineligible/permission/stale/start/connecting/active/stop/call-ends/error.
- **Realtime:** one pipeline; no duplicate pollers/listeners; cleanup on unmount; state changes render; selection stable; detail updates; stale truthful; no leaks after repeated navigation.
- **Whisper:** permission + tenant + active-call capability; deliberate initiation; correct agent; no false connected; active unmistakable; Stop visible; backend/mock authoritative; call-ended cleanup; error recovery; duplicate session prevented; keyboard accessible.
- **Visual:** agent state dominates performance; compact summary; dense table; no card-per-agent; FLEX tokens; no pulsing/flashing; whisper prominent only when active.
- **Accessibility:** heading; table semantics; filter labels; keyboard row access; detail focus trap + return; whisper accessible names; no color-only state; reduced motion; restrained live regions (announce only whisper connected/failed/ended + monitoring connection lost).
- **Responsive:** large desktop → mobile-ish; summary wraps; table scroll contained; Agent/State stay accessible; active whisper + Stop reachable.
- **Performance:** no full-table rerender per second; no per-row pollers; no per-component sockets; no expensive sort on timer tick.

## 11. Edge cases

- Unknown agent state → safe label + neutral styling, never map to Ready, no whisper.
- Agent disconnect → state updates, call clears on server truth, whisper eligibility clears, detail updates, active whisper terminates if required.
- Current-call privacy → preserve masking in table + detail; whisper eligibility derives from capability without exposing identity.
- Performance freshness slower than live state → do not mark the whole page stale; localize.
- Navigation away during whisper → mock terminates the session; no invented persistence.

## 12. Stop conditions

Stop and investigate if: real agent states unclear; whisper behavior/permission/tenant scope unclear; listeners duplicate; timers cause performance problems; whisper appears available when it shouldn't; privacy regresses; Dashboard regresses; scope expands into telephony redesign.

## 13. Release note (drafted)

```text
FLEX Agent Monitoring v0.1

Agent Monitoring (Supervision):
- new /admin/monitoring surface - realtime agent roster, state summary,
  search/filter/sort, per-agent detail sheet with live call context
- single realtime pipeline reused from the Dashboard (no duplicate polling)
- monitor.view capability for admin/super-admin; hidden from agent role
- canonical agent-state labels (incl. global wallboard label fix)

Call Whispering (Supervision, simulated):
- whisper intervention on a live call (agent in Talking state); supervisor
  coaching note; caller unaffected
- explicitly labeled simulated; real whisper requires the Call Manager
  integration path and backend telephony

Docs:
- domain/agent-monitoring.md, exemplars/agent-monitoring.md
- design docs updated in lockstep with their patterns
```

---

## 14. Next phase (after this release)

`AGENT_WORKSPACE_PLAN.md` — modernize the agent's operational surface (CRM integration boundary, Call Manager, Agent State Control, Incoming/Outbound/Active Call, Hold/Resume, Mute, Transfer, Call History, Wrap Up, media error states), preserving the CRM iframe boundary and the separate Call Manager. Do not begin until the final Agent Monitoring release commit exists on GitHub.
