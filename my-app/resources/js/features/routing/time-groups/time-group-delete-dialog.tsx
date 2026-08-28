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
    const { t } = useTranslation('administration');
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
                toast.success(t('timeGroups.deleteDialog.toast.deleted'));
            } catch {
                toast.error(t('timeGroups.deleteDialog.toast.deleteFailed'));
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
                    <AlertDialogTitle>{t('timeGroups.deleteDialog.title')}</AlertDialogTitle>
                    {blocked ? (
                        <AlertDialogDescription>
                            {t('timeGroups.deleteDialog.blockedDescription', { count: usage, count_other: usage })}
                        </AlertDialogDescription>
                    ) : (
                        <AlertDialogDescription>
                            {t('timeGroups.deleteDialog.description', { name: group?.description })}
                        </AlertDialogDescription>
                    )}
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={busy}>{t('timeGroups.deleteDialog.cancel')}</AlertDialogCancel>
                    <AlertDialogAction variant="destructive" onClick={handleConfirm} disabled={busy || blocked}>
                        {busy ? t('timeGroups.deleteDialog.deleting') : t('timeGroups.deleteDialog.delete')}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
