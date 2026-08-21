# FLEX Operational Health Data Map — Increment A5

| Domain | Source | States |
|---|---|---|
| Telephony | `workspaceState.connection` (`live/stale/reconnecting/disconnected/error`) | Operational / Reconnecting / Unavailable |
| Social | `socialRepository` (no realtime at baseline) | Unknown (until transport) |
| Realtime | `DashboardProvider.connectionState` | Operational / Degraded / Reconnecting |
| Agent Assist | `isAssistEligible` + `ASSIST_PANEL_META` | Operational / Degraded |
| CRM iframe | `crm-integration-host` load/error | Operational / Unavailable |
| Build | `appVersion` / `build SHA` (diagnostics) | version only, gated |

Health center is role-restricted (`monitor.view`/`system.view`), uses real telemetry, never exposes secrets.
