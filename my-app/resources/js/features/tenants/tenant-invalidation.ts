/**
 * Tenant-scoped invalidation helper — Increment 2 scaffolding, real wiring in Increment 3.
 * Single helper that consumers call on TenantContext change, per ADR-002.
 */

export type InvalidationScope = {
    tenantId: string | null; // null → platform
};

export interface InvalidationResult {
    queriesInvalidated: number;
    subscriptionsTornDown: number;
}

type Invalidatable = {
    onTenantChange?: (scope: InvalidationScope) => number | void;
};

const registry = new Set<Invalidatable>();

export function registerInvalidatable(handle: Invalidatable): () => void {
    registry.add(handle);

    return () => registry.delete(handle);
}

export function invalidateOnTenantChange(scope: InvalidationScope): InvalidationResult {
    let queriesInvalidated = 0;
    const subscriptionsTornDown = 0;

    for (const handle of registry) {
        const n = handle.onTenantChange?.(scope);

        if (typeof n === 'number') {
            queriesInvalidated += n;
        }
        // subscriptionsTornDown is incremented by realtime channels that expose a count
    }

    return { queriesInvalidated, subscriptionsTornDown };
}
