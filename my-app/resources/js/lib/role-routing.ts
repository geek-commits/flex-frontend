import { ROLE_CAPABILITIES  } from '@/auth/capabilities';
import type {Role} from '@/auth/capabilities';
import { FLEX_DOMAINS, isActiveRoute } from '@/auth/nav-domains';

const ROLE_LANDING: Record<Role, string> = {
    agent: '/agent/dashboard',
    supervisor: '/dashboard',
    admin: '/admin/console',
    'super-admin': '/admin/tenants',
};

export function getSafeLandingForRole(role: Role): string {
    return ROLE_LANDING[role];
}

/** True if the given URL is visible for the target role's capability set. */
export function isRouteAccessibleForRole(url: string, role: Role): boolean {
    const caps = ROLE_CAPABILITIES[role];
    const path = url.split(/[?#]/)[0] ?? url;

    for (const domain of FLEX_DOMAINS) {
        if (!caps.includes(domain.capability)) {
            const maybeInDomain = domain.groups.some((g) => g.items.some((item) => isActiveRoute(path, item.href)));

            if (maybeInDomain) {
                return false;
            }

            continue;
        }

        for (const group of domain.groups) {
            for (const item of group.items) {
                if (isActiveRoute(path, item.href)) {
                    if (!item.capability) {
                        return true;
                    }

                    return caps.includes(item.capability);
                }
            }
        }
    }

    // Shared fallback: Settings (not in any FLEX_DOMAIN group beyond hrefPrefixes).
    if (isActiveRoute(path, '/settings/profile')) {
        return caps.includes('settings.manage');
    }

    // Unknown route — treat as accessible (preserve provider state; let backend/404 handle).
    return true;
}
