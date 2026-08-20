# Motion transitions audit

Result of running `transitions review` + `transitions refine` (transitions.dev skill) against the FLEX frontend, mapped onto FLEX's canonical motion tokens.

## Method

- Scanned `resources/js` + `resources/css` for motion indicators: `transition:`/`animation:` declarations, `@keyframes`, hardcoded `ms`/`s` durations, Tailwind `duration-*` utilities, tw-animate data-state utilities, `blur`/`scale`/`translate`, and components matching transitions.dev decision rules.
- Mapped each finding to FLEX semantics (`docs/design/05-motion.md`), not to the skill's stock defaults.
- Review-only. No edits in this pass.

## FLEX canonical tokens (authority)

```css
--flex-duration-fast:   120ms;  /* hover/emphasis, button/selection */
--flex-duration-default: 150ms; /* menu / popover (140–180ms) */
--flex-duration-overlay: 200ms; /* sheet / dialog (180–220ms) */
--flex-ease: cubic-bezier(0.4, 0, 0.2, 1);
```

Existing convention note: `ln`/`n` identifier alias is intentionally preserved; cleanup is out of scope.

## Findings

| File | Component | Current motion | Suggested transition | Reason | FLEX adaptation | Decision |
|---|---|---|---|---|---|---|
| `components/ui/dropdown-menu.tsx` | Menu / dropdown (profile, tenant, context) | `duration-100`, `data-open:animate-in fade-in-0 zoom-in-95`, `data-closed:fade-out-0 zoom-out-95`, per-side `slide-in-from-*`, `origin-(--transform-origin)`, `before:backdrop-blur-2xl before:backdrop-saturate-150` | menu-dropdown (`05`) | Origin-aware dropdown grows from trigger; close faster than open | Keep origin-aware fade + zoom-0.95; drop `backdrop-blur-2xl` (blur → 0–1px per blur-sparing); open `--flex-duration-default`, close `--flex-duration-fast` | **ADOPT (pilot)** |
| `features/agent-workspace/call-manager/active-call-surface.tsx` | Mute ↔ Unmute, Hold ↔ Resume icon controls | static icon swap on state | icon-swap (`09`) | Two icons in the same slot | 120–150ms opacity + scale 0.90–0.95→1; blur 0–1px; presentation-only — command fires immediately, animation only reflects state | **ADOPT (pilot)** |
| `pages/admin/cdr-detail.tsx` | Voicemail Play ↔ Pause | `playing ? lnLine : lnFill` swap | icon-swap (`09`) | Real `playing` state exists; two icons in same slot | Same as above; no fake playback state | **ADOPT (pilot)** |
| `features/social/social-workspace-page.tsx` | Social mobile Inbox ↔ Conversation | hard switch via `activeId`/`onBack` | page-side-by-side (`08`) | List ↔ detail directional continuity | 180–220ms, 6–8px directional, subtle opacity; **no animation on initial hydration**; desktop split panes stay stable; scroll preserved | **ADOPT (pilot)** |
| `components/ui/dialog.tsx`, `alert-dialog.tsx` | Modal / confirm dialogs | `duration-100` | modal (`06`) | Centered dialog; scale-up open, softer close | `--flex-duration-overlay` (200ms open) / `default` (150ms close); blur 0–1px | Defer (documented) |
| `components/ui/sheet.tsx` | Sheet drawer | `data-open:duration-500` / `data-closed:duration-300` | panel-reveal / modal | Over-range by ~2.5× vs FLEX overlay | `--flex-duration-overlay` (200ms) | Defer (flag over-range) |
| `components/ui/select.tsx`, `popover.tsx`, `combobox.tsx` | Menu / popover surfaces | `duration-100` | menu-dropdown (`05`) | Menu family | `--flex-duration-default` (150ms) | Defer (align with dropdown once pilot lands) |
| `components/ui/navigation-menu.tsx` | Nav menu | `duration-300`/`duration-200`, zoom-in/out | menu-dropdown (`05`) | Menu | `--flex-duration-default` (150ms) | Defer (documented) |
| `components/ui/tooltip.tsx` | Tooltip | tw-animate slide-in-from | tooltip (`17`) | Dense icon controls | fast + subtle, minimal scale | Defer (documented) |
| `components/ui/sidebar.tsx` | Sidebar rail | `duration-200`, data-state open/closed | panel-reveal | Expand/collapse | `--flex-duration-overlay` (200ms) — already aligned | Defer |
| `pages/settings/profile.tsx`, `pages/auth/two-factor-challenge.tsx` | Page surfaces | `duration-300` | — | Over-range vs FLEX overlay | `--flex-duration-overlay` (200ms) | Defer (flag over-range) |
| `components/ui/input-otp.tsx` | OTP input | `duration-1000` | — | Caret/blink, not a UI transition | Leave as-is | Out of scope |

