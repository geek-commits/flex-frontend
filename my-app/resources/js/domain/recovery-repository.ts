import { RECOVERY_MOCK_RECORDS } from '@/data/recovery.mock';
import type {
    RecoveryMutationResult,
    RecoveryQuery,
    RecoveryRecord,
} from '@/features/customer-recovery/recovery-types';

/**
 * Customer Recovery repository boundary.
 *
 * POC MOCK — operates on the in-memory synthetic dataset, scoped to a single
 * implicit tenant. Claim, attempt, and attended transitions are authoritative
 * here (the backend is the real authority in production). `queryRecords()`
 * returns a fresh array so React always sees state changes.
 */

export interface RecoveryRepository {
    queryRecords(query: RecoveryQuery): RecoveryRecord[];
    getById(id: string): RecoveryRecord | undefined;
    claimRecord(id: string, agentId: string, agentName: string): RecoveryMutationResult;
    incrementAttempt(id: string, agentName: string): RecoveryMutationResult;
    markAttended(id: string): RecoveryMutationResult;
}

let records = [...RECOVERY_MOCK_RECORDS];

function clone(record: RecoveryRecord): RecoveryRecord {
    return {
        ...record,
        attemptHistory: record.attemptHistory.map((attempt) => ({ ...attempt })),
        voicemail: { ...record.voicemail },
        claimedBy: record.claimedBy ? { ...record.claimedBy } : undefined,
    };
}

function matches(query: RecoveryQuery, record: RecoveryRecord): boolean {
    const needle = query.search?.trim().toLowerCase();

    const matchesSearch =
        !needle ||
        record.phoneNumber.toLowerCase().includes(needle) ||
        (record.customerName ?? '').toLowerCase().includes(needle) ||
        record.queueName.toLowerCase().includes(needle);

    const matchesStatus = !query.status || query.status === 'all' || record.status === query.status;
    const matchesQueue = !query.queue || query.queue === 'all' || record.queueName === query.queue;

    const matchesOwnership =
        !query.ownership ||
        query.ownership === 'all' ||
        (query.ownership === 'unclaimed' && !record.claimedBy) ||
        (query.ownership === 'me' && record.claimedBy?.id === 'u1');

    const matchesVoicemail =
        !query.voicemail ||
        query.voicemail === 'all' ||
        (query.voicemail === 'with' && record.voicemail.hasVoicemail) ||
        (query.voicemail === 'without' && !record.voicemail.hasVoicemail);

    return matchesSearch && matchesStatus && matchesQueue && matchesOwnership && matchesVoicemail;
}

export const recoveryRepository: RecoveryRepository = {
    queryRecords(query: RecoveryQuery) {
        return records.filter((record) => matches(query, record)).map(clone);
    },

    getById(id: string) {
        const record = records.find((r) => r.id === id);

        return record ? clone(record) : undefined;
    },

    claimRecord(id: string, agentId: string, agentName: string): RecoveryMutationResult {
        const record = records.find((r) => r.id === id);

        if (!record) {
            return { ok: false, reason: 'Record no longer exists.' };
        }

        if (record.status === 'resolved') {
            return { ok: false, reason: 'This callback has already been resolved.' };
        }

        if (record.claimedBy && record.claimedBy.id !== agentId) {
            return { ok: false, reason: 'This callback was just claimed by another agent.' };
        }

        record.claimedBy = { id: agentId, name: agentName };

        return { ok: true, record: clone(record) };
    },

    incrementAttempt(id: string, agentName: string): RecoveryMutationResult {
        const record = records.find((r) => r.id === id);

        if (!record) {
            return { ok: false, reason: 'Record no longer exists.' };
        }

        record.attempts += 1;
        record.attemptHistory = [
            ...record.attemptHistory,
            { time: new Date().toISOString().slice(0, 16).replace('T', ' '), agent: agentName, outcome: 'Attempted' },
        ];

        return { ok: true, record: clone(record) };
    },

    markAttended(id: string): RecoveryMutationResult {
        const record = records.find((r) => r.id === id);

        if (!record) {
            return { ok: false, reason: 'Record no longer exists.' };
        }

        record.status = 'resolved';

        return { ok: true, record: clone(record) };
    },
};
