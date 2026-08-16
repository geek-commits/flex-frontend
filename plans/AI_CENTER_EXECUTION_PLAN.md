# FLEX AI CENTER / AI CAPABILITIES v1.0 — Consolidated Execution Plan

Governed by `/Users/air/Downloads/AI_CENTER_CAPABILITIES_PLAN.md` (227 sections). This is the consolidated ~8-phase execution plan, mirroring the Social precedent.

## Objective
Modernize the current static AI Center page into an **AI Operations workspace** under the Administration workspace, with a full sub-route IA (Overview, Knowledge Base, Agent Assist, Virtual Assistants, Usage & Costs, Providers & Models, Audit, Settings), each a POC-mock surface driven by a shared AI repository. All dead marketing literals are removed and replaced with honest empty/DEFERRED/configuration-required states.

## Preflight Audit (done)
- `pages/admin/ai.tsx` is a single self-contained static page. **No** `features/ai/`, no sub-routes, no data source/polling/repository.
- All numbers are hardcoded marketing literals: 342 sessions, 84.5% adoption, 1.24M tokens, $4.82 cost, 98.2% precision, 1,280 items, 4 vaults.
- "Refresh Stats" button is dead (no onClick).
- `AIFeatureStatus` enum EXISTS: `enabled | disabled | degraded | configuration-required` (`types/flex.ts:44`). Shared `aiFeatureStatusMap` + `StatusBadge` (`status-badge.tsx`, domain `ai`) — reuse, never duplicate.
- `ai.view` capability exists = super-admin ONLY (`capabilities.tsx:25,46,105`). Nav entry exists: `{ title: 'AI Center', href: '/admin/ai', icon: 'ai-center', capability: 'ai.view', workspace: 'admin' }`.
- Route exists: `Route::inertia('admin/ai', 'admin/ai')->name('admin.ai')` (`web.php:19`).
- Icons exist: `ai-center` (Bot), `ai-copilot` (AssistantAvatar), `knowledge-base` (RiBookOpenLine), `voice-assistants` (RiBrainLine), `ai-snapshot` (RiSparklingLine). NOTE: `ai-snapshot` = RiSparklingLine (sparkles) — check plan §112/§1959: NO sparkles/glow; replace the snapshot icon usage with a neutral icon, do not render sparkles.
- `AdminShell` supports `contextTitle` + `contextGroups` (ContextSidebar). CDR exemplar shows the sub-route IA pattern (`features/cdr/cdr-page.tsx:23-38`, `pages/admin/cdr-detail.tsx`).
- Parity: `AI-001…005` = `PARTIAL` / `CONFIRMED_FRONTEND` at `docs/product/FLEX_FEATURE_PARITY.md:276`.
- Agent Assist does NOT exist in the agent workspace; Voice AI is configuration-only; KB/Providers/Usage/Audit/Settings all absent.

## Hard Rules (from plan §222, §223, §110-113)
- Never invent AI runtime data, statuses, metrics, provider/model names, LLM pricing, token formulas, Search Precision calculations, Agent Assist suggestions, Voice AI bot builders, speech/voice config, model fallback controls.
- No purple AI theme / gradients / glow / sparkles / count-up animation.
- Runtime/backend is source of truth. Backend remains authoritative for permissions, tenant isolation, secrets.
- Do NOT create frontend-only feature toggles. Do NOT mark failed cost data as $0.00. Do NOT confuse Disabled with Error.
- Do NOT expose provider secrets. Safe AI text rendering (plain text, escaped).
- No AI suggested replies in Social (out of scope this phase).
- Preserve Agent Workspace / Call Manager / external CRM boundary.

## Architecture
```
my-app/resources/js/
  features/ai/
    ai-types.ts          # AISnapshot, AIFeatureStatusInfo, KnowledgeItem, KBVault,
                         # ProviderConfig, UsageRow, AuditRecord, AISettings
    ai-constants.ts      # AI_FEATURE_DEFS, AI_OVERVIEW_IA groups (context sidebar),
                         # provider/status constants
    ai-repository.ts     # POC singleton; getSnapshot/getFeatures/getKnowledge/
                         # getUsage/getProviders/getAudit/getSettings + mutations
    use-ai-center.ts     # React binding hook (snapshot + stable actions)
    ai-overview-page.tsx
    ai-knowledge-page.tsx
    ai-assist-page.tsx
    ai-voice-page.tsx
    ai-usage-page.tsx
    ai-providers-page.tsx
    ai-audit-page.tsx
    ai-settings-page.tsx
    components/          # shared: ai-feature-status-grid, ai-snapshot-metrics,
                         # kb-table, provider-table, usage-table, audit-table, etc.
  pages/admin/ai.tsx        -> routes to Overview (or redirect to /admin/ai/overview)
  pages/admin/ai/overview.tsx, knowledge.tsx, assist.tsx, voice.tsx,
                  usage.tsx, providers.tsx, audit.tsx, settings.tsx
  data/ai.mock.ts          # deterministic POC dataset
routes/web.php             # Route::inertia('admin/ai/...') entries
auth/capabilities.tsx      # sub-capabilities? (keep ai.view as guard; per-module capabilities)
```
All sub-pages use `AdminShell` with `contextTitle="AI Center"` + `contextGroups` listing the 8 IA items (the AI-operations context sidebar), mirroring CDR.

