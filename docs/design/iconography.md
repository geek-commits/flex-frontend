# Iconography — FLEX Semantic Icon System

Defines FLEX's single icon system: how icons are named, sourced, sized, colored,
and placed across the product. Application code requests a **FLEX meaning**, never
a vendor filename.

## One semantic registry

All FLEX product icons are requested through the semantic registry:

```tsx
<FlexIcon name="reports" />
<FlexIcon name="queues" />
<FlexIcon name="ai-center" />
```

```text
Wrong:  <DashboardSvg /> <CardReportsIcon /> <RandomQueueIcon />
```

The registry owns source selection. This lets FLEX change a source icon later
without editing dozens of routes. There is exactly **one** icon registry; do not
create a second navigation registry just for icons.

## Icon families

```text
PRODUCT (clean line)      → navigation, module directories, category headers,
                            settings, reports, system administration
ILLUSTRATION (cartoon)    → empty states, setup guidance, onboarding, help
FEATURE (solid)           → occasional large feature identity, used sparingly
SYSTEM / CONTROL          → precise utility family (unchanged)
TELEPHONY                 → precise call-control family (unchanged)
```

Sources live under `resources/assets/flex/icons/{product,illustration,feature}`.
Provenance: see `docs/design/iconography-sources.md`.

## Size scale

Use the shared semantic scale. Glyph size — not the interactive hit target.

```text
xs          14px
sm          16px
md          18px
lg          20px
xl          24px
2xl         32px
3xl         40px
illustration 48–80px (context-dependent)
```

```text
metadata                      → 14px
compact utility               → 16px
normal control                → 18px
sidebar navigation            → 20px
Management Console module     → 20–24px
category identity             → 24px
feature identity              → 32–40px
empty-state illustration      → 48–80px
```

Do not use arbitrary sizes (17, 21, 27px) per route. Tune optical size, not CSS
values — source viewBoxes differ, so perceived weight must be verified visually.

## Color

Icons use `currentColor` and inherit FLEX design tokens. Do not hardcode fills.

```text
inactive navigation → muted foreground
active navigation   → FLEX primary
default feature icon→ foreground / muted foreground
danger state        → destructive
success state       → success
warning             → warning
```

Color communicates **state/hierarchy**, not category.

```text
phone ≠ automatically green
database ≠ automatically blue
mail ≠ automatically cyan
```

## Utility & telephony freeze

Do not migrate these automatically to the Koboyo family:

```text
search, close, chevron-left/right/down, sort, filter, plus, minus,
more-horizontal, more-vertical, edit, trash, copy, download, upload,
external-link, calendar controls, pagination, checkbox/radio indicators,
expand/collapse
```

```text
answer, decline, hang up, mute, unmute, hold, resume, transfer,
warm transfer, dialpad, speaker, microphone, call history
```

Reason: recognition speed, high frequency, operational consequence, existing
learned behavior. A handmade visual style is less important than immediate
comprehension.

## Active / container policy

- The icon inherits the canonical active navigation treatment. No blue circular
  background, glowing icon, or gradient tile just for the icon.
- Default container: **none**. Use a subtle container only for feature identity,
  empty-state composition, or a special semantic requirement. Never add
  decorative containers to make the icon look "designed".
- Management Console: icon + module name + one-line description + chevron. No
  large colorful icon circles inside oversized cards.

## Accessibility

```text
Decorative (text already visible):  aria-hidden, focusable="false"
Icon-only control:                  accessible name on the interactive element
                                    (aria-label on Button, not only on the SVG)
Collapsed navigation:               tooltip + accessible route name
Empty-state illustration:           normally decorative (aria-hidden)
```

Tooltips are secondary help, not a replacement for an accessible name.

## Feedback & illustrations

Empty-state hierarchy (illustration is secondary):

```text
illustration
title
short explanation
primary action if applicable
```

Do not add an illustration to every empty table automatically. Loading must not
be illustrated as empty; error states should generally not become cartoon-heavy.

Illustrations stay **static** — no animation of cartoon icons.

## Gap & duplicate policy

- When no approved icon exists for a concept, **keep the current system icon**.
  Do not reuse an unrelated icon, crop an illustration, use emoji, or invent an
  icon during route implementation.
- Avoid assigning one icon to multiple sibling modules users must distinguish.
  Semantic clarity comes before family purity.
- If two candidates are visually similar, pick one canonical icon and give each
  retained icon a distinct semantic responsibility.

## Motion

Do not animate Koboyo navigation icons by default (no wiggle, bounce, spin,
draw-on, pulse on hover). Normal interaction motion is subtle: color,
background, small opacity/transform where the existing component already uses
it. The animated brand logo is a brand-specific exception.

## Implementation rules

- Store semantic names (`icon: "reports"`), never raw SVG strings, in route or
  module metadata.
- SVG imports use the `?react` suffix and are handled by `vite-plugin-svgr`; they
  must preserve `currentColor`. Do not use `<img>` where color inheritance is
  required.
- Separate the **product registry** from the **illustration registry** so unused
  assets do not bloat the root shell bundle.
- Icons are static presentational components: no remote requests, no per-row SVG
  fetch, no runtime SVG parsing.