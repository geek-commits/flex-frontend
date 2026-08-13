import type { QueueMember, QueueRecord } from '@/domain/routing-types';

/**
 * POC MOCK — deterministic queue fixtures. Dev-only. Queue identities align
 * with the runtime queue set in `docs/design/domain/queue-state.md`
 * (Customer Support, Sales & Inquiries, Technical Escalations).
 */
export const QUEUE_MOCK_RECORDS: QueueRecord[] = [
    {
        id: 'q1',
        name: 'Customer Support',
        extension: '7001',
        strategy: 'ring-all',
        ringTimeout: 30,
        memberCount: 4,
        status: 'active',
        description: 'General customer support inbound queue.',
    },
    {
        id: 'q2',
        name: 'Sales & Inquiries',
        extension: '7002',
        strategy: 'least-recent',
        ringTimeout: 25,
        memberCount: 3,
        status: 'active',
        description: 'Sales and new-inquiry call routing.',
    },
    {
        id: 'q3',
        name: 'Technical Escalations',
        extension: '7003',
        strategy: 'fewest-calls',
        ringTimeout: 20,
        memberCount: 2,
        status: 'inactive',
        description: 'Technical escalation handling queue.',
    },
];

export const QUEUE_MEMBERS_MOCK: Record<string, QueueMember[]> = {
    q1: [
        { agentId: 'u1', name: 'Grace Mwanga', extension: '8001', department: 'Customer Support', priority: 1 },
        { agentId: 'u2', name: 'James Otieno', extension: '8002', department: 'Customer Support', priority: 1 },
        { agentId: 'u5', name: 'Sarah Smith', extension: '8005', department: 'Customer Support', priority: 2 },
        { agentId: 'u6', name: 'John Doe', extension: '8006', department: 'Customer Support', priority: 2 },
    ],
    q2: [
        { agentId: 'u3', name: 'Fatuma Ally', extension: '8003', department: 'Sales & Inquiries', priority: 1 },
        { agentId: 'u7', name: 'Amina Hassan', extension: '8007', department: 'Sales & Inquiries', priority: 1 },
        { agentId: 'u10', name: 'Linda Wanjiru', extension: '8010', department: 'Sales & Inquiries', priority: 2 },
    ],
    q3: [
        { agentId: 'u9', name: 'Michael Brown', extension: '8009', department: 'Technical Escalations', priority: 1 },
        { agentId: 'u14', name: 'Esther Njeri', extension: '8014', department: 'Technical Escalations', priority: 2 },
    ],
};

/** All available agents (for the members add/remove surface). */
export const AVAILABLE_AGENTS_MOCK: QueueMember[] = [
    { agentId: 'u1', name: 'Grace Mwanga', extension: '8001', department: 'Customer Support', priority: 1 },
    { agentId: 'u2', name: 'James Otieno', extension: '8002', department: 'Customer Support', priority: 1 },
    { agentId: 'u3', name: 'Fatuma Ally', extension: '8003', department: 'Sales & Inquiries', priority: 1 },
    { agentId: 'u4', name: 'David Kiprotich', extension: '8004', department: 'Sales & Inquiries', priority: 2 },
    { agentId: 'u5', name: 'Sarah Smith', extension: '8005', department: 'Customer Support', priority: 2 },
    { agentId: 'u6', name: 'John Doe', extension: '8006', department: 'Customer Support', priority: 2 },
    { agentId: 'u7', name: 'Amina Hassan', extension: '8007', department: 'Sales & Inquiries', priority: 1 },
    { agentId: 'u8', name: 'Peter Ndungu', extension: '8008', department: 'Sales & Inquiries', priority: 2 },
    { agentId: 'u9', name: 'Michael Brown', extension: '8009', department: 'Technical Escalations', priority: 1 },
    { agentId: 'u10', name: 'Linda Wanjiru', extension: '8010', department: 'Sales & Inquiries', priority: 2 },
    { agentId: 'u13', name: 'Samuel Kimani', extension: '8013', department: 'Technical Escalations', priority: 2 },
    { agentId: 'u14', name: 'Esther Njeri', extension: '8014', department: 'Technical Escalations', priority: 2 },
];
