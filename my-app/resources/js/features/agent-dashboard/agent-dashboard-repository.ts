import { AGENT_QUEUE_PRESSURE_MOCK } from '@/data/agent-dashboard.mock';
import type { AgentDashboardData } from './agent-dashboard-types';

/**
 * Agent Dashboard repository boundary.
 *
 * POC MOCK — returns the deterministic in-memory snapshot for the session.
 * The real backend must implement the same contract (profile identity,
 * queue pressure, performance, skills, provider minutes, notices) later.
 * No HTTP API is faked. The backend remains authoritative for metrics and
 * queue membership; sections it does not yet implement are deferred.
 */
export interface AgentDashboardRepository {
    getDashboardData(): AgentDashboardData;
}

const DEFERRED_PERFORMANCE = {
    availability: 'deferred',
    reason: 'Performance metrics (calls handled, call rate, answer rate, average handling time) require backend call accounting and are not available yet.',
} as const;

const DEFERRED_SKILLS = {
    availability: 'deferred',
    reason: 'Skills and proficiency are configured by supervisors and require a backend skills assignment; they are not available yet.',
} as const;

const DEFERRED_PROVIDER_MINUTES = {
    availability: 'deferred',
    reason: 'Provider minutes consumption requires telco usage reporting and is not available yet.',
} as const;

const DEFERRED_NOTICES = {
    availability: 'deferred',
    reason: 'System notices require a backend notifications feed and are not available yet.',
} as const;

export const agentDashboardRepository: AgentDashboardRepository = {
    getDashboardData(): AgentDashboardData {
        return {
            profile: {
                name: 'Admin User',
                extension: '1001',
                organization: 'FLEX HQ',
            },
            queuePressure: AGENT_QUEUE_PRESSURE_MOCK,
            deferred: {
                performance: DEFERRED_PERFORMANCE,
                skills: DEFERRED_SKILLS,
                providerMinutes: DEFERRED_PROVIDER_MINUTES,
                notices: DEFERRED_NOTICES,
            },
        };
    },
};