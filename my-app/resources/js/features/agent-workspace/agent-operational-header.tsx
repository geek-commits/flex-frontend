import { Link, usePage } from '@inertiajs/react';
import { RiMenuLine } from '@remixicon/react';
import React from 'react';
import { useCapabilities } from '@/auth/capabilities';
import { FlexBrandLogo } from '@/components/flex/brand';
import { useBrandIntroReplayGuard } from '@/components/flex/brand/use-brand-intro-replay-guard';
import { FlexProfileMenu } from '@/components/flex/flex-profile-menu';
import { GlobalSearchTrigger } from '@/components/flex/global-search';
import { FlexIcon } from '@/components/flex/iconography';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import type { AgentState, ConnectionState } from '@/types/flex';
import { AgentStateControl } from './agent-state-control';
import { ConnectionStatus } from './connection-status';
import { SessionTimer } from './session-timer';

export interface AgentOperationalHeaderProps {
    agentState: AgentState;
    onAgentStateChange: (state: AgentState) => void;
    pendingState?: AgentState | null;
    stateError?: string | null;
    connectionState: ConnectionState;
    sessionStartedAt?: string;
    title?: string;
    subtitle?: string;
}

/**
 * Agent operational header — not a generic SaaS topbar (AGENT_WORKSPACE_PLAN §17).
 * Operational priority: Agent State → Telephony Connection → Timer, then generic
 * search/account chrome.
 */
export function AgentOperationalHeader({
    agentState,
    onAgentStateChange,
    pendingState,
    stateError,
    connectionState,
    sessionStartedAt,
    title = 'Agent Workspace',
    subtitle = 'External CRM & Central Call Manager',
}: AgentOperationalHeaderProps) {
    const { url } = usePage();
    const { navEntries } = useCapabilities();
    const animateOnMount = useBrandIntroReplayGuard();

    return (
        <header className="h-14 bg-card border-b border-border px-4 flex items-center justify-between gap-3 sticky top-0 z-20 shrink-0 select-none">
            {/* Title / Mobile Drawer */}
            <div className="flex items-center gap-2.5 min-w-0">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon-sm" className="md:hidden">
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
                            {navEntries.map((item) => {
                                const isActive = url.startsWith(item.href);

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
                                        <FlexIcon name={item.icon} className="size-4" />
                                        <span>{item.title}</span>
                                    </Link>
                                );
                            })}
                        </nav>
                    </SheetContent>
                </Sheet>

                <div className="min-w-0">
                    <h1 className="text-sm font-semibold text-foreground tracking-tight flex items-center gap-2">
                        {title}
                        <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-primary/10 text-primary border border-primary/20">
                            Agent Mode
                        </span>
                    </h1>
                    <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
                </div>
            </div>

            {/* Operational Controls */}
            <div className="flex items-center gap-3">
                <AgentStateControl
                    state={agentState}
                    onSelect={onAgentStateChange}
                    pendingState={pendingState}
                    error={stateError}
                />

                <ConnectionStatus state={connectionState} />

                <SessionTimer startedAt={sessionStartedAt} />

                <GlobalSearchTrigger />

                {/* Profile / Account */}
                <div className="flex items-center gap-2 pl-2 border-l border-border">
                    <FlexProfileMenu />
                </div>
            </div>
        </header>
    );
}
