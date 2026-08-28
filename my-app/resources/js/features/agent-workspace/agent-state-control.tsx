import { RiErrorWarningLine, RiLoader4Line } from '@remixicon/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
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
    const { t } = useTranslation(['agent', 'common']);
    const current = agentStateMap[state];
    const currentLabel = current.labelKey ? t(current.labelKey) : current.label;
    const isPending = pendingState !== null && pendingState !== undefined;

    return (
        <div
            data-call-island-zone="agent-state"
            className={`flex items-center gap-1.5 ${className ?? ''}`}
        >
            <Select
                value={state}
                onValueChange={(val) => onSelect(val as AgentState)}
                disabled={isPending}
            >
                <SelectTrigger
                    size="sm"
                    className="h-8 w-32 gap-1.5 rounded-md border border-transparent bg-transparent px-2.5 text-[13px] font-medium text-flex-text-primary shadow-none hover:bg-flex-layer-hover data-[state=open]:bg-flex-layer-active focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0"
                    aria-label={t('agent:status.ready')}
                >
                    <span className="flex items-center gap-1.5 truncate">
                        <span className={`size-2 rounded-full ${current.dotClass}`} aria-hidden="true" />
                        <SelectValue>{currentLabel}</SelectValue>
                    </span>
                </SelectTrigger>
                    <SelectContent align="end">
                        {SELECTABLE_AGENT_STATES.map((key) => {
                            const cfg = agentStateMap[key];
                            const label = cfg.labelKey ? t(cfg.labelKey) : cfg.label;

                            return (
                                <SelectItem key={key} value={key} className="text-xs">
                                    <span className={`size-2 rounded-full ${cfg.dotClass}`} />
                                    <span>{label}</span>
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
                        {t('common:status.loading')}
                    </span>
                )}

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
