import type { AgentState, CampaignStatus } from '@/types/flex';

/**
 * Shared POC domain entity types.
 *
 * These mirror the existing inline shapes used by the Flex pages. They are
 * UI-only contracts for the POC; the real backend contracts are DEFERRED and
 * will replace the mock adapters behind the same repository interfaces.
 */

export interface CDRRecord {
    id: string;
    date: string;
    customerPhone: string;
    agentName: string;
    queueName: string;
    durationSeconds: number;
    hasRecording: boolean;
    status: 'answered' | 'missed' | 'voicemail' | 'transferred';
}

export interface CampaignRecord {
    id: string;
    sn: number;
    title: string;
    destination: string;
    scheduleTime: string;
    status: CampaignStatus;
    totalContacts: number;
    dialedCount: number;
    answeredCount: number;
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
}
