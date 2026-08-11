import { useMemo } from 'react';
import type {
    ActiveCall,
    AgentState,
} from '@/features/dashboard/dashboard-types';
import { useDashboardData } from '@/features/dashboard/use-dashboard-data';

export interface MonitoringAgentRow {
    id: string;
    name: string;
    extension: string;
    queue: string;
    state: AgentState;
    stateSince?: string;
    callsToday: number;
    aht: string;
    call?: ActiveCall;
}

export const MONITORING_STATE_ORDER: AgentState[] = [
    'talking',
    'ready',
    'ringing',
    'wrap-up',
    'break',
    'not-ready',
    'offline',
];

export function useAgentMonitoring() {
    const {
        data,
        isLoading,
        isRefreshing,
        error,
        connectionState,
        lastUpdated,
        refresh,
    } = useDashboardData();

    const agents = useMemo<MonitoringAgentRow[]>(() => {
        if (!data) {
            return [];
        }

        return data.agents.map((agent) => ({
            id: agent.id,
            name: agent.name,
            extension: agent.extension,
            queue: agent.queue,
            state: agent.state,
            stateSince: agent.stateSince,
            callsToday: agent.callsToday,
            aht: agent.aht,
            call: data.activeCalls.find((call) => call.agent.id === agent.id),
        }));
    }, [data]);

    const summary = useMemo<Record<AgentState, number>>(() => {
        const counts = Object.fromEntries(
            MONITORING_STATE_ORDER.map((state) => [state, 0]),
        ) as Record<AgentState, number>;

        for (const agent of agents) {
            counts[agent.state] += 1;
        }

        return counts;
    }, [agents]);

    return {
        agents,
        summary,
        isLoading,
        isRefreshing,
        error,
        connectionState,
        lastUpdated,
        refresh,
    };
}
