# 13 — Visual Language

Defines the canonical FLEX design metrics and global font. This is the approved
Phase-A specification that route-level styling must inherit.

> **Core rule:** First standardize the visual language. Then change workspace
> composition. This spec is the source of truth for typography, compact
> controls, card geometry, chart colors, and text roles.

## Canonical spec

```text
GLOBAL UI FONT
Inter

METRICS
Inter 18px / 24px
Semi Bold 600
Letter spacing -0.1px

LABELS
Inter 12px / 16px
Medium 500

FILTERS / COMPACT CONTROLS
Height 28px
Inter 13px / 16px
Medium 500
Radius 6px

CARDS
Radius 14px
Horizontal padding 16px

CHARTS
Primary line #519DFA
Primary bars #0077E6

LIGHT-THEME TEXT
Default #333333
Subtle #777777
```

## Where these live

| Role | Utility / token |
|------|------------------|
| Global font | `--font-sans: 'Inter Variable'` in `app.css` `@theme` |
| Metric | `.flex-metric` utility (18/24, 600, -0.1px) |
| Label | `.flex-label` utility (12/16, 500) |
| Section / group label | `--flex-font-size-section: 0.875rem` (14px) / 600 muted — Plane pivot for workbench group headers |
| Compact filter | `Input size="sm"` / `Select size="sm"` (28px, 13px, 6px radius) |
| Card | `rounded-lg` (14px) + `CardContent p-4` (16px) |
| Chart line | `--flex-chart-line: #519DFA` |
| Chart bar | `--flex-chart-bar: #0077E6` |
| Light default text | `--foreground: #333333` equivalent |
| Light subtle text | `--muted-foreground: #777777` equivalent |
| Motion slow | `--flex-duration-slow: 300ms` — shell/sidebar collapse |
| Radius rule | `sm 6 / md 8 / lg 12` — reserve `lg` for overlays/modals; inline surfaces use 6/8 (Plane 4/6/8) |

## Rules

### Font
- Inter is the global UI font for shell, navigation, body, metrics, labels,
  filters, forms, tables, dialogs, tooltips, charts, empty/error states, and
  all workspaces.
- Do not set `font-family: Inter` independently per component when inheritance
  suffices.
- Preserve **monospace** only for semantic technical content (code, logs, raw
  IDs, SIP/debug values, fingerprints, payloads). Ordinary table data is Inter.

### Metric role
- Use `.flex-metric` for true operational/KPI values only (dashboard KPIs,
  agent KPIs, system metrics, report summary values, AI usage metrics).
- Do not apply metric typography to ordinary table numbers, timestamps, IDs, or
  form values.

### Label role
- Use `.flex-label` for metric labels, compact metadata, small field labels,
  supporting descriptors, and chart supporting labels.
- Do not reduce normal body text to 12px.

### Section / group header role (Plane pivot)
- Group headers inside workbench surfaces (e.g. `Backlog 3`, `Todo 1`, table group rows) use **14px / 600 / muted** (`--flex-font-size-section` + `font-semibold text-flex-text-muted`).
- This is distinct from `.flex-label` (12px). Do not apply 14/600 to ordinary body/table cells — those remain 13px (`--flex-font-size-label` / body).
- The tighter 13px body versus 14px muted header gives Plane's hierarchy-without-color effect.

### Compact filters
- Compact/filter controls are 28px, Inter 13/16, 500 weight, 6px radius.
- Apply to table filters, date filters, compact selects, view selectors,
  filter triggers, and compact search/filter controls.
- **Never** shrink ordinary form inputs, primary buttons, or telephony safety
  controls.

### Card geometry
- True cards: 14px radius, 16px horizontal padding; vertical padding
  context-aware. Prefer border hierarchy over heavy shadows.
- Do not force every surface into a Card.

### Chart colors
- Primary/neutral line series use `#519DFA`; primary/neutral bar series use
  `#0077E6` (via `--flex-chart-line` / `--flex-chart-bar`).
- **Semantic exception:** real warning/error/success series may remain
  amber/red/green when color encodes meaning (e.g. answered=green,
  missed=red). Do not replace meaningful state colors with blue.

## Light-theme text rule

`#333333` (default) and `#777777` (subtle) are **light-theme values only**,
mapped to semantic tokens (`--foreground` / `--muted-foreground`). Do not
hardcode them in components.

Dark mode must provide readable **semantic equivalents** for foreground, muted
foreground, border, surface, chart axis, and chart tooltip. Do not reuse the
light hex values literally in dark mode.

## Theme-aware charts

Supporting chart UI must be theme-aware: axis text, grid, tooltip surface,
tooltip text, legend, crosshair/hover cursor, active dots, and area fills all
resolve from semantic tokens. The theme toggle must update charts immediately
(no reload).