import { RiAlertLine, RiDeleteBinLine } from '@remixicon/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
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
import { RECORDING_USAGE_TYPE_KEYS } from '@/domain/recording-types';
import type { RecordingRecord } from '@/domain/recording-types';

export interface RecordingDeleteDialogProps {
    record?: RecordingRecord;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (record: RecordingRecord, force: boolean) => void;
}

export function RecordingDeleteDialog({ record, open, onOpenChange, onConfirm }: RecordingDeleteDialogProps) {
    const { t } = useTranslation('administration');

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
                        <AlertDialogTitle>{t('recordings.delete.title')}</AlertDialogTitle>
                    </div>
                    <AlertDialogDescription className="text-xs text-flex-text-muted leading-relaxed">
                        {t('recordings.delete.description', { name: record.name, filename: record.filename })}
                    </AlertDialogDescription>

                    {hasUsages && (
                        <div className="mt-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md text-xs">
                            <p className="font-semibold text-destructive mb-1">{t('recordings.delete.warningTitle')}</p>
                            <p className="text-flex-text-muted">{t('recordings.delete.warningDescription')}</p>
                            <ul className="list-disc list-inside mt-1 font-medium text-flex-text-primary">
                                {record.usages.map((u, i) => (
                                    <li key={i}>
                                        {t(RECORDING_USAGE_TYPE_KEYS[u.type])}: {u.name}
                                    </li>
                                ))}
                            </ul>
                            <p className="mt-2 text-destructive text-[11px]">{t('recordings.delete.warningHint')}</p>
                        </div>
                    )}
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-2">
                    <AlertDialogCancel className="text-xs h-9">{t('recordings.delete.cancel')}</AlertDialogCancel>
                    <AlertDialogAction
                        className="text-xs h-9 bg-destructive hover:bg-destructive/90 gap-1.5"
                        onClick={() => onConfirm(record, true)}
                    >
                        <RiDeleteBinLine className="size-3.5" />
                        {hasUsages ? t('recordings.delete.deleteAnyway') : t('recordings.delete.deleteRecording')}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
