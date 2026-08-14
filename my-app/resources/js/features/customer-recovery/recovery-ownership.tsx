import React from 'react';
import type { RecoveryRecord } from '@/features/customer-recovery/recovery-types';

export interface RecoveryOwnershipProps {
    record: RecoveryRecord;
    currentAgentId?: string;
}

/**
 * Ownership presentation — separate from status. Shows Unclaimed, Claimed by
 * you, or Claimed by <name>. Never inferred from call history.
 */
export function RecoveryOwnership({ record, currentAgentId }: RecoveryOwnershipProps) {
    if (!record.claimedBy) {
        return <span className="text-xs text-flex-text-muted">Unclaimed</span>;
    }

    if (currentAgentId && record.claimedBy.id === currentAgentId) {
        return <span className="text-xs font-semibold text-primary">Claimed by you</span>;
    }

    return <span className="text-xs text-flex-text-muted">Claimed by {record.claimedBy.name}</span>;
}
