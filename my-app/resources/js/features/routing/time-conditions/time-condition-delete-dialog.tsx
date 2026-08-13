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
import type { TimeConditionRecord } from '@/domain/routing-types';

export interface TimeConditionDeleteDialogProps {
    condition?: TimeConditionRecord;
    onOpenChange: (open: boolean) => void;
    onDeleted?: () => void;
}

/** Time Condition deletion — confirms the condition name and that routing rules stop. */
export function TimeConditionDeleteDialog({ condition, onOpenChange, onDeleted }: TimeConditionDeleteDialogProps) {
    const [busy, setBusy] = useState(false);

    const open = !!condition;

    const handleConfirm = () => {
        if (!condition) {
            return;
        }

        setBusy(true);
        setTimeout(() => {
            try {
                routingRepository.deleteTimeCondition(condition.id);
                toast.success('Time Condition deleted');
            } catch {
                toast.error('Time Condition could not be deleted');
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
                    <AlertDialogTitle>Delete time condition?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Delete &quot;{condition?.name}&quot;? Its schedule-based routing rules will be removed.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={busy}>Cancel</AlertDialogCancel>
                    <AlertDialogAction variant="destructive" onClick={handleConfirm} disabled={busy}>
                        {busy ? 'Deleting…' : 'Delete Condition'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
