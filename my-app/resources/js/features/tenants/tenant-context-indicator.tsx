import { RiGlobalLine, RiLogoutCircleRLine, RiStore3Line } from '@remixicon/react';
import React from 'react';
import { useTenantContext } from '@/features/tenants/tenant-context';

/**
 * Persistent platform/tenant context indicator (admin chrome).
 *
 * Always visible and text-accessible: shows "Platform" when operating across
 * tenants, or "Tenant · <name>" when inside a single tenant, with a Return to
 * Platform affordance. The context is never implicit.
 */
export function TenantContextIndicator() {
    const { context, returnToPlatform } = useTenantContext();

    const inTenant = context.mode === 'tenant';

    return (
        <div
            className={`hidden sm:flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition-colors hover:bg-flex-layer-hover ${inTenant ? 'text-primary' : 'text-flex-text-tertiary hover:text-flex-text-primary'}`}
            title={inTenant ? `Operating inside ${context.tenant.name}` : 'Operating across all tenants'}
        >
            {inTenant ? <RiStore3Line className="size-3.5" /> : <RiGlobalLine className="size-3.5" />}
            <span className="truncate max-w-40">
                {inTenant ? (
                    <>
                        Tenant · <span className="font-semibold">{context.tenant.name}</span>
                    </>
                ) : (
                    'Platform'
                )}
            </span>

            {inTenant && (
                <button
                    type="button"
                    onClick={returnToPlatform}
                    className="flex items-center gap-1 ml-1 px-1.5 py-0.5 rounded text-[10px] font-semibold hover:bg-primary/10 transition-colors"
                    aria-label="Return to Platform scope"
                >
                    <RiLogoutCircleRLine className="size-3" />
                    Return
                </button>
            )}
        </div>
    );
}
