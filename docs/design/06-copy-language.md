# 06 — Copy Language

Defines how FLEX speaks: operational, concise, specific, consistent, domain-correct, and action-oriented.

## Canonical terminology

FLEX uses canonical terms from the runtime types (`resources/js/types/flex.ts`) and the *Flex CC User Manual*. Do not introduce casual synonyms.

### Agent states

| Runtime value | Canonical display label |
|---|---|
| `ready` | Ready |
| `talking` | Talking (On Call) |
| `ringing` | Ringing |
| `wrap-up` | Wrap Up |
| `break` | Break |
| `not-ready` | Not Ready |
| `offline` | Offline |

Do not say `Standby`, `Free`, or `Available` when the concept is `Ready`. `Not Ready` is not `Offline`. Full semantics in `domain/agent-state.md`.

### Campaign statuses

| Runtime value | Display label | Semantic tone |
|---|---|---|
| `draft` | Draft | neutral |
| `scheduled` | Scheduled | info |
| `active` | Active | success |
| `paused` | Paused | warning |
| `completed` | Completed | neutral |

Full semantics and action matrix in `domain/campaign-state.md`.

### Call outcomes / states

Runtime call states include `idle`, `dialing`, `ringing`, `connected`, `hold`, `muted`, `transferring`, `wrap-up`, `ended`, `failed`. CDR outcomes use `answered`, `missed`, `voicemail`, `transferred`. Only use states the runtime actually supports — see `domain/call-state.md`.

### Objects

Use the canonical object names exactly: `Queue`, `Agent`, `Campaign`, `Recording`, `Tenant`, `User`, `Role`, `Permission`, `IVR (Interactive Voice Response)`, `Time Condition`, `Call Records (CDR)`, `Call Campaign`. Expand acronyms such as `CDR`, `IVR`, and `SLA (Service-Level Agreement)` at first use.

## Copy rules

- **Operational** — describe what the system does and what the user can do, in domain terms.
- **Concise** — a button label is a verb phrase, not a sentence; a helper is one or two clauses.
- **Specific** — name the object: `Pause Campaign "Q3 Onboarding"`, not `Pause`.
- **Consistent** — the same concept always gets the same label on every surface.
- **Domain-correct** — use canonical terminology; never invent a word the product does not use.
- **Action-oriented** — buttons state the action they perform.

## Anti-pattern labels

Avoid vague placeholders for actions. Prefer the specific verb:

| Avoid | Prefer |
|---|---|
| Continue | Create Campaign / Save Changes |
| Submit | Save Changes / Create User |
| Process | Apply Queue Changes / Run Report |
| Manage | (name the actual action) |
| Proceed | (name the actual action) |
| Confirm | (name the actual action, e.g., Delete Recording) |
| Refresh | Refresh Live Data |

## Error copy

Every meaningful error message answers two questions:

```text
What happened?
What can the user do next?
```

- Only explain the cause when the cause is actually known.
- State the recovery action in operational terms (`Retry`, `Fix and Retry`, `Check mail configuration`).
- Do not hide failures behind friendly-but-vague copy ("Something went wrong") when a specific failure is known.
