import { Head } from '@inertiajs/react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { FlexMetricItem } from '@/components/flex/metrics/flex-metric-item';
import { FlexMetricStrip } from '@/components/flex/metrics/flex-metric-strip';
import type { RecordingDraft, RecordingRecord } from '@/domain/recording-types';
import { RecordingDeleteDialog } from '@/features/recordings/recording-delete-dialog';
import { RecordingDetailSheet } from '@/features/recordings/recording-detail-sheet';
import { RecordingFormSheet } from '@/features/recordings/recording-form-sheet';
import { RecordingToolbar } from '@/features/recordings/recording-toolbar';
import { RecordingsTable } from '@/features/recordings/recordings-table';
import { useRecordingsData } from '@/features/recordings/use-recordings-data';
import { AdminShell } from '@/layouts/admin-shell';

function formatBytes(bytes: number): string {
    if (bytes === 0) {
        return '0 B';
    }

    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function RecordingsPage() {
    const {
        records,
        summary,
        query,
        setQuery,
        isLoading,
        lastUpdated,
        create,
        update,
        replaceAudio,
        remove,
    } = useRecordingsData();

    const [selectedRecord, setSelectedRecord] = useState<RecordingRecord>();
    const [detailOpen, setDetailOpen] = useState(false);

    const [formOpen, setFormOpen] = useState(false);
    const [formMode, setFormMode] = useState<'create' | 'edit' | 'replace'>('create');
    const [editingRecord, setEditingRecord] = useState<RecordingRecord>();

    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deletingRecord, setDeletingRecord] = useState<RecordingRecord>();

    const handleRowClick = (record: RecordingRecord) => {
        setSelectedRecord(record);
        setDetailOpen(true);
    };

    const handleEdit = (record: RecordingRecord) => {
        setEditingRecord(record);
        setFormMode('edit');
        setFormOpen(true);
    };

    const handleReplace = (record: RecordingRecord) => {
        setEditingRecord(record);
        setFormMode('replace');
        setFormOpen(true);
    };

    const handleDeleteClick = (record: RecordingRecord) => {
        setDeletingRecord(record);
        setDeleteOpen(true);
    };

    const handleSaveDraft = (draft: RecordingDraft): boolean => {
        if (formMode === 'create') {
            const res = create(draft);

            if (!res.ok) {
                toast.error(res.reason);

                return false;
            }

            return true;
        }

        if (formMode === 'edit' && editingRecord) {
            const res = update(editingRecord.id, draft);

            if (!res.ok) {
                toast.error(res.reason);

                return false;
            }

            if (selectedRecord?.id === editingRecord.id) {
                setSelectedRecord(res.record);
            }

            return true;
        }

        return false;
    };

    const handleConfirmReplace = (
        id: string,
        fileData: { filename: string; format: 'WAV' | 'MP3'; duration?: string; durationSeconds?: number; fileSizeBytes?: number; url?: string }
    ): boolean => {
        const res = replaceAudio(id, fileData);

        if (!res.ok) {
            toast.error(res.reason);

            return false;
        }

        if (selectedRecord?.id === id) {
            setSelectedRecord(res.record);
        }

        return true;
    };

    const handleConfirmDelete = (record: RecordingRecord, force: boolean) => {
        const res = remove(record.id, force);

        if (!res.ok) {
            toast.error(res.reason ?? 'Failed to delete recording');

            return;
        }

        toast.success(`Deleted "${record.name}"`);
        setDeleteOpen(false);

        if (selectedRecord?.id === record.id) {
            setDetailOpen(false);
            setSelectedRecord(undefined);
        }
    };

    return (
        <AdminShell
            title="Call Recordings & Audio Prompts"
            subtitle="Manage system audio files, greetings, hold music, and IVR prompts."
        >
            <Head title="Call Recordings & Audio Prompts — Flex Contact Center" />

            <div className="flex flex-col gap-[var(--flex-space-section)] w-full">
                {/* Metric Summary Strip */}
                <FlexMetricStrip>
                    <FlexMetricItem label="Total Audio Assets" value={summary.totalRecordings} />
                    <FlexMetricItem label="Storage Used" value={formatBytes(summary.totalFileSizeBytes)} />
                    <FlexMetricItem label="IVR Prompts" value={summary.ivrPromptsCount} />
                    <FlexMetricItem label="Queue Audio" value={summary.queueAudioCount} />
                </FlexMetricStrip>

                <div className="flex items-center justify-between text-xs text-flex-text-muted">
                    <span>
                        Showing <span className="font-semibold text-flex-text-primary">{records.length}</span> audio {records.length === 1 ? 'file' : 'files'}
                    </span>
                    <span>
                        Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>

                {/* Toolbar */}
                <RecordingToolbar
                    query={query}
                    onQueryChange={setQuery}
                    onUploadClick={() => {
                        setEditingRecord(undefined);
                        setFormMode('create');
                        setFormOpen(true);
                    }}
                />

                {/* Main Table */}
                <RecordingsTable
                    records={records}
                    isLoading={isLoading}
                    onRowClick={handleRowClick}
                    onEdit={handleEdit}
                    onReplace={handleReplace}
                    onDelete={handleDeleteClick}
                />
            </div>

            {/* Detail Sheet */}
            <RecordingDetailSheet
                record={selectedRecord}
                open={detailOpen}
                onOpenChange={setDetailOpen}
                onEdit={handleEdit}
                onReplace={handleReplace}
                onDelete={handleDeleteClick}
            />

            {/* Form Sheet (Create / Edit / Replace) */}
            <RecordingFormSheet
                open={formOpen}
                onOpenChange={setFormOpen}
                mode={formMode}
                editing={editingRecord}
                onSave={handleSaveDraft}
                onReplaceAudio={handleConfirmReplace}
            />

            {/* Delete Dialog */}
            <RecordingDeleteDialog
                record={deletingRecord}
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                onConfirm={handleConfirmDelete}
            />
        </AdminShell>
    );
}
