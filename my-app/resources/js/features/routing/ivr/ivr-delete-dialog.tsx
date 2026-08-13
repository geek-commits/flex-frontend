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
import type { IVRRecord } from '@/domain/routing-types';

export interface IVRDeleteDialogProps {
    ivr?: IVRRecord;
    onOpenChange: (open: boolean) => void;
    onDeleted?: () => void;
}

/** IVR deletion — confirms the IVR name and that its menu routing will be removed. */
export function IVRDeleteDialog({ ivr, onOpenChange, onDeleted }: IVRDeleteDialogProps) {
    const [busy, setBusy] = useState(false);

    const open = !!ivr;

    const handleConfirm = () => {
        if (!ivr) {
            return;
        }

        setBusy(true);
        setTimeout(() => {
            try {
                routingRepository.deleteIVR(ivr.id);
                toast.success('IVR deleted');
            } catch {
                toast.error('IVR could not be deleted');
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
                    <AlertDialogTitle>Delete IVR?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Delete &quot;{ivr?.name}&quot;? Its menu entries and destinations will be removed.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={busy}>Cancel</AlertDialogCancel>
                    <AlertDialogAction variant="destructive" onClick={handleConfirm} disabled={busy}>
                        {busy ? 'Deleting…' : 'Delete IVR'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
