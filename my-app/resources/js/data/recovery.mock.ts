import type { RecoveryRecord } from '@/features/customer-recovery/recovery-types';

/**
 * POC MOCK — deterministic customer-recovery fixtures. Dev-only; uses synthetic
 * phone numbers. The backend remains authoritative for ownership, attempt
 * counting, call outcomes, and voicemail authorization.
 */
export const RECOVERY_MOCK_RECORDS: RecoveryRecord[] = [
    {
        id: 'mc-1',
        phoneNumber: '+255 784 123 999',
        customerName: 'Grace Mollel',
        missedAt: '2026-08-07 13:15:00',
        category: 'VIP Customer',
        queueName: 'Customer Support',
        status: 'unhandled',
        attempts: 1,
        attemptHistory: [{ time: '2026-08-07 13:16:00', agent: '—', outcome: 'Missed' }],
        voicemail: { hasVoicemail: true, duration: '0:42', url: 'vm://dev/mc-1' },
    },
    {
        id: 'mc-2',
        phoneNumber: '+255 712 998 877',
        customerName: 'Juma Salim',
        missedAt: '2026-08-07 12:40:12',
        category: 'Standard Inbound',
        queueName: 'Sales & Inquiries',
        status: 'callback-scheduled',
        attempts: 2,
        attemptHistory: [
            { time: '2026-08-07 12:41:00', agent: 'Fatuma Ally', outcome: 'No Answer' },
            { time: '2026-08-07 12:55:00', agent: 'Fatuma Ally', outcome: 'Busy' },
        ],
        voicemail: { hasVoicemail: false },
        claimedBy: { id: 'u3', name: 'Fatuma Ally' },
    },
    {
        id: 'mc-3',
        phoneNumber: '+255 655 443 322',
        customerName: 'Amina Hassan',
        missedAt: '2026-08-07 11:20:45',
        category: 'Technical Inquiry',
        queueName: 'Technical Escalations',
        status: 'resolved',
        attempts: 3,
        attemptHistory: [
            { time: '2026-08-07 11:21:00', agent: 'Michael Brown', outcome: 'No Answer' },
            { time: '2026-08-07 12:00:00', agent: 'Michael Brown', outcome: 'Answered' },
        ],
        voicemail: { hasVoicemail: true, duration: '1:08', url: 'vm://dev/mc-3' },
        claimedBy: { id: 'u9', name: 'Michael Brown' },
    },
    {
        id: 'mc-4',
        phoneNumber: '+255 789 321 654',
        customerName: 'Peter Ndungu',
        missedAt: '2026-08-06 17:05:33',
        category: 'VIP Customer',
        queueName: 'Customer Support',
        status: 'unhandled',
        attempts: 0,
        attemptHistory: [],
        voicemail: { hasVoicemail: false },
    },
    {
        id: 'mc-5',
        phoneNumber: '+255 700 112 233',
        missedAt: '2026-08-06 15:48:09',
        category: 'Standard Inbound',
        queueName: 'Customer Support',
        status: 'resolved',
        attempts: 4,
        attemptHistory: [
            { time: '2026-08-06 15:49:00', agent: 'Sarah Smith', outcome: 'No Answer' },
            { time: '2026-08-06 16:20:00', agent: 'Sarah Smith', outcome: 'Answered' },
        ],
        voicemail: { hasVoicemail: true, duration: '2:04', url: 'vm://dev/mc-5' },
        claimedBy: { id: 'u5', name: 'Sarah Smith' },
    },
    {
        id: 'mc-6',
        phoneNumber: '+255 733 556 677',
        customerName: 'Linda Wanjiru',
        missedAt: '2026-08-06 14:02:51',
        category: 'Technical Inquiry',
        queueName: 'Technical Escalations',
        status: 'callback-scheduled',
        attempts: 2,
        attemptHistory: [
            { time: '2026-08-06 14:03:00', agent: 'Esther Njeri', outcome: 'Busy' },
        ],
        voicemail: { hasVoicemail: true, duration: '0:31', url: 'vm://dev/mc-6' },
        claimedBy: { id: 'u14', name: 'Esther Njeri' },
    },
];
