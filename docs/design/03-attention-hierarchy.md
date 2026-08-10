# 03 — Attention Hierarchy

Defines what earns visual prominence in each FLEX workspace. This is the core anti-AI-slop principle: prominence is earned by operational importance, not decoration.

## Global attention-budget rule

```text
Level 1 — critical / current task
Level 2 — primary operational data
Level 3 — controls and metadata
Level 4 — navigation / chrome
Level 5 — decoration
```

> **An element must earn visual prominence through operational importance.**

If an element cannot state the operational reason it deserves Level 1–2 prominence, give it less prominence. This is what keeps FLEX from drifting into generic SaaS dashboards and decorative AI-style UI.

## Agent attention order

```text
1. Incoming / current interaction
2. Agent availability state
3. Current customer context
4. Required call action
5. Queue / callback pressure
6. Personal performance
7. Navigation / chrome
```

Implications:

- an incoming call beats decorative metrics;
- Ready / Not Ready / Break / Wrap Up remain obvious at all times;
- call actions (answer, hold, transfer, end) outrank navigation;
- personal-performance metrics do not compete with live work.

## Supervisor attention order

```text
1. Operational exception
2. SLA / queue health
3. Workforce availability
4. Active calls
5. Intervention opportunity
6. Performance trend
7. Navigation / chrome
```

Implications:

- the Dashboard surfaces exceptions first (the operational-exception banner precedes metrics);
- queue/SLA health is primary data, not a side widget;
- active calls and workforce state rank above trends and chrome;
- performance trends support, they do not headline.

## Administrator attention order

```text
1. Configuration being changed
2. Impact / validation
3. Current configuration
4. Save / test / publish action
5. Secondary settings
6. Navigation
```

Implications:

- the object being changed is the focus; unrelated secondary settings are de-emphasized;
- validation and consequence messaging sit with the change, not in a toast after the fact;
- the commit action (Save / Apply / Test) is a clear primary action.

## Super Administrator attention order

```text
1. Tenant context
2. Platform health / scope
3. Current support / configuration task
4. Tenant state
5. Global actions
6. Navigation
```

Implication:

- tenant context is always the top anchor (see `domain/tenant-context.md`); a support task performed against the wrong tenant is a failure regardless of the task's own quality.

## Application of the budget

- Level 1–2 elements may use emphasized typography, surface contrast, and size.
- Level 3–4 elements use standard controls and muted chrome.
- Level 5 is effectively zero: FLEX does not decorate (see `05-motion.md` for prohibited effects).
- The five levels are per-page guidance; the workspace order above decides *which* content is Level 1–2 for that workspace.
