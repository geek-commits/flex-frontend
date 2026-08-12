# Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring the codebase.

## Before exploring, read these

- **`CONTEXT.md`** at the repo root, or
- **`CONTEXT-MAP.md`** at the repo root if it exists — it points at one `CONTEXT.md` per context. Read each one relevant to the topic.
- **`docs/adr/`** — read ADRs that touch the area you're about to work in. In multi-context repos, also check `src/<context>/docs/adr/` for context-scoped decisions.
- **`docs/design/`** — FLEX's product-design operating system. Start at `docs/design/README.md`, then the workspace model (`01-product-model.md`) and the relevant domain spec (`docs/design/domain/`).
- **`docs/product/FLEX_FEATURE_PARITY.md`** — canonical feature-completion tracker; cross-check feature IDs before any revamp.

If any of these files don't exist, **proceed silently**. Don't flag their absence; don't suggest creating them upfront. The `/domain-modeling` skill (reached via `/grill-with-docs` and `/improve-codebase-architecture`) creates them lazily when terms or decisions actually get resolved.

## File structure

Single-context repo (this repo):

```
/
├── CONTEXT.md
├── docs/adr/
│   ├── 0001-...
│   └── 0002-...
└── src/
```

## Use the glossary's vocabulary

When your output names a domain concept (in an issue title, a refactor proposal, a hypothesis, a test name), use the term as defined in `CONTEXT.md` (and, for FLEX product terms, the canonical terminology in `docs/design/domain/`). Don't drift to synonyms the glossary explicitly avoids (e.g. `Standby`/`Free`/`Available` for `Ready`).

If the concept you need isn't in the glossary yet, that's a signal — either you're inventing language the project doesn't use (reconsider) or there's a real gap (note it for `/domain-modeling`).

## Flag ADR conflicts

If your output contradicts an existing ADR, surface it explicitly rather than silently overriding:

> _Contradicts ADR-0007 (…) — but worth reopening because…_

### FLEX runtime rule

The runtime/backend is authoritative for enums, routes, permissions, and supported transitions. When the User Manual and runtime disagree: document the discrepancy, preserve current runtime behavior, and mark `NEEDS_PRODUCT_DECISION` in the parity tracker.