import type { ExecutionState } from '@/features/reports/scheduled/scheduled-types';

/**
 * Execution history domain types. Logs are an operational troubleshooting
 * surface — a dense timeline, not summary cards.
 */

export interface ExecutionStage {
    name: string;
    duration: string;
    status: 'completed' | 'failed';
    error?: string;
}

export interface ExecutionRecord {
    id: string;
    scheduleId: string;
    timestamp: string;
    state: ExecutionState;
    duration: string;
    records: number;
    fileSize: string;
    emailsSent: number;
    emailsFailed: number;
    stages: ExecutionStage[];
}
