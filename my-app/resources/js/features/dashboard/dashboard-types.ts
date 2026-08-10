export type ConnectionState = 'live' | 'stale' | 'reconnecting' | 'error';

export interface DashboardData {
    agents: AgentRosterEntry[];
    callVolume14d: DailyCallVolume[];
    queueSla: QueueSla[];
    activeCalls: ActiveCall[];
    queueHealth: QueueHealth[];
}

export interface AgentRosterEntry {
    id: string;
    name: string;
    extension: string;
    queue: string;
    state: AgentState;
    callDuration?: string;
    callsToday: number;
    aht: string;
    stateSince?: string;
}

export interface DailyCallVolume {
    day: string;
    answered: number;
    missed: number;
}

export interface QueueSla {
    queue: string;
    withinSla: number;
}

export interface ActiveCall {
    id: string;
    customer: { name: string; phone: string };
    agent: { id: string; name: string };
    queue: string;
    direction: 'inbound' | 'outbound';
    state: 'ringing' | 'connected' | 'hold' | 'transferring';
    durationSeconds: number;
    startedAt: string;
}

export interface QueueHealth {
    queue: string;
    waiting: number;
    longestWait: number;
    availableAgents: number;
    totalAgents: number;
    sla: number;
}

export interface UseDashboardDataReturn {
    data: DashboardData | null;
    isLoading: boolean;
    isRefreshing: boolean;
    error: Error | null;
    connectionState: ConnectionState;
    lastUpdated: Date | null;
    refresh: () => Promise<void>;
}

export type AgentState =
    | 'ready'
    | 'talking'
    | 'ringing'
    | 'wrap-up'
    | 'break'
    | 'not-ready'
    | 'offline';
