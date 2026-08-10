# Modernization — Phase 1 & 2 Completion Report

## Phase 1 — Design Foundation

### Scope
One radius/token/status language across primitives and pages; install chart/alert-dialog/combobox.

### Changes
- **Radius normalization** (enterprise language): `button` `rounded-4xl→rounded-md`; `input`/`textarea` `rounded-3xl/2xl→rounded-md`; `select` trigger `rounded-3xl→rounded-md`, content `→rounded-lg`, items `→rounded-md`; `card` `rounded-xl→rounded-lg`; `dialog` `rounded-4xl→rounded-xl`; `popover` `rounded-3xl→rounded-xl`; `skeleton` `rounded-2xl→rounded-md`; `tooltip` `rounded-xl→rounded-md`; `command` dialog/items `rounded-4xl/3xl→rounded-xl/lg`; `dropdown-menu` content/items `→rounded-xl/md`; ReUI `alert` `→rounded-lg`.
- **Status-token consolidation**: rewrote `lib/status-styles.ts` — connection/campaign/ai maps now use `--status-*` semantic tokens (no raw emerald/amber/rose + `dark:`); removed `animate-ping/bounce` dots; added exported `statusToneClasses` + `StatusTone`. Migrated inline raw badges to tokens across CDR, reports, system, ai, dashboard, troubleshooting, missed-calls, support, diagnostic-panel, metric-card, call-manager, app-topbar, flex-data-table, settings/auth success messages.
- **Semantic avatar/success/controls**: avatar fallback `neutral-200` → `bg-muted text-muted-foreground` (user-info, app-header); `text-green-600` → `text-status-live`; app-header active styles → sidebar-accent, underline → `bg-primary`; nav-footer → muted tokens; appearance-tabs rebuilt (remixicon icons + `role="radiogroup"/"radio"` ARIA + tokens); call-manager "Initiate Call" green → `bg-primary`.
- **Installed primitives** (declined overwrites to preserve radius edits): `chart` (recharts@3.8.0), `alert-dialog`, `combobox` (Base UI; IconPlaceholder resolved to remixicon).

### Verify
tsc 0 · build ok · Pest 39 pass · lint 0 on touched files · browser smoke (CDR badges, appearance radios, no console errors).

## Phase 2 — Shell + Navigation Honesty

### Scope
`/` redirect + minimal public page; settings sidebar restyle; dead-link placeholders.

### Changes
- **`/` redirect**: new `app/Http/Controllers/HomeController` — authenticated → `route('dashboard')`; guests → minimal `welcome` (Flex logo, tagline, Log in/Register). Rebuilt `welcome.tsx` from the stock Laravel hex page to token-based minimal hero. Deleted orphan `pages/dashboard.tsx`.
- **Settings sidebar restyle** (kept shadcn Sidebar): `app-sidebar.tsx` → Flex logo + remixicon Flex module links (Dashboard, CDR, Campaigns, Agent Workspace); removed starter repo/docs footer links + orphan `nav-footer.tsx`; header padding normalized; `NavMain` optional label; `SettingsLayout` inner nav active state → `bg-primary/10 text-primary`.
- **Placeholders**: new `domain/modules.ts` catalog (CONSOLE_MODULES + SETTINGS_MODULES + MODULE_INDEX by href, with capabilities); wildcard routes `admin/{module}` + `admin/settings/{module}` → `admin/module-placeholder` page (capability-gated "coming soon"/"not found" empty states + back CTA). `management-console.tsx` + `settings.tsx` now render from the catalog (single source; no more 404 links).

### Verify
tsc 0 · build ok · Pest 39 pass · lint 0 · browser: `/` redirects to dashboard when authed, `/admin/queues` + `/admin/settings/moh` render placeholders, console/settings directories render from catalog, no console errors.

## Status
READY FOR NEXT PHASE
