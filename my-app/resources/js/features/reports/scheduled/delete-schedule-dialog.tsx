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
import { scheduledReportsRepository } from '@/domain/scheduled-reports-repository';
import { getReportById } from '@/features/reports/report-registry';
import type { ScheduledReportRecord } from '@/features/reports/scheduled/scheduled-types';

export interface DeleteScheduleDialogProps {
    schedule?: ScheduledReportRecord;
    onOpenChange: (open: boolean) => void;
    onDeleted?: () => void;
}

/**
 * Delete schedule confirmation — identifies the schedule name and report type,
 * and explains that automated execution will stop.
 */
export function DeleteScheduleDialog({ schedule, onOpenChange, onDeleted }: DeleteScheduleDialogProps) {
    const [busy, setBusy] = useState(false);

    const open = !!schedule;

    const handleConfirm = () => {
        if (!schedule) {
            return;
        }

        setBusy(true);
        setTimeout(() => {
            try {
                scheduledReportsRepository.deleteSchedule(schedule.id);
                toast.success('Schedule deleted');
            } catch {
                toast.error('Schedule could not be deleted');
            }

            setBusy(false);
            onOpenChange(false);
            onDeleted?.();
        }, 400);
    };

    const report = schedule ? getReportById(schedule.reportId) : undefined;

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete schedule?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Delete &quot;{schedule?.name}&quot; ({report?.label ?? schedule?.reportId})? Automated execution
                        will stop.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={busy}>Cancel</AlertDialogCancel>
                    <AlertDialogAction variant="destructive" onClick={handleConfirm} disabled={busy}>
                        {busy ? 'Deleting…' : 'Delete Schedule'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
