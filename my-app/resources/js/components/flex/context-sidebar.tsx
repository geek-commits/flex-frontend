import { usePage } from '@inertiajs/react';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useCapabilities } from '@/auth/capabilities';
import {
    FLEX_NAVIGATION_AREAS,
    resolveActiveNavigationHref,
    resolveNavigationArea,
} from '@/auth/nav-domains';
import { FlexIcon } from '@/components/flex/iconography';
import {
    Sidebar001,
    Sidebar001Content,
    Sidebar001Item,
    Sidebar001Section,
} from '@/components/unlumen-ui/sidebar-001';

/**
 * Complete contextual tree for the selected workspace or Settings area.
 * Groups remain expanded on desktop so orientation never resets between pages.
 */
export function ContextSidebar() {
    const { url } = usePage();
    const { has } = useCapabilities();
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
            data-flex-context-sidebar
            className="sticky top-0 hidden h-full shrink-0 md:flex"
        >
            <Sidebar001
                defaultWidth={256}
                minWidth={256}
                maxWidth={256}
                className="h-full"
            >
                <div className="flex h-12 shrink-0 items-center border-b border-flex-workspace-divider px-4">
                    <h2 className="truncate text-sm font-semibold tracking-tight text-flex-text-primary">
                        {t(activeArea.labelKey)}
                    </h2>
                </div>

                <Sidebar001Content className="px-3 py-3">
                    <nav
                        className="flex flex-col gap-1"
                        aria-label={t(activeArea.labelKey)}
                    >
                        {groups.map((group, groupIndex) => (
                            <Sidebar001Section
                                key={group.groupTitleKey ?? groupIndex}
                                label={
                                    (group.groupTitleKey || group.groupTitle) ? (
                                        <h3 className="px-2 text-[11px] font-semibold tracking-[0.08em] text-flex-text-tertiary uppercase">
                                            {group.groupTitleKey
                                                ? t(group.groupTitleKey)
                                                : group.groupTitle}
                                        </h3>
                                    ) : undefined
                                }
                                className="gap-1"
                            >
                                {group.items.map((item) => {
                                    const isActive = activeHref === item.href;

                                    return (
                                        <Sidebar001Item
                                            key={item.href}
                                            href={item.href}
                                            isActive={isActive}
                                            label={
                                                <span className="flex min-w-0 items-center gap-2">
                                                    <FlexIcon
                                                        name={item.icon}
                                                        className="size-4 shrink-0"
                                                    />
                                                    <span className="min-w-0 truncate">
                                                        {t(item.titleKey)}
                                                    </span>
                                                    {item.placeholder && (
                                                        <span className="text-flex-text-tertiary shrink-0 rounded-sm border border-flex-workspace-divider px-1 py-0.5 text-[9px] leading-none font-medium">
                                                            {t('badges.comingSoon')}
                                                        </span>
                                                    )}
                                                </span>
                                            }
                                            className={`flex-focus-visible min-h-9 rounded-md text-[13px] font-medium transition-colors duration-[var(--flex-duration-fast)] ${
                                                isActive
                                                    ? 'bg-flex-layer-selected text-flex-text-primary'
                                                    : 'text-flex-text-tertiary hover:text-flex-text-primary'
                                            }`}
                                        />
                                    );
                                })}
                            </Sidebar001Section>
                        ))}
                    </nav>
                </Sidebar001Content>
            </Sidebar001>
        </aside>
    );
}
