import { Link, usePage } from '@inertiajs/react';
import { RiWifiLine, RiTimeLine, RiMenuLine, RiDashboard3Line, RiCustomerServiceLine, RiPhoneFindLine, RiMegaphoneLine, RiFileChartLine, RiRobotLine, RiServerLine, RiSettings4Line } from '@remixicon/react';
import React, { useState, useEffect } from 'react';
import { FlexBrandLogo } from '@/components/flex/brand';
import { useBrandIntroReplayGuard } from '@/components/flex/brand/use-brand-intro-replay-guard';
import { GlobalSearchTrigger } from '@/components/flex/global-search';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { agentStateMap, connectionStateMap } from '@/lib/status-styles';
import type { User } from '@/types';
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
    const { url, props } = usePage();
    const user = props.auth?.user as User | undefined;
    const animateOnMount = useBrandIntroReplayGuard();
    const [seconds, setSeconds] = useState(319); // 00:05:19 initial demonstration counter

    useEffect(() => {
        const timer = setInterval(() => {
            setSeconds((prev) => prev + 1);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTimer = (totalSec: number) => {
        const hrs = Math.floor(totalSec / 3600);
        const mins = Math.floor((totalSec % 3600) / 60);
        const secs = totalSec % 60;

        return [
            hrs > 0 ? String(hrs).padStart(2, '0') : null,
            String(mins).padStart(2, '0'),
            String(secs).padStart(2, '0'),
        ]
            .filter(Boolean)
            .join(':');
    };

    const currentAgentConfig = agentStateMap[agentState];
    const connConfig = connectionStateMap[connectionState];

    const mobileNavItems = [
        { title: 'Agent Workspace', href: '/agent', icon: RiCustomerServiceLine },
        { title: 'Contact Center Dashboard', href: '/dashboard', icon: RiDashboard3Line },
        { title: 'Management Console', href: '/admin/console', icon: RiMegaphoneLine },
        { title: 'Call Records (CDR)', href: '/admin/cdr', icon: RiPhoneFindLine },
        { title: 'Call Campaigns', href: '/admin/campaigns', icon: RiMegaphoneLine },
        { title: 'Reports & Analytics', href: '/admin/reports', icon: RiFileChartLine },
        { title: 'AI Center', href: '/admin/ai', icon: RiRobotLine },
        { title: 'System Infrastructure', href: '/admin/system', icon: RiServerLine },
        { title: 'Settings', href: '/settings/profile', icon: RiSettings4Line },
    ];

    return (
        <header className="h-14 bg-card border-b border-border px-4 flex items-center justify-between sticky top-0 z-20 shrink-0 select-none">
            {/* Title / Mobile Drawer Trigger */}
            <div className="flex items-center gap-2.5">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon-sm" className="md:hidden">
                            <RiMenuLine className="size-4" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-64 p-4 flex flex-col gap-4">
                        <SheetHeader>
                            <SheetTitle className="text-left">
                                <FlexBrandLogo className="w-40" animateOnMount={animateOnMount} decorative />
                            </SheetTitle>
                        </SheetHeader>
                        <nav className="flex flex-col gap-1 mt-2">
                            {mobileNavItems.map((item) => {
                                const isActive = url.startsWith(item.href);
                                const Icon = item.icon;

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                                            isActive
                                                ? 'bg-primary text-primary-foreground'
                                                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                        }`}
                                    >
                                        <Icon className="size-4" />
                                        <span>{item.title}</span>
                                    </Link>
                                );
                            })}
                        </nav>
                    </SheetContent>
                </Sheet>

                <div>
                    {title && (
                        <h1 className="text-sm font-semibold text-foreground tracking-tight flex items-center gap-2">
                            {title}
                            {mode === 'agent' && (
                                <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-primary/10 text-primary border border-primary/20">
                                    Agent Mode
                                </span>
                            )}
                        </h1>
                    )}
                    {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
                </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-3">
                {actions}

                <GlobalSearchTrigger />

                {/* Agent Specific Toolbar Controls */}
                {mode === 'agent' && (
                    <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-lg border border-border">
                        {/* Agent Presence Selector */}
                        <Select
                            value={agentState}
                            onValueChange={(val) => onAgentStateChange?.(val as AgentState)}
                        >
                            <SelectTrigger className="h-8 text-xs font-semibold px-2.5 bg-card border-border w-32">
                                <div className="flex items-center gap-1.5 truncate">
                                    <span className={`size-2 rounded-full ${currentAgentConfig.dotClass}`} />
                                    <SelectValue>{currentAgentConfig.label}</SelectValue>
                                </div>
                            </SelectTrigger>
                            <SelectContent align="end">
                                {(Object.keys(agentStateMap) as AgentState[]).map((key) => {
                                    const cfg = agentStateMap[key];

                                    return (
                                        <SelectItem key={key} value={key} className="text-xs">
                                            <div className="flex items-center gap-2">
                                                <span className={`size-2 rounded-full ${cfg.dotClass}`} />
                                                <span>{cfg.label}</span>
                                            </div>
                                        </SelectItem>
                                    );
                                })}
                            </SelectContent>
                        </Select>

                        {/* Session Timer */}
                        <div className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono font-semibold text-foreground bg-card rounded-md border border-border">
                            <RiTimeLine className="size-3.5 text-muted-foreground" />
                            <span>{formatTimer(seconds)}</span>
                        </div>
                    </div>
                )}

                {/* Connection Status Badge */}
                <div
                    className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${connConfig.bgClass} ${connConfig.textClass} ${connConfig.borderClass}`}
                >
                    <RiWifiLine className="size-3.5" />
                    <span className={`size-1.5 rounded-full ${connConfig.dotClass}`} />
                    <span>{connConfig.label}</span>
                </div>

                {/* User Role Badge */}
                <div className="flex items-center gap-2 pl-2 border-l border-border">
                    <div className="text-right hidden lg:block">
                        <div className="text-xs font-semibold text-foreground leading-none">
                            {user?.name || 'Super Administrator'}
                        </div>
                        <div className="text-[10px] text-muted-foreground font-medium mt-0.5">
                            {user?.email || 'admin@flex.com'}
                        </div>
                    </div>
                    <span className="size-2 rounded-full bg-status-live" title="Authenticated" />
                </div>
            </div>
        </header>
    );
}
