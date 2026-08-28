import { Link, usePage } from '@inertiajs/react';
import { RiMenuLine } from '@remixicon/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useCapabilities } from '@/auth/capabilities';
import { isActiveRoute } from '@/auth/nav-domains';
import { FlexBrandLogo } from '@/components/flex/brand';
import { useBrandIntroReplayGuard } from '@/components/flex/brand/use-brand-intro-replay-guard';
import { FlexProfileMenu } from '@/components/flex/flex-profile-menu';
import { GlobalSearchTrigger } from '@/components/flex/global-search';
import { FlexIcon } from '@/components/flex/iconography';
import { LanguageSwitcher } from '@/components/language-switcher';
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

export interface AgentOperationalHeaderProps {
    agentState: AgentState;
    onAgentStateChange: (state: AgentState) => void;
    pendingState?: AgentState | null;
    stateError?: string | null;
    connectionState: ConnectionState;
    title?: string;
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
    title = 'Agent Workspace',
}: AgentOperationalHeaderProps) {
    const { url } = usePage();
    const { navEntries } = useCapabilities();
    const { t } = useTranslation('navigation');
    const animateOnMount = useBrandIntroReplayGuard();

    return (
        <header className="sticky top-0 z-20 flex h-11 shrink-0 select-none items-center justify-between gap-3 border-b border-flex-workspace-divider bg-flex-workspace-surface px-3 md:px-4">
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
                                const isActive = isActiveRoute(url, item.href);

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
                                        <span>{t(item.titleKey as string)}</span>
                                    </Link>
                                );
                            })}
                        </nav>
                        <div className="mt-4 border-t border-border pt-4">
                            <LanguageSwitcher />
                        </div>
                    </SheetContent>
                </Sheet>

                <div className="min-w-0">
                    <h1 className="truncate text-sm font-semibold tracking-tight text-flex-text-primary">{title}</h1>
                </div>
            </div>

            {/* Operational Controls */}
            <div className="flex flex-wrap items-center gap-2 md:flex-nowrap md:justify-end md:gap-3">
                <AgentStateControl
                    state={agentState}
                    onSelect={onAgentStateChange}
                    pendingState={pendingState}
                    error={stateError}
                    className="min-w-28"
                />

                <ConnectionStatus state={connectionState} />

                <LanguageSwitcher variant="compact" className="hidden sm:flex" />
                <div className="ml-auto flex items-center gap-1 border-l border-border pl-1 md:ml-0 md:pl-2">
                    <GlobalSearchTrigger />

                    {/* Profile / Account */}
                    <div
                        data-call-island-zone="profile-tenant"
                        className="flex items-center"
                    >
                        <FlexProfileMenu />
                    </div>
                </div>
            </div>
        </header>
    );
}
