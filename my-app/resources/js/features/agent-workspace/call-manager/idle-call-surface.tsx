import { RiSearchLine } from '@remixicon/react';
import React from 'react';
import { Input } from '@/components/ui/input';
import type { CallHistoryEntry, CallTarget } from '../state/workspace-types';
import { Dialer } from './dialer';

export interface IdleCallSurfaceProps {
    dialNumber: string;
    onDialNumberChange: (value: string) => void;
    activeTab: 'dialer' | 'history';
    onTabChange: (tab: 'dialer' | 'history') => void;
    history: CallHistoryEntry[];
    onDial: (target: CallTarget) => void;
    onCallFromHistory: (target: CallTarget) => void;
}

/**
 * Quiet idle state: dialer and lightweight call history (AGENT_WORKSPACE_PLAN
 * §25, §46). Active-call controls are never shown here as a sea of disabled
 * buttons.
 */
export function IdleCallSurface({
    dialNumber,
    onDialNumberChange,
    activeTab,
    onTabChange,
    history,
    onDial,
    onCallFromHistory,
}: IdleCallSurfaceProps) {
    return (
        <>
            <div className="flex items-center border-b border-border bg-muted/20 px-2 shrink-0">
                <button
                    type="button"
                    onClick={() => onTabChange('dialer')}
                    aria-pressed={activeTab === 'dialer'}
                    className={`flex-1 py-2 text-center text-xs font-semibold border-b-2 transition-colors ${
                        activeTab === 'dialer'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                >
                    Dialer
                </button>
                <button
                    type="button"
                    onClick={() => onTabChange('history')}
                    aria-pressed={activeTab === 'history'}
                    className={`flex-1 py-2 text-center text-xs font-semibold border-b-2 transition-colors ${
                        activeTab === 'history'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                >
                    Call History
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3">
                {activeTab === 'dialer' ? (
                    <Dialer
                        dialNumber={dialNumber}
                        onDialNumberChange={onDialNumberChange}
                        onDial={() => onDial(numberTarget(dialNumber))}
                    />
                ) : (
                    <div className="flex flex-col gap-2">
                        <div className="relative mb-1">
                            <RiSearchLine className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                            <Input
                                placeholder="Filter call history..."
                                className="pl-8 h-8 text-xs bg-background"
                                aria-label="Filter call history"
                            />
                        </div>

                        {history.length === 0 ? (
                            <p className="text-xs text-muted-foreground text-center py-6">
                                No calls yet this session.
                            </p>
                        ) : (
                            history.map((log) => (
                                <button
                                    key={log.id}
                                    type="button"
                                    onClick={() =>
                                        log.target.kind === 'phone' && onCallFromHistory(log.target)
                                    }
                                    className="p-2 rounded-md bg-muted/40 hover:bg-muted border border-border flex items-center justify-between text-left transition-colors disabled:opacity-60"
                                    disabled={log.target.kind !== 'phone'}
                                >
                                    <div className="flex flex-col min-w-0">
                                        <span className="font-semibold font-mono text-foreground truncate">
                                            {log.target.label}
                                        </span>
                                        <span className="text-[10px] text-muted-foreground">
                                            {formatTime(log.startedAt)} • {log.direction} • {log.outcome}
                                        </span>
                                    </div>
                                    <span className="font-mono text-[11px] text-muted-foreground shrink-0 ml-2">
                                        {log.durationSeconds > 0 ? formatDuration(log.durationSeconds) : '—'}
                                    </span>
                                </button>
                            ))
                        )}
                    </div>
                )}
            </div>
        </>
    );
}

function numberTarget(number: string): CallTarget {
    const trimmed = number.trim();

    return { id: `phone:${trimmed}`, kind: 'phone', label: trimmed, phone: trimmed };
}

function formatTime(iso: string): string {
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDuration(totalSeconds: number): string {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;

    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
