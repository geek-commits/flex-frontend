# FLEX Plane Pivot — Semantic Token Map (Phase 00)

> Reuse existing FLEX values; add `layer` aliases only. No brand replacement.

| Pivot vocabulary (§6) | Existing FLEX token | Value (light) | Notes |
|---|---|---|---|
| `canvas` | `--flex-workspace-canvas` (`--background`) | `oklch 0.982` | app root only |
| `surface-primary` | `--flex-workspace-surface` (`--card`) | `oklch 1 0 0` | dominant workspace surface |
| `surface-secondary` | `--flex-workspace-surface-muted` / `--flex-surface-subtle` | `0.986` / `0.985` | muted surface |
| `layer-1` | `--flex-surface` / `--card` | white | row / item layer inside surface |
| `layer-1-hover` | *(new)* `--flex-layer-hover` → `oklch 0.985` | — | alias to subtle |
| `layer-1-active` | *(new)* `--flex-layer-active` → `var(--muted)` | `0.97` | pressed |
| `layer-1-selected` | *(new)* `--flex-layer-selected` → `var(--accent)` | `0.97` | selected row |
| `border-subtle` | `--flex-workspace-divider` / `--flex-table-grid` | `0.926` | default |
| `border-strong` | `--flex-workspace-divider-strong` / `--flex-border-strong` | `0.896` / `0.87` | strong |
| `text-primary` | `--flex-text-primary` (`--foreground`) | `0.29` (`#333`) | — |
| `text-secondary` | `--flex-text-secondary` | `0.42` | — |
| `text-tertiary` | `--flex-text-muted` (alias `--flex-text-tertiary`) | `0.55` (`#777`) | tertiary = muted |
| `accent` | `--flex-brand-primary` (`--primary`) | `0.488 0.243 264` | interactive only |
| `success/warning/danger` | `--flex-status-*` | `live/stale/disconnected` | semantic pairs |

**Convention:** new layer tokens are `--flex-layer-*` (consistent with `--flex-*`), not bare `layer-1`. `border-subtle/strong` map to existing divider tokens.

**Verification:** light/dark mappings preserved (`:root` + `.dark` in `app.css:362-525`). No new library, no route change.
