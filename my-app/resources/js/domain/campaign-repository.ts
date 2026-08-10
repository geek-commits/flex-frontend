import { getCampaignContacts  } from '@/data/campaign-contacts.mock';
import type {CampaignContact} from '@/data/campaign-contacts.mock';
import { CAMPAIGN_MOCK_RECORDS } from '@/data/campaigns.mock';
import type { CampaignRecord } from '@/domain/types';
import type { CampaignStatus } from '@/types/flex';

/**
 * Campaign repository boundary.
 *
 * POC MOCK — operates on the in-memory synthetic dataset. CRUD mutations update
 * a local copy for the session. The real backend must implement the same
 * contract (persistence, authorization, validation) later. No HTTP API is faked.
 */

export type CampaignStatusFilter = CampaignStatus | 'all';

export interface CampaignQuery {
    search?: string;
    status?: CampaignStatusFilter;
}

export interface CampaignRepository {
    query(query: CampaignQuery): CampaignRecord[];
    getById(id: string): CampaignRecord | undefined;
    getContacts(id: string, limit?: number): CampaignContact[];
    create(input: CampaignDraft): CampaignRecord;
    update(id: string, input: CampaignDraft): CampaignRecord | undefined;
    delete(id: string): void;
}

export interface CampaignDraft {
    title: string;
    destination: string;
    scheduleTime: string;
    status: CampaignStatus;
    totalContacts: number;
    dialedCount: number;
    answeredCount: number;
}

let records = [...CAMPAIGN_MOCK_RECORDS];

const nextSn = () => records.reduce((max, r) => Math.max(max, r.sn), 0) + 1;

export const campaignRepository: CampaignRepository = {
    query({ search = '', status = 'all' }) {
        const needle = search.trim().toLowerCase();

        return records.filter((record) => {
            const matchesSearch =
                !needle ||
                record.title.toLowerCase().includes(needle) ||
                record.destination.toLowerCase().includes(needle);
            const matchesStatus = status === 'all' || record.status === status;

            return matchesSearch && matchesStatus;
        });
    },

    getById(id) {
        return records.find((record) => record.id === id);
    },

    getContacts(id, limit = 12) {
        return getCampaignContacts(id, limit);
    },

    create(input) {
        const record: CampaignRecord = {
            id: `camp-${Date.now()}`,
            sn: nextSn(),
            ...input,
        };
        records = [record, ...records];

        return record;
    },

    update(id, input) {
        let updated: CampaignRecord | undefined;
        records = records.map((record) => {
            if (record.id !== id) {
return record;
}

            updated = { ...record, ...input };

            return updated;
        });

        return updated;
    },

    delete(id) {
        records = records.filter((record) => record.id !== id);
    },
};
