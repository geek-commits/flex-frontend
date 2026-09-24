'use client';

import { usePage } from '@inertiajs/react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
    FLEX_NAVIGATION_AREAS,
    resolveActiveNavigationHref,
    resolveNavigationArea,
} from '@/auth/nav-domains';
import { AppBreadcrumbs } from '@/components/app-breadcrumbs';
import type { AppBreadcrumbPage } from '@/components/app-breadcrumbs';
import { CustomSidebarTrigger } from '@/components/custom-sidebar-trigger';
import { FlexProfileMenu } from '@/components/flex/flex-profile-menu';
import { GlobalSearchTrigger } from '@/components/flex/global-search';
import { FlexIcon } from '@/components/flex/iconography';
import { LanguageSwitcher } from '@/components/language-switcher';
import { Separator } from '@/components/ui/separator';
import { TenantContextIndicator } from '@/features/tenants/tenant-context-indicator';

/**
 * Merged shell header for the Administration canary: registry chrome
 * (sidebar trigger + breadcrumbs) on the left, FLEX operational controls
 * (search, language, tenant context, profile) on the right. Registry demo
 * controls (Send/Bell/NavUser) are intentionally not carried over.
 */
export function AppHeader({
    operationalControls,
}: {
    /** Agent-specific live controls rendered inside the shared global header. */
    operationalControls?: React.ReactNode;
}) {
    const { url } = usePage();
    const { t } = useTranslation('navigation');

    const activePage = useMemo<AppBreadcrumbPage | null>(() => {
        const areaId = resolveNavigationArea(url);
        const activeHref = resolveActiveNavigationHref(url, areaId);
        const area = FLEX_NAVIGATION_AREAS.find((a) => a.id === areaId) ?? null;
        const item = area?.groups
            .flatMap((group) => group.items)
            .find((entry) => entry.href === activeHref);

        if (!item) {
            return null;
        }

        return {
            title: t(item.titleKey),
            icon: <FlexIcon name={item.icon} className="size-3.5" />,
        };
    }, [url, t]);

    return (
        <header
            data-flex-global-header
            className="sticky top-0 z-50 flex h-14 shrink-0 items-center justify-between gap-2 bg-flex-workspace-surface px-4 select-none md:px-6"
        >
            <div className="flex min-w-0 items-center gap-3">
                <CustomSidebarTrigger />
                <AppBreadcrumbs page={activePage} />
            </div>
            <div className="flex min-w-0 items-center gap-2 md:gap-3">
                <GlobalSearchTrigger />
                {operationalControls}
                <Separator
                    className="hidden h-4 data-[orientation=vertical]:self-center sm:block"
                    orientation="vertical"
                />
                <LanguageSwitcher variant="compact" className="hidden lg:flex" />
                <div
                    data-call-island-zone="profile-tenant"
                    className="flex min-w-0 items-center gap-2 md:gap-3"
                >
                    <TenantContextIndicator />
                    <div className="border-l border-flex-workspace-divider pl-2">
                        <FlexProfileMenu />
                    </div>
                </div>
            </div>
        </header>
    );
}
