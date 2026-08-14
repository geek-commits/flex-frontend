import { Link } from '@inertiajs/react';
import {
    RiDashboard3Line,
    RiPhoneFindLine,
    RiMegaphoneLine,
    RiCustomerServiceLine,
} from '@remixicon/react';
import { FlexBrandLogo, FlexBrandMark } from '@/components/flex/brand';
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
        icon: RiDashboard3Line,
    },
    {
        title: 'Call Records (CDR)',
        href: '/admin/cdr',
        icon: RiPhoneFindLine,
    },
    {
        title: 'Call Campaigns',
        href: '/admin/campaigns',
        icon: RiMegaphoneLine,
    },
    {
        title: 'Agent Workspace',
        href: '/agent',
        icon: RiCustomerServiceLine,
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
                                    <FlexBrandLogo className="w-32" animateOnMount={animateOnMount} decorative />
                                ) : (
                                    <FlexBrandMark size={26} standalone={false} />
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
