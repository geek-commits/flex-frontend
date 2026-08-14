import {
    RiDeleteBinLine,
    RiEditLine,
    RiExchangeLine,
    RiExternalLinkLine,
    RiInformationLine,
    RiLinkM,
} from '@remixicon/react';
import React from 'react';
import { FlexDetailSheet } from '@/components/flex/flex-detail-sheet';
import { FlexStatus } from '@/components/flex/flex-status';
import { Button } from '@/components/ui/button';
import type { RecordingCategory, RecordingRecord } from '@/domain/recording-types';
import { RecordingAudioPlayer } from '@/features/recordings/recording-audio-player';

export interface RecordingDetailSheetProps {
    record?: RecordingRecord;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onEdit: (record: RecordingRecord) => void;
    onReplace: (record: RecordingRecord) => void;
    onDelete: (record: RecordingRecord) => void;
}

const CATEGORY_META: Record<RecordingCategory, { label: string; tone: 'info' | 'warning' | 'neutral' | 'success' | 'danger' }> = {
    'ivr-prompt': { label: 'IVR Prompt', tone: 'info' },
    'queue-announcement': { label: 'Queue Audio', tone: 'warning' },
    'voicemail-greeting': { label: 'Voicemail Greeting', tone: 'neutral' },
    'hold-music': { label: 'Hold Music', tone: 'success' },
    'system-announcement': { label: 'System Notice', tone: 'danger' },
};

function formatBytes(bytes: number): string {
    if (bytes === 0) {
        return '0 B';
    }

    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex items-start justify-between gap-4 py-1.5 border-b border-border/40 last:border-0">
            <span className="text-xs text-flex-text-muted shrink-0">{label}</span>
            <span className="text-xs text-flex-text-primary text-right font-medium">{children}</span>
        </div>
    );
}

export function RecordingDetailSheet({
    record,
    open,
    onOpenChange,
    onEdit,
    onReplace,
    onDelete,
}: RecordingDetailSheetProps) {
    if (!record) {
        return null;
    }

    const catMeta = CATEGORY_META[record.category] ?? { label: record.category, tone: 'neutral' as const };

    return (
        <FlexDetailSheet
            open={open}
            onOpenChange={onOpenChange}
            title={record.name}
            meta={`${record.format} · ${record.duration} · ${formatBytes(record.fileSizeBytes)}`}
            footer={
                <div className="flex items-center justify-between gap-2 w-full">
                    <Button
                        variant="destructive"
                        size="sm"
                        className="gap-1.5 text-xs"
                        onClick={() => {
                            onOpenChange(false);
                            onDelete(record);
                        }}
                    >
                        <RiDeleteBinLine className="size-3.5" />
                        Delete
                    </Button>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-1.5 text-xs"
                            onClick={() => {
                                onOpenChange(false);
                                onReplace(record);
                            }}
                        >
                            <RiExchangeLine className="size-3.5" />
                            Replace Audio
                        </Button>
                        <Button
                            size="sm"
                            className="gap-1.5 text-xs"
                            onClick={() => {
                                onOpenChange(false);
                                onEdit(record);
                            }}
                        >
                            <RiEditLine className="size-3.5" />
                            Edit Details
                        </Button>
                    </div>
                </div>
            }
        >
            <div className="flex flex-col gap-5">
                {/* Audio Playback Box */}
                <div className="flex flex-col gap-2 p-3 rounded-lg bg-muted/30 border">
                    <span className="text-[11px] font-semibold text-flex-text-muted uppercase tracking-wider">
                        Audio Preview
                    </span>
                    <RecordingAudioPlayer
                        url={record.url}
                        duration={record.duration}
                        name={record.name}
                        compact={false}
                    />
                </div>

                {/* Metadata List */}
                <div className="flex flex-col">
                    <span className="text-[11px] font-semibold text-flex-text-muted uppercase tracking-wider mb-2">
                        Asset Metadata
                    </span>
                    <DetailRow label="Filename">
                        <span className="font-mono text-[11px]">{record.filename}</span>
                    </DetailRow>
                    <DetailRow label="Category">
                        <FlexStatus tone={catMeta.tone} className="text-[11px]">
                            {catMeta.label}
                        </FlexStatus>
                    </DetailRow>
                    <DetailRow label="Duration">{record.duration}</DetailRow>
                    <DetailRow label="Format & Encoding">{record.format} (Audio)</DetailRow>
                    <DetailRow label="File Size">{formatBytes(record.fileSizeBytes)}</DetailRow>
                    <DetailRow label="Last Modified">
                        {new Date(record.updatedAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                    </DetailRow>
                </div>

                {/* Script / Transcript */}
                {record.description && (
                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-1.5 text-flex-text-muted">
                            <RiInformationLine className="size-3.5" />
                            <span className="text-[11px] font-semibold uppercase tracking-wider">
                                Transcript & Script
                            </span>
                        </div>
                        <p className="text-xs text-flex-text-primary bg-muted/20 p-3 rounded border leading-relaxed">
                            {record.description}
                        </p>
                    </div>
                )}

                {/* Linked Usages */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-1.5 text-flex-text-muted">
                        <RiLinkM className="size-3.5" />
                        <span className="text-[11px] font-semibold uppercase tracking-wider">
                            Routing Usages ({record.usages.length})
                        </span>
                    </div>
                    {record.usages.length === 0 ? (
                        <p className="text-xs text-flex-text-muted italic">
                            This recording is currently unassigned to any IVR menu or Queue.
                        </p>
                    ) : (
                        <div className="flex flex-col gap-1.5">
                            {record.usages.map((usage, i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between p-2.5 rounded border bg-card text-xs"
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-flex-text-primary">{usage.name}</span>
                                        <span className="text-[11px] text-flex-text-muted">({usage.type})</span>
                                    </div>
                                    {usage.href && (
                                        <a
                                            href={usage.href}
                                            className="text-primary hover:underline flex items-center gap-1 text-[11px]"
                                        >
                                            Configure
                                            <RiExternalLinkLine className="size-3" />
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </FlexDetailSheet>
    );
}
