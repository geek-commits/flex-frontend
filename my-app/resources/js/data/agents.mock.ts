import type { AgentRosterEntry } from '@/domain/types';

/**
 * Synthetic agent roster mock dataset for the POC.
 *
 * POC MOCK — replace with the real agent/realtime source behind an adapter.
 * Contains development-only synthetic data.
 */

export const AGENT_MOCK_ROSTER: AgentRosterEntry[] = [
    { id: 'a1', name: 'John Doe', extension: '1001', queue: 'Customer Support', state: 'talking', callDuration: '02:14', callsToday: 18, aht: '03:22' },
    { id: 'a2', name: 'Sarah Smith', extension: '1002', queue: 'Sales & Inquiries', state: 'ready', callsToday: 12, aht: '02:45' },
    { id: 'a3', name: 'Michael Brown', extension: '1003', queue: 'Technical Escalations', state: 'wrap-up', callsToday: 9, aht: '06:10' },
    { id: 'a4', name: 'Amina Hassan', extension: '1004', queue: 'Customer Support', state: 'talking', callDuration: '05:31', callsToday: 22, aht: '03:55' },
    { id: 'a5', name: 'Peter Ndungu', extension: '1005', queue: 'Sales & Inquiries', state: 'ready', callsToday: 15, aht: '02:18' },
    { id: 'a6', name: 'Grace Mwanga', extension: '1006', queue: 'Customer Support', state: 'break', callsToday: 8, aht: '04:02' },
    { id: 'a7', name: 'David Kiprotich', extension: '1007', queue: 'Technical Escalations', state: 'not-ready', callsToday: 5, aht: '07:44' },
    { id: 'a8', name: 'Fatuma Ally', extension: '1008', queue: 'Customer Support', state: 'talking', callDuration: '00:48', callsToday: 20, aht: '03:11' },
];
