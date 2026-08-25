import { router, usePage } from '@inertiajs/react';
import { RiPhoneLine, RiArrowRightLine } from '@remixicon/react';
import { motion } from 'motion/react';
import React, { useCallback, useState } from 'react';
import { useCallIslandDrag } from '@/components/flex/call-island/use-call-island-drag';
import { useCallIslandMetrics } from '@/components/flex/call-island/use-call-island-metrics';
import { useCallIslandSafeZones } from '@/components/flex/call-island/use-call-island-safe-zones';
import { DynamicIsland } from '@/components/smoothui/dynamic-island';
import { useActiveCallPresentation } from '@/features/agent-workspace/state/use-active-call-presentation';
import type { ActiveCallPresentation } from '@/features/agent-workspace/state/use-active-call-presentation';
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
 *
 * The compact island is freely draggable; on release it magnetically snaps to
 * the nearest safe semantic anchor. The expanded island stays stationary at its
 * current anchor. The preferred anchor is persisted as a semantic value.
 */
export function FlexCallIsland() {
    const call = useActiveCallPresentation();
    const { url } = usePage();
    const pathname = url.split(/[?#]/)[0].replace(/\/+$/, '') || '/';

    if (!call || pathname === '/agent') {
        return null;
    }

    return <FlexCallIslandSurface key={call.id} call={call} />;
}

function FlexCallIslandSurface({ call }: { call: ActiveCallPresentation }) {
    const [expanded, setExpanded] = useState(false);
    const duration = useCallTimer(call.connectedAt);
    const { viewport, safeArea, islandRef, islandSize } =
        useCallIslandMetrics();
    const safeZones = useCallIslandSafeZones();
    const drag = useCallIslandDrag({
        enabled: !expanded,
        viewport,
        islandSize,
        safeArea,
        safeZones,
    });

    const displayName = call.displayName || call.phoneNumber || 'Active call';
    const stateLabel = STATE_LABEL[call.state] ?? call.state;
    const metaParts = [
        call.queueName,
        call.direction ? DIRECTION_LABEL[call.direction] : null,
    ].filter(Boolean);
    const { didDrag } = drag;

    const handleToggle = useCallback(() => {
        if (didDrag()) {
            return;
        }

        setExpanded((value) => !value);
    }, [didDrag]);

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

    const handleOpenCall = useCallback(
        (event: React.MouseEvent<HTMLButtonElement>) => {
            event.stopPropagation();
            router.visit('/agent');
        },
        [],
    );

    return (
        <div className="pointer-events-none fixed inset-0 z-40">
            <motion.div
                ref={islandRef}
                style={{ x: drag.x, y: drag.y }}
                role="button"
                tabIndex={0}
                aria-label={`Active call with ${displayName}. ${expanded ? 'Close call details.' : 'Open call details.'}`}
                aria-expanded={expanded}
                className="pointer-events-auto absolute top-0 left-0 cursor-grab rounded-[32px] bg-flex-call-island text-flex-call-island-text shadow-flex-overlay outline-none focus-visible:ring-2 focus-visible:ring-flex-brand active:cursor-grabbing"
                onClick={handleToggle}
                onKeyDown={handleKeyDown}
                {...drag.dragProps}
            >
                <DynamicIsland
                    view={expanded ? 'expanded' : 'compact'}
                    compactContent={
                        <div className="flex min-w-0 items-center gap-2.5 px-4 py-2.5">
                            <RiPhoneLine className="size-4 shrink-0" />
                            <span className="min-w-0 truncate text-sm font-medium">
                                {displayName}
                            </span>
                            <span className="shrink-0 text-xs font-medium tabular-nums opacity-80">
                                {duration}
                            </span>
                        </div>
                    }
                    expandedContent={
                        <div className="w-72 px-4 py-3">
                            <div className="flex items-center justify-between gap-3">
                                <span className="min-w-0 truncate text-sm font-semibold">
                                    {displayName}
                                </span>
                                <span className="shrink-0 text-xs font-medium tabular-nums opacity-80">
                                    {duration}
                                </span>
                            </div>
                            {call.phoneNumber ? (
                                <div className="mt-1 text-xs text-flex-call-island-muted tabular-nums">
                                    {call.phoneNumber}
                                </div>
                            ) : null}
                            {metaParts.length > 0 ? (
                                <div className="mt-0.5 text-xs text-flex-call-island-muted">
                                    {metaParts.join(' · ')}
                                </div>
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
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-flex-brand px-2.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-flex-brand-hover focus-visible:ring-2 focus-visible:ring-flex-brand focus-visible:outline-none"
                                >
                                    Open Call
                                    <RiArrowRightLine className="size-3.5" />
                                </button>
                            </div>
                        </div>
                    }
                />
            </motion.div>
        </div>
    );
}
