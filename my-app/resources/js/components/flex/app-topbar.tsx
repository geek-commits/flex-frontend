import { Link, usePage } from '@inertiajs/react';
import { RiWifiLine, RiMenuLine } from '@remixicon/react';
import React from 'react';
import { useCapabilities } from '@/auth/capabilities';
import { FlexBrandLogo } from '@/components/flex/brand';
import { useBrandIntroReplayGuard } from '@/components/flex/brand/use-brand-intro-replay-guard';
import { FlexProfileMenu } from '@/components/flex/flex-profile-menu';
import { GlobalSearchTrigger } from '@/components/flex/global-search';
import { FlexIcon } from '@/components/flex/iconography';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { TenantContextIndicator } from '@/features/tenants/tenant-context-indicator';
import { agentStateMap, connectionStateMap } from '@/lib/status-styles';
import type { AgentState, ConnectionState } from '@/types/flex';

export interface AppTopbarProps {
    title?: string;
    subtitle?: string;
    mode?: 'admin' | 'agent';
    agentState?: AgentState;
    onAgentStateChange?: (state: AgentState) => void;
    connectionState?: ConnectionState;
    actions?: React.ReactNode;
}

export function AppTopbar({
    title,
    subtitle,
    mode = 'admin',
    agentState = 'ready',
    onAgentStateChange,
    connectionState = 'live',
    actions,
}: AppTopbarProps) {
    const { url } = usePage();
    const animateOnMount = useBrandIntroReplayGuard();
    const { navEntries } = useCapabilities();

    const currentAgentConfig = agentStateMap[agentState];
    const connConfig = connectionStateMap[connectionState];

    const mobileNavItems = navEntries;

    return (
        <header className="h-14 bg-card border-b border-border px-4 flex items-center justify-between sticky top-0 z-20 shrink-0 select-none">
            {/* Title / Mobile Drawer Trigger */}
            <div className="flex items-center gap-2.5">
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
                        <nav className="flex flex-col gap-1 mt-2">
                            {mobileNavItems.map((item) => {
                                const isActive = url.startsWith(item.href);

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center gap-2.5 px-3 h-8 rounded-md text-[13px] font-medium transition-colors ${
                                            isActive
                                                ? 'bg-flex-layer-selected border border-flex-workspace-divider-strong text-flex-text-primary'
                                                : 'text-flex-text-tertiary hover:bg-flex-layer-hover hover:text-flex-text-primary border border-transparent'
                                        }`}
                                    >
                                        <FlexIcon name={item.icon} className="size-4" />
                                        <span>{item.title}</span>
                                    </Link>
                                );
                            })}
                        </nav>
                    </SheetContent>
                </Sheet>

                <div>
                    {title && (
                        <h1 className="text-sm font-semibold text-foreground tracking-tight">
                            {title}
                        </h1>
                    )}
                    {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
                </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-3">
                {actions}

                <GlobalSearchTrigger />

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

                {/* Tenant / Platform Context (admin only) — adjacent to profile */}
                <div data-call-island-zone="profile-tenant" className="flex items-center gap-3">
                    {mode === 'admin' && <TenantContextIndicator />}

                    {/* Profile / Account */}
                    <div className="pl-2 border-l border-border">
                        <FlexProfileMenu />
                    </div>
                </div>
            </div>
        </header>
    );
}
