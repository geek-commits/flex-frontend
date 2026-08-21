# ADR-003 — Social Realtime Ownership

* Status: **Accepted — deferred transport** (Increment 1 baseline has no realtime transport)
* Date: 2026-08-21
* Deciders: FLEX Hardening plan §§7, 8, 26

## Context

Social Inbox is `SHIPPED (POC)` on a mock `socialRepository` (`features/social/social-repository.ts` + `data/social.mock.ts` — 5 conversations, channels whatsapp/facebook/instagram via `SOCIAL_CHANNELS`). React binding `useSocialWorkspace()` (`features/social/use-social-workspace.ts`) holds `SocialInboxData` via `useState(() => getInbox())` and synchronous actions `sendReply/setFollowUp/escalate` (+ `setData(getInbox())`). Baseline has **no polling, no SSE/WebSocket, no Pusher**, and inbox is NOT tenant-scoped. Manual §§20, 8 demand: message ID dedupe, ordering, pagination merge, read-state, reconnect, `Tenant A→B→A` isolation.

## Decision

**Single owner:** `socialRepository` singleton. Transport-agnostic contract:

```
owner:  socialRepository (session singleton)
binding: useSocialWorkspace() — stable action callbacks via useMemo
selectors: conversations, getMessages(conversationId), unreadCount, followUp/escalated
transport: pluggable adapter behind the same contract (mock → polling/SSE/WS)
persistence: none — no draft/message persistence beyond explicit product requirement
tenant scope: to be added via ADR-002 invalidator
```

When a real transport lands (Increment 3):

* `messageId` dedupe, ordering (server-timestamp canonical), pagination-merge, `read` reconciliation, `followUp/escalated` idempotency.
* `last-known-data` preserved during reconnect (`§8` rule — keep data visible, localize failure).
* Navigation `activeId` remains local `useState` in `SocialWorkspacePage` (correct locality; only promote if cross-route reuse proven).

Domain layout: `features/social/` (16 files) + `domain/`-compatible `social/` boundary if split proves useful (§26); prefer compatibility with `features/social/*` over a forced mega-store.

## Consequences

* No duplicate polling/listeners introduced in Increment 1 — Social has zero intervals at baseline (see `FLEX_REALTIME_CHANNEL_AUDIT.md`).
* Increment 3 reconnect tests: offline 5 s / 30 s, server reconnect, tenant-switch-while-reconnecting, route-change-during-reconnect.
* Primitive `SocialChannelIcon` stays canonical (`@assets/social/*.svg?react` via `vite-plugin-svgr`).

## Verification

* Grep `social` transports → zero `setInterval/EventSource/WebSocket` at baseline (confirmed).
* Vitest targets (Increment 2): `SocialChannelIcon` normalization, dedupe/ordering reducers, pagination merge, error normalization for `message_send_failed`.
