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
    const { t } = useTranslation('administration');
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
                toast.success(t('queues.deleteDialog.toast.deleted'));
            } catch {
                toast.error(t('queues.deleteDialog.toast.deleteFailed'));
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
                    <AlertDialogTitle>{t('queues.deleteDialog.title')}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {t('queues.deleteDialog.description', { name: queue?.name, extension: queue?.extension })}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={busy}>{t('queues.deleteDialog.cancel')}</AlertDialogCancel>
                    <AlertDialogAction variant="destructive" onClick={handleConfirm} disabled={busy}>
                        {busy ? t('queues.deleteDialog.deleting') : t('queues.deleteDialog.delete')}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
