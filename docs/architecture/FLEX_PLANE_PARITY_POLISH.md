# FLEX Plane Parity Polish — Phase 10

> **Responsive 1440/1280/1024/768/430/390/375/320 — no body overflow, no clipped dialogs, intentional table scroll.**

* **Desktop/Tablet/Mobile:** `PrimaryRail hidden md:flex w-16` + `ContextSidebar hidden md:flex w-56` → `Sheet w-64 left` hamburger at `md:hidden`; `AgentShell main p-4 pb-24 md:p-5 md:pb-5` + `CallManager fixed bottom 85dvh md:static w-80/96` keeps `End/Mute/Hold` above sheet at `390`; `DataGridScrollArea` intentional scroll for Monitoring/CDR/Queues/Tenants, body `overflow hidden` preserved.

* **Dark mode:** `canvas 0.982→0.147`, `surface white→0.21`, `layer hover subtle 0.985→muted 0.25`, `border 0.926→/10% strong /20%`, `text 0.29→0.985 secondary 0.42→0.80 tertiary 0.55→0.48`, `chart line #519DFA→0.62`, `status live 0.52→0.68` — all via `--flex-*` semantic, no literal `#333/#777` on dark.

* **A11y:** `Sheet` focus trap + `Escape` returns to trigger, `Tabs line Roles→Permissions role=tab`, `DataGridColumnHeader sortable aria-sort`, call controls `Mute/Unmute/Hold/Resume/Transfer/End aria-label + Tooltip right`, `GlobalSearch aria-label`, `flex-focus-visible ring-2 ring-offset-1` on `ghost icon-xs`, `Dialog max-w-lg/xl` at `320` not clipped.

* **Motion:** `hover 120 fast → useReducedMotion 0.01ms`, menus `animate-none!` quirk documented, sheets `200 overlay`, data `TrafficChart animate=false` (no replay on 5s poll), `Dynamic Island SNAP_SPRING 0.4 spring direct-manipulation` exception, island `scale 0.92` + `w-2/3` bar reduce to `0`.

No overlay collisions (safe zones `profile-tenant/call-manager` via `useSyncExternalStore + pathname`), no recurring entrance motion.

Verified: types:check, build 166 assets, vitest 20/20.
