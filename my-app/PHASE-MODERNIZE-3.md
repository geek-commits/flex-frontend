# Modernization — Phase 3 Completion Report

## Scope
Entity detail pages (read-focused) for CDR + Campaigns, with drill-down, shared form sheet, and AlertDialog destructive actions.

## Changes
- **Routes**: `admin/cdr/{record}` → `admin/cdr-detail`, `admin/campaigns/{campaign}` → `admin/campaign-detail` (explicit closures passing the route param as a prop — `Route::inertia` does not forward params).
- **Repositories**: `CdrRepository.getById`; `CampaignRepository.getContacts`. New mocks: `data/cdr-events.mock.ts` (deterministic call timeline), `data/campaign-contacts.mock.ts` (12 contact rows/campaign).
- **CDR detail page** (`admin/cdr-detail.tsx`): entity header (customer, status token badge, queue/agent/duration/recording), mock recording player, call timeline (initiated → connected → ended/transferred/missed/voicemail), Download/Call Back/Export actions, BackLink, not-found state, Telephony context sidebar.
- **Campaign detail page** (`admin/campaign-detail.tsx`): header (title, StatusBadge, schedule, destination), progress bar, metric group (contacts/dialed/answered/answer rate), contacts table with status tones, actions (Pause/Start, Edit via shared sheet, Delete via AlertDialog), not-found state.
- **Shared components**: `BackLink`; `CampaignFormSheet` extracted from the grid page (form state lives inside `SheetContent` so Radix remounts it per open — seeds fresh each time, no set-state-in-effect). Used by both the grid and the detail page.
- **Drill-down**: CDR + Campaigns grids `onRowClick` + row "View" action → detail route. Action buttons `stopPropagation` so they don't trigger row navigation (bug fixed).
- **Delete**: migrated grid + detail to `AlertDialog` (proper `alertdialog` role) with destructive confirm.

## Verify
tsc 0 · build ok · Pest 39 pass · lint 0 · browser: CDR detail (timeline/player) renders; campaign detail (metrics/contacts) renders; grid row-click navigates; action buttons no longer navigate; Edit sheet pre-fills; New sheet empty; AlertDialog opens/acts.

## Status
READY FOR NEXT PHASE
