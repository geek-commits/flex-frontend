import { IVR_MOCK_RECORDS } from '@/data/ivr.mock';
import { AVAILABLE_AGENTS_MOCK, QUEUE_MEMBERS_MOCK, QUEUE_MOCK_RECORDS } from '@/data/queues.mock';
import { TIME_CONDITION_MOCK_RECORDS } from '@/data/time-conditions.mock';
import { TIME_GROUP_MOCK_RECORDS } from '@/data/time-groups.mock';
import type {
    IVRDraft,
    IVRRecord,
    QueueDraft,
    QueueMember,
    QueueRecord,
    TimeConditionDraft,
    TimeConditionRecord,
    TimeGroupDraft,
    TimeGroupRecord,
} from '@/domain/routing-types';

/**
 * Routing Configuration repository boundary.
 *
 * POC MOCK — operates on the in-memory synthetic dataset, scoped to a single
 * implicit tenant. CRUD mutations update a local copy for the session. The real
 * backend must implement the same contract (routing semantics, validation,
 * authorization, tenant scoping) server-side. No HTTP API is faked.
 */

export interface RoutingRepository {
    /* Queues */
    queryQueues(): QueueRecord[];
    getQueue(id: string): QueueRecord | undefined;
    createQueue(draft: QueueDraft): QueueRecord;
    updateQueue(id: string, draft: QueueDraft): QueueRecord | undefined;
    deleteQueue(id: string): void;
    queryMembers(queueId: string): QueueMember[];
    addMember(queueId: string, member: QueueMember): boolean;
    removeMember(queueId: string, agentId: string): void;
    getAvailableAgents(): QueueMember[];

    /* IVR */
    queryIVRs(): IVRRecord[];
    getIVR(id: string): IVRRecord | undefined;
    createIVR(draft: IVRDraft): IVRRecord;
    updateIVR(id: string, draft: IVRDraft): IVRRecord | undefined;
    deleteIVR(id: string): void;

    /* Time Groups */
    queryTimeGroups(): TimeGroupRecord[];
    getTimeGroup(id: string): TimeGroupRecord | undefined;
    createTimeGroup(draft: TimeGroupDraft): TimeGroupRecord;
    updateTimeGroup(id: string, draft: TimeGroupDraft): TimeGroupRecord | undefined;
    deleteTimeGroup(id: string): void;
    timeGroupUsage(id: string): number;

    /* Time Conditions */
    queryTimeConditions(): TimeConditionRecord[];
    getTimeCondition(id: string): TimeConditionRecord | undefined;
    createTimeCondition(draft: TimeConditionDraft): TimeConditionRecord;
    updateTimeCondition(id: string, draft: TimeConditionDraft): TimeConditionRecord | undefined;
    deleteTimeCondition(id: string): void;
}

let queues = [...QUEUE_MOCK_RECORDS];
const queueMembers = new Map<string, QueueMember[]>(Object.entries(QUEUE_MEMBERS_MOCK));
let ivrs = [...IVR_MOCK_RECORDS];
let timeGroups = [...TIME_GROUP_MOCK_RECORDS];
let timeConditions = [...TIME_CONDITION_MOCK_RECORDS];

function syncMemberCount(queueId: string): number {
    return queueMembers.get(queueId)?.length ?? 0;
}

