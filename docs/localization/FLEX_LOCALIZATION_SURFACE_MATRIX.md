# FLEX Localization Surface Matrix

**Source:** `FLEX_LIVE_UI_LOCALIZATION_COMPLETION_PLAN.md:3` — inventory every real route for Agent/Supervisor/Administrator/Super Admin.
**Branch:** `main` @ `e17d8fa8030440ba3f50fe2e9983b4a4d3152a3b` (2026-08-28)
**Runtime:** `i18n.changeLanguage` instant, no refresh; namespaces `common, navigation, auth, agent, assist, supervision, administration, platform, validation`; `en-GB/sw-TZ/fr-FR` formatters.
**Policy:** JSON key existence ≠ rendered. Verified via `grep -r useTranslation` (22 files, 353 hits) vs ~150 feature files.

## Legend
- ✅ Uses `useTranslation` + `t()` and reacts to `languageChanged`
- ⚠️ Partial (some keys via navigation/supervision but header/table/Head still hardcoded)
- ❌ Hardcoded English, 0 `t()` — will NOT switch
- `Head` = `<Head title>`; `A11y` includes `aria-label/title/placeholder`; `Toast` = `sonner`

## Matrix

| # | Route (URI) | Page / Feature | Roles | Header | Navigation | Metrics | Table | Chart | Form/Sheet | Dialog | Status/Badge | Toast | Empty | Error | Loading | A11y | Head title | Recording | Report/Export | Localized? |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `/` | `welcome` | Guest | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a | minimal | ❌ `Welcome` | n/a | n/a | ❌ |
| 2 | `/dashboard` | `admin/contact-center-dashboard` | Supervisor/Admin/Super | ✅ `supervision:dashboard.title` | ✅ | ✅ `supervision:dashboard.metrics.*` | ✅ `supervision:activeCalls/wallboard/queue` + ⚠️ `dashboard-wallboard-columns` | ✅ `supervision:dashboard.traffic.*` | n/a | n/a | ✅ `FlexLiveDataStatus` | n/a | ✅ | ✅ | ✅ | ✅ | ✅ `dashboard.title — Flex` | n/a | n/a | ✅ (full) |
| 3 | `admin/monitoring` | `admin/agent-monitoring` | Sup/Admin/Super | ❌ `Agent Monitoring` | ✅ rail | ❌ `AgentStateSummary` 5 states | ❌ `AgentMonitoringRoster` 8 cols | n/a | n/a | n/a | ❌ state badges | n/a | ❌ | ❌ | ❌ | ❌ `Search agents` | ❌ `Agent Monitoring — Flex` | n/a | n/a | ❌ |
| 4 | `admin/cdr` | `admin/cdr` | Sup/Admin/Super | ❌ `Call Detail Records (CDR)` | ✅ | n/a | ❌ `CdrTable` 6 cols | n/a | ❌ `CdrToolbar` filters | ❌ `CdrDetailSheet` | ❌ status | n/a | ❌ | ❌ | ❌ | ❌ | ❌ `CDR — Flex` | ⚠️ `No recording` | n/a | ❌ |
| 5 | `admin/cdr/{record}` | `admin/cdr-detail` | same | ❌ | ✅ | n/a | n/a (detail) | n/a | ❌ | ❌ | ❌ | n/a | n/a | ❌ | ❌ | minimal | ❌ `Call Detail ${id}` | ❌ | n/a | ❌ |
| 6 | `admin/campaigns` | `admin/campaigns` | Sup/Admin/Super | ❌ `Call Campaigns` | ✅ | ❌ `CampaignSummary` 3 KPIs | ❌ `CampaignsTable` | n/a (progress bar) | ❌ `CampaignFormSheet` | ❌ | ❌ `CampaignStatus` | ❌ sonner | ❌ | ❌ | ❌ | ❌ | ❌ `Call Campaigns — Flex` | n/a | n/a | ❌ |
| 7 | `admin/reports` | `admin/reports` | Sup/Admin/Super | ❌ `Reports & Analytics` | ✅ | n/a | ❌ `ScheduledReportsTable` | ❌ viewers (12) | ❌ `ReportFilterBar` | ❌ `ExecutionHistorySheet` | ❌ `ScheduleStatus` | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ `Reports & Analytics — Flex` | ✅ recordings viewer | ❌ `ReportExportMenu`/`ReportLibrary` | ❌ |
| 8 | `admin/system` | `admin/system` | Admin/Super | ❌ `System & Infrastructure` | ✅ | ❌ | ❌ | n/a | ❌ | n/a | ❌ | ❌ sonner | ❌ | ❌ | ❌ | ❌ | ❌ | n/a | n/a | ❌ |
| 9 | `admin/ai/*` (8) | `admin/ai/overview` etc | Admin/Super | ⚠️ dynamic via `ai-ia.ts` hardcoded titles | ✅ | ❌ `AiFeatureStatusGrid` | n/a | n/a | n/a | n/a | ❌ | n/a | ❌ | ❌ | ❌ | minimal | ⚠️ `${title} — Flex` hardcoded source | n/a | n/a | ❌ |
| 10 | `admin/users` | `admin/users` | Admin/Super | ❌ `Users` | ✅ | ❌ `UsersResultMeta` | ❌ `UsersTable` 6 cols | n/a | ❌ `UserFormSheet` | ❌ `UserLifecycleDialog` | ❌ `UserStatus` | ❌ sonner | ❌ | ❌ | ❌ | ❌ | ❌ `Users — Flex` | n/a | n/a | ❌ |
| 11 | `admin/roles` | `admin/roles` | Admin/Super | ❌ `Roles & Permissions` | ✅ | n/a | ❌ `RolesTable`+`PermissionsTable` | n/a | ❌ `RoleFormSheet` | ❌ | ❌ | ❌ sonner | ❌ | ❌ | ❌ | ❌ | ❌ | n/a | n/a | ❌ |
| 12 | `admin/queues` | `admin/queues` | Sup/Admin/Super | ❌ dynamic via `routing-shell` | ✅ | n/a | ❌ `QueueTable` | n/a | ❌ `QueueFormSheet`/`QueueMembersSheet` | ❌ `QueueDeleteDialog` | ❌ `RoutingStatus` | ❌ sonner | ❌ | ❌ | ❌ | ❌ | ⚠️ `${title} — Flex` | ❌ | n/a | ❌ |
| 13 | `admin/ivr` | `admin/ivr` | same | ❌ | ✅ | n/a | ❌ `IvrTable` | n/a | ❌ `IvrFormSheet` (Select recording) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ⚠️ dynamic | ✅ recording select | n/a | ❌ |
| 14 | `admin/time-groups` | `admin/time-groups` | same | ❌ `Time Groups` | ✅ | n/a | ❌ `TimeGroupTable` | n/a | ❌ `TimeGroupFormSheet`+`ScheduleEntryEditor` | ❌ | ❌ | ❌ sonner | ❌ | ❌ | ❌ | ❌ | ⚠️ | n/a | n/a | ❌ |
| 15 | `admin/time-conditions` | `admin/time-conditions` | same | ❌ `Time Conditions` | ✅ | n/a | ❌ `TimeConditionTable` | n/a | ❌ `TimeConditionFormSheet` | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ⚠️ | n/a | n/a | ❌ |
| 16 | `admin/recordings` | `admin/recordings` | same | ❌ `Call Recordings & Audio Prompts` | ✅ | ❌ 4 `FlexMetricItem` | ❌ `RecordingsTable` `Title & File/Category/Modified` | n/a | ❌ `RecordingFormSheet`/`DetailSheet` | ❌ `RecordingDeleteDialog` | n/a | ❌ sonner | ❌ `No audio recordings found` | ❌ `Couldn't load…` | ❌ | ❌ `Search audio titles…`/`Play/Pause` | ✅ `RecordingAudioPlayer` | n/a | ❌ |
| 17 | `admin/subscription` | `admin/subscription` | Admin/Super | ❌ `Subscription Management` | ✅ | ❌ `SubscriptionStatusBadge` | ❌ `SubscriptionsTable` 7 cols | n/a | n/a | ❌ `SubscriptionRenewDialog` | ❌ | ❌ sonner | ❌ | ❌ | ❌ | ❌ | ❌ `Subscriptions — Flex` | n/a | n/a | ❌ |
| 18 | `admin/mail-config` | `admin/mail-config` | Admin/Super | ❌ `Mail Configuration — Flex` | ✅ | ❌ `MailStatusBanner` | n/a | n/a | ❌ `MailConfigForm` | n/a | ❌ | ❌ sonner | n/a | ❌ | ❌ | ❌ | ❌ | n/a | n/a | ❌ |
| 19 | `admin/tenants` | `admin/tenants` | Super only | ❌ `Tenants` / `Manage tenant…` | ✅ + `TenantContextIndicator` | ❌ `TenantsResultMeta` | ❌ `TenantsTable` 5 cols | n/a | ❌ `TenantFormSheet` | ❌ `TenantStatusDialog` | ❌ `tenant-status` Active/Inactive | ❌ sonner | ❌ `No tenants yet` | ❌ `Couldn't load tenants` | ❌ | ❌ `Search tenants…` | ❌ `Tenants — Flex` | n/a | n/a | ❌ |
| 20 | `customers/{customer}` | `customers/show` | Auth (agent 360) | ❌ dynamic `${displayName} — Customer 360` | ✅ | n/a | n/a detail view | n/a | n/a | n/a | n/a | n/a | ❌ | ❌ | ❌ | minimal | ❌ | n/a | n/a | ❌ |
| 21 | `supervision/exceptions` | `supervision/exceptions` | Auth | ❌ `Exceptions — Flex` | ✅ | ❌ | ❌ | n/a | ❌ | n/a | ❌ | n/a | ❌ | ❌ | ❌ | n/a | ❌ | n/a | n/a | ❌ |
| 22 | `admin/health` | `admin/health` | Admin/Super | ❌ `Operational Health — Flex` | ✅ | ❌ | ❌ | ❌ | n/a | n/a | ❌ | n/a | ❌ | ❌ | ❌ | n/a | ❌ | n/a | ❌ | ❌ |
| 23 | `admin/settings` | `admin/settings` | Admin | ❌ `System Settings — Flex` | ✅ | n/a | n/a | n/a | ❌ placeholder | n/a | n/a | n/a | n/a | n/a | n/a | n/a | ❌ | n/a | n/a | ❌ |
| 24 | `admin/console` | `admin/management-console` | Sup/Admin/Super | ❌ `Management Console` | ✅ | n/a | ❌ `console-module-directory` | n/a | n/a | n/a | n/a | n/a | ❌ `No modules…` | n/a | n/a | ❌ `Search administrations…` | ❌ | n/a | n/a | ❌ |
| 25 | `agent` | `agent/index` → `AgentWorkspacePage` + `ExternalWorkspaceHost` CRM + `CallManager` + `AgentAssistDock` | Agent/Super | ✅ `AgentOperationalHeader` (state + ConnectionStatus) | ✅ rail | n/a | ❌ call history inside `IdleCallSurface` (direction/outcome) | n/a | ✅ Dialer `enterNumber` partially | ✅ Transfer | ✅ `AgentState`/`ConnectionStatus` | n/a | n/a | ⚠️ `External Host Unavailable` | ✅ `Loading integration…` | ✅ `Mute/Hold/End/Answer` + ⚠️ others | ✅ `Agent Workspace — Flex` via `agent:workspace`? hardcoded | ✅ via recovery path | n/a | ⚠️ |
| 26 | `agent/dashboard` | `agent/dashboard` | Agent/Super | ❌ `Agent Dashboard` (header not i18n) | ✅ rail | ❌ `QueuePressure`/`AgentStatus`/`DeferredSection` (some `agent:*` keys exist but not wired) | n/a | n/a | n/a | n/a | ❌ queue health | n/a | ❌ `No calls waiting` | ❌ | ❌ | minimal | ❌ `Agent Dashboard — Flex` | n/a | n/a | ❌ |
| 27 | `agent/social` | `agent/social` | Agent/Super | ❌ `Social Inbox` | ✅ rail | ❌ `SocialChannelFilter` counts | ❌ `ConversationList`/`MessageTimeline` | n/a | ❌ `SocialComposer` `Type a reply…` | ❌ `ConversationDetail` | ❌ `Follow-up/Escalated` | n/a | ❌ `No messages yet` | ❌ `Couldn't load this conversation` | ❌ | ❌ `Reply message/Send reply/Filter by channel` | ❌ `Social Inbox — Flex` | n/a | n/a | ❌ |
| 28 | `agent/missed-calls` | `agent/missed-calls` | Agent/Super | ❌ `Missed Calls & Voicemail — Flex` | ✅ rail | ❌ `RecoveryStatus` | ❌ `RecoveryTable` `Customer/Phone/Missed At/Queue/Status` | n/a | ❌ `CallbackAction` | ❌ `RecoveryDetailSheet` | ❌ | ❌ sonner? | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ `VoicemailPlayer` | n/a | ❌ |
| 29 | `agent/troubleshooting` | `agent/troubleshooting` | Agent/Super | ❌ `Troubleshooting — Flex` | ✅ rail | ❌ | ❌ | n/a | ❌ | n/a | ❌ | n/a | ❌ | ❌ | ❌ | n/a | ❌ | n/a | n/a | ❌ |
| 30 | `agent/support` | `agent/support` | Agent+Sup+Admin+Super | ❌ `Quick Support — Flex` | ✅ rail | n/a | n/a | n/a | ❌ support form | n/a | n/a | n/a | ❌ | ❌ | ❌ | n/a | ❌ | n/a | n/a | ❌ |
| 31 | `settings/profile|security|appearance` | `settings/*` | All auth | ❌ `Profile/Security/Appearance settings` | ✅ settings sidebar | n/a | n/a | n/a | ❌ forms | ❌ `DeleteUser`/`Passkeys`/`2FA` | n/a | n/a | n/a | ❌ validation | ❌ | ❌ | n/a | n/a | ❌ |
| 32 | `auth/*` (login/register/forgot/reset/verify/confirm/2fa)` | `auth/*` | Guest/Auth | n/a | n/a | n/a | n/a | n/a | ✅ `auth.json` fully | n/a | n/a | n/a | n/a | ✅ `validation.json` | ✅ `Confirming…` | ✅ `email@example.com`/`Password` | ✅ `confirmPassword.title` etc | n/a | n/a | ✅ |
| 33 | `admin/{module}` / `admin/settings/{module}` | `admin/module-placeholder` | Admin/Super | ❌ `${module.title ?? 'Module'} — Flex` + `Coming Soon` | ✅ | n/a | n/a | n/a | n/a | n/a | ❌ `FlexStatus Coming Soon` | n/a | ❌ | n/a | n/a | minimal | ❌ dynamic | n/a | n/a | ❌ |

## Hardcoded Literal Audit (sample counts, 2026-08-28 grep)
- `Head title` — 41 hits, only 5 use `t()` (auth + dashboard) → **36 hardcoded**
- `placeholder=` — 38 hits, ~30 hardcoded (only `idle-call-surface` uses `t()` fallback)
- `aria-label=` — ~85 hits, ~70 hardcoded
- `title="…"` (icon buttons) — ~60 hits, all hardcoded
- `toast.success|error|warning` — 58 hits across 14 files, **0 use `t()`**
- `FlexEmptyState title=` — 28 hits, 0 use `t()` except dashboard
- `FlexErrorState title/description=` — 18 hits, all hardcoded except `queue-health`
- `DataGridColumnHeader title=` — ~45 hits, only `dashboard-queue-columns` uses `tr()`

## Top-30 Hardcoded Files (0 `useTranslation`, most FLEX-owned literals)
1. `resources/js/features/tenants/tenants-page.tsx` (12 literals, Head hardcoded)
2. `resources/js/features/recordings/recordings-page.tsx` + `recordings-table.tsx`
3. `resources/js/features/cdr/cdr-page.tsx` + `cdr-columns.tsx` + `cdr-toolbar.tsx`
4. `resources/js/features/campaigns/campaigns-page.tsx` + `campaigns-table.tsx`
5. `resources/js/features/routing/queues/**`
6. `resources/js/features/routing/ivr/**`
7. `resources/js/features/routing/time-groups/**`
8. `resources/js/features/routing/time-conditions/**`
9. `resources/js/features/subscriptions/**`
10. `resources/js/features/access-management/users/**`
11. `resources/js/features/access-management/roles/**`
12. `resources/js/features/reports/reports-page.tsx` + `report-export-menu.tsx` + viewers (12)
13. `resources/js/features/agent-monitoring/**` (headers `Agent/Ext./Queue/State/State Time/Current Call/Calls Today/AHT`)
14. `resources/js/features/customer-recovery/**`
15. `resources/js/features/social/**` (`Type a reply…`, `Follow-up/Escalated`, `No messages yet`)
16. `resources/js/features/agent-dashboard/**` (`QueuePressure` empty states)
17. `resources/js/features/dashboard/**` residual (`Failed to load active calls`, `No active calls`)
18. `resources/js/features/management-console/**`
19. `resources/js/features/mail-config/**`
20. `resources/js/features/system/**` + `pages/admin/system.tsx`
21. `resources/js/features/integrations/external-workspace-host.tsx` (partially `t()` but fallbacks hardcoded)
22. `resources/js/features/agent-workspace/call-manager/**` (`Wrap Up`, `Transfer`, etc.)
23. `resources/js/pages/admin/*` + `pages/agent/*` + `pages/settings/*` (all `<Head>` hardcoded)
24. `resources/js/components/flex/app-topbar.tsx` + `primary-rail.tsx` fallback literals
25. `resources/js/features/recordings/recording-detail-sheet.tsx` + `recording-form-sheet.tsx` + `recording-delete-dialog.tsx`
26. `resources/js/features/tenants/tenant-*.tsx` (columns/toolbar/sheets/dialog)
27. `resources/js/features/support/**` + `features/ai/**` + `features/diagnostics/**`
28. `resources/js/pages/dev/brand-preview.tsx`
29. `resources/js/pages/customers/show.tsx` + `pages/supervision/exceptions.tsx`
30. `resources/js/features/cdr/cdr-detail-sheet.tsx` etc.

## Translation JSON vs Rendered
- JSON parity enforced by `resources/js/i18n/__tests__/translation-completeness.test.ts` (393 lines across 9 namespaces). Keys exist (e.g., `supervision:cdr.title`, `navigation:items.tenantManagement`) but **~85% of feature files never import `useTranslation`** — locale switch leaves them English. Only 22 files consume `t()`. **Necessary but not sufficient — grep `t(` ≠ rendered coverage.**

## Allowlist (runtime data, must NOT translate)
Brand/technical: `FLEX`, `CDR`, `IVR`, `SIP`, `API`, `SMTP`, `URI`, `URL`, `UUID`. Tenant/customer names, phone numbers, IDs, durations `hh:mm:ss`, dates/numbers (formatted via `i18n/formatters.ts` `en-GB/sw-TZ/fr-FR`).

## Next (per FLEX_LIVE_UI_LOCALIZATION_COMPLETION_PLAN.md)
1. Wire `useTranslation('administration'|'platform'|'supervision'|'common')` into top-30 files; replace `Head title`, column `title`, `placeholder`, `aria-label`, `toast`, `empty/error/loading`.
2. Add missing keys (e.g., `administration:recordings.*`, `common:media.*`) — professional Kiswahili/Français via glossary.
3. Playwright `EN→SW→FR→EN` no-refresh sweep; assert tables/headers/chrome translate, data values stable, no iframe reload.
