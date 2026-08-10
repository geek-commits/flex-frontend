import { ACTIVE_CALLS_MOCK } from '@/data/active-calls.mock';
import { CALL_VOLUME_14D, QUEUE_SLA } from '@/data/dashboard-trends.mock';
import { QUEUES } from '@/features/dashboard/constants';
import type {
    AgentRosterEntry,
    DailyCallVolume,
    QueueSla,
    ActiveCall,
    QueueHealth,
} from '@/features/dashboard/dashboard-types';

const AGENT_ROSTER: AgentRosterEntry[] = [
    {
        id: 'a1',
        name: 'John Doe',
        extension: '1001',
        queue: 'Customer Support',
        state: 'talking',
        callDuration: '02:14',
        callsToday: 18,
        aht: '03:22',
        stateSince: new Date(Date.now() - 134_000).toISOString(),
    },
    {
        id: 'a2',
        name: 'Sarah Smith',
        extension: '1002',
        queue: 'Sales & Inquiries',
        state: 'ready',
        callsToday: 12,
        aht: '02:45',
        stateSince: new Date(Date.now() - 3_600_000).toISOString(),
    },
    {
        id: 'a3',
        name: 'Michael Brown',
        extension: '1003',
        queue: 'Technical Escalations',
        state: 'wrap-up',
        callsToday: 9,
        aht: '06:10',
        stateSince: new Date(Date.now() - 600_000).toISOString(),
    },
    {
        id: 'a4',
        name: 'Amina Hassan',
        extension: '1004',
        queue: 'Customer Support',
        state: 'talking',
        callDuration: '05:31',
        callsToday: 22,
        aht: '03:55',
        stateSince: new Date(Date.now() - 331_000).toISOString(),
    },
    {
        id: 'a5',
        name: 'Peter Ndungu',
        extension: '1005',
        queue: 'Sales & Inquiries',
        state: 'ready',
        callsToday: 15,
        aht: '02:18',
        stateSince: new Date(Date.now() - 7_200_000).toISOString(),
    },
    {
        id: 'a6',
        name: 'Grace Mwanga',
        extension: '1006',
        queue: 'Customer Support',
        state: 'break',
        callsToday: 8,
        aht: '04:02',
        stateSince: new Date(Date.now() - 1_800_000).toISOString(),
    },
    {
        id: 'a7',
        name: 'David Kiprotich',
        extension: '1007',
        queue: 'Technical Escalations',
        state: 'not-ready',
        callsToday: 5,
        aht: '07:44',
        stateSince: new Date(Date.now() - 900_000).toISOString(),
    },
    {
        id: 'a8',
        name: 'Fatuma Ally',
        extension: '1008',
        queue: 'Customer Support',
        state: 'talking',
        callDuration: '00:48',
        callsToday: 20,
        aht: '03:11',
        stateSince: new Date(Date.now() - 48_000).toISOString(),
    },
];

function computeQueueHealth(agents: AgentRosterEntry[]): QueueHealth[] {
    return QUEUES.map((queue) => {
        const queueAgents = agents.filter((a) => a.queue === queue);
        const available = queueAgents.filter((a) => a.state === 'ready').length;
        const total = queueAgents.length;
        const waiting = Math.floor(Math.random() * 3);
        const longestWait = waiting > 0 ? Math.floor(Math.random() * 120) : 0;
        const sla = 90 + Math.random() * 10;

        return {
            queue,
            waiting,
            longestWait,
            availableAgents: available,
            totalAgents: total,
            sla: Math.round(sla * 10) / 10,
        };
    });
}

function jitter<T>(data: T, variance = 0.05): T {
    if (Array.isArray(data)) {
        return data.map((item) => jitter(item, variance)) as T;
    }

    if (typeof data === 'object' && data !== null) {
        const result: Record<string, unknown> = {};

        for (const [key, value] of Object.entries(data)) {
            if (typeof value === 'number') {
                const delta = value * variance * (Math.random() * 2 - 1);
                result[key] = Math.max(0, Math.round(value + delta));
            } else {
                result[key] = value;
            }
        }

        return result as T;
    }

    return data;
}

export async function fetchDashboardData(): Promise<{
    agents: AgentRosterEntry[];
    callVolume14d: DailyCallVolume[];
    queueSla: QueueSla[];
    activeCalls: ActiveCall[];
    queueHealth: QueueHealth[];
}> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const agents = jitter(AGENT_ROSTER, 0.03);
    const callVolume14d = jitter(CALL_VOLUME_14D, 0.02);
    const queueSla = jitter(QUEUE_SLA, 0.03);
    const activeCalls = jitter(ACTIVE_CALLS_MOCK, 0.1);
    const queueHealth = computeQueueHealth(agents);

    return {
        agents,
        callVolume14d,
        queueSla,
        activeCalls,
        queueHealth,
    };
}
