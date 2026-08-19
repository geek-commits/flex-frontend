import { router } from '@inertiajs/react';
import { RiPhoneLine, RiArrowRightLine } from '@remixicon/react';
import React, { useCallback, useState } from 'react';
import { DynamicIsland } from '@/components/smoothui/dynamic-island';
import {
    useActiveCallPresentation
    
} from '@/features/agent-workspace/state/use-active-call-presentation';
import type {ActiveCallPresentation} from '@/features/agent-workspace/state/use-active-call-presentation';
import { useCallTimer } from '@/features/dashboard/use-call-timer';

const STATE_LABEL: Record<string, string> = {
    connected: 'Connected',
    hold: 'Held',
    transferring: 'Transferring',
};

const DIRECTION_LABEL: Record<string, string> = {
    inbound: 'Inbound',
    outbound: 'Outbound',
};

const STATE_DOT_COLOR: Record<string, string> = {
    connected: 'bg-flex-status-success',
    hold: 'bg-flex-status-warning',
    transferring: 'bg-flex-status-warning',
};

/**
 * Shell-level active-call awareness island.
 *
 * Owns call presentation, FLEX styling, compact/expanded content, navigation,
 * and accessibility. It never owns the call — it reflects the canonical
 * workspace state and disappears as soon as the call is no longer live.
 */
export function FlexCallIsland() {
    const call = useActiveCallPresentation();

    if (!call) {
        return null;
    }

    return <FlexCallIslandSurface key={call.id} call={call} />;
}

function FlexCallIslandSurface({ call }: { call: ActiveCallPresentation }) {
    const [expanded, setExpanded] = useState(false);
    const duration = useCallTimer(call.connectedAt);

    const displayName = call.displayName || call.phoneNumber || 'Active call';
    const stateLabel = STATE_LABEL[call.state] ?? call.state;
    const metaParts = [call.queueName, call.direction ? DIRECTION_LABEL[call.direction] : null].filter(Boolean);

    const handleToggle = useCallback(() => setExpanded((value) => !value), []);

    const handleKeyDown = useCallback(
        (event: React.KeyboardEvent<HTMLDivElement>) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                setExpanded((value) => !value);
            } else if (event.key === 'Escape' && expanded) {
                event.preventDefault();
                setExpanded(false);
            }
        },
        [expanded],
    );

    const handleOpenCall = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        router.visit('/agent');
    }, []);

    return (
        <div className="pointer-events-none fixed inset-x-0 top-3 z-40 flex justify-center px-4">
            <div
                role="button"
                tabIndex={0}
                aria-label={`Active call with ${displayName}. ${expanded ? 'Close call details.' : 'Open call details.'}`}
                aria-expanded={expanded}
                className="pointer-events-auto cursor-pointer rounded-[32px] bg-flex-call-island text-flex-call-island-text shadow-flex-overlay outline-none focus-visible:ring-2 focus-visible:ring-flex-brand"
                onClick={handleToggle}
                onKeyDown={handleKeyDown}
            >
                <DynamicIsland
                    view={expanded ? 'expanded' : 'compact'}
                    compactContent={
                        <div className="flex min-w-0 items-center gap-2.5 px-4 py-2.5">
                            <RiPhoneLine className="size-4 shrink-0" />
                            <span className="min-w-0 truncate text-sm font-medium">{displayName}</span>
                            <span className="shrink-0 text-xs font-medium tabular-nums opacity-80">{duration}</span>
                        </div>
                    }
                    expandedContent={
                        <div className="w-72 px-4 py-3">
                            <div className="flex items-center justify-between gap-3">
                                <span className="min-w-0 truncate text-sm font-semibold">{displayName}</span>
                                <span className="shrink-0 text-xs font-medium tabular-nums opacity-80">{duration}</span>
                            </div>
                            {call.phoneNumber ? (
                                <div className="mt-1 text-xs tabular-nums text-flex-call-island-muted">{call.phoneNumber}</div>
                            ) : null}
                            {metaParts.length > 0 ? (
                                <div className="mt-0.5 text-xs text-flex-call-island-muted">{metaParts.join(' · ')}</div>
                            ) : null}
                            <div className="mt-3 flex items-center justify-between gap-3 border-t border-white/10 pt-3">
                                <span className="flex items-center gap-1.5 text-xs font-medium">
                                    <span
                                        aria-hidden
                                        className={`size-1.5 rounded-full ${STATE_DOT_COLOR[call.state] ?? 'bg-flex-status-success'}`}
                                    />
                                    {stateLabel}
                                </span>
                                <button
                                    type="button"
                                    onClick={handleOpenCall}
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-flex-brand px-2.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-flex-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-flex-brand"
                                >
                                    Open Call
                                    <RiArrowRightLine className="size-3.5" />
                                </button>
                            </div>
                        </div>
                    }
                />
            </div>
        </div>
    );
}