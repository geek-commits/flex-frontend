import { SUPPORT_MOCK } from '@/data/support.mock';
import type { SupportData, SupportSubmission, SupportTicket } from './support-types';

/**
 * Quick Support repository boundary.
 *
 * POC MOCK — operates on the in-memory synthetic dataset. Submitting a ticket
 * appends to a local copy for the session. The real backend must implement the
 * same contract later. No HTTP API is faked; the backend remains authoritative
 * for ticket lifecycle, categories, and permissions.
 */
export interface SupportRepository {
    getData(): SupportData;
    getTickets(): SupportTicket[];
    getCategories(): string[];
    submitTicket(submission: SupportSubmission): void;
}

let data: SupportData = SUPPORT_MOCK;

function nextId(): string {
    const max = data.tickets.reduce((acc, t) => {
        const n = Number(t.id.replace('TICK-', ''));

        return Number.isNaN(n) ? acc : Math.max(acc, n);
    }, 1000);

    return `TICK-${max + 1}`;
}

export const supportRepository: SupportRepository = {
    getData() {
        return data;
    },
    getTickets() {
        return data.tickets;
    },
    getCategories() {
        return data.categories;
    },
    submitTicket(submission) {
        const ticket: SupportTicket = {
            id: nextId(),
            subject: submission.subject.trim(),
            category: submission.category,
            status: 'open',
            createdAt: new Date().toISOString(),
        };

        data = { ...data, tickets: [ticket, ...data.tickets] };
    },
};