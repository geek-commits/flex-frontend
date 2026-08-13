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
import type { TimeGroupRecord } from '@/domain/routing-types';

export interface TimeGroupDeleteDialogProps {
    group?: TimeGroupRecord;
    onOpenChange: (open: boolean) => void;
    onDeleted?: () => void;
}

/**
 * Time Group deletion. If the group is referenced by a Time Condition, deletion
 * is blocked and the backend-style dependency reason is surfaced.
 */
export function TimeGroupDeleteDialog({ group, onOpenChange, onDeleted }: TimeGroupDeleteDialogProps) {
    const [busy, setBusy] = useState(false);

    const open = !!group;
    const usage = group ? routingRepository.timeGroupUsage(group.id) : 0;
    const blocked = usage > 0;

    const handleConfirm = () => {
        if (!group || blocked) {
            return;
        }

        setBusy(true);
        setTimeout(() => {
            try {
                routingRepository.deleteTimeGroup(group.id);
                toast.success('Time Group deleted');
            } catch {
                toast.error('Time Group could not be deleted');
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
                    <AlertDialogTitle>Delete time group?</AlertDialogTitle>
                    {blocked ? (
                        <AlertDialogDescription>
                            This Time Group is currently used by {usage} time condition{usage === 1 ? '' : 's'} and
                            cannot be deleted.
                        </AlertDialogDescription>
                    ) : (
                        <AlertDialogDescription>
                            Delete &quot;{group?.description}&quot;? Its schedule definition will be removed.
                        </AlertDialogDescription>
                    )}
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={busy}>Cancel</AlertDialogCancel>
                    <AlertDialogAction variant="destructive" onClick={handleConfirm} disabled={busy || blocked}>
                        {busy ? 'Deleting…' : 'Delete Time Group'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