## Rejected for FLEX (operational UI)

Per `docs/design/05-motion.md` and the transitions.dev priority matrix (§21): number pop-in, spinning counter, shimmer text, card hover tilt, avatar hover bounce, like button, decorative text reveal, plus-to-menu morph. None apply to operational tables, live KPIs, telephony, or status indicators.

## Priority

1. Dropdown blur/scale/timing (shared primitive — one fix covers profile, tenant, context menus)
2. Telephony icon swaps (Mute/Hold, Voicemail Play/Pause) — presentation-only
3. Social mobile list ↔ detail

Deferred to a later pass: sheet/dialog/modal timing, select/popover/nav-menu alignment, tooltip tuning.

## Phase 2 outcome (pilots shipped)

All three ADOPT pilots landed and were verified in-browser (mobile viewport, reduced-motion, console clean).

| Pilot | Change | Commits | Verified |
|---|---|---|---|
| Dropdown | Removed `backdrop-blur-2xl`/`backdrop-saturate-150` → solid `bg-popover`; open `duration-[var(--flex-duration-default)]`, close `duration-[var(--flex-duration-fast)]`. Also fixed a pre-existing Base UI crash (error #31: `MenuGroupContext is missing` — `user-menu-content.tsx` rendered `DropdownMenuLabel` outside any `DropdownMenuGroup`; wrapped in a Group) | `2bf1afe`, `af4def6` | Opens without crash, closes cleanly, `backdropFilter:none`, solid surface |
| Telephony icon swaps | `active-call-surface.tsx` Mute/Hold + `cdr-detail.tsx` Voicemail Play/Pause use keyed `motion.span` crossfade (opacity 0→1, scale 0.92→1, 0.15s, reduced-motion→0). Presentation-only; command fires immediately | `4beb635` | Icon animates 0.92→1.0 frames; no errors |
| Social mobile list ↔ detail | `social-workspace-page.tsx` wraps the `lg:hidden` block in `AnimatePresence initial={false} mode="wait"`: detail enters from right (x+8), list returns from left (x−8), 0.2s easeOut, `useReducedMotion`→0. Desktop split panes untouched | `46b5da7` | List→detail slides; back reverses; reduced-motion instant; no hydration animation |

`motion/react` was already a runtime dependency; no new dependency was added.

### New findings (discovered during pilots — apply to future motion work)

1. **`--duration-flex-*` theme tokens do not generate utilities** in Tailwind 4.3.3 (`resources/css/app.css` `@theme inline`). Built CSS contains zero `duration-flex`, so existing `duration-flex-fast` usages (primary rail, cdr toolbar, etc.) silently fall back to the browser default — a latent app-wide issue. **Use the proven arbitrary form `duration-[var(--flex-duration-*)]`** (as in `social-channel-filter.tsx`, `conversation-row.tsx`, and the dropdown fix above).
2. **`animate-none!` defeats tw-animate enter/exit.** `components/ui/dropdown-menu.tsx`'s class list ends with `animate-none!` (important), which cancels the `data-open:animate-in` / `data-closed:animate-out` — the dropdown enter/exit animation never ran (pre-existing). Left in place (risky with base-ui Positioner); the token-correct durations are in but currently no-op for the animation itself.

### Phase 2 gate (re-audit)

No new ADOPT candidates surfaced during pilots. Deferred set (sheet/dialog/modal timing, select/popover/nav-menu alignment, tooltip tuning) remains deferred. Decision: **hold further rollout pending explicit scope request** — current motion already covers the three highest-value surfaces without adding perceived latency to operational flows.