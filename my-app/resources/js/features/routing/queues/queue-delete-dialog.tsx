import React, { useState } from 'react';
import { toast } from 'sonner';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { routingRepository } from '@/domain/routing-repository';
import type { QueueRecord } from '@/domain/routing-types';

export interface QueueDeleteDialogProps {
    queue?: QueueRecord;
    onOpenChange: (open: boolean) => void;
    onDeleted?: () => void;
}

/**
 * Queue deletion — high consequence. Confirms the queue identity and explains
 * that incoming-call distribution for this queue will stop.
 */
export function QueueDeleteDialog({ queue, onOpenChange, onDeleted }: QueueDeleteDialogProps) {
    const [busy, setBusy] = useState(false);

    const open = !!queue;

    const handleConfirm = () => {
        if (!queue) {
            return;
        }

        setBusy(true);
        setTimeout(() => {
            try {
                routingRepository.deleteQueue(queue.id);
                toast.success('Queue deleted');
            } catch {
                toast.error('Queue could not be deleted');
            }

            setBusy(false);
            onOpenChange(false);
            onDeleted?.();
        }, 400);
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete queue?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Delete &quot;{queue?.name}&quot; ({queue?.extension})? Incoming-call distribution for this queue
                        will stop.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={busy}>Cancel</AlertDialogCancel>
                    <AlertDialogAction variant="destructive" onClick={handleConfirm} disabled={busy}>
                        {busy ? 'Deleting…' : 'Delete Queue'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
