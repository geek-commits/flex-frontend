import { useCallback, useMemo, useState } from 'react';
import type { Filter } from '@/components/reui/filters';
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

    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState<Filter<string>[]>([]);

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

    const queues = useMemo(
        () =>
            Array.from(new Set(agents.map((agent) => agent.queue))).sort(
                (a, b) => a.localeCompare(b),
            ),
        [agents],
    );

    const hasPopoverFilters = useMemo(
        () =>
            filters.some(
                (filter) =>
                    filter.values?.length > 0 &&
                    filter.values.some((value) => value !== ''),
            ),
        [filters],
    );

    const hasActiveFilters = search.trim() !== '' || hasPopoverFilters;

    const filteredAgents = useMemo(() => {
        const active = filters.filter(
            (filter) =>
                filter.values?.length > 0 &&
                filter.values.some((value) => value !== ''),
        );
        const query = search.trim().toLowerCase();

        return agents.filter((agent) => {
            if (
                query &&
                !agent.name.toLowerCase().includes(query) &&
                !agent.extension.toLowerCase().includes(query)
            ) {
                return false;
            }

            for (const filter of active) {
                const { field, operator, values } = filter;

                if (field === 'state') {
                    if (
                        (operator === 'is' || operator === 'equals') &&
                        !values.includes(agent.state)
                    ) {
                        return false;
                    }

                    if (operator === 'is_not' && values.includes(agent.state)) {
                        return false;
                    }
                }

                if (field === 'queue') {
                    if (
                        (operator === 'is' || operator === 'equals') &&
                        !values.includes(agent.queue)
                    ) {
                        return false;
                    }

                    if (operator === 'is_not' && values.includes(agent.queue)) {
                        return false;
                    }
                }
            }

            return true;
        });
    }, [agents, search, filters]);

    const clearFilters = useCallback(() => {
        setSearch('');
        setFilters([]);
    }, []);

    return {
        agents,
        summary,
        queues,
        filteredAgents,
        search,
        setSearch,
        filters,
        setFilters,
        hasActiveFilters,
        hasPopoverFilters,
        clearFilters,
        isLoading,
        isRefreshing,
        error,
        connectionState,
        lastUpdated,
        refresh,
    };
}
