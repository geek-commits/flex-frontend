# domain — Campaign State

Canonical campaign semantics for FLEX. Runtime type: `CampaignStatus` in `resources/js/types/flex.ts`; tone mapping in `features/campaigns/campaign-status.ts`; rows and actions in `features/campaigns/campaigns-columns.tsx`.

## Campaign statuses

| Runtime value | Display label | Semantic tone |
|---|---|---|
| `draft` | Draft | neutral |
| `scheduled` | Scheduled | info |
| `active` | Active | success |
| `paused` | Paused | warning |
| `completed` | Completed | neutral |

Only these five statuses exist in the runtime. Do not invent additional states.

## Campaign record (runtime fields)

```text
id, sn, title, destination, scheduleTime, status,
totalContacts, dialedCount, answeredCount
```

## Action matrix

Available row actions by status (runtime `campaigns-columns.tsx`):

| Action | Draft | Scheduled | Active | Paused | Completed |
|---|---|---|---|---|---|
| View | yes | yes | yes | yes | yes |
| Edit | yes | yes | yes | yes | yes |
| Pause | — | — | yes | — | — |
| Start (resume) | — | — | — | yes | — |
| Delete | yes | yes | yes | yes | yes |

- Pause/Start is offered only on the statuses where it applies (`active`/`paused`).
- While a status mutation is pending, the row's toggle is disabled (`statusBusyId`) — duplicates are prevented (see `10-admin-safety.md`).
- Delete is a destructive action with confirmation naming the campaign (see `04-interaction-rules.md`).

## Where shown

- Campaigns page (`features/campaigns/*`) — status badge via `FlexStatus`, progress (`CampaignProgress`), summary, detail sheet, create/edit form sheet.
- Future: campaign reporting.
