import { Link } from '@inertiajs/react';

import { FlexBrandLogo } from '@/components/flex/brand';
import { useBrandIntroReplayGuard } from '@/components/flex/brand/use-brand-intro-replay-guard';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Contact Center Dashboard',
        href: dashboard(),
        icon: 'dashboard',
    },
    {
        title: 'Call Records (CDR)',
        href: '/admin/cdr',
        icon: 'call-records',
    },
    {
        title: 'Call Campaigns',
        href: '/admin/campaigns',
        icon: 'campaigns',
    },
    {
        title: 'Agent Workspace',
        href: '/agent',
        icon: 'agent-workspace',
    },
];

export function AppSidebar() {
    const { state, isMobile } = useSidebar();
    const animateOnMount = useBrandIntroReplayGuard();
    const expanded = state === 'expanded' && !isMobile;

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                {expanded ? (
                                    <FlexBrandLogo variant="sidebar" animateOnMount={animateOnMount} decorative />
                                ) : (
                                    <FlexBrandLogo variant="collapsed" decorative />
                                )}
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
