import { RiAlertLine, RiDeleteBinLine } from '@remixicon/react';
import React from 'react';
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
import type { RecordingRecord } from '@/domain/recording-types';

export interface RecordingDeleteDialogProps {
    record?: RecordingRecord;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (record: RecordingRecord, force: boolean) => void;
}

export function RecordingDeleteDialog({
    record,
    open,
    onOpenChange,
    onConfirm,
}: RecordingDeleteDialogProps) {
    if (!record) {
        return null;
    }

    const hasUsages = record.usages.length > 0;

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="sm:max-w-md">
                <AlertDialogHeader className="gap-2">
                    <div className="flex items-center gap-2 text-destructive">
                        <RiAlertLine className="size-5" />
                        <AlertDialogTitle>Delete Recording</AlertDialogTitle>
                    </div>
                    <AlertDialogDescription className="text-xs text-flex-text-muted leading-relaxed">
                        Are you sure you want to delete <span className="font-semibold text-flex-text-primary">"{record.name}"</span> ({record.filename})? This action cannot be undone.
                    </AlertDialogDescription>

                    {hasUsages && (
                        <div className="mt-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md text-xs">
                            <p className="font-semibold text-destructive mb-1">Warning: Active Routing Dependencies</p>
                            <p className="text-flex-text-muted">
                                This audio file is actively used by:
                            </p>
                            <ul className="list-disc list-inside mt-1 font-medium text-flex-text-primary">
                                {record.usages.map((u, i) => (
                                    <li key={i}>{u.type}: {u.name}</li>
                                ))}
                            </ul>
                            <p className="mt-2 text-destructive text-[11px]">
                                Deleting this asset may cause callers to hear silence or encounter routing errors.
                            </p>
                        </div>
                    )}
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-2">
                    <AlertDialogCancel className="text-xs h-9">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        className="text-xs h-9 bg-destructive hover:bg-destructive/90 gap-1.5"
                        onClick={() => onConfirm(record, true)}
                    >
                        <RiDeleteBinLine className="size-3.5" />
                        {hasUsages ? 'Delete Anyway' : 'Delete Recording'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
