# Brand — FLEX Monogram & Wordmark

Defines the official FLEX brand mark, the canonical animated component, and its usage rules. Brand presentation is separate from product state — brand motion must never carry operational meaning.

## Official mark

The FLEX mark is the **F monogram**: a vertical foundation with a top arm, a middle arm, and a red activation accent.

```text
F-monogram
├── vertical foundation
├── top arm
├── middle arm
└── red accent
```

Source of truth is the static SVG: `viewBox="0 0 100 100"`, geometry, proportions, corner radii, gradient, and colors preserved exactly. Do not redraw or approximate the monogram.

## Colors

Approved brand colors (logo only):

```text
gradient   #3FC5F2 → #1C7FDB
accent     #E23A2E
```

**Gradient rule:** the logo gradient is a **brand-mark exception**, not an application design token. Gradient buttons, dashboards, cards, and backgrounds are not approved. The red accent is part of the official logo and must not dynamically represent errors, agent state, SIP state, alerts, or tenant state.

## Canonical component

```text
components/flex/brand/
├── FlexBrandSvg      ← static authoritative SVG (unique gradient id per instance via useId)
├── FlexBrandMark     ← animated brand mark (Web Animations API)
└── index.ts
```

The canonical shell consumes the brand component. Individual pages/routes must not maintain their own animated-logo implementations.

```tsx
<FlexBrandMark
  size={28}
  animateOnMount
  animateOnHover={false}   // hover disabled by default in the operational CRM
/>
```

Login / marketing surfaces may enable hover:

```tsx
<FlexBrandMark animateOnMount animateOnHover />
```

## Accessibility

- If the mark appears next to visible `FLEX` text: `aria-hidden`.
- If the monogram appears alone: `role="img"` + `aria-label="FLEX"`.
- Animation stages are not announced to screen readers (decorative branding, not application status).

## Mount animation

Uses the browser **Web Animations API** (no animation library). Animates only `transform` and `opacity`; no layout recalculation.

Sequence (brand construction):

```text
foundation → top arm → (stagger) middle arm → accent → subtle settle
```

Production behavior:

- constructs **once on first application-shell mount**;
- stays idle after completion (no loop, no reverse, no timer continues);
- **no replay** on SPA route change, data refresh, sidebar collapse/expand, tenant switch, or component rerender.

Timing is centralized in `LOGO_MOTION` inside `FlexBrandMark`. These are **brand motion tokens**, distinct from product motion tokens (`05-motion.md`). Brand construction is allowed to be slightly longer than normal UI motion but must not feel like a splash-screen intro.

## Hover replay (opt-in)

- Uses `onPointerEnter` (not `onMouseMove`);
- replays once per pointer entry;
- does not reverse on pointer leave;
- prevents overlapping/duplicate runs on rapid re-entry.

## Reduced motion

When `prefers-reduced-motion: reduce` is active:

- construction is skipped entirely — the completed logo renders immediately;
- hover replay is disabled;
- no hidden/initial animation state is flashed.

## Layout stability

The brand container reserves its final dimensions and uses `contain: layout paint` so the animation never changes sidebar width, pushes navigation, or causes layout shift.

## Prohibited usage

The animated brand mark must not be used as: a loading spinner, page loader, API loading indicator, call-connecting indicator, success animation, empty-state decoration, dashboard decoration, or background watermark. Logo motion must never be connected to system state (WebRTC/SIP/server reconnect, agent Ready, tenant change, data Live).
