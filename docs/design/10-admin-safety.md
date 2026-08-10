# 10 — Admin Safety

Administrator surfaces can change how the live contact center behaves. The UX must optimize for safe change management.

## Configuration change rules

For high-impact configuration:

- **Current value visible** — the user sees what is configured now before editing.
- **Changed value understandable** — the pending change is expressed in domain terms, not raw state.
- **Validation before commit** — the form validates before the change is applied; errors block the commit with actionable messages.
- **Pending save visible** — while a mutation is in flight the save is visibly pending and duplicates are prevented.
- **Failure preserves context** — a failed save keeps the form and its values; nothing is silently reset.
- **Destructive consequences explicit** — if applying the change affects routing, calls, or recordings, that consequence is stated before commit.
- **Backend authoritative** — the UI reflects backend rules and cannot offer what the backend rejects; the backend is the source of truth for validity.

## High-impact configuration domains

These are configuration domains where consequence awareness matters most (do not implement them in this phase — this is the rule for when they are built):

```text
queues
IVR
time conditions
inbound routes
recordings
mail
subscriptions
security
tenant state
```

## Destructive and pending-action behavior

- Confirmation dialogs name the exact object and state the true consequence (see `04-interaction-rules.md`).
- Pending mutations disable duplicate submit — the Campaigns pause/resume guard is the canonical example (pause/resume cannot double-fire while pending).
- Do not claim "cannot be undone" unless the backend cannot undo it.

## Test / preview rule

If the backend supports a safe test or preview, expose it clearly and label it with the real action:

```text
Test Connection
Preview
Run Test
```

- Do not invent fake preview or staging behavior the backend does not have.
- A preview that shows a fabricated result is worse than none.

## Anti-patterns

- Save button that succeeds in the UI while the backend rejected the change;
- a destructive configuration change confirmed with a generic "Are you sure?";
- validation errors appearing only after the mutation fires;
- "Live" or "applied" claimed without backend confirmation.
