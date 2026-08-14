# Brand — FLEX Full Wordmark

Defines the official FLEX brand, the canonical animated component, and its usage rules. Brand presentation is separate from product state — brand motion must never carry operational meaning.

## Primary brand

The primary FLEX brand is the **full FLEX wordmark** — the complete wordmark lockup supplied as `flex-logo.original.svg`.

```text
Primary logo      → full FLEX wordmark
Compact logo      → official FLEX monogram (only where the wordmark cannot fit)
Animation         → full wordmark construction
Operational timing→ ~1.3–1.6s
Loop              → development only
Hover             → off in CRM
Reduced motion    → static (exact source)
Theme             → official fills preserved
```

Source of truth is the static SVG: `flex-logo.original.svg` (`viewBox 0 0 256 256`). All **11** original path `d`, `fill`, and `transform` values are preserved exactly. Do not redraw, simplify, merge, recolor, or alter the source transforms. The validator `validate-flex-logo-source.py` must pass before and after any change.

## Compact mark

The F-monogram is the **responsive/compact exception** — used only where the full wordmark genuinely cannot fit, such as the collapsed 64px icon rail. It must not replace the wordmark as the primary brand.

```text
F-monogram (compact)
├── vertical foundation
├── top arm
├── middle arm
└── red accent
```

Do not crop or squeeze the full wordmark to make a compact mark.

## Colors

Approved brand colors (logo only):

```text
wordmark   #1F88CA / #01B0F1 / #1E87C9 / #288BC7
red        #C21619 / #D11F24 / #B92729 / #CB2D30
monogram   gradient #3FC5F2 → #1C7FDB, accent #E23A2E
```

**Gradient rule:** the logo gradient is a **brand-mark exception**, not an application design token. Gradient buttons, dashboards, cards, and backgrounds are not approved. The red pieces are part of the official brand and must not dynamically represent errors, agent state, SIP state, alerts, or tenant state.

## Canonical components

```text
components/flex/brand/
├── flex-logo.original.svg        ← authoritative source (11 paths)
├── AnimatedFlexLogo              ← source-preserving animation engine (WAAPI)
├── FlexBrandLogo                 ← canonical production wrapper (wordmark)
├── FlexBrandMark                 ← animated compact monogram
├── FlexBrandSvg                  ← static monogram
├── use-brand-intro-replay-guard  ← play once per session
├── animated-flex-logo.css        ← scoped brand styles
├── validate-flex-logo-source.py  ← source-preservation validator
└── index.ts
```

The canonical shell consumes the brand components. Individual pages/routes must not maintain their own animated-logo implementations.

### Full wordmark (primary)

```tsx
<FlexBrandLogo />                          // app default
<FlexBrandLogo variant="login" />          // login/marketing, slightly longer
<FlexBrandLogo decorative />               // next to visible FLEX text
```

Production defaults are centralized in the wrapper: animate once on mount, hover off, loop off, `durationScale ≈ 0.28` (~1.46s); login uses `0.35–0.40`. Routes never set `loop` / `durationScale` / `replayOnHover`.

### Compact monogram (exception)

```tsx
<FlexBrandMark size={28} animateOnMount animateOnHover={false} />
```

Login / marketing surfaces may enable hover replay on the monogram only where space forces the compact mark.

## Accessibility

- Full wordmark next to visible `FLEX` text: `decorative` (`aria-hidden`).
- Wordmark alone: `role="img"` + `aria-label="FLEX"`.
- Animation stages are not announced to screen readers (decorative branding, not application status).
- The brand link labels itself once — no duplicate `FLEX` announcements.

## Mount animation

Uses the browser **Web Animations API** (no animation library). Animates only `transform` and `opacity`; no layout recalculation. After intro completion, animation styles are cancelled so the resting logo is the **literal source SVG**.

Production behavior:

- constructs **once per session** (guarded by `use-brand-intro-replay-guard` via `sessionStorage`), because the admin/agent shells remount per route;
- stays idle after completion (no loop, no reverse, no timer continues);
- **no replay** on SPA route change, data refresh, sidebar collapse/expand, tenant switch, or component rerender.

Timing is centralized in the engine (`AnimatedFlexLogo`). These are **brand motion tokens**, distinct from product motion tokens (`05-motion.md`). Brand construction is allowed to be slightly longer than normal UI motion but must not feel like a splash-screen intro.

## Hover replay (opt-in, non-CRM only)

- Uses `onPointerEnter` (not `onMouseMove`);
- replays once per pointer entry;
- does not reverse on pointer leave;
- prevents overlapping/duplicate runs on rapid re-entry.

## Reduced motion

When `prefers-reduced-motion: reduce` is active:

- construction is skipped entirely — the completed source logo renders immediately;
- hover replay is disabled;
- no hidden/initial animation state is flashed.

## Layout stability

The brand container reserves its final dimensions so the animation never changes sidebar width, pushes navigation, or causes layout shift. The presentation viewBox frames the wordmark (aspect ~2.27:1) with padding for animation overshoot; `preserveAspectRatio="none"` is never used.

## Prohibited usage

The animated brand must not be used as: a loading spinner, page loader, API loading indicator, call-connecting indicator, success animation, empty-state decoration, dashboard decoration, or background watermark. Logo motion must never be connected to system state (WebRTC/SIP/server reconnect, agent Ready, tenant change, data Live). The wordmark is not a status indicator — never recolor or replay it based on application state.