# 07 — Feedback States

Defines the reachable states every FLEX data surface must consider, and how loading, empty, stale, and partial-failure states behave.

## Reachable-state matrix

For each feature, evaluate every applicable state. Do not force unreachable states, and do not skip states the data source can actually produce.

```text
populated
loading
refreshing
empty
filtered empty
error
partial error
stale
disabled
permission restricted
pending mutation
mutation failure
success
unknown backend state
long content
narrow viewport
```

Each state is implemented with the shared feedback primitives: `flex-loading-state`, `flex-empty-state`, `flex-error-state`, plus status handling via `flex-status`.

## Loading rule

- **Prefer skeletons that match eventual content** (row/table skeletons, card skeletons) over spinners.
- Avoid a page-wide spinner for a single section, and avoid spinner storms (many sections each showing its own loading element).
- **Never clear stable data during a background refresh** — keep previous data visible while the refresh is in flight.

## Background refresh

When a background refresh is safe:

```text
keep previous data
show a subtle refresh state
replace after successful update
```

- No routine flicker — data does not flash to empty between polls.
- The subtle refresh indicator communicates that an update is occurring (see `domain/data-freshness.md`).
- On failure, keep the last known good data and surface staleness rather than clearing the view.

## Empty states

Distinguish two different conditions:

```text
No data exists
```

from:

```text
Current filters return no data
```

An empty state answers:

```text
What is empty?
Why might this be?
What can the user do?
```

- True empty: explain the state and offer the natural first action (e.g., "No campaigns yet — create one").
- Filtered empty: state that filters produced no results and offer to clear the filters.
- Use `flex-empty-state`; never show a blank table body or a spinner for "no rows".

## Partial failure

- **Independent sections should fail independently** where the architecture allows.
- Do not blank healthy sections because one data source failed (the Dashboard is the canonical example: a failed queue-health source must not hide a healthy agent wallboard).
- Mark the failed section with its own error state and a retry path (see `09-realtime-data.md`).

## Mutation feedback

- Pending mutation: the acting control is disabled/subdued and duplicates are prevented (see `04-interaction-rules.md` destructive actions).
- Mutation failure: keep context, show the specific failure, allow retry.
- Success: confirm in place; a brief inline or toast confirmation, not a page reload that loses context.
