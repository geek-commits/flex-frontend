# FLEX Supervisor Exception Data Audit — Increment A4

> Exceptions are deterministic, explainable, actionable — never speculative AI.

| Exception | Metric / source | Threshold | Owner | Refresh | Action |
|---|---|---|---|---|---|
| SLA risk | `queue-health` SLA + `queueHealth` from Dashboard | existing config (no invented threshold) | backend/config | 5s poll | `Open Queue` → `/admin/queues` |
| Long wait / backlog | `queueHealth callers waiting`, longest wait | `> 5 min` only if runtime/config provides | backend | 5s poll | `Open Monitoring` |
| Missed-call spike | `recoveryRepository.queryRecords` last hour count | `> 3× baseline` only if metric available | repository | 5s | `Open Missed Calls` |
| Campaign failure spike | `campaign.failureRate` | derived `failed/attempted` | `CampaignRepository` | on campaign load | `Open Campaign` |
| Realtime disconnect | `workspaceState.connection` / `DashboardProvider.connectionState` | `disconnected/reconnecting` | telephony owner | event | `Open diagnostics` |

If threshold has no authoritative source at runtime, the exception is **not shipped** (§66).
