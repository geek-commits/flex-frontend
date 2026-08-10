# FLEX — Agent Monitoring + Call Whispering Plan

> Status: **pending sign-off — no implementation started**
>
> This is the roadmap for the Supervision workspace's next surface. It is fully grounded in the current POC runtime and the FLEX product-design operating system (`docs/design/`). Do not begin Phase 1 until the sign-off line at the bottom is confirmed.

## 1. Purpose

Build the **Agent Monitoring** surface (realtime supervision of agent availability and active calls) and the **Call Whispering** intervention (supervisor coaches an agent mid-call), as the next Supervision-workspace capability after the Contact Center Dashboard.

Both concepts are already named as canonical future surfaces in the design system:

- `docs/design/README.md:11` — "every future surface — Agent Monitoring, Call Whispering, Management Console …"
- `docs/design/01-product-model.md:58-60` — Supervisor core concepts include Agent Monitoring and Call Whispering.
- `docs/design/02-navigation-model.md:36` — the design-model Supervision group includes Agent Monitoring.
- `docs/design/09-realtime-data.md:3` — lists Agent Monitoring as a future realtime surface.
- `docs/design/domain/agent-state.md:51` — "Future: Agent Monitoring, Reports."

**Workspace:** Supervision. This is a Supervision surface living in the admin workspace — it is **not** a new role, a new shell, or a fourth product mode.

## 2. Runtime grounding (current facts)

Verified against the working tree:

- **No monitoring/whisper implementation exists.** No route, no page, no capability, no component. The only supervision surface is the Dashboard (`/dashboard`).
- **Capability registry** (`my-app/resources/js/auth/capabilities.tsx`): 16 capabilities, roles `super-admin | admin | agent`. Nothing named monitor/whisper/supervision. Supervision is currently gated by `dashboard.view`.
- **Realtime pipeline** (`my-app/resources/js/features/dashboard/dashboard-context.tsx`): client-side polling (`DASHBOARD_POLL_INTERVAL = 5_000`) against an in-memory mock adapter (`dashboard-data.ts`). No websockets/SSE. One provider per route, `isRefreshingRef` guard, `checkStale` at `STALE_THRESHOLD_MS = 30_000`, `document.hidden` pause, cleanup on unmount.
- **Data shapes** (`features/dashboard/dashboard-types.ts`): `AgentRosterEntry` (id, name, extension, queue, `state: AgentState`, callsToday, aht, stateSince), `ActiveCall` (customer, agent{id,name}, queue, direction, state, durationSeconds, startedAt), `QueueHealth`, `QueueSla`, `DailyCallVolume`. `AgentState` = `ready | talking | ringing | wrap-up | break | not-ready | offline`.
- **Join gap:** `AgentRosterEntry` and `ActiveCall` reference the same agent ids but have no declared join key. The monitoring view model must derive the join by agent id (the wallboard already pairs them visually).
- **No telephony/media anywhere.** `call-manager.tsx` is a local `useState` simulation (dial → ring → connect on timers). The iframe integration boundary is a mock (`public/mocks/integrations/crm-primary.json`, `hostBridge` declared but unconsumed). No `ws://`, no audio.
- **Context sidebar** on supervision surfaces shows two groups: `SUPERVISION Dashboard` and `OPERATIONS CDR · Campaigns · Reports`, capability-filtered (`context-sidebar.tsx`).

## 3. Scope

### In scope

1. A new Supervision route **Agent Monitoring** (`/admin/monitoring`) — realtime list of agents with state, state duration, queue, current call context, search/filter, sort, and per-agent detail.
2. **Call Whispering** — a simulated supervisor intervention on a live call: coach the agent, caller does not hear the supervisor. Explicitly labeled as simulation (no media path).
3. `monitor.view` capability + role wiring + navigation entry.
4. New domain doc (`domain/agent-monitoring.md`) and a new canonical exemplar (`exemplars/agent-monitoring.md`).
5. One justified primitive promotion: `LiveDataStatus` → `components/flex/flex-live-data-status.tsx` (second realtime consumer makes it a shared product-system rule per `11-component-governance.md`).

### Explicitly out of scope (do not build or claim)

