import { Link, usePage } from '@inertiajs/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useCapabilities } from '@/auth/capabilities';
import {
    FLEX_NAVIGATION_AREAS,
    getFirstAccessibleHref,
    resolveNavigationArea,
} from '@/auth/nav-domains';
import { ContextSidebarToggle } from '@/components/flex/context-sidebar-toggle';
import { FlexIcon } from '@/components/flex/iconography';
import { useShell } from '@/components/flex/shell-context';

/**
 * Permanent major-area rail. The reference shell keeps this level visually
 * stable while the contextual tree changes beside it.
 */
export function PrimaryRail() {
    const { url } = usePage();
    const { has } = useCapabilities();
    const { t } = useTranslation('navigation');
    const { contextSidebarOpen } = useShell();
    const activeArea = resolveNavigationArea(url);
    const visibleAreas = FLEX_NAVIGATION_AREAS.filter(
        (area) => !area.capability || has(area.capability),
    );
    const workspaceAreas = visibleAreas.filter(
        (area) => area.kind === 'workspace',
    );
    const utilityAreas = visibleAreas.filter((area) => area.kind === 'utility');

    const renderArea = (area: (typeof FLEX_NAVIGATION_AREAS)[number]) => {
        const isActive = activeArea === area.id;

        return (
            <Link
                key={area.id}
                href={getFirstAccessibleHref(area, has)}
                aria-current={isActive ? 'page' : undefined}
                className={`flex-focus-visible flex min-h-[54px] w-full flex-col items-center justify-center gap-1 rounded-md px-1.5 py-2 text-center transition-colors duration-[var(--flex-duration-fast)] ${
                    isActive
                        ? 'bg-flex-layer-selected text-flex-text-primary'
                        : 'text-flex-text-tertiary hover:bg-flex-layer-hover hover:text-flex-text-primary'
                }`}
            >
                <FlexIcon name={area.icon} className="size-[18px] shrink-0" />
                <span className="max-w-full truncate text-[10px] leading-3 font-medium">
                    {t(area.labelKey)}
                </span>
            </Link>
        );
    };

    return (
        <aside
            data-flex-primary-rail
            className="sticky top-0 z-20 hidden h-full w-[72px] shrink-0 flex-col justify-between bg-flex-workspace-surface px-1.5 py-2 select-none md:flex"
        >
            <div className="relative flex flex-col gap-1">
                {!contextSidebarOpen && (
                    <div className="flex justify-center pb-1">
                        <ContextSidebarToggle />
                    </div>
                )}
                <nav
                    className="flex flex-col gap-1"
                    aria-label={t('aria.productDomains')}
                >
                    {workspaceAreas.map(renderArea)}
                </nav>
                <span
                    aria-hidden="true"
                    className="flex-rail-divider pointer-events-none absolute inset-y-0 -right-1.5 w-px"
                />
            </div>
            <nav
                className="flex flex-col gap-1 border-t border-flex-workspace-divider pt-2"
                aria-label={t('areas.settings')}
            >
                {utilityAreas.map(renderArea)}
            </nav>
        </aside>
    );
}
