# FLEX External System Ownership — CRM + Social

**Status:** Code-complete (frontend integration), server CSP DEFERRED
**Stage lock:** NO SERVER CHANGES / NO APACHE RELOAD / NO PRODUCTION DEPLOYMENT per plan §1

## Principle

FLEX owns the shell and embedding boundary. External systems own their UI/session/realtime/data.

| Concern | Owner | Notes |
|---------|-------|-------|
| FLEX shell (global header, left rail) | FLEX | `FlexAppShell`, `PrimaryRail`, `AppTopbar`, `AgentShell` |
| Agent state / Call Manager / Assist | FLEX | `features/agent-workspace/*` — safe call lifecycle, Assist call-scoped |
| CRM UI / auth / session / data / routing | **External CRM** | `https://demo-crm.flex.co.tz/login` via `public/integrations/crm-primary.json` |
| Social UI / auth / session / realtime / messages | **External Social** | `https://demo-chat.flex.co.tz/login` via `public/integrations/social-primary.json` |
| Iframe host / container / lifecycle / config / error-deferred | FLEX | `features/integrations/external-workspace-host.tsx` (`chrome="none"` full-bleed: relative min-h-0 → absolute inset-0 block) + `use-external-workspace-state.ts` (neutral loaded, frameKey only on config/retry) |

## Routes

- `/agent` → `AgentWorkspacePage` → `AgentShell` + `ExternalWorkspaceHost crm-primary.json chrome="none"` + `CallManager` right panel + `AgentAssistDock` — no duplicate Customer Workspace toolbar, iframe fills `flex-1 min-w-0 min-h-0 overflow-hidden` left of Call Manager.
- `/agent/social` → `SocialIntegrationHost` → `AgentShell` + `ExternalWorkspaceHost social-primary.json chrome="none"` — no native conversation list/detail/composer, no extra Call Manager panel, Dynamic Island remains continuity.

## Boundaries

- FLEX does NOT: recreate external login/forms/tables, style iframe DOM, inject CSS/JS, proxy HTML, scrape, handle external credentials/cookies, fix frame-ancestors from React (browser enforces child headers).
- External CSP currently blocks render (`frame-ancestors` violation) — honestly recorded as `BLOCKED — EXTERNAL CSP` until separate server phase (§79). Frontend composition is still PASS.

## Customer 360

POC timeline preserves `type=social` events via `features/customer-360/customer-360-social-mock.ts` (minimal fields: id, participant, displayName, channel, lastActivityAt, latestPreview, route `/agent/social`) — decoupled from native `features/social/*` which is removed. Customer 360 does NOT own Social realtime; links to `/agent/social` for actual system.

## Related

- `FLEX_STATE_OWNERSHIP_MAP.md` — updated to external Social/CRM ownership
- `ADR-003-social-realtime-ownership.md` — external Social owns realtime
- `FLEX_REALTIME_CHANNEL_AUDIT.md` — native Social realtime removed
