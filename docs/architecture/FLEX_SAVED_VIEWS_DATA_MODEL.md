# FLEX Saved Views — Data Model (Increment A2)

> Tenant- and permission-safe, schema-versioned, local-first.

```ts
type SavedView = {
  id: string; ownerId: string; dataset: string; // e.g. "cdr" | "missed-calls" | "campaigns" | "social"
  name: string; filters: Record<string, unknown>; sorting?: unknown;
  visibleColumns?: string[]; columnOrder?: string[]; pageSize?: number;
  dateRange?: { from?: string; to?: string };
  version: 1;
};
```

- **Scope:** user + tenant (key `flex.savedViews::<tenantId>::<userId>`). Tenant switch re-scopes — invalid views hidden, dangling queue/column permissions revalidated via `has(capability)` on load.
- **Storage:** `localStorage` for POC (harmless device-local, no sensitive data). Backend user-preferences if later available.
- **UX:** toolbar `Current View ▾` + `Save View` (name + current filters/sorting/columns). Supported datasets: CDR, Missed, Campaigns, Social, Monitoring, Customers.
