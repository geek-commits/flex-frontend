import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { TenantRecord } from '@/features/tenants/shared/types';

/**
 * Active operating context for the FLEX POC surface.
 *
 * Platform scope: the Super Administrator operates across all tenants.
 * Tenant scope: the Super Administrator has entered a single tenant.
 *
 * POC MOCK — this is derived single in-memory state with a default of Platform.
 * It does NOT create a second authority, does NOT persist to localStorage, and
 * does NOT scope any module's data (no module is tenant-scoped at runtime yet).
 * The real tenant context switch must come from the backend in rollout.
 */

export type TenantContext = { mode: 'platform' } | { mode: 'tenant'; tenant: TenantRecord };

interface TenantContextValue {
    context: TenantContext;
    enterTenant: (tenant: TenantRecord) => void;
    returnToPlatform: () => void;
}

const TenantContextContext = createContext<TenantContextValue | undefined>(undefined);

export function TenantContextProvider({ children }: { children: React.ReactNode }) {
    const [context, setContext] = useState<TenantContext>({ mode: 'platform' });

    const enterTenant = useCallback((tenant: TenantRecord) => {
        setContext({ mode: 'tenant', tenant });
    }, []);

    const returnToPlatform = useCallback(() => {
        setContext({ mode: 'platform' });
    }, []);

    const value = useMemo(
        () => ({ context, enterTenant, returnToPlatform }),
        [context, enterTenant, returnToPlatform]
    );

    return <TenantContextContext.Provider value={value}>{children}</TenantContextContext.Provider>;
}

export function useTenantContext(): TenantContextValue {
    const ctx = useContext(TenantContextContext);

    if (!ctx) {
        throw new Error('useTenantContext must be used within a TenantContextProvider');
    }

    return ctx;
}
