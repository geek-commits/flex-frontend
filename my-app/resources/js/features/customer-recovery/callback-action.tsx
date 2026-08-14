import { RiLoaderLine, RiPhoneLine } from '@remixicon/react';
import React, { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { recoveryRepository } from '@/domain/recovery-repository';
import { workspaceState } from '@/features/agent-workspace/state/mock-workspace-state';
import { useWorkspaceState } from '@/features/agent-workspace/state/use-workspace-state';
import type { RecoveryRecord } from '@/features/customer-recovery/recovery-types';

export interface CallbackActionProps {
    record: RecoveryRecord;
    currentAgent: { id: string; name: string };
    onChanged?: (record: RecoveryRecord) => void;
}

const IN_CALL = new Set(['dialing', 'connecting', 'connected', 'hold', 'transferring', 'wrap-up']);

/**
 * Call Back — uses the canonical outbound pipeline (`workspaceState.dial`), not
 * a second dialer. Duplicate clicks are prevented; a claim is only acknowledged
 * from the repository, never assumed. Not available while a call is active or
 * the record is resolved.
 */
export function CallbackAction({ record, currentAgent, onChanged }: CallbackActionProps) {
    const { callState } = useWorkspaceState();
    const [pending, setPending] = useState(false);

    const canCall =
        record.status !== 'resolved' &&
        !IN_CALL.has(callState) &&
        Boolean(record.phoneNumber) &&
        (!record.claimedBy || record.claimedBy.id === currentAgent.id);

    const handleCall = useCallback(() => {
        if (!canCall || pending) {
            return;
        }

        setPending(true);

        setTimeout(() => {
            // Authoritative claim acknowledgement from the repository.
            const claim = recoveryRepository.claimRecord(record.id, currentAgent.id, currentAgent.name);

            if (!claim.ok) {
                setPending(false);
                toast.error(claim.reason);

                return;
            }

            recoveryRepository.incrementAttempt(record.id, currentAgent.name);
            onChanged?.(recoveryRepository.getById(record.id)!);

            // Start the canonical outbound call.
            workspaceState.dial({
                id: record.id,
                kind: 'phone',
                label: record.customerName ?? record.phoneNumber,
                phone: record.phoneNumber,
            });

            setPending(false);
            toast.success('Callback started');
        }, 400);
    }, [canCall, pending, record, currentAgent, onChanged]);

    const reason = !record.phoneNumber
        ? 'No phone number'
        : record.status === 'resolved'
          ? 'Resolved'
          : IN_CALL.has(callState)
            ? 'Call already active'
            : undefined;

    return (
        <Button
            size="sm"
            variant="outline"
            className="gap-1 text-xs text-primary"
            onClick={handleCall}
            disabled={!canCall || pending}
            title={reason}
            aria-label={`Call back ${record.customerName ?? record.phoneNumber}`}
        >
            {pending ? <RiLoaderLine className="size-3.5 animate-spin" /> : <RiPhoneLine className="size-3" />}
            {pending ? 'Starting…' : 'Call Back'}
        </Button>
    );
}
