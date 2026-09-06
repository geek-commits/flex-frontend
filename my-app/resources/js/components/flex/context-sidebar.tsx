import { Link, usePage } from '@inertiajs/react';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useCapabilities } from '@/auth/capabilities';
import {
    FLEX_NAVIGATION_AREAS,
    resolveActiveNavigationHref,
    resolveNavigationArea,
} from '@/auth/nav-domains';
import { ContextSidebarToggle } from '@/components/flex/context-sidebar-toggle';
import { FlexIcon } from '@/components/flex/iconography';
import { useShell } from '@/components/flex/shell-context';
import { cn } from '@/lib/utils';

/**
 * Complete contextual tree for the selected workspace or Settings area.
 * Groups remain expanded on desktop so orientation never resets between pages.
 */
export function ContextSidebar() {
    const { url } = usePage();
    const { has } = useCapabilities();
    const { contextSidebarOpen } = useShell();
    const { t } = useTranslation('navigation');
    const activeAreaId = resolveNavigationArea(url);
    const activeArea =
        FLEX_NAVIGATION_AREAS.find((area) => area.id === activeAreaId) ?? null;
    const activeHref = resolveActiveNavigationHref(url, activeAreaId);
    const groups = useMemo(
        () =>
            (activeArea?.groups ?? [])
                .map((group) => ({
                    ...group,
                    items: group.items.filter(
                        (item) => !item.capability || has(item.capability),
                    ),
                }))
                .filter((group) => group.items.length > 0),
        [activeArea, has],
    );

    if (!activeArea) {
        return null;
    }

    return (
        <aside
            id="flex-context-sidebar"
            data-flex-context-sidebar
            aria-hidden={contextSidebarOpen ? undefined : true}
            inert={contextSidebarOpen ? undefined : true}
            className={cn(
                'sticky top-0 hidden h-full shrink-0 overflow-hidden bg-flex-workspace-surface transition-[width] duration-[180ms] ease-[var(--flex-ease)] select-none motion-reduce:transition-none md:block',
                contextSidebarOpen ? 'w-64' : 'w-0',
            )}
        >
            <div className="h-full w-64 overflow-y-auto">
                <div className="relative">
                    <div className="flex h-12 shrink-0 items-center border-b border-flex-workspace-divider px-4">
                        <h2 className="min-w-0 flex-1 truncate text-sm font-semibold tracking-tight text-flex-text-primary">
                            {t(activeArea.labelKey)}
                        </h2>
                        <ContextSidebarToggle />
                    </div>

                    <nav
                        className="flex flex-col gap-5 px-3 py-4"
                        aria-label={t(activeArea.labelKey)}
                    >
                        {groups.map((group, groupIndex) => (
                            <section
                                key={group.groupTitleKey ?? groupIndex}
                                className="flex flex-col gap-1"
                            >
                                {(group.groupTitleKey || group.groupTitle) && (
                                    <h3 className="text-flex-text-tertiary px-2 pb-1 text-[11px] font-semibold tracking-[0.08em] uppercase">
                                        {group.groupTitleKey
                                            ? t(group.groupTitleKey)
                                            : group.groupTitle}
                                    </h3>
                                )}

                                {group.items.map((item) => {
                                    const isActive = activeHref === item.href;

                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            aria-current={
                                                isActive ? 'page' : undefined
                                            }
                                            className={`flex-focus-visible flex min-h-8 items-center gap-2 rounded-md border px-2.5 py-1.5 text-[13px] font-medium transition-colors duration-[var(--flex-duration-fast)] ${
                                                isActive
                                                    ? 'bg-flex-layer-selected border-flex-workspace-divider text-flex-text-primary'
                                                    : 'text-flex-text-tertiary hover:bg-flex-layer-hover border-transparent hover:text-flex-text-primary'
                                            }`}
                                        >
                                            <FlexIcon
                                                name={item.icon}
                                                className="size-4 shrink-0"
                                            />
                                            <span className="min-w-0 flex-1 truncate">
                                                {t(item.titleKey)}
                                            </span>
                                            {item.placeholder && (
                                                <span className="text-flex-text-tertiary shrink-0 rounded-sm border border-flex-workspace-divider px-1 py-0.5 text-[9px] leading-none font-medium">
                                                    {t('badges.comingSoon')}
                                                </span>
                                            )}
                                        </Link>
                                    );
                                })}
                            </section>
                        ))}
                    </nav>
                    <span
                        aria-hidden="true"
                        className="flex-rail-divider pointer-events-none absolute inset-y-0 right-0 w-px"
                    />
                </div>
            </div>
        </aside>
    );
}
