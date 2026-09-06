import { Link, usePage } from '@inertiajs/react';
import { RiArrowDownSLine, RiMenuLine, RiWifiLine } from '@remixicon/react';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useCapabilities } from '@/auth/capabilities';
import {
    FLEX_NAVIGATION_AREAS,
    getFirstAccessibleHref,
    resolveActiveNavigationHref,
    resolveNavigationArea,
} from '@/auth/nav-domains';
import { FlexBrandLogo } from '@/components/flex/brand';
import { FlexProfileMenu } from '@/components/flex/flex-profile-menu';
import { GlobalSearchTrigger } from '@/components/flex/global-search';
import { FlexIcon } from '@/components/flex/iconography';
import { LanguageSwitcher } from '@/components/language-switcher';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { TenantContextIndicator } from '@/features/tenants/tenant-context-indicator';
import { agentStateMap, connectionStateMap } from '@/lib/status-styles';
import type { AgentState, ConnectionState } from '@/types/flex';

export interface AppTopbarProps {
    title?: string;
    mode?: 'admin' | 'agent';
    agentState?: AgentState;
    onAgentStateChange?: (state: AgentState) => void;
    connectionState?: ConnectionState;
    /** Agent-specific live controls rendered inside the shared global header. */
    operationalControls?: React.ReactNode;
}

