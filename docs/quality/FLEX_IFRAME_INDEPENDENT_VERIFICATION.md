# Independent Verification — External CRM + Social Iframe (Old-Version Parity)

**Verifier:** Independent (fresh, no commit trust)
**SHA:** `9c0e306` (post native Social cleanup + Customer 360 decoupling)
**Date:** 2026-08-28
**Mode:** Source + static gates + layout verification (no server/CSP deploy)

## Instruction

> Audit CRM and Social integration against old-version screenshots and plan §86. Do not trust commit messages. Verify route composition, iframe source, full-bleed sizing, absence of duplicate FLEX integration chrome, Social native-workspace removal, CRM Call Manager preservation, iframe lifecycle stability, regression safety. Distinguish FLEX-owned failures from external CSP blocking.

## Route Composition

- `/agent` → `my-app/resources/js/features/agent-workspace/agent-workspace-page.tsx:34` → `AgentShell` + `ExternalWorkspaceHost title="Customer Workspace" configPath="/integrations/crm-primary.json" chrome="none"` → Call Manager right panel `callManagerPanel={<CallManager/>}`: PASS
- `/agent/social` → `my-app/resources/js/pages/agent/social.tsx:12` → `SocialIntegrationHost` → `my-app/resources/js/features/social/social-integration-host.tsx:21` → `AgentShell` + `ExternalWorkspaceHost title="Social Inbox" configPath="/integrations/social-primary.json" chrome="none"` → no Call Manager panel (Dynamic Island continuity only): PASS
- Native `SocialWorkspacePage` at `my-app/resources/js/features/social/social-workspace-page.tsx:28` deleted: PASS (no production route import per grep `SocialWorkspacePage` 0 hits)

## Iframe Source & Security

- CRM `my-app/public/integrations/crm-primary.json:9` `https://demo-crm.flex.co.tz/login`, Social `social-primary.json:9` `https://demo-chat.flex.co.tz/login` — real external URLs, not mocks: PASS
- Sandbox `my-app/resources/js/features/integrations/external-workspace-host.tsx:87` `config?.iframeConfig?.sandbox` → `allow-same-origin allow-scripts allow-forms allow-popups` (json `10:5`): PASS, no `allow-top-navigation`
- Referrer `strict-origin-when-cross-origin` (`:89` fallback + json `11:5`): PASS, no proxy/DOM injection/CSP hack: PASS

## Full-Bleed Sizing (Old Screenshots Parity)

- Host `ExternalWorkspaceHostProps.chrome?:'full'|'none'='full'` `:11` + conditional toolbar `:14` hides `h-9` when `none`: PASS (CRM/Social both `none`)
- Root `flex h-full min-h-0 flex-col overflow-hidden` `:21`, viewport `relative flex min-h-0 flex-1 overflow-hidden` `:45` (was `min-h-[400px]`), iframe `absolute inset-0 block h-full w-full border-0` `:90`: PASS — matches §13-16 contract

## Duplicate Chrome Absence

- No extra Customer Workspace / Social Inbox FLEX title toolbar in `none` mode — toolbar conditional `:14`: PASS
- CRM fills `flex-1 min-w-0 min-h-0 overflow-hidden` left of Call Manager (`flex-app-shell.tsx:113` `rightPanel` `w-80 lg:w-96`); Social fills entire workspace: PASS

## Native Social Removal + Customer 360 Preservation

- Deleted 19 files: `social-workspace-page`, `use-social-workspace`, `social-repository`+tests, `social-dedupe`+tests, `social-identity`, `social-types`, `social-constants`, 8 conversation components+channel-icon, `data/social.mock.ts`: PASS
- Customer 360 preserves timeline: `my-app/resources/js/features/customer-360/customer-360-social-mock.ts:1` exports `CUSTOMER_360_SOCIAL_MOCK` (id/participant/displayName/channel/lastActivityAt/latestPreview) and `my-app/resources/js/features/customer-360/customer-360-repository.ts:3` now imports `getCustomer360SocialActivities` (decoupled, no `socialRepository`/`SocialConversation`): PASS — grep `socialRepository` 0 hits, `social-types` 0 hits, `pages/customers/show.tsx` still renders `type=social` with `route=/agent/social`: PASS

## Call Manager & Assist Preservation

- `agent-workspace-page.tsx:23` `callManagerPanel={<CallManager />}` + `assistPanel={<AgentAssistDock />}` + `flex-app-shell.tsx:113` `data-call-island-zone="call-manager"` right panel preserved; mobile bottom sheet `call-manager.tsx:155` preserved: PASS
- `ExternalWorkspaceHost` `unavailable` UI `my-app/resources/js/features/integrations/external-workspace-host.tsx:62` explicitly keeps telephony independent; `handleFrameLoad/Error` neutral `loaded` (`use-external-workspace-state.ts:50` frameKey only on config/retry, not locale/sidebar/timer): PASS

## Lifecycle Stability (§22-23)

- `frameKey` bumps only in `use-external-workspace-state.ts:41` `applyConfig` + `retry` (`:59`), not on rerenders: PASS
- No `onLoad` health false claim — neutral `loaded` vs `connected` alias preserved: PASS

## Quality Gates

- `bun run types:check` PASS, `lint:check` 0/0 PASS, `test` 12 files 127 PASS (was 14/134 before native deletion), `build` 174 assets PASS, `git diff --check` PASS: PASS

## CSP Classification (§25/§72)

- Real render currently `BLOCKED — EXTERNAL CSP` (`frame-ancestors` violation for both demo origins) — documented as `KNOWN EXTERNAL DEPENDENCY` (`docs/architecture/FLEX_EXTERNAL_SYSTEM_OWNERSHIP.md`), not FLEX integration failure: PASS

## Verdict

**CRM FRONTEND INTEGRATION PASS, OLD-VERSION COMPOSITION PASS, SOCIAL FRONTEND PASS, OLD-VERSION COMPOSITION PASS, NATIVE SOCIAL REPLACEMENT REMOVED, CUSTOMER 360 SOCIAL TIMELINE PRESERVED via decoupled mock, CALL MANAGER PRESERVED, ASSIST PRESERVED, EXTERNAL CONTENT BLOCKED — EXTERNAL CSP (deferred server phase), PRODUCTION DEPLOYMENT NOT STARTED**

