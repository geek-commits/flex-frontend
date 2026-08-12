import { AGENT_MOCK_ROSTER } from '@/data/agents.mock';
import type { AgentState } from '@/types/flex';
import type { CallTarget } from './workspace-types';

/**
 * Transfer target source (AGENT_WORKSPACE_PLAN §41).
 *
 * Only real supported targets are offered: agents and queues derived from the
 * POC agent roster. No placeholder target categories. Reachability comes from
 * the target's current roster state — the same deterministic data the rest of
 * the POC reads.
 */

export interface TransferTargetOption {
    target: CallTarget;
    /** Agent extension when the target is an agent. */
    extension?: string;
    /** Agent's assigned queue / the queue name for queue targets. */
    queue?: string;
    /** Whether the runtime considers the target reachable for a transfer. */
    reachable: boolean;
    /** Presentational availability label for unreachable targets. */
    stateLabel?: string;
}

const UNREACHABLE_AGENT_STATES: AgentState[] = ['break', 'not-ready', 'offline'];

const AGENT_STATE_LABELS: Partial<Record<AgentState, string>> = {
    break: 'On break',
    'not-ready': 'Not ready',
    offline: 'Offline',
};

function agentIsReachable(state: AgentState): boolean {
    return !UNREACHABLE_AGENT_STATES.includes(state);
}

/** Build the deterministic list of transfer targets from the roster. */
export function buildTransferTargets(): TransferTargetOption[] {
    const agents: TransferTargetOption[] = AGENT_MOCK_ROSTER.map((agent) => ({
        target: { id: agent.id, kind: 'agent', label: agent.name, phone: agent.extension },
        extension: agent.extension,
        queue: agent.queue,
        reachable: agentIsReachable(agent.state),
        stateLabel: AGENT_STATE_LABELS[agent.state],
    }));

    const queueLabels = [...new Set(AGENT_MOCK_ROSTER.map((agent) => agent.queue))].sort();
    const queues: TransferTargetOption[] = queueLabels.map((queue) => ({
        target: { id: `queue-${queue}`, kind: 'queue', label: queue },
        queue,
        reachable: true,
    }));

    return [...agents, ...queues];
}

export interface TransferTargetFilter {
    agents: TransferTargetOption[];
    queues: TransferTargetOption[];
}

/** Filter targets by name, extension, or queue. Empty query returns everything. */
export function filterTransferTargets(options: TransferTargetOption[], query: string): TransferTargetFilter {
    const q = query.trim().toLowerCase();

    if (!q) {
        return splitByKind(options);
    }

    const matches = options.filter((option) => {
        const haystack = [option.target.label, option.extension, option.queue]
            .filter((value): value is string => Boolean(value))
            .join(' ')
            .toLowerCase();

        return haystack.includes(q);
    });

    return splitByKind(matches);
}

function splitByKind(options: TransferTargetOption[]): TransferTargetFilter {
    return {
        agents: options.filter((option) => option.target.kind === 'agent'),
        queues: options.filter((option) => option.target.kind === 'queue'),
    };
}

/**
 * Whether the runtime can transfer to the target right now.
 *
 * Queues accept transfers; agents must be reachable per the roster state.
 * Unknown targets (including unsupported kinds like phone numbers) are not
 * reachable — the backend stays authoritative on failure (§44).
 */
export function isTransferTargetReachable(target: CallTarget): boolean {
    if (target.kind === 'queue') {
        return true;
    }

    if (target.kind !== 'agent') {
        return false;
    }

    const agent = AGENT_MOCK_ROSTER.find((entry) => entry.id === target.id);

    return agent !== undefined && agentIsReachable(agent.state);
}
