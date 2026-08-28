import { router, usePage } from '@inertiajs/react';
/* eslint-disable react-hooks/preserve-manual-memoization, no-empty -- vendor island memo */
import { RiPhoneLine, RiArrowRightLine, RiSparklingLine } from '@remixicon/react';
import { motion } from 'motion/react';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCallIslandDrag } from '@/components/flex/call-island/use-call-island-drag';
import { useCallIslandMetrics } from '@/components/flex/call-island/use-call-island-metrics';
import { useCallIslandSafeZones } from '@/components/flex/call-island/use-call-island-safe-zones';
import { DynamicIsland } from '@/components/smoothui/dynamic-island';
import { useAgentAssistSessionOptional } from '@/features/agent-workspace/agent-assist/agent-assist-session-context';
import { useActiveCallPresentation } from '@/features/agent-workspace/state/use-active-call-presentation';
import type { ActiveCallPresentation } from '@/features/agent-workspace/state/use-active-call-presentation';
import { useCallTimer } from '@/features/dashboard/use-call-timer';

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
    const { t } = useTranslation('agent');
    const [expanded, setExpanded] = useState(false);
    const duration = useCallTimer(call.connectedAt);

    const STATE_LABEL: Record<string, string> = {
        connected: t('dynamicIsland.connected'),
        hold: t('dynamicIsland.held'),
        transferring: t('dynamicIsland.transferring'),
    };

    const DIRECTION_LABEL: Record<string, string> = {
        inbound: t('dynamicIsland.inbound'),
        outbound: t('dynamicIsland.outbound'),
    };
    const { viewport, safeArea, islandRef, islandSize } = useCallIslandMetrics();
    const safeZones = useCallIslandSafeZones();
    const drag = useCallIslandDrag({
        enabled: !expanded,
        viewport,
        islandSize,
        safeArea,
        safeZones,
    });
    const assist = useAgentAssistSessionOptional();

    const assistLive = !!assist && assist.sessionState !== 'idle' && assist.sessionState !== 'ended';
    const assistLanguage = assist?.language;
    const latestFinal = useMemo(() => {
        if (!assist?.segments.length) {
            return null;
        }

        const finals = assist.segments.filter((s) => s.status === 'final');

        return finals.length ? finals[finals.length - 1] : null;
    }, [assist?.segments]);

    const displayName = call.displayName || call.phoneNumber || t('dynamicIsland.activeCall');
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

    const handleOpenAssist = useCallback(
        (event: React.MouseEvent<HTMLButtonElement>) => {
            event.stopPropagation();

            try {
                assist?.openAssist();
            } catch {}

            router.visit('/agent');
        },
        [assist],
    );

    return (
        <div className="pointer-events-none fixed inset-0 z-40">
            <motion.div
                ref={islandRef}
                style={{ x: drag.x, y: drag.y }}
                role="button"
                tabIndex={0}
                aria-label={`${t('dynamicIsland.activeCallWith', { name: displayName })}. ${expanded ? t('dynamicIsland.closeDetails') : t('dynamicIsland.openDetails')}`}
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
                            <span className="min-w-0 truncate text-sm font-medium">{displayName}</span>
                            {assistLive && (
                                <RiSparklingLine
                                    className="size-3.5 shrink-0 text-amber-300"
                                    aria-label={t('dynamicIsland.assistLiveLabel')}
                                    aria-hidden={false}
                                />
                            )}
                            <span className="shrink-0 text-xs font-medium tabular-nums opacity-80">{duration}</span>
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
                            {assistLive && (
                                <div className="mt-3 border-t border-white/10 pt-3 space-y-1.5">
                                    <div className="flex items-center gap-1.5 text-xs text-white/80">
                                        <RiSparklingLine className="size-3.5 shrink-0" aria-hidden />
                                        <span className="font-medium">{t('dynamicIsland.assistLive')}</span>
                                        {assistLanguage && !assistLanguage.isDetecting && (
                                            <span className="opacity-70">· {assistLanguage.label}</span>
                                        )}
                                        {assistLanguage?.isDetecting && <span className="opacity-70">· {t('dynamicIsland.detectingLanguage')}</span>}
                                    </div>
                                    {latestFinal && (
                                        <p className="line-clamp-2 text-xs leading-relaxed text-white/85">
                                            “{latestFinal.text}”
                                        </p>
                                    )}
                                </div>
                            )}
                            <div className="mt-3 flex items-center justify-between gap-3 border-t border-white/10 pt-3">
                                <span className="flex items-center gap-1.5 text-xs font-medium">
                                    <span
                                        aria-hidden
                                        className={`size-1.5 rounded-full ${STATE_DOT_COLOR[call.state] ?? 'bg-flex-status-success'}`}
                                    />
                                    {stateLabel}
                                </span>
                                <span className="inline-flex items-center gap-1.5">
                                    {assistLive && (
                                        <button
                                            type="button"
                                            onClick={handleOpenAssist}
                                            className="inline-flex items-center gap-1 rounded-lg bg-white/15 px-2.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none"
                                        >
                                            {t('dynamicIsland.openAssist')}
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        onClick={handleOpenCall}
                                        className="inline-flex items-center gap-1.5 rounded-lg bg-flex-brand px-2.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-flex-brand-hover focus-visible:ring-2 focus-visible:ring-flex-brand focus-visible:outline-none"
                                    >
                                        {t('dynamicIsland.openCall')}
                                        <RiArrowRightLine className="size-3.5" />
                                    </button>
                                </span>
                            </div>
                        </div>
                    }
                />
            </motion.div>
        </div>
    );
}