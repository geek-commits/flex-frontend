import type { ReactNode } from 'react';

/**
 * Sidebar navigation types for the app shell. Structure only — actual items
 * are derived from FLEX_NAVIGATION_AREAS (auth/nav-domains.ts) so capability
 * gating and active-route resolution stay single-sourced.
 */
export interface SidebarNavItem {
    title: string;
    path?: string;
    icon?: ReactNode;
    isActive?: boolean;
    /** Small trailing badge, e.g. the coming-soon marker for placeholders. */
    badge?: string;
    subItems?: SidebarNavItem[];
}

export interface SidebarNavGroup {
    label?: string;
    items: SidebarNavItem[];
}