## Phase Map (consolidated from plan phases 2-26)
Phase gates identical to Social: IMPLEMENT → TEST → RUN → VISUAL/FUNCTIONAL VERIFY → FIX → RETEST → REVIEW GIT DIFF → COMMIT → PUSH → VERIFY GITHUB → NEXT.

| Phase | Scope | Plan refs |
|---|---|---|
| **P1** Route + IA shell | Add `/admin/ai/overview, knowledge, assist, voice, usage, providers, audit, settings` routes + page wrappers; keep `/admin/ai` → overview; `AdminShell` context sidebar (8 items) on every sub-page; nav `ai-center` stays. Verify each renders via AdminShell. | §174-176 |
| **P2** Types + mock + repository | `ai-types.ts`, `ai-constants.ts` (feature defs incl. only the 5 real statuses), `data/ai.mock.ts` (deterministic: statuses enabled/configuration-required, ZERO-cost/zero-token honest states, small KB dataset), `ai-repository.ts` (POC singleton, getSnapshot/getFeatures/getKnowledge/getUsage/getProviders/getAudit/getSettings + mutations like reindex/toggle-assist/test-connection), `use-ai-center.ts`. | §177, §29-46, §55-71, §72-77, §78-80, §81-84 |
| **P3** Overview page | Snapshot metrics (sessions, adoption, tokens, cost) driven from repo with honest `$0.00`/zero handling, not literals; feature status grid via existing `StatusBadge`; Knowledge coverage; "Live"/last-updated semantics; dead Refresh replaced with working refresh; exception-first layout; remove sparkles icon. | §8-28, §18-25, §47-54 |
| **P4** Knowledge Base workspace | Directory/list of KB vaults + items from mock; coverage stats; reindex action; empty/configuration-required states; safe text; tenant-isolation note. | §29-45, §89, §95-96 |
| **P5** Agent Assist + Voice AI | Agent Assist configuration surface (enablement, adoption, latency) — configuration-only, no invented suggestions; Voice AI as configuration-required surface (capabilities, telephony-safety note, status). Both honest/DEFERRED. | §46-54, §55-60 |
| **P6** Usage & Costs + Providers & Models | Usage/cost table with filters, honest zero/error; Providers & Models list + config forms (secrets masked, test-connection), safe secret handling. | §72-77, §64-71, §90, §91, §150 |
| **P7** Audit + Settings | AI Audit list (from mock); AI Settings (global vs tenant, feature toggles shown configuration-only, dependency graph note). | §78-80, §81-84, §158 |
| **P8** Feedback/responsive/a11y/security + parity + release QA | Feedback states (loading/empty/error/config-required); responsive (1440→360); a11y (landmarks, statuses text-readable, forms labeled, no color-only); security (no secrets, safe rendering); cross-feature regression (Agent Workspace/Call Manager/Social/tenants); final parity `AI-001…005` with real evidence; release QA. | §190-200, §201-218 |

## STOP conditions / DO NOT (summary)
If any of these are unclear, STOP and report:
- Can't prove an AI metric/status/feature is real → render honest empty/configuration-required, never a marketing literal.
- Agent Assist / Voice AI / Providers / KB have no backend runtime → POC-mock surfaces with DEFERRED/configuration-required states only.
- Never invent provider/model names, prices, token math, precision numbers, Assist suggestions, Voice AI builders.
- No purple theme, sparkles, glow, count-up. Reuse `--flex-*` tokens and existing `StatusBadge`.

## Success criteria
Each sub-route renders via the shared AdminShell AI context sidebar; every hardcoded literal is gone; existing `StatusBadge` reused; parity `AI-001…005` updated with actual evidence; all gates green; console clean; no secrets/glow/decoration; Agent Workspace + Social + tenants regression pass.