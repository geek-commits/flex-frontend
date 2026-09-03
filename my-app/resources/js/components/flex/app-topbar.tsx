import { Link, usePage } from '@inertiajs/react';
import { RiWifiLine, RiMenuLine } from '@remixicon/react';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useCapabilities } from '@/auth/capabilities';
import { FLEX_DOMAINS, isActiveRoute } from '@/auth/nav-domains';
import { FlexBrandLogo } from '@/components/flex/brand';
import { useBrandIntroReplayGuard } from '@/components/flex/brand/use-brand-intro-replay-guard';
import { FlexProfileMenu } from '@/components/flex/flex-profile-menu';
import { GlobalSearchTrigger } from '@/components/flex/global-search';
import { FlexIcon } from '@/components/flex/iconography';
import { LanguageSwitcher } from '@/components/language-switcher';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { TenantContextIndicator } from '@/features/tenants/tenant-context-indicator';
import { agentStateMap, connectionStateMap } from '@/lib/status-styles';
import type { AgentState, ConnectionState } from '@/types/flex';

export interface AppTopbarProps {
    title?: string;
    mode?: 'admin' | 'agent';
    agentState?: AgentState;
    onAgentStateChange?: (state: AgentState) => void;
    connectionState?: ConnectionState;
}

export function AppTopbar({
    title,
    mode = 'admin',
    agentState = 'ready',
    onAgentStateChange,
    connectionState = 'live',
}: AppTopbarProps) {
    const { url } = usePage();
    const animateOnMount = useBrandIntroReplayGuard();
    const { has } = useCapabilities();
    const { t } = useTranslation('navigation');

    const currentAgentConfig = agentStateMap[agentState];
    const connConfig = connectionStateMap[connectionState];

    const visibleMobileDomains = useMemo(() => {
        return FLEX_DOMAINS.filter((domain) => has(domain.capability))
            .map((domain) => ({
                ...domain,
                groups: domain.groups
                    .map((group) => ({
                        ...group,
                        items: group.items.filter((item) => !item.capability || has(item.capability)),
                    }))
                    .filter((group) => group.items.length > 0),
            }))
            .filter((domain) => domain.groups.length > 0);
    }, [has]);

    return (
        <header className="h-11 bg-flex-workspace-surface border-b border-flex-workspace-divider px-3 md:px-4 grid grid-cols-[1fr_auto_1fr] items-center sticky top-0 z-20 shrink-0 select-none">
            {/* Left slot — mobile drawer trigger (layout-balancing column on desktop) */}
            <div className="flex items-center gap-2.5 justify-self-start">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon-sm" className="md:hidden" aria-label="Open navigation">
                            <RiMenuLine className="size-4" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-64 p-4 flex flex-col gap-4">
                        <SheetHeader>
                            <SheetTitle className="text-left">
                                <FlexBrandLogo variant="sidebar" animateOnMount={animateOnMount} decorative />
                            </SheetTitle>
                        </SheetHeader>
                        <nav className="flex flex-col gap-1 mt-2 overflow-y-auto">
                            {visibleMobileDomains.map((domain) => (
                                <div key={domain.id} className="flex flex-col gap-1">
                                    <p className="px-3 pt-2 text-[11px] font-semibold uppercase tracking-wider text-flex-text-tertiary">
                                        {t(domain.labelKey)}
                                    </p>
                                    {domain.groups.map((group, gi) => (
                                        <div key={`${domain.id}-${gi}`} className="flex flex-col gap-1">
                                            {(group.groupTitleKey || group.groupTitle) && (
                                                <p className="px-3 pt-1 text-[11px] font-medium text-flex-text-tertiary">
                                                    {group.groupTitleKey ? t(group.groupTitleKey) : group.groupTitle}
                                                </p>
                                            )}
                                            {group.items.map((item) => {
                                                const isActive = isActiveRoute(url, item.href);

                                                return (
                                                    <Link
                                                        key={item.href}
                                                        href={item.href}
                                                        aria-current={isActive ? 'page' : undefined}
                                                        className={`flex items-center gap-2.5 px-3 h-8 rounded-md text-[13px] font-medium transition-colors ${
                                                            isActive
                                                                ? 'bg-flex-layer-selected text-flex-text-primary'
                                                                : 'text-flex-text-tertiary hover:bg-flex-layer-hover hover:text-flex-text-primary border border-transparent'
                                                        }`}
                                                    >
                                                        <FlexIcon name={item.icon} className="size-4" />
                                                        <span>{t(item.titleKey)}</span>
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </nav>
                        <div className="mt-4 border-t border-flex-workspace-divider pt-4">
                            <LanguageSwitcher />
                        </div>
                    </SheetContent>
                </Sheet>

                <div>
                    {title && (
                        <h1 className="hidden lg:block text-sm font-semibold text-flex-text-primary tracking-tight">
                            {title}
                        </h1>
                    )}
                </div>
            </div>

            {/* Centered global search — centers within main-area width on desktop */}
            <div className="justify-self-center">
                <GlobalSearchTrigger />
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-2 md:gap-3 justify-self-end">

                {/* Agent State — compact ghost selector (transparent default, subtle hover) */}
                {mode === 'agent' && (
                    <Select
                        value={agentState}
                        onValueChange={(val) => onAgentStateChange?.(val as AgentState)}
                    >
                        <SelectTrigger
                            className="h-8 w-32 gap-1.5 rounded-md border border-transparent bg-transparent px-2.5 text-[13px] font-medium text-flex-text-primary shadow-none hover:bg-flex-layer-hover data-[state=open]:bg-flex-layer-active focus-visible:ring-2 focus-visible:ring-ring"
                            aria-label="Agent availability state"
                        >
                            <span className="flex items-center gap-1.5 truncate">
                                <span className={`size-2 rounded-full ${currentAgentConfig.dotClass}`} aria-hidden="true" />
                                <SelectValue>{currentAgentConfig.label}</SelectValue>
                            </span>
                        </SelectTrigger>
                        <SelectContent align="end">
                            {(Object.keys(agentStateMap) as AgentState[]).map((key) => {
                                const cfg = agentStateMap[key];

                                return (
                                    <SelectItem key={key} value={key} className="text-xs">
                                        <span className={`size-2 rounded-full ${cfg.dotClass}`} aria-hidden="true" />
                                        <span>{cfg.label}</span>
                                    </SelectItem>
                                );
                            })}
                        </SelectContent>
                    </Select>
                )}

                {/* Connection Status Badge — hidden when healthy (§25 show nothing if live) */}
                {connectionState !== 'live' && (
                    <div
                        className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${connConfig.bgClass} ${connConfig.textClass} ${connConfig.borderClass}`}
                    >
                        <RiWifiLine className="size-3.5" />
                        <span className={`size-1.5 rounded-full ${connConfig.dotClass}`} />
                        <span>{connConfig.label}</span>
                    </div>
                )}

                {/* Language Switcher — shared control for EN/SW/FR */}
                <LanguageSwitcher variant="compact" className="hidden sm:flex" />

                {/* Tenant / Platform Context (admin only) — adjacent to profile */}
                <div data-call-island-zone="profile-tenant" className="flex items-center gap-2 md:gap-3">
                    {mode === 'admin' && <TenantContextIndicator />}

                    {/* Profile / Account */}
                    <div className="pl-2 border-l border-flex-workspace-divider">
                        <FlexProfileMenu />
                    </div>
                </div>
            </div>
        </header>
    );
}