- **No new role, no new shell.** Supervision stays in the admin workspace; `supervisor` is not added as a runtime role (per `domain/permission-model.md:35`).
- **No barge/join.** The manual names Agent Monitoring and Call Whispering only. Barge is not a defined FLEX concept here — do not invent it. If product later defines it, it is a separate design pass.
- **No real audio / telephony.** No `WebSocket`, no media streams, no `postMessage` protocol invented. Whisper is a simulated affordance, exactly as the Call Manager simulates dial/ring/connect.
- **No backend capabilities invented.** The capability registry is a UI-only mirror (per `README.md` and `permission-model.md`); the backend remains authoritative.
- **No route renames/moves.** `/admin/monitoring` is a new route; nothing existing is renamed (route stability, `02-navigation-model.md`).
- **No new polling.** The monitoring surface consumes the existing dashboard realtime pipeline (one data pipeline per domain, `09-realtime-data.md`).
- **No fixing pre-existing smells** (e.g., the two `AGENT_ROSTER` copies in `dashboard-data.ts` vs `data/agents.mock.ts`). Flagged, not fixed, this phase.
- **No websockets.** Polling remains the mechanism.

## 4. Product definition

### Agent Monitoring

A supervisor-facing realtime view answering: *what is every agent doing right now?* It extends the Dashboard's Agent Wallboard from a compact table into a full supervision surface:

