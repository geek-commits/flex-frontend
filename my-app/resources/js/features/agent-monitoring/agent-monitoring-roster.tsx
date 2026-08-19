import React from 'react';
import { FlexStatus } from '@/components/flex/flex-status';
import type { FlexStatusTone } from '@/components/flex/flex-status';
import { Skeleton } from '@/components/ui/skeleton';
import type { MonitoringAgentRow } from '@/features/agent-monitoring/use-agent-monitoring';
import { useStateTimer } from '@/features/dashboard/use-state-timer';
import { agentStateMap } from '@/lib/status-styles';

/**
 * Canonical Agent Monitoring roster — column grammar mirrors the Live Agent
 * Wallboard (cross-supervision consistency) but is backed entirely by the
 * Agent Monitoring runtime (`useAgentMonitoring`). Monitoring-specific actions
 * are intentionally omitted until a real capability exists (e.g. Whisper).
 */
const AGENT_STATE_TONES: Record<MonitoringAgentRow['state'], FlexStatusTone> = {
    ready: 'success',
    talking: 'info',
    ringing: 'warning',
    'wrap-up': 'neutral',
    break: 'neutral',
    'not-ready': 'warning',
    offline: 'danger',
};

function CurrentCallCell({ row }: { row: MonitoringAgentRow }) {
    if (!row.call) {
        return (
            <span className="text-flex-text-muted">—</span>
        );
    }

    const { direction, customer, state } = row.call;

    return (
        <span className="flex items-center gap-1.5 text-flex-text-primary">
            <span className="capitalize text-flex-text-muted">{direction}</span>
            <span>{customer.name}</span>
            <span className="text-xs text-flex-text-muted uppercase">{state}</span>
        </span>
    );
}

function MonitoringRosterRow({ row }: { row: MonitoringAgentRow }) {
    const stateTime = useStateTimer(row.stateSince);
    const statusConfig = agentStateMap[row.state];

    return (
        <tr className="hover:bg-muted/30">
            <td className="py-2.5 text-start font-semibold text-flex-text-primary">{row.name}</td>
            <td className="py-2.5 text-start font-mono text-flex-text-muted">{row.extension}</td>
            <td className="py-2.5 text-start text-flex-text-muted">{row.queue}</td>
            <td className="py-2.5 text-start">
                <FlexStatus tone={AGENT_STATE_TONES[row.state]} className="capitalize">
                    {statusConfig.label}
                </FlexStatus>
            </td>
            <td className="flex-numeric py-2.5 text-end font-mono text-flex-text-primary">
                {stateTime}
            </td>
            <td className="py-2.5 text-start">
                <CurrentCallCell row={row} />
            </td>
            <td className="py-2.5 text-end font-bold text-flex-text-primary">{row.callsToday}</td>
            <td className="py-2.5 text-end font-mono text-flex-text-muted">{row.aht}</td>
        </tr>
    );
}

export interface AgentMonitoringRosterProps {
    rows: MonitoringAgentRow[];
    isLoading?: boolean;
}

export function AgentMonitoringRoster({ rows, isLoading }: AgentMonitoringRosterProps) {
    if (isLoading) {
        return (
            <div className="overflow-hidden rounded-lg border border-border bg-card">
                <div className="overflow-x-auto">
                    <table className="flex-table-grid w-full text-left text-xs">
                        <thead>
                <tr className="border-b border-border text-[10px] font-semibold text-flex-text-muted uppercase">
                    <th className="pb-2 text-start">Agent</th>
                    <th className="pb-2 text-start">Ext.</th>
                    <th className="pb-2 text-start">Queue</th>
                    <th className="pb-2 text-start">State</th>
                    <th className="pb-2 text-end">State Time</th>
                    <th className="pb-2 text-start">Current Call</th>
                    <th className="pb-2 text-end">Calls Today</th>
                    <th className="pb-2 text-end">AHT</th>
                </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {[1, 2, 3, 4].map((i) => (
                                <tr key={i} className="hover:bg-muted/30">
                                    <td className="py-2.5"><Skeleton className="h-4 w-28" /></td>
                                    <td className="py-2.5"><Skeleton className="h-4 w-12" /></td>
                                    <td className="py-2.5"><Skeleton className="h-4 w-20" /></td>
                                    <td className="py-2.5"><Skeleton className="h-4 w-16 rounded-full" /></td>
                                    <td className="py-2.5"><Skeleton className="h-4 w-16" /></td>
                                    <td className="py-2.5"><Skeleton className="h-4 w-24" /></td>
                                    <td className="py-2.5"><Skeleton className="h-4 w-12" /></td>
                                    <td className="py-2.5"><Skeleton className="h-4 w-12" /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-lg border border-border bg-card">
            <div className="overflow-x-auto">
                <table className="flex-table-grid w-full text-left text-xs">
                    <thead>
                        <tr className="border-b border-border text-[10px] font-semibold text-flex-text-muted uppercase">
                            <th className="pb-2 text-start">Agent</th>
                            <th className="pb-2 text-start">Ext.</th>
                            <th className="pb-2 text-start">Queue</th>
                            <th className="pb-2 text-start">State</th>
                            <th className="pb-2 text-end">State Time</th>
                            <th className="pb-2 text-start">Current Call</th>
                            <th className="pb-2 text-end">Calls Today</th>
                            <th className="pb-2 text-end">AHT</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {rows.map((row) => (
                            <MonitoringRosterRow key={row.id} row={row} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
