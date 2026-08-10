# Exemplar — Call Campaigns

Route: `/admin/campaigns` · `features/campaigns/*` · page `pages/admin/campaigns.tsx`

## What this page proves

- **Lifecycle status** — a real status model (`draft | scheduled | active | paused | completed`) rendered through `FlexStatus` with per-status tone mapping (`campaign-status.ts`); statuses are canonical, not invented per page.
- **Progress** — `CampaignProgress` shows dialed/answered against total contacts without count-up animation (`05-motion.md`).
- **Compact summary** — `CampaignSummary` gives the operational totals at a glance; metrics support, they do not headline.
- **Contextual actions** — row actions are minimal: View, Edit, and Pause/Start only where the status allows (`domain/campaign-state.md` action matrix); the rest of the hierarchy is enforced by status, not by a cluster of every action.
- **Destructive safety** — Delete is separated, names the campaign, and requires confirmation; pending mutations disable duplicate submit (`10-admin-safety.md`).
- **Detail inspection** — rows open a detail sheet; create/edit runs in a form sheet; the sheet handles the focused task.

## Patterns to reuse

- Status-driven action availability (action matrix per status);
- pending-mutation guard (`statusBusyId`) to prevent double actions;
- sheet-based detail and edit with focus return (`04-interaction-rules.md`);
- canonical campaign vocabulary (`06-copy-language.md`).

## What not to copy blindly

- Campaign-specific columns and filters;
- the POC's mock repository boundary — replace the adapter behind the same interface rather than copying campaign code for another domain.
