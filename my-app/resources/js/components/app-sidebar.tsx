'use client';

import { Link, usePage } from '@inertiajs/react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useCapabilities } from '@/auth/capabilities';
import {
    FLEX_NAVIGATION_AREAS,
    getFirstAccessibleHref,
    isActiveRoute,
    resolveNavigationArea,
} from '@/auth/nav-domains';
import type { SidebarNavGroup } from '@/components/app-shared';
import { FlexBrandLogo } from '@/components/flex/brand';
import { FlexIcon } from '@/components/flex/iconography';
import { NavGroup } from '@/components/nav-group';
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';

/**
 * Universal FLEX sidebar: single inset icon-collapsible rail that replaces
 * PrimaryRail + ContextSidebar. Workspace switching (rail parity) followed
 * by the active area's groups (context parity), both derived from
 * FLEX_NAVIGATION_AREAS with render-time capability filtering. Active
 * detection honors href aliases via isActiveRoute.
 */
export function AppSidebar() {
    const { url } = usePage();
    const { has } = useCapabilities();
    const { t } = useTranslation('navigation');
    const { state, isMobile } = useSidebar();
    const activeAreaId = resolveNavigationArea(url);

    const visibleAreas = useMemo(
        () =>
            FLEX_NAVIGATION_AREAS.filter(
                (area) => !area.capability || has(area.capability),
            ),
        [has],
    );

    const homeHref = visibleAreas[0]
        ? getFirstAccessibleHref(visibleAreas[0], has)
        : '/admin/console';

    const groups = useMemo<SidebarNavGroup[]>(() => {
        const activeArea =
            visibleAreas.find((area) => area.id === activeAreaId) ?? null;

        if (!activeArea) {
            return [];
        }

        return activeArea.groups
            .map((group) => ({
                label: group.groupTitleKey
                    ? t(group.groupTitleKey)
                    : group.groupTitle,
                items: group.items
                    .filter(
                        (item) => !item.capability || has(item.capability),
                    )
                    .map((item) => ({
                        title: t(item.titleKey),
                        path: item.href,
                        icon: (
                            <FlexIcon
                                name={item.icon}
                                className="size-4 shrink-0"
                            />
                        ),
                        isActive: [item.href, ...(item.aliases ?? [])].some(
                            (href) => isActiveRoute(url, href),
                        ),
                        badge: item.placeholder
                            ? t('badges.comingSoon')
                            : undefined,
                    })),
            }))
            .filter((group) => group.items.length > 0);
    }, [visibleAreas, activeAreaId, has, url, t]);

    const collapsed = state === 'collapsed' && !isMobile;

    return (
        <Sidebar
            collapsible="icon"
            variant="inset"
            aria-label={t('aria.productDomains')}
        >
            <SidebarHeader className="h-14 justify-center px-2">
                {collapsed ? (
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                render={
                                    <Link
                                        href={homeHref}
                                        aria-label="FLEX home"
                                    />
                                }
                                tooltip="FLEX"
                            >
                                <FlexBrandLogo
                                    variant="collapsed"
                                    animateOnMount={false}
                                    decorative
                                />
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                ) : (
                    <Link
                        href={homeHref}
                        aria-label="FLEX home"
                        className="flex-focus-visible flex items-center rounded-md px-1 transition-transform duration-[var(--flex-duration-fast)] ease-[var(--flex-ease)] active:scale-[0.98]"
                    >
                        <FlexBrandLogo
                            variant="static"
                            animateOnMount={false}
                            decorative
                            style={{ width: 112 }}
                        />
                    </Link>
                )}
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>
                        {t('aria.productDomains')}
                    </SidebarGroupLabel>
                    <SidebarMenu>
                        {visibleAreas.map((area) => {
                            const isActive = activeAreaId === area.id;

                            return (
                                <SidebarMenuItem key={area.id}>
                                    <SidebarMenuButton
                                        render={
                                            <Link
                                                href={getFirstAccessibleHref(
                                                    area,
                                                    has,
                                                )}
                                                aria-label={t(area.labelKey)}
                                            />
                                        }
                                        isActive={isActive}
                                        aria-current={
                                            isActive ? 'page' : undefined
                                        }
                                        tooltip={t(area.labelKey)}
                                    >
                                        <FlexIcon
                                            name={area.icon}
                                            className="size-[18px] shrink-0"
                                        />
                                        <span>{t(area.labelKey)}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            );
                        })}
                    </SidebarMenu>
                </SidebarGroup>
                {groups.map((group, index) => (
                    <NavGroup
                        key={`${group.label ?? 'group'}-${index}`}
                        {...group}
                    />
                ))}
            </SidebarContent>
        </Sidebar>
    );
}
