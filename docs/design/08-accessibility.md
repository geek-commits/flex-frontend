# 08 — Accessibility

Defines the keyboard, focus, status-communication, and hit-target standards for FLEX UI.

## Keyboard

At minimum, every surface supports:

```text
Tab            move forward
Shift + Tab    move backward
Enter / Space  activate
Escape         close / cancel
Arrow keys     where component semantics require them
```

- Native elements and Radix/shadcn primitives already provide this; do not regress it.
- Future accelerators (`Cmd/Ctrl + K`, `/`, `?`) are added only when intentionally implemented — never accidentally claimed in copy or docs.

## Focus

- **Visible `focus-visible`** — use the `.flex-focus-visible` ring token (`--flex-focus-ring`). Do not remove outlines without a visible replacement.
- **Overlay focus trap** — dialogs and sheets trap focus while open; Escape closes them.
- **Focus return** — closing an overlay returns focus to the invoker (see `04-interaction-rules.md`).
- **Logical focus order** — DOM order matches reading order; headers, toolbar, and content follow a predictable sequence.
- **No removing outline without replacement** — `outline: none` with nothing in its place is a defect.

## Status accessibility

Color alone is insufficient.

- Use readable text with a dot/icon or another semantic cue, in addition to color (the `FlexStatus` primitive renders dot + label by design).
- A status change on a data region announces through a live region (`role="status"` / `aria-live="polite"`) — the Dashboard announces exception and recovery states this way.
- Charts and standalone visualizations carry an accessible name (e.g., `aria-label` on the chart container).

## Hit targets

- Small icons may remain visually small.
- Clickable areas must remain comfortably usable — the interactive region (padding/area) is larger than the glyph.
- Icon-only controls require an accessible name (tooltip + `aria-label`).

## Anti-patterns

- Color-only status (a red dot with no text/label);
- focus ring removed without replacement;
- dialog/sheet that does not trap or return focus;
- icon buttons with no accessible name;
- status changes that are never announced.