- Realtime roster: name, extension, queue, state (canonical labels + tone via `FlexStatus`), state duration (ticking `useStateTimer`), current call context, calls today, AHT.
- Search by name/extension, filter by state and queue, sortable columns.
- Row → detail sheet (`FlexDetailSheet`): full identity, current state + duration, live call context (customer, queue, direction, call duration — joined from `activeCalls` by agent id), and the whisper intervention.
- Freshness surfaced via the shared live-data status (reuse the dashboard's pattern); reachable states per `07-feedback-states.md` (loading skeleton, empty, no-match, partial failure, error + retry).
- Supervisor attention order applies (`03-attention-hierarchy.md`): intervention opportunity ranks above trends/chrome; operational data is the page.

### Call Whispering

A supervisor coaches an agent during a live call; the supervisor hears the call, the agent hears the supervisor, the **caller does not**.

In the POC this is a **simulated** session, labeled as such everywhere it appears (mirroring the Call Manager's simulation honesty):

- Whisper is offered only when the target agent's state is `talking` (an action the runtime could perform — never offered for idle/not-ready agents).
- Session states: idle → available (agent talking) → initiating (simulated) → active → ended.
- The supervisor can type a coaching note (simulated message to the agent) during the active session.
- The surface always states "Simulated — real whisper requires the Call Manager integration path." No audio, no invented protocol.

## 5. Design decisions (fixed)

| Decision | Choice | Why |
|---|---|---|
| Workspace | Supervision, admin shell | Manual maps supervisor surfaces to the admin workspace (`01-product-model.md:27`); no new shell |
| Capability | `monitor.view` on `Capability`; granted to `super-admin` + `admin`, **not** `agent` | Follows existing noun-dot naming; no fourth role |
| Route | `Route::inertia('admin/monitoring', 'admin/agent-monitoring')` | New route, kebab path, mirrors CDR/Campaigns placement; label "Agent Monitoring" |
| Navigation | `NAVIGATION` entry `Agent Monitoring`, `/admin/monitoring`, `monitor.view`, workspace `admin` | Sidebar is capability-filtered; appears in the SUPERVISION group for admin/super-admin only |
| Data | Reuse `DashboardProvider` + `useDashboardData` on the monitoring route; join roster↔active calls by agent id | One pipeline per domain; no duplicate polling; no new mock adapter |
| Shared status | Promote `LiveDataStatus` → `components/flex/flex-live-data-status.tsx` (dashboard updates its import; no visual change) | Second realtime consumer satisfies the component decision test (`11-component-governance.md`) |
| Table | ReUI data-grid + search + state/queue filters + sort (proven in CDR/Campaigns) | Larger roster than the wallboard; reuse over a second hand-rolled table |
| Detail | `FlexDetailSheet` (proven in CDR/Campaigns) | Overlay decision model: contextual inspection → sheet (`04-interaction-rules.md`) |
| Intervention | Single action: **Whisper**; no barge, no monitor-as-action | Manual names only Agent Monitoring + Call Whispering; keep actions runtime-truthful |

## 6. Phases

Each phase ends with: verify affected route(s) in the browser (console errors included), run `npm run lint:check`, `npm run types:check`, `npm run build` (under `my-app/`), review `git status`/`git diff`, stage only intended files, commit, push, verify on GitHub, and output `READY FOR NEXT PHASE` or `BLOCKED`. Follow `12-quality-gates.md` (phase report format, test-failure rule, push rules).

### Phase 1 — Domain model + capability + navigation + route scaffold

- Write `docs/design/domain/agent-monitoring.md`: monitoring view model, whisper semantics, simulation-honesty rule, reachable states, where shown; cross-link `agent-state.md`/`call-state.md` (no duplicated state definitions).
- Add `monitor.view` to the `Capability` union; grant to `super-admin` + `admin` in `ROLE_CAPABILITIES`.
- Add the `Agent Monitoring` `NAVIGATION` entry.
- Add route `admin/monitoring` in `my-app/routes/web.php`; create `pages/admin/agent-monitoring.tsx` re-exporting a minimal `features/monitoring/agent-monitoring.tsx` (page header + empty feedback state only).
- Update `01-product-model.md` (supervision runtime evidence) and `02-navigation-model.md` (runtime supervision group gains Agent Monitoring).
- Verify: route renders; entry visible for admin/super-admin; **hidden for agent role** (permission QA).

### Phase 2 — Realtime monitoring surface

- Promote `LiveDataStatus` → `components/flex/flex-live-data-status.tsx`; update dashboard import; update `11-component-governance.md` primitive list (no visual change).
- Build `features/monitoring/agent-monitoring.tsx` on `DashboardProvider`/`useDashboardData`: data-grid roster (states via `FlexStatus` + `useStateTimer`), search, state/queue filters, sort, live-data status, loading/empty/no-match/partial/error+retry states.
- Write `docs/design/exemplars/agent-monitoring.md`.
- Verify: realtime QA (single pipeline — the page must mount exactly one `DashboardProvider`; no leaked timers; no overlapping refresh), functional QA across all reachable states, visual/responsive/accessibility QA.

### Phase 3 — Agent detail + whisper intervention affordance

- Row → `FlexDetailSheet`: identity, state + duration, live call context (joined from `activeCalls`), calls today/AHT; whisper action.
- Whisper affordance rules: offered only for `talking` agents; secondary-action hierarchy (`04-interaction-rules.md`); simulation label; focus return + list context preserved on close.
- Update `domain/agent-monitoring.md` (where shown, reachable states).
- Verify: functional + accessibility QA (keyboard open/close, focus return), permission QA.

### Phase 4 — Whisper session simulation + docs release

- Simulated whisper session UI: session states (idle → available → initiating → active → ended), coaching-note field, explicit "Simulated" labeling, no media/protocol invented.
- Update `docs/design/README.md` (doc tree index + release note; adjust the "future surfaces" phrasing), `09-realtime-data.md` (Agent Monitoring is now a current realtime surface), `domain/agent-state.md` (Where shown gains monitoring).
- Final cross-route validation (`/dashboard`, `/admin/monitoring`, `/admin/cdr`, `/admin/campaigns`, `/agent`), final git check, quality pass, release note.
- Verify: console-error sweep on all affected routes; no regression on the Dashboard (shared pipeline).

## 7. Acceptance criteria

- [ ] `Agent Monitoring` is a real page, not a placeholder; visible only to roles with `monitor.view`.
- [ ] Roster is realtime, single-pipeline (no duplicate polling), freshness explicit, stale ≠ error, no fake Live.
- [ ] States use canonical labels and tones (Ready, Talking (On Call), …) — the monitoring surface does **not** repeat the wallboard's raw-value-label discrepancy (`domain/agent-state.md:21`).
- [ ] Whisper is offered only for `talking` agents and is explicitly labeled simulated; no barge; no invented media path.
- [ ] Detail sheet preserves focus and list context; all feedback states reachable and accurate.
- [ ] `domain/agent-monitoring.md` and `exemplars/agent-monitoring.md` exist and match the built surface; design docs updated in the same commits as their patterns.
- [ ] `npm run lint:check`, `npm run types:check`, `npm run build` pass (or pre-existing failures documented per the test-failure rule); every commit pushed and verified.

## 8. Open questions (decision needed at sign-off)

1. **Route path:** `/admin/monitoring` (proposed) vs `/admin/agent-monitoring`. Route path and nav grouping are separate concerns; either is safe. Default: `/admin/monitoring`.
2. **Whisper scope:** POC ships the **simulated** affordance only. Real whisper requires the Call Manager integration path/backend telephony and is out of scope — confirm you accept that split.
3. **Barge/join:** not a defined FLEX concept in this repo and excluded. Confirm exclusion.

## 9. Release note (drafted)

```text
FLEX Agent Monitoring + Call Whispering v0.1

Agent Monitoring (Supervision):
- new /admin/monitoring surface - realtime agent roster, state filters, search,
  sort, per-agent detail sheet with live call context
- single realtime pipeline reused from the Dashboard (no duplicate polling)
- monitor.view capability for admin/super-admin; hidden from agent role

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

**SIGN-OFF:** _Awaiting user confirmation to begin Phase 1._
