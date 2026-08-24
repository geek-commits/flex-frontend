# FLEX Dashboard — Plane Pivot (Phase 05)

> **Hierarchy:** Metrics → Chart → Queues → Wallboard (single grouped metrics region, not per-metric cards).

* **Metrics:** `FlexMetricStrip` `gap-x-8 gap-y-4 border bg-card` with 4 `FlexMetricItem` (`Talking/Ready/Waiting/SLA` `flex-metric 18/24` + `flex-label 12/16 upper`) — one shared surface, trend red only `sla<90 && waiting>0`.
* **Chart:** `TRAFFIC_SERIES` `answered #0077E6 var(--flex-chart-bar)` / `missed destructive`, `animate=false` (no replay on 5s poll), `aspect 3/1`, `DashboardProvider` `5s poll / 30s stale / visibilitychange`.
* **Tables:** `queue-health` 6 cols, `active-calls` 6 cols, `wallboard` 8 cols — `DataGrid` `flex-table-grid` dividers, `align end` for duration/numeric, `FlexStatus` semantic only.
* **Responsive:** strip `flex-wrap`, `lg:grid-cols-2` queues/calls → scroll on mobile via `DataGridScrollArea`.

No metric drill links (informational only), no chart animation loop, no calculation change.
