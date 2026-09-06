import { ROLE_CAPABILITIES } from '@/auth/capabilities';
import type { Role } from '@/auth/capabilities';
import {
    FLEX_NAVIGATION_AREAS,
    resolveActiveNavigationHref,
    resolveNavigationArea,
} from '@/auth/nav-domains';

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
    const areaId = resolveNavigationArea(url);

    if (!areaId) {
        return true;
    }

    const area = FLEX_NAVIGATION_AREAS.find(
        (candidate) => candidate.id === areaId,
    );

    if (!area) {
        return true;
    }

    if (area.capability && !caps.includes(area.capability)) {
        return false;
    }

    const activeHref = resolveActiveNavigationHref(url, areaId);
    const activeItem = area.groups
        .flatMap((group) => group.items)
        .find((item) => item.href === activeHref);

    if (activeItem?.capability) {
        return caps.includes(activeItem.capability);
    }

    return true;
}
