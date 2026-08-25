# 12 — Quality Gates

Defines how FLEX UI work is tested and accepted. Every implementation phase follows the gate below.

## Mandatory gate

```text
IMPLEMENT
      ↓
TEST
      ↓
RUN APP / VALIDATE DOCS
      ↓
VERIFY EXPECTED RESULT
      ↓
NO → FIX → RETEST
      ↓
YES
      ↓
git status / git diff
      ↓
COMMIT
      ↓
PUSH
      ↓
VERIFY GITHUB
      ↓
NEXT PHASE
```

> **Never begin the next phase with untested, uncommitted, or unpushed work from the current phase.**

## QA passes

Every feature implementation includes:

1. **Functional QA** — the feature behaves correctly across its reachable states (`07-feedback-states.md`).
2. **Visual QA** — matches the design system: spacing, alignment, cursors, hover, borders, density, no layout shift on load.
3. **Responsive QA** — verified at desktop, laptop, narrow, tablet, and mobile widths; tables scroll in their containers; no page-level horizontal overflow.
4. **Accessibility QA** — keyboard operable, visible focus, focus return, status not color-only, hit targets usable, reduced motion respected (`08-accessibility.md`).
5. **Realtime QA** — single pipeline, no duplicate polling, no leaked listeners, no overlapping requests, freshness explicit, stale ≠ error, no fake Live (`09-realtime-data.md`).
6. **Permission QA** — navigation/actions reflect capabilities; backend remains authoritative (`domain/permission-model.md`).
7. **Tenant QA** — tenant context explicit where applicable; no unsupported tenant behavior documented as current (`domain/tenant-context.md`).
8. **Craft pass** — a deliberate pass searching for small defects: spacing mismatch, alignment error, wrong cursor, inconsistent hover, tooltip behavior, border/focus mismatch, icon/copy inconsistency, scroll issue, loading layout shift, table density mismatch. Do not stop at "functional".

## Tooling note

Vitest is the frontend test runner (`bun run test`). Gates rely on `bun run lint:check`, `bun run types:check`, and `bun run build` (under `my-app/`), plus browser verification (console errors included). The Laravel backend uses Pest (`php artisan test --compact`). Only claim checks that were actually run.

## Commit rules

- Review `git status` / `git diff` before committing.
- Stage only intended files; exclude unrelated changes, debug files, temporary screenshots, secrets, `.env`, generated noise, accidental mass formatting, stale docs.
- When a canonical pattern changes, update the relevant design document in the same commit.

## Push rules

- `git push` after each commit; use `git push -u origin <branch>` if upstream is not configured; never routine force-push.
- **Push failure:** stop; inspect the exact error; resolve auth/permission/branch-protection/network/divergence safely; re-run tests if code changed; push again; verify on GitHub; continue only after success.

## Test failure rule

If a relevant test fails:

```text
DO NOT COMMIT
DO NOT PUSH
DO NOT CONTINUE
```

unless the failure is confirmed pre-existing and unrelated — then document it, verify no regression, run the other checks, and note the exception in the phase report.

## Phase report format

```text
PHASE: <name>

IMPLEMENTED
- ...

VALIDATED
- docs
- runtime/domain terminology
- affected routes
- permissions/tenant context where applicable
- lint / typecheck / tests / build as applicable

RESULT
- PASS

COMMIT
- <hash> <message>

PUSH
- Successfully pushed to <remote>/<branch>

NOTES
- ...
```

Never claim checks that were not run.
