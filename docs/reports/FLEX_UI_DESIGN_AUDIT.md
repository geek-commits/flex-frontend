# FLEX production UI design audit

Date: 2026-09-22
Scope: production-facing routes in `my-app/routes/web.php`
Method: UI-design heuristics plus `docs/design/` operating system

## Audit lens

Each route was reviewed for the user's likely question, answer-bearing signal,
structural edges, density differentiation, state visibility, and attention order.
The runtime remains authoritative: this audit does not invent states, permissions,
thresholds, tenant behavior, or backend capabilities.

## Findings by surface

| Surface | Workspace | Finding | Priority |
| --- | --- | --- | --- |
| Contact Center Dashboard | Supervision | Exception-first status band is the correct hierarchy; preserve and verify responsive density. | Verify |
| Agent Monitoring | Supervision | Workbench is strong; freshness, state summary, and roster can read as one operational surface. | Medium |
| Exceptions | Supervision | Generic card-wrapped empty state weakens the exception-oriented task. | High |
| CDR list | Supervision | Canonical operational table exemplar. | None |
| CDR detail | Supervision | Nested cards and mini-metric tiles dilute the record hierarchy. | High |
| Campaigns list | Supervision | Canonical lifecycle/workbench exemplar. | None |
| Campaign detail | Supervision | Detail card, metrics, and contacts table compete for prominence. | High |
| Reports / Scheduled Reports | Supervision | Strong library/workbench patterns; unify remaining internal table edges. | Medium |
| Management Console | Administration | Grouped directory and search model are aligned with the navigation system. | None |
| AI Center (all subroutes) | Administration | Repeated card frames and uppercase micro-headings make configuration and status harder to scan. | High |
| Users | Administration | Canonical workbench, filters, empty states, and sheets are strong. | None |
| Roles & Permissions | Administration | Tabs are valid; nested permission tables need flatter hierarchy. | Medium |
| Queues / IVR / Time Groups / Time Conditions | Administration | Repeated older search → table composition bypasses the canonical workbench toolbar. | High |
| Recordings | Administration | Strong metric/workbench composition; verify audio actions and density. | Low |
| Subscriptions | Administration | Workbench is strong; status notice and toolbar are visually detached. | Medium |
| Mail Configuration | Administration | Form, test actions, and status compete instead of following configuration → impact → action. | High |
| System / Health | Administration | Repeated cards and generic status rows weaken operational scanning. | High |
| Tenants | Platform | Strong workbench and explicit tenant context treatment. | Low |
| Agent Dashboard | Agent | Availability and queue pressure are right; deferred backend-dependent sections are too equal. | High |
| Agent Workspace / Social / Callback & Voicemail | Agent | Canonical call-scoped and workbench patterns; preserve integration boundaries. | None / Low |
| Troubleshooting / Support | Agent | Card-heavy layouts compete with the primary diagnostic or support action. | High |
| Customer 360 | Agent / CRM boundary | Timeline is useful but card-wrapped and visually flat. | Medium |
| Profile / Security / Appearance | Shared settings | Existing `SettingsCard` structure is appropriate; verify form hierarchy only. | Low |

Auth, welcome, and dev-only preview surfaces are intentionally outside this
implementation pass.

## Implemented quick win

The dashboard's operational exception and freshness signals are grouped into a
single bounded status strip, with exceptions first and live freshness as supporting
metadata. This preserves runtime behavior while making the supervisor scan path
explicit.

## Next implementation targets

1. Migrate the four routing directories to `FlexWorkbenchShell` +
   `FlexDataWorkspaceToolbar`, removing table-owned outer frames.
2. Flatten AI, System, Health, Mail Configuration, and detail-page card nesting.
3. Quiet deferred Agent Dashboard sections and clarify Troubleshooting, Support,
   and Customer 360 hierarchy.
