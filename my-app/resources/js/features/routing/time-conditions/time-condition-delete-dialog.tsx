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
import type { TimeConditionRecord } from '@/domain/routing-types';

export interface TimeConditionDeleteDialogProps {
    condition?: TimeConditionRecord;
    onOpenChange: (open: boolean) => void;
    onDeleted?: () => void;
}

/** Time Condition deletion — confirms the condition name and that routing rules stop. */
export function TimeConditionDeleteDialog({ condition, onOpenChange, onDeleted }: TimeConditionDeleteDialogProps) {
    const { t } = useTranslation('administration');
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
                toast.success(t('timeConditions.deleteDialog.toast.deleted'));
            } catch {
                toast.error(t('timeConditions.deleteDialog.toast.deleteFailed'));
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
                    <AlertDialogTitle>{t('timeConditions.deleteDialog.title')}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {t('timeConditions.deleteDialog.description', { name: condition?.name })}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={busy}>{t('timeConditions.deleteDialog.cancel')}</AlertDialogCancel>
                    <AlertDialogAction variant="destructive" onClick={handleConfirm} disabled={busy}>
                        {busy ? t('timeConditions.deleteDialog.deleting') : t('timeConditions.deleteDialog.delete')}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
