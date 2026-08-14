/**
 * Customer Recovery domain types.
 *
 * POC MOCK — the backend has no callback/voicemail model. These types are the
 * frontend contract for the mock adapter. The backend remains authoritative for
 * ownership, attempt counting, call outcomes, attended/resolved transitions,
 * and voicemail authorization. Status values mirror the current frontend.
 */

export type RecoveryStatus = 'unhandled' | 'callback-scheduled' | 'resolved';

export interface AttemptRecord {
    time: string;
    agent: string;
    outcome: string;
}

export interface VoicemailInfo {
    hasVoicemail: boolean;
    duration?: string;
    /** Secure pseudo-url; a real backend returns an authorized, short-lived URL. */
    url?: string;
}

export interface RecoveryRecord {
    id: string;
    phoneNumber: string;
    customerName?: string;
    missedAt: string;
    category: string;
    queueName: string;
    status: RecoveryStatus;
    attempts: number;
    attemptHistory: AttemptRecord[];
    voicemail: VoicemailInfo;
    /** Owner of the current callback claim, if any. */
    claimedBy?: { id: string; name: string };
}

export interface RecoveryQuery {
    search?: string;
    status?: RecoveryStatus | 'all';
    queue?: string | 'all';
    ownership?: 'all' | 'unclaimed' | 'me';
    voicemail?: 'all' | 'with' | 'without';
}

export type RecoveryMutationResult = { ok: true; record: RecoveryRecord } | { ok: false; reason: string };