export const routingRepository: RoutingRepository = {
    /* ---- Queues ---- */
    queryQueues() {
        return queues.map((queue) => ({ ...queue, memberCount: syncMemberCount(queue.id) }));
    },

    getQueue(id: string) {
        const queue = queues.find((q) => q.id === id);

        return queue ? { ...queue, memberCount: syncMemberCount(queue.id) } : undefined;
    },

    createQueue(draft: QueueDraft) {
        const queue: QueueRecord = {
            id: `q${Date.now()}`,
            ...draft,
            memberCount: 0,
        };

        queues = [...queues, queue];
        queueMembers.set(queue.id, []);

        return queue;
    },

    updateQueue(id: string, draft: QueueDraft) {
        const existing = queues.find((queue) => queue.id === id);

        if (!existing) {
            return undefined;
        }

        existing.name = draft.name;
        existing.extension = draft.extension;
        existing.strategy = draft.strategy;
        existing.ringTimeout = draft.ringTimeout;
        existing.status = draft.status;
        existing.description = draft.description;

        return existing;
    },

    deleteQueue(id: string) {
        queues = queues.filter((queue) => queue.id !== id);
        queueMembers.delete(id);
    },

    queryMembers(queueId: string) {
        return queueMembers.get(queueId) ?? [];
    },

    addMember(queueId: string, member: QueueMember) {
        const members = queueMembers.get(queueId) ?? [];

        if (members.some((existing) => existing.agentId === member.agentId)) {
            return false;
        }

        queueMembers.set(queueId, [...members, member]);

        return true;
    },

    removeMember(queueId: string, agentId: string) {
        const members = queueMembers.get(queueId) ?? [];

        queueMembers.set(queueId, members.filter((member) => member.agentId !== agentId));
    },

    getAvailableAgents() {
        return AVAILABLE_AGENTS_MOCK;
    },

    /* ---- IVR ---- */
    queryIVRs() {
        return [...ivrs];
    },

    getIVR(id: string) {
        return ivrs.find((ivr) => ivr.id === id);
    },

    createIVR(draft: IVRDraft) {
        const ivr: IVRRecord = { id: `ivr${Date.now()}`, ...draft };

        ivrs = [...ivrs, ivr];

        return ivr;
    },

    updateIVR(id: string, draft: IVRDraft) {
        const existing = ivrs.find((ivr) => ivr.id === id);

        if (!existing) {
            return undefined;
        }

        existing.name = draft.name;
        existing.prompt = draft.prompt;
        existing.entries = draft.entries;
        existing.defaultDestination = draft.defaultDestination;
        existing.status = draft.status;

        return existing;
    },

    deleteIVR(id: string) {
        ivrs = ivrs.filter((ivr) => ivr.id !== id);
    },

    /* ---- Time Groups ---- */
    queryTimeGroups() {
        return [...timeGroups];
    },

    getTimeGroup(id: string) {
        return timeGroups.find((group) => group.id === id);
    },

    createTimeGroup(draft: TimeGroupDraft) {
        const group: TimeGroupRecord = { id: `tg${Date.now()}`, ...draft };

        timeGroups = [...timeGroups, group];

        return group;
    },

    updateTimeGroup(id: string, draft: TimeGroupDraft) {
        const existing = timeGroups.find((group) => group.id === id);

        if (!existing) {
            return undefined;
        }

        existing.description = draft.description;
        existing.entries = draft.entries;

        return existing;
    },

    deleteTimeGroup(id: string) {
        timeGroups = timeGroups.filter((group) => group.id !== id);
    },

    timeGroupUsage(id: string) {
        return timeConditions.filter((condition) => condition.timeGroupId === id).length;
    },

    /* ---- Time Conditions ---- */
    queryTimeConditions() {
        return [...timeConditions];
    },

    getTimeCondition(id: string) {
        return timeConditions.find((condition) => condition.id === id);
    },

    createTimeCondition(draft: TimeConditionDraft) {
        const condition: TimeConditionRecord = { id: `tc${Date.now()}`, ...draft };

        timeConditions = [...timeConditions, condition];

        return condition;
    },

    updateTimeCondition(id: string, draft: TimeConditionDraft) {
        const existing = timeConditions.find((condition) => condition.id === id);

        if (!existing) {
            return undefined;
        }

        existing.name = draft.name;
        existing.timeGroupId = draft.timeGroupId;
        existing.matchDestination = draft.matchDestination;
        existing.noMatchDestination = draft.noMatchDestination;
        existing.status = draft.status;

        return existing;
    },

    deleteTimeCondition(id: string) {
        timeConditions = timeConditions.filter((condition) => condition.id !== id);
    },
};
