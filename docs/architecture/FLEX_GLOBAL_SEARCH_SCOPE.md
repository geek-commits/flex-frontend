# FLEX Global Search Scope — Increment A3

> `Cmd+K` Command Center, permission + tenant filtered, debounced/cancelled, no bypass.

| Domain | Source | Permission | Tenant scope |
|---|---|---|---|
| Navigation | `NAVIGATION` + `CONSOLE_MODULES` | `has(capability)` | current tenant only |
| CDR | `CDR_MOCK_RECORDS` (→ `CdrRepository`) | `cdr.view` | NOT tenant-scoped (mock) |
| Campaigns | `CAMPAIGN_MOCK_RECORDS` | `campaigns.view` | NOT tenant-scoped |
| Customers | `resolveCustomerTimeline` phone index (CDR + Recovery) | `cdr.view`/`missed-calls.view` | NOT tenant-scoped |
| Agents | `AGENT_MOCK_ROSTER` | `monitor.view` | NOT tenant-scoped |

Implementation: `components/flex/global-search.tsx` (CommandDialog, Ctrl+K, arrow/enter/escape, recent items safe ids). Search debounce via existing `matches()`; cancellation via React state. No action bypass — commands invoke `router.visit(href)` under same `has()` gate.
