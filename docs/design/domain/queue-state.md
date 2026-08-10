# domain — Queue State

Canonical queue semantics for FLEX. Runtime: `features/dashboard/dashboard-types.ts` (`QueueHealth`, `QueueSla`), `features/dashboard/constants.ts`, `features/dashboard/dashboard-data.ts`.

## Queues

Runtime queue set (`QUEUES` in `constants.ts`):

```text
Customer Support
Sales & Inquiries
Technical Escalations
```

## Queue health metrics (runtime fields)

Each `QueueHealth` entry:

| Field | Meaning |
|---|---|
| `queue` | Queue name |
| `waiting` | Calls currently waiting in queue |
| `longestWait` | Longest current wait (seconds) |
| `availableAgents` | Agents currently Ready in this queue |
| `totalAgents` | Agents assigned to this queue |
| `sla` | SLA performance percentage |

Related: `QueueSla` (`queue`, `withinSla`) for SLA trend display; operations summary aggregates queue/agent state counts.

## Health thresholds

- The only runtime SLA constant is `SLA_TARGET = 90` (`constants.ts`).
- **Semantic health must derive from actual configured thresholds/backend state — never invent thresholds.**
- The POC computes `availableAgents` from the roster (`state === 'ready'`) and jitters `waiting`/`longestWait`/`sla` in the mock adapter; production replaces the adapter behind the same shape.

## Unknown-state fallback

When queue data is unavailable (loading, stale, error), preserve the last known health values and surface the freshness state (see `data-freshness.md`). Do not render a queue as healthy or unhealthy based on absent data.

## Where shown

- Supervision Dashboard — Queue Health card, SLA summary, Operations Summary (`features/dashboard/*`).
- Future: Management Console queues, Reports.
