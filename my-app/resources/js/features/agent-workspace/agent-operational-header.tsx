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
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
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
    /** Optional Agent Assist toggle control, rendered before the profile cluster. */
    assistSlot?: React.ReactNode;
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
    assistSlot,
}: AgentOperationalHeaderProps) {
    const { url } = usePage();
    const { navEntries } = useCapabilities();
    const animateOnMount = useBrandIntroReplayGuard();

    return (
        <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border bg-card px-4 select-none">
            {/* Title / Mobile Drawer */}
            <div className="flex min-w-0 items-center gap-2.5">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            className="md:hidden"
                        >
                            <RiMenuLine className="size-4" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent
                        side="left"
                        className="flex w-64 flex-col gap-4 p-4"
                    >
                        <SheetHeader>
                            <SheetTitle className="text-left">
                                <FlexBrandLogo
                                    variant="sidebar"
                                    animateOnMount={animateOnMount}
                                    decorative
                                />
                            </SheetTitle>
                        </SheetHeader>
                        <nav className="mt-2 flex flex-col gap-1">
                            {navEntries.map((item) => {
                                const isActive = url.startsWith(item.href);

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                                            isActive
                                                ? 'bg-primary text-primary-foreground'
                                                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                        }`}
                                    >
                                        <FlexIcon
                                            name={item.icon}
                                            className="size-4"
                                        />
                                        <span>{item.title}</span>
                                    </Link>
                                );
                            })}
                        </nav>
                    </SheetContent>
                </Sheet>

                <div className="min-w-0">
                    <h1 className="flex items-center gap-2 text-sm font-semibold tracking-tight text-foreground">
                        {title}
                        <span className="rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary uppercase">
                            Agent Mode
                        </span>
                    </h1>
                    <p className="truncate text-xs text-muted-foreground">
                        {subtitle}
                    </p>
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

                {assistSlot}

                {/* Profile / Account */}
                <div
                    data-call-island-zone="profile-tenant"
                    className="flex items-center gap-2 border-l border-border pl-2"
                >
                    <FlexProfileMenu />
                </div>
            </div>
        </header>
    );
}
