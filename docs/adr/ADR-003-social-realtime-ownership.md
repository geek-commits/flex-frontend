# ADR-003 — Social Realtime Ownership (Superseded for external Social)

* Status: **Superseded 2026-08-28** — Social is external (`https://demo-chat.flex.co.tz` via `public/integrations/social-primary.json` embedded at `/agent/social` via `ExternalWorkspaceHost` `chrome="none"`). See `docs/architecture/FLEX_EXTERNAL_SYSTEM_OWNERSHIP.md`.
* Date: 2026-08-21 (original), updated 2026-08-28
* Deciders: Old-version parity plan §§30-35 + Customer 360 decoupling decision

## Context

Social Inbox was `SHIPPED (POC)` on a mock `socialRepository` (`features/social/social-repository.ts` + `data/social.mock.ts`). That POC is now **removed** from the production route. Canonical route `pages/agent/social.tsx` → `SocialIntegrationHost` → `ExternalWorkspaceHost` embeds the real external Social system. Native three-pane inbox (`SocialWorkspacePage`), `useSocialWorkspace()`, `socialRepository`, dedupe/identity, conversation components, composer, and `SocialChannelIcon` are deleted per reachability audit (no production route import; Customer 360 now uses minimal `features/customer-360/customer-360-social-mock.ts` POC boundary linking to `/agent/social`).

## Decision (current)

- **External Social owns:** UI, login/auth/session, conversation inbox/detail/composer, filters, realtime (messages, typing, delivery), data. FLEX must not reintroduce native realtime owner, polling, or duplicate subscriptions.
- **FLEX owns:** `ExternalWorkspaceHost` container/lifecycle (`relative min-h-0` → `absolute inset-0 block` full-bleed), config fetch (`/integrations/social-primary.json`), neutral `loaded` state, error/deferred state (`configuration-missing`/`unavailable` with retry/open-externally), `frameKey` only on config/retry (not on locale/sidebar/timer).
- **Customer 360:** POC social timeline events preserved via `features/customer-360/customer-360-social-mock.ts` (fields: id, participant, displayName, channel, lastActivityAt, latestPreview, route `/agent/social`) — no dependency on native `SocialConversation` model, no fake external API, no iframe scraping.

## Consequences

- No native Social polling/listeners to audit — external system handles reconnect, dedupe, ordering, pagination, read-state.
- FLEX must not: capture external credentials, modify cookies, proxy/inject HTML, add `allow-top-navigation`, or attempt CSP fix from React (child `frame-ancestors`).
- Remaining `frame-ancestors` block is `KNOWN EXTERNAL` until server phase; frontend composition is PASS.

## Verification

- `grep -r features/social` at `c6c0ebb` post-cleanup: only `social-integration-host.tsx` + `customer-360-social-mock.ts` remain production-reachable; `SocialWorkspacePage`/`useSocialWorkspace`/`socialRepository` gone.
- `bun run tests` — native social tests removed (12 files 127 tests); `shell-integrity` still PASS.
