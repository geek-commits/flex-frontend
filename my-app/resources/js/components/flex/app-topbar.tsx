import { RiWifiLine } from '@remixicon/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FlexProfileMenu } from '@/components/flex/flex-profile-menu';
import { GlobalSearchTrigger } from '@/components/flex/global-search';
import { FlexIcon } from '@/components/flex/iconography';
import { LanguageSwitcher } from '@/components/language-switcher';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { TenantContextIndicator } from '@/features/tenants/tenant-context-indicator';
import { useAppearance } from '@/hooks/use-appearance';
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
    const { appearance, updateAppearance } = useAppearance();
    const { t } = useTranslation(['navigation', 'agent', 'supervision', 'common']);

    const currentAgentConfig = agentStateMap[agentState];
    const connConfig = connectionStateMap[connectionState];

    return (
        <header className="h-12 bg-flex-workspace-surface border-b border-flex-workspace-divider px-3 md:px-4 grid grid-cols-[1fr_auto_1fr] items-center sticky top-0 z-20 shrink-0 select-none">
            <div className="flex items-center gap-2.5 justify-self-start">
                <SidebarTrigger aria-label={t('navigation:aria.toggleSidebar')} />
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
                            aria-label={t('agent:status.ariaLabel')}
                        >
                            <span className="flex items-center gap-1.5 truncate">
                                <span className={`size-2 rounded-full ${currentAgentConfig.dotClass}`} aria-hidden="true" />
                                <SelectValue>{t(`agent:${currentAgentConfig.labelKey}`, currentAgentConfig.label)}</SelectValue>
                            </span>
                        </SelectTrigger>
                        <SelectContent align="end">
                            {(Object.keys(agentStateMap) as AgentState[]).map((key) => {
                                const cfg = agentStateMap[key];

                                return (
                                    <SelectItem key={key} value={key} className="text-xs">
                                        <span className={`size-2 rounded-full ${cfg.dotClass}`} aria-hidden="true" />
                                        <span>{t(`agent:${cfg.labelKey}`, cfg.label)}</span>
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
                        <span>{t(`supervision:${connConfig.labelKey}`, connConfig.label)}</span>
                    </div>
                )}

                {/* Language Switcher — shared control for EN/SW/FR */}
                <LanguageSwitcher variant="compact" className="hidden sm:flex" />

                <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => updateAppearance(appearance === 'dark' ? 'light' : 'dark')}
                    aria-label={t('common:settings.appearance.toggleTheme')}
                >
                    <FlexIcon name={appearance === 'dark' ? 'sun' : 'moon'} size="sm" aria-hidden="true" />
                </Button>

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
