# FLEX Customer 360 — Data Audit (Increment A1)

> **Increment:** A1 — Customer 360 + Contextual Navigation
> **Rule:** aggregate *references* to real records; do not duplicate domain objects.

| Source | Domain | Store / endpoint | Customer identifier | Timestamp | Record id | Route destination | Permission | Tenant scope | Metadata | Realtime |
|---|---|---|---|---|---|---|---|---|---|---|
| CDR | `cdr` | `CdrRepository` (`data/cdr.mock.ts`, `domain/cdr-repository.ts`) | `customerPhone` (E.164) | `date` | `id` (`cdr-*`) | `/admin/cdr` (detail via search) | `cdr.view` | NOT tenant-scoped (mock) | queue, agent, duration, status, recording | none (poll if dashboard) |
| Social | `social` | `SocialRepository` (`data/social.mock.ts`, `features/social/social-repository.ts`) | `participant` (phone or `@handle`) → normalized `displayName` | `lastActivityAt` | `conversation.id` (`conv-*`) | `/agent/social` (conversation) | `social.view` | NOT tenant-scoped | channel (whatsapp/facebook/instagram), preview, unread/followUp/escalated |
| Missed Calls / Voicemail | `customer-recovery` | `RecoveryRepository` (`data/recovery.mock.ts`, `domain/recovery-repository.ts`) | `phoneNumber` | `createdAt` | `id` | `/agent/missed-calls` | `missed-calls.view` | NOT tenant-scoped | customerName, queue, category, attemptCount |
| Tasks | `external CRM` | `EXTERNAL CRM BOUNDARY` (iframe `crm-integration-host.tsx`) | external ID — **not resolvable locally** | — | — | CRM iframe | UNKNOWN | EXTERNAL | — | — |
| Campaign contacts | `campaigns` | `CampaignRepository` (`data/campaign-contacts.mock.ts`) | `phone` | — | contact id | `/admin/campaigns` | `campaigns.view` | NOT tenant-scoped | campaign association | none |

## Identity resolution

* **Primary:** normalized `E.164` phone (`+255 …`) — only identifier shared across CDR, Social (WhatsApp participant), and Recovery at runtime.
* **Fallback:** `displayName` exact match for Social handles where no phone exists (e.g. `@sarah.kitchen`). Marked as `resolution: name-fallback` and not merged across tenants.
* **Never** fuzzy-merge across tenants (§18) — Super Admin cross-tenant inspection only if runtime explicitly supports it (not at baseline).

## Decision

Increment A1 ships **phone-anchored** Customer 360 (timeline of CDR + Social + Recovery by normalized phone). CRM / campaign contacts are `UNKNOWN / EXTERNAL` and excluded from v1 — honest empty state `No activity yet` when only external sources would apply. Timeline type: `call | social | callback | voicemail`.
