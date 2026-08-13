# 05 — Motion

Defines FLEX motion durations, what may animate, and what is prohibited. Motion tokens are the runtime baseline — do not invent new durations.

## Runtime tokens

`resources/css/app.css`:

```css
--flex-duration-fast:   120ms;
--flex-duration-default: 150ms;
--flex-duration-overlay: 200ms;
--flex-ease:            cubic-bezier(0.4, 0, 0.2, 1);
```

Map to the canonical timing bands:

| Use | Duration |
|---|---|
| hover / emphasis | 120–150ms (`fast`/`default`) |
| button / selection | 120–150ms (`fast`/`default`) |
| menu / popover | 140–180ms (`default`) |
| sheet / dialog | 180–220ms (`overlay`) |

Use the tokens; never hard-code a new duration for an existing interaction class.

## Motion rules

1. **Prefer `opacity` and `transform`.** These are compositor-friendly and cheap.
2. **Never routinely animate**:
   - table layout and row repositioning;
   - counters and KPI numbers;
   - live status dots;
   - chart decoration;
   - high-frequency controls (polling refresh, typing, scroll-linked effects).
3. **Respect `prefers-reduced-motion`.** Under reduced motion, transition to instant or near-instant and suppress non-essential movement.

## Prohibited motion

- pulsing Live indicators (a live dot is static; status changes, it does not breathe);
- bouncing icons;
- animated gradients;
- status glow loops;
- count-up / counting metrics;
- AI-style sparkle or shimmer transitions;
- any animation that delays task completion.

## Anti-patterns

- A live indicator that pulses to signal "alive";
- KPI numbers that roll up on every poll refresh;
- a spinner or shimmer on every background refresh (see `07-feedback-states.md`).

## Brand motion exception

The FLEX brand mark (`brand.md`) is the one intentional long-duration animation in the product. It constructs once on application-shell mount and stays idle. Brand motion tokens are separate from product motion tokens and never apply to UI controls, status, or loading. Reduced-motion still renders the completed brand mark immediately.
