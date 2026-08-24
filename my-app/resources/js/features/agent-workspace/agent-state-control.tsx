import { RiErrorWarningLine, RiLoader4Line } from '@remixicon/react';
import React from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { agentStateMap } from '@/lib/status-styles';
import type { AgentState } from '@/types/flex';

/**
 * Manually selectable agent availability states (see docs/design/domain/agent-state.md).
 * System-driven states (talking, ringing, wrap-up, offline) are never offered here.
 */
const SELECTABLE_AGENT_STATES: AgentState[] = ['ready', 'not-ready', 'break'];

export interface AgentStateControlProps {
    state: AgentState;
    onSelect: (state: AgentState) => void;
    pendingState?: AgentState | null;
    error?: string | null;
    className?: string;
}

/**
 * Agent availability control. While a transition is pending the control is
 * disabled (prevents duplicate submissions) and still shows the
 * server-authoritative current state; failures are surfaced in place and never
 * silently flip the displayed state.
 */
export function AgentStateControl({
    state,
    onSelect,
    pendingState,
    error,
    className,
}: AgentStateControlProps) {
    const current = agentStateMap[state];
    const isPending = pendingState !== null && pendingState !== undefined;

    return (
        <div
            data-call-island-zone="agent-state"
            className={`flex items-center gap-1.5 ${className ?? ''}`}
        >
            <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-lg border border-border">
                <Select
                    value={state}
                    onValueChange={(val) => onSelect(val as AgentState)}
                    disabled={isPending}
                >
                    <SelectTrigger
                        size="sm"
                        className="w-32 bg-card border-border text-xs font-semibold px-2.5"
                        aria-label="Agent availability state"
                    >
                        <div className="flex items-center gap-1.5 truncate">
                            <span className={`size-2 rounded-full ${current.dotClass}`} />
                            <SelectValue>{current.label}</SelectValue>
                        </div>
                    </SelectTrigger>
                    <SelectContent align="end">
                        {SELECTABLE_AGENT_STATES.map((key) => {
                            const cfg = agentStateMap[key];

                            return (
                                <SelectItem key={key} value={key} className="text-xs">
                                    <span className={`size-2 rounded-full ${cfg.dotClass}`} />
                                    <span>{cfg.label}</span>
                                </SelectItem>
                            );
                        })}
                    </SelectContent>
                </Select>

                {isPending && (
                    <span
                        className="flex items-center gap-1 px-1.5 text-[10px] font-semibold text-muted-foreground"
                        role="status"
                    >
                        <RiLoader4Line className="size-3 animate-spin" />
                        Updating…
                    </span>
                )}
            </div>

            {error && (
                <span
                    className="flex items-center gap-1 px-1.5 text-[10px] font-semibold text-status-disconnected"
                    role="alert"
                >
                    <RiErrorWarningLine className="size-3" />
                    {error}
                </span>
            )}
        </div>
    );
}
