# FLEX Contact Center — Product-Design Operating System

This repository contains the FLEX Contact Center frontend POC (under `my-app/`). Before modifying any UI in this repository, read the FLEX product-design operating system:

- **Start:** `docs/design/README.md` — purpose, source-of-truth hierarchy, how to use the docs.
- **Work** with the design rules in `docs/design/` and the domain models in `docs/design/domain/` as the default source of product-design behavior.
- **Mirror** the canonical routes documented in `docs/design/exemplars/` (CDR, Campaigns, Dashboard).

Feature work is tracked as GitHub issues cut per phase; consult `docs/product/FLEX_FEATURE_PARITY.md` for the canonical feature-completion tracker before any revamp.

Frontend development uses Bun (`bun install`, `bun run dev`, `bun run build`) inside `my-app/`; backend uses Composer + Artisan.

## Workspaces

Identify which workspace a page belongs to before designing or reviewing it:

```text
Agent         handle customer interactions
Supervision   monitor operations and intervene
Administration configure the contact center
Platform      operate the multi-tenant platform (tenant context)
```

See `docs/design/01-product-model.md`. A page that cannot name its workspace is not ready to build.

## Required pre-UI check

Before modifying any UI:

1. Read `docs/design/README.md`.
2. Identify the workspace: Agent / Supervision / Administration / Platform.
3. Read the relevant domain spec (`docs/design/domain/`).
4. Inspect existing FLEX primitives (`my-app/resources/js/components/flex/*`, `components/ui/*`) before writing new components.
5. Inspect the relevant exemplar (`docs/design/exemplars/`).
6. Preserve runtime behavior — never encode a manual concept the runtime does not implement.
7. Preserve permissions (`my-app/resources/js/auth/capabilities.tsx`) — the backend remains authoritative.
8. Preserve tenant boundaries — tenant context is a safety concern.
9. Identify every reachable state for the surface (`docs/design/07-feedback-states.md`).
10. Plan before large changes; follow `docs/design/12-quality-gates.md`.

## Prohibitions

Do not:

- invent domain states, permissions, thresholds, or backend capabilities;
- create route-specific copies of shared patterns (duplicate a FLEX primitive per route);
- introduce arbitrary visual tokens (use `--flex-*` tokens in `my-app/resources/css/app.css`);
- replace integration boundaries (mock adapters, iframe, Call Manager);
- hide failures — show accurate errors with a next step;
- use animation as decoration (see `docs/design/05-motion.md`);
- break routes merely for visual consistency (route path and grouping are separate).

## Testing rule

Every implementation phase must be tested, visually verified, functionally verified, committed, pushed to GitHub, and the push verified before the next phase begins.

- Run `npm run lint:check`, `npm run types:check`, and `npm run build` (under `my-app/`).
- Verify affected routes in the browser; check the console for errors.
- Review the diff (`git status`, `git diff`); stage only intended files; never commit secrets, `.env`, or generated noise.
- When a canonical pattern changes, update the relevant design document in the same code change.

## Agent skills

### Issue tracker

Work is tracked as GitHub issues cut per PLAN phase via `gh`. See `docs/agents/issue-tracker.md`.

### Triage labels

The five canonical triage labels (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`) are used as-is. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `CONTEXT.md` + `docs/adr/` at the repo root, with FLEX's `docs/design/` operating system and `docs/product/FLEX_FEATURE_PARITY.md` as product references. See `docs/agents/domain.md`.