export function AppTopbar({
    mode = 'admin',
    agentState = 'ready',
    onAgentStateChange,
    connectionState = 'live',
    operationalControls,
}: AppTopbarProps) {
    const { url } = usePage();
    const { has } = useCapabilities();
    const activeAreaId = resolveNavigationArea(url);
    const activeHref = resolveActiveNavigationHref(url, activeAreaId);
    const currentAgentConfig = agentStateMap[agentState];
    const connConfig = connectionStateMap[connectionState];

    const visibleAreas = useMemo(
        () =>
            FLEX_NAVIGATION_AREAS.filter(
                (area) => !area.capability || has(area.capability),
            )
                .map((area) => ({
                    ...area,
                    groups: area.groups
                        .map((group) => ({
                            ...group,
                            items: group.items.filter(
                                (item) =>
                                    !item.capability || has(item.capability),
                            ),
                        }))
                        .filter((group) => group.items.length > 0),
                }))
                .filter((area) => area.groups.length > 0),
        [has],
    );
    const homeHref = visibleAreas[0]
        ? getFirstAccessibleHref(visibleAreas[0], has)
        : '/dashboard';

    return (
        <header
            data-flex-global-header
            className="flex h-14 shrink-0 items-center border-b border-flex-workspace-divider bg-flex-workspace-surface select-none"
        >
            <div className="flex h-full shrink-0 items-center gap-2 border-r border-flex-workspace-divider px-3 md:w-[328px] md:px-4">
                <MobileNavigation
                    visibleAreas={visibleAreas}
                    activeAreaId={activeAreaId}
                    activeHref={activeHref}
                />
                <Link
                    href={homeHref}
                    className="flex-focus-visible rounded-sm"
                    aria-label="FLEX home"
                >
                    <FlexBrandLogo
                        variant="static"
                        animateOnMount={false}
                        decorative
                        className="h-auto !w-[96px] md:!w-[112px]"
                    />
                </Link>
            </div>

            <div className="grid min-w-0 flex-1 grid-cols-[1fr_auto] items-center gap-2 px-3 sm:grid-cols-[1fr_auto_1fr] md:px-4">
                <div className="hidden sm:block" aria-hidden="true" />
                <div className="justify-self-start sm:justify-self-center">
                    <GlobalSearchTrigger />
                </div>

                <div className="flex min-w-0 items-center gap-2 justify-self-end md:gap-3">
                    {operationalControls ??
                        (mode === 'agent' && (
                            <Select
                                value={agentState}
                                onValueChange={(value) =>
                                    onAgentStateChange?.(value as AgentState)
                                }
                            >
                                <SelectTrigger
                                    className="hover:bg-flex-layer-hover hidden h-8 w-32 gap-1.5 border-transparent bg-transparent px-2.5 text-[13px] font-medium shadow-none sm:flex"
                                    aria-label="Agent availability state"
                                >
                                    <span className="flex items-center gap-1.5 truncate">
                                        <span
                                            className={`size-2 rounded-full ${currentAgentConfig.dotClass}`}
                                            aria-hidden="true"
                                        />
                                        <SelectValue>
                                            {currentAgentConfig.label}
                                        </SelectValue>
                                    </span>
                                </SelectTrigger>
                                <SelectContent align="end">
                                    {(
                                        Object.keys(
                                            agentStateMap,
                                        ) as AgentState[]
                                    ).map((key) => {
                                        const config = agentStateMap[key];

                                        return (
                                            <SelectItem
                                                key={key}
                                                value={key}
                                                className="text-xs"
                                            >
                                                <span
                                                    className={`size-2 rounded-full ${config.dotClass}`}
                                                    aria-hidden="true"
                                                />
                                                <span>{config.label}</span>
                                            </SelectItem>
                                        );
                                    })}
                                </SelectContent>
                            </Select>
                        ))}

                    {connectionState !== 'live' && !operationalControls && (
                        <div
                            className={`hidden items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium lg:flex ${connConfig.bgClass} ${connConfig.textClass} ${connConfig.borderClass}`}
                        >
                            <RiWifiLine className="size-3.5" />
                            <span
                                className={`size-1.5 rounded-full ${connConfig.dotClass}`}
                            />
                            <span>{connConfig.label}</span>
                        </div>
                    )}

                    <LanguageSwitcher
                        variant="compact"
                        className="hidden lg:flex"
                    />
                    <div
                        data-call-island-zone="profile-tenant"
                        className="flex min-w-0 items-center gap-2 md:gap-3"
                    >
                        {mode === 'admin' && <TenantContextIndicator />}
                        <div className="border-l border-flex-workspace-divider pl-2">
                            <FlexProfileMenu />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

interface MobileNavigationProps {
    visibleAreas: typeof FLEX_NAVIGATION_AREAS;
    activeAreaId: ReturnType<typeof resolveNavigationArea>;
    activeHref: string | null;
}

function MobileNavigation({
    visibleAreas,
    activeAreaId,
    activeHref,
}: MobileNavigationProps) {
    const { t } = useTranslation('navigation');

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon-sm"
                    className="md:hidden"
                    aria-label={t('aria.openNavigation')}
                >
                    <RiMenuLine className="size-4" />
                </Button>
            </SheetTrigger>
            <SheetContent
                side="left"
                className="flex w-[min(22rem,92vw)] flex-col gap-0 p-0"
            >
                <SheetHeader className="border-b border-flex-workspace-divider px-4 py-4 text-left">
                    <SheetTitle>
                        <FlexBrandLogo
                            variant="static"
                            animateOnMount={false}
                            decorative
                            className="h-auto w-[124px]"
                            style={{ width: undefined }}
                        />
                    </SheetTitle>
                    <SheetDescription>
                        {t('aria.sidebarDescription')}
                    </SheetDescription>
                </SheetHeader>

                <nav
                    className="flex-1 overflow-y-auto px-3 py-3"
                    aria-label={t('aria.productDomains')}
                >
                    {visibleAreas.map((area) => (
                        <details
                            key={area.id}
                            open={activeAreaId === area.id}
                            className="group mb-1"
                        >
                            <summary className="hover:bg-flex-layer-hover flex-focus-visible flex min-h-10 cursor-pointer list-none items-center gap-2 rounded-md px-2.5 text-[13px] font-semibold text-flex-text-primary">
                                <FlexIcon name={area.icon} className="size-4" />
                                <span className="flex-1">
                                    {t(area.labelKey)}
                                </span>
                                <RiArrowDownSLine className="size-4 transition-transform group-open:rotate-180" />
                            </summary>

                            <div className="ml-4 border-l border-flex-workspace-divider py-1 pl-3">
                                {area.groups.map((group, groupIndex) => (
                                    <section
                                        key={group.groupTitleKey ?? groupIndex}
                                        className="pb-3 last:pb-1"
                                    >
                                        {(group.groupTitleKey ||
                                            group.groupTitle) && (
                                            <h3 className="text-flex-text-tertiary px-2 pt-1 pb-1 text-[10px] font-semibold tracking-[0.08em] uppercase">
                                                {group.groupTitleKey
                                                    ? t(group.groupTitleKey)
                                                    : group.groupTitle}
                                            </h3>
                                        )}
                                        <div className="flex flex-col gap-0.5">
                                            {group.items.map((item) => {
                                                const isActive =
                                                    activeHref === item.href;

                                                return (
                                                    <Link
                                                        key={item.href}
                                                        href={item.href}
                                                        aria-current={
                                                            isActive
                                                                ? 'page'
                                                                : undefined
                                                        }
                                                        className={`flex-focus-visible flex min-h-9 items-center gap-2 rounded-md px-2 text-[13px] font-medium ${
                                                            isActive
                                                                ? 'bg-flex-layer-selected text-flex-text-primary'
                                                                : 'text-flex-text-tertiary hover:bg-flex-layer-hover hover:text-flex-text-primary'
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
                                                            <span className="text-flex-text-tertiary rounded-sm border border-flex-workspace-divider px-1 py-0.5 text-[9px] leading-none">
                                                                {t(
                                                                    'badges.comingSoon',
                                                                )}
                                                            </span>
                                                        )}
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </section>
                                ))}
                            </div>
                        </details>
                    ))}
                </nav>
            </SheetContent>
        </Sheet>
    );
}
