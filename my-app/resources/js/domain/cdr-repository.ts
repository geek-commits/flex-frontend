import { CDR_MOCK_RECORDS } from '@/data/cdr.mock';
import type { CDRRecord } from '@/domain/types';

/**
 * CDR repository boundary.
 *
 * POC MOCK — this implementation filters the in-memory synthetic dataset.
 * The real backend must implement the same contract (ideally async, server-side
 * search/filter/sort/pagination). No HTTP API is faked; the boundary is local.
 */

export type CdrStatusFilter = CDRRecord['status'] | 'all';
export type CdrQueueFilter = string | 'all';

export interface CdrQuery {
    search?: string;
    status?: CdrStatusFilter;
    queue?: CdrQueueFilter;
    dateFrom?: string;
    dateTo?: string;
}

export interface CdrRepository {
    query(query: CdrQuery): CDRRecord[];
    getById(id: string): CDRRecord | undefined;
}

const matchesDateRange = (recordDate: string, from?: string, to?: string): boolean => {
    if (!from && !to) {
        return true;
    }

    const date = recordDate.slice(0, 10);

    if (from && date < from) {
        return false;
    }

    if (to && date > to) {
        return false;
    }

    return true;
};

export const cdrRepository: CdrRepository = {
    query({ search = '', status = 'all', queue = 'all', dateFrom, dateTo }) {
        const needle = search.trim().toLowerCase();

        return CDR_MOCK_RECORDS.filter((record) => {
            const matchesSearch =
                !needle ||
                record.customerPhone.toLowerCase().includes(needle) ||
                record.agentName.toLowerCase().includes(needle) ||
                record.queueName.toLowerCase().includes(needle) ||
                record.id.toLowerCase().includes(needle);
            const matchesStatus = status === 'all' || record.status === status;
            const matchesQueue = queue === 'all' || record.queueName === queue;
            const matchesDate = matchesDateRange(record.date, dateFrom, dateTo);

            return matchesSearch && matchesStatus && matchesQueue && matchesDate;
        });
    },

    getById(id) {
        return CDR_MOCK_RECORDS.find((record) => record.id === id);
    },
};
