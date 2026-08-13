import { Link } from '@inertiajs/react';
import {
    RiDashboard3Line,
    RiPhoneFindLine,
    RiMegaphoneLine,
    RiCustomerServiceLine,
} from '@remixicon/react';
import { FlexBrandMark } from '@/components/flex/brand';
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
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <FlexBrandMark size={26} standalone={false} />
                                <span className="truncate font-semibold text-sm">Flex</span>
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
