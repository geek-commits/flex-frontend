import type { AgentQueuePressure } from '@/features/agent-dashboard/agent-dashboard-types';

/**
 * Synthetic agent-dashboard mock dataset for the POC.
 *
 * POC MOCK — deterministic (no `Math.random()`), replaces with the real
 * backend behind `AgentDashboardRepository`. Only queue-pressure fields
 * correspond to runtime `QueueHealth` semantics (`features/dashboard/*`);
 * performance, skills, provider minutes and notices are backend-only and are
 * returned as deferred, never fabricated here.
 */

export const AGENT_QUEUE_PRESSURE_MOCK: AgentQueuePressure[] = [
    {
        queue: 'Customer Support',
        waiting: 3,
        longestWait: 48,
        availableAgents: 2,
        totalAgents: 4,
        sla: 94.2,
    },
    {
        queue: 'Sales & Inquiries',
        waiting: 1,
        longestWait: 20,
        availableAgents: 2,
        totalAgents: 3,
        sla: 97.5,
    },
    {
        queue: 'Technical Escalations',
        waiting: 0,
        longestWait: 0,
        availableAgents: 1,
        totalAgents: 2,
        sla: 88.7,
    },
];