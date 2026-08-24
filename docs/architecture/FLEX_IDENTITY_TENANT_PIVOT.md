# FLEX Identity & Tenant — Plane Pivot (Phase 08)

> **Risk:** Medium-high — visual restructuring must not obscure authorization or trigger stale tenant.

* **Users** (`AdminShell Users → FlexWorkbenchShell`) — `UsersTable DataGrid dense columnsMovable skeleton pageSize 10` 7 cols `user SearchHighlight / username mono / role / organization / status FlexStatus / lastActivity / actions icon-xs ghost Eye+Edit` (no bulk). Toolbar `pill All/active/inactive/deleted + role select + search + Columns/Refresh + Add User`. No tenant column (organization is label, not tenant id).

* **Roles/Permissions** (`Tabs line Roles|Permissions`) — `roles-tab` 3 rows `Role / Permissions pill count / Users / Actions Edit`; `permissions-tab` flat `Permission mono 10px / Type pill / Module` derivably grouped via `permissionGroups() → MODULE_BY_PREFIX` (20 caps from `auth/capabilities`). `role-form-sheet` grouped checkboxes per module `search + unknownPermissions`. Preserve exact `roles.manage` semantics.

* **Tenant** (`TenantsPage FlexWorkbenchShell`) — `TenantsTable 6 cols tenant/domain Contact/phone/status/createdAt/actions Eye + More Edit/Enter tenant / Disable`. `TenantContext mode platform|tenant` + `invalidateOnTenantChange` + `emitObservability tenant_switch` (mechanism frozen per stop condition). `TenantContextIndicator` in `AppTopbar data-call-island-zone` — `Platform muted bg-muted/50` vs `Tenant · name primary/10 max-w-40 + Return`.

No permission rename, no cross-tenant stale UI (visual indicator + invalidation count), no platform danger banner, no subscription/mail consolidation.

Verified: types:check, build 166 assets, vitest 20/20.
