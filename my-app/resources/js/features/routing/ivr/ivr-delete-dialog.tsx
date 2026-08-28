import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
    const { t } = useTranslation('administration');
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
                toast.success(t('ivr.deleteDialog.toast.deleted'));
            } catch {
                toast.error(t('ivr.deleteDialog.toast.deleteFailed'));
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
                    <AlertDialogTitle>{t('ivr.deleteDialog.title')}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {t('ivr.deleteDialog.description', { name: ivr?.name })}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={busy}>{t('ivr.deleteDialog.cancel')}</AlertDialogCancel>
                    <AlertDialogAction variant="destructive" onClick={handleConfirm} disabled={busy}>
                        {busy ? t('ivr.deleteDialog.deleting') : t('ivr.deleteDialog.delete')}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
