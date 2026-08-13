import type { UserAccount } from '@/features/access-management/shared/types';

/**
 * Synthetic access-management mock dataset for the POC.
 *
 * POC MOCK — replace with the real users backend behind `AccessRepository`.
 * Contains development-only synthetic data; never real credentials.
 */

export const USERS_MOCK_RECORDS: UserAccount[] = [
    { id: 'u1', name: 'Grace Mwanga', email: 'grace.mwanga@flexco.com', username: 'g.mwanga', role: 'super-admin', status: 'active', organization: 'FLEX HQ', lastActivity: '2026-08-12T09:24:00Z', createdAt: '2024-02-11T08:00:00Z' },
    { id: 'u2', name: 'James Otieno', email: 'james.otieno@flexco.com', username: 'j.otieno', role: 'admin', status: 'active', organization: 'FLEX HQ', lastActivity: '2026-08-13T07:10:00Z', createdAt: '2024-03-02T08:00:00Z' },
    { id: 'u3', name: 'Fatuma Ally', email: 'fatuma.ally@flexco.com', username: 'f.ally', role: 'admin', status: 'active', organization: 'Nairobi Central', lastActivity: '2026-08-12T16:48:00Z', createdAt: '2024-05-19T08:00:00Z' },
    { id: 'u4', name: 'David Kiprotich', email: 'david.kiprotich@flexco.com', username: 'd.kiprotich', role: 'admin', status: 'inactive', organization: 'Nairobi Central', lastActivity: '2026-07-30T11:05:00Z', createdAt: '2024-06-04T08:00:00Z' },
    { id: 'u5', name: 'Sarah Smith', email: 'sarah.smith@flexco.com', username: 's.smith', role: 'agent', status: 'active', organization: 'Customer Support', lastActivity: '2026-08-13T08:02:00Z', createdAt: '2024-08-22T08:00:00Z' },
    { id: 'u6', name: 'John Doe', email: 'john.doe@flexco.com', username: 'j.doe', role: 'agent', status: 'active', organization: 'Customer Support', lastActivity: '2026-08-13T07:55:00Z', createdAt: '2024-09-01T08:00:00Z' },
    { id: 'u7', name: 'Amina Hassan', email: 'amina.hassan@flexco.com', username: 'a.hassan', role: 'agent', status: 'active', organization: 'Sales & Inquiries', lastActivity: '2026-08-13T08:11:00Z', createdAt: '2024-10-15T08:00:00Z' },
    { id: 'u8', name: 'Peter Ndungu', email: 'peter.ndungu@flexco.com', username: 'p.ndungu', role: 'agent', status: 'inactive', organization: 'Sales & Inquiries', lastActivity: '2026-07-18T14:30:00Z', createdAt: '2025-01-08T08:00:00Z' },
    { id: 'u9', name: 'Michael Brown', email: 'michael.brown@flexco.com', username: 'm.brown', role: 'agent', status: 'active', organization: 'Technical Escalations', lastActivity: '2026-08-12T18:40:00Z', createdAt: '2025-02-27T08:00:00Z' },
    { id: 'u10', name: 'Linda Wanjiru', email: 'linda.wanjiru@flexco.com', username: 'l.wanjiru', role: 'admin', status: 'active', organization: 'FLEX HQ', lastActivity: '2026-08-13T07:34:00Z', createdAt: '2025-04-10T08:00:00Z' },
    { id: 'u11', name: 'Brian Otundo', email: 'brian.otundo@flexco.com', username: 'b.otundo', role: 'agent', status: 'deleted', organization: 'Customer Support', lastActivity: '2026-05-02T09:20:00Z', createdAt: '2025-06-19T08:00:00Z', deletedAt: '2026-07-28T10:00:00Z' },
    { id: 'u12', name: 'Mary Chebet', email: 'mary.chebet@flexco.com', username: 'm.chebet', role: 'agent', status: 'deleted', organization: 'Sales & Inquiries', lastActivity: '2026-04-11T13:15:00Z', createdAt: '2025-07-03T08:00:00Z', deletedAt: '2026-08-01T09:30:00Z' },
    { id: 'u13', name: 'Samuel Kimani', email: 'samuel.kimani@flexco.com', username: 's.kimani', role: 'admin', status: 'active', organization: 'Nairobi Central', lastActivity: '2026-08-13T06:58:00Z', createdAt: '2025-09-14T08:00:00Z' },
    { id: 'u14', name: 'Esther Njeri', email: 'esther.njeri@flexco.com', username: 'e.njeri', role: 'agent', status: 'active', organization: 'Technical Escalations', lastActivity: '2026-08-12T20:05:00Z', createdAt: '2025-11-21T08:00:00Z' },
];
