import { Link } from '@inertiajs/react';
import { RiArrowRightSLine } from '@remixicon/react';
import type { SidebarNavGroup } from '@/components/app-shared';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';

/**
 * Collapsible sidebar group. Presentational only — items (with resolved
 * `isActive` and capability filtering) are built by AppSidebar from
 * FLEX_NAVIGATION_AREAS so the FLEX resolvers stay authoritative.
 * Links use Inertia so navigation stays SPA; tooltips appear in icon mode.
 */
export function NavGroup({ label, items }: SidebarNavGroup) {
    if (items.length === 0) {
        return null;
    }

    return (
        <SidebarGroup>
            {label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
            <SidebarMenu>
                {items.map((item) => {
                    const key = item.path ?? item.title;

                    if (item.subItems?.length) {
                        return (
                            <Collapsible
                                asChild
                                className="group/collapsible"
                                defaultOpen={
                                    !!item.isActive ||
                                    item.subItems.some((i) => !!i.isActive)
                                }
                                key={key}
                            >
                                <SidebarMenuItem>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton
                                            isActive={item.isActive}
                                            tooltip={item.title}
                                        >
                                            {item.icon}
                                            <span>{item.title}</span>
                                            <RiArrowRightSLine className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {item.subItems.map((subItem) => (
                                                <SidebarMenuSubItem
                                                    key={
                                                        subItem.path ??
                                                        subItem.title
                                                    }
                                                >
                                                    <SidebarMenuSubButton
                                                        render={
                                                            <Link
                                                                href={
                                                                    subItem.path ??
                                                                    '#'
                                                                }
                                                                aria-label={subItem.title}
                                                            />
                                                        }
                                                        isActive={
                                                            subItem.isActive
                                                        }
                                                    >
                                                        {subItem.icon}
                                                        <span>
                                                            {subItem.title}
                                                        </span>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            ))}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </SidebarMenuItem>
                            </Collapsible>
                        );
                    }

                    return (
                        <SidebarMenuItem key={key}>
                            <SidebarMenuButton
                                render={
                                    <Link
                                        href={item.path ?? '#'}
                                        aria-label={item.title}
                                    />
                                }
                                isActive={item.isActive}
                                aria-current={
                                    item.isActive ? 'page' : undefined
                                }
                                tooltip={item.title}
                            >
                                {item.icon}
                                <span>{item.title}</span>
                                {item.badge && (
                                    <span className="ml-auto shrink-0 rounded-sm border border-flex-workspace-divider px-1 py-0.5 text-[9px] leading-none font-medium text-flex-text-tertiary group-data-[collapsible=icon]:hidden">
                                        {item.badge}
                                    </span>
                                )}
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
