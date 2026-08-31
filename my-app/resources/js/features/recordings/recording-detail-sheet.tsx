import {
    RiDeleteBinLine,
    RiEditLine,
    RiExchangeLine,
    RiExternalLinkLine,
    RiInformationLine,
    RiLinkM,
} from '@remixicon/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FlexDetailSheet } from '@/components/flex/flex-detail-sheet';
import { FlexStatus } from '@/components/flex/flex-status';
import { Button } from '@/components/ui/button';
import type { RecordingRecord } from '@/domain/recording-types';
import { RECORDING_CATEGORY_KEYS, RECORDING_USAGE_TYPE_KEYS } from '@/domain/recording-types';
import { RecordingAudioPlayer } from '@/features/recordings/recording-audio-player';

export interface RecordingDetailSheetProps {
    record?: RecordingRecord;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onEdit: (record: RecordingRecord) => void;
    onReplace: (record: RecordingRecord) => void;
    onDelete: (record: RecordingRecord) => void;
}

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
    const { t, i18n } = useTranslation('administration');

    if (!record) {
        return null;
    }

    const catMeta = (
        {
            'ivr-prompt': { label: t(RECORDING_CATEGORY_KEYS['ivr-prompt']), tone: 'info' as const },
            'queue-announcement': { label: t(RECORDING_CATEGORY_KEYS['queue-announcement']), tone: 'warning' as const },
            'voicemail-greeting': { label: t(RECORDING_CATEGORY_KEYS['voicemail-greeting']), tone: 'neutral' as const },
            'hold-music': { label: t(RECORDING_CATEGORY_KEYS['hold-music']), tone: 'success' as const },
            'system-announcement': { label: t(RECORDING_CATEGORY_KEYS['system-announcement']), tone: 'danger' as const },
        } as const
    )[record.category] ?? { label: record.category, tone: 'neutral' as const };

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
                        {t('recordings.detail.delete')}
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
                            {t('recordings.detail.replaceAudio')}
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
                            {t('recordings.detail.editDetails')}
                        </Button>
                    </div>
                </div>
            }
        >
            <div className="flex flex-col gap-5">
                {/* Audio Playback Box */}
                <div className="flex flex-col gap-2 p-3 rounded-lg bg-muted/30 border">
                    <span className="text-[11px] font-semibold text-flex-text-muted uppercase tracking-wider">
                        {t('recordings.detail.audioPreview')}
                    </span>
                    <RecordingAudioPlayer url={record.url} duration={record.duration} name={record.name} compact={false} />
                </div>

                {/* Metadata List */}
                <div className="flex flex-col">
                    <span className="text-[11px] font-semibold text-flex-text-muted uppercase tracking-wider mb-2">
                        {t('recordings.detail.assetMetadata')}
                    </span>
                    <DetailRow label={t('recordings.detail.filename')}>
                        <span className="font-mono text-[11px]">{record.filename}</span>
                    </DetailRow>
                    <DetailRow label={t('recordings.detail.category')}>
                        <FlexStatus tone={catMeta.tone} className="text-[11px]">
                            {catMeta.label}
                        </FlexStatus>
                    </DetailRow>
                    <DetailRow label={t('recordings.detail.duration')}>{record.duration}</DetailRow>
                    <DetailRow label={t('recordings.detail.formatEncoding')}>{record.format} (Audio)</DetailRow>
                    <DetailRow label={t('recordings.detail.fileSize')}>{formatBytes(record.fileSizeBytes)}</DetailRow>
                    <DetailRow label={t('recordings.detail.lastModified')}>
                        {new Intl.DateTimeFormat(i18n.language, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(record.updatedAt))}
                    </DetailRow>
                </div>

                {/* Script / Transcript */}
                {record.description && (
                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-1.5 text-flex-text-muted">
                            <RiInformationLine className="size-3.5" />
                            <span className="text-[11px] font-semibold uppercase tracking-wider">{t('recordings.detail.transcript')}</span>
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
                            {t('recordings.detail.routingUsages', { count: record.usages.length })}
                        </span>
                    </div>
                    {record.usages.length === 0 ? (
                        <p className="text-xs text-flex-text-muted italic">{t('recordings.detail.unassigned')}</p>
                    ) : (
                        <div className="flex flex-col gap-1.5">
                            {record.usages.map((usage, i) => (
                                <div key={i} className="flex items-center justify-between p-2.5 rounded border bg-card text-xs">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-flex-text-primary">{usage.name}</span>
                                        <span className="text-[11px] text-flex-text-muted">({t(RECORDING_USAGE_TYPE_KEYS[usage.type])})</span>
                                    </div>
                                    {usage.href && (
                                        <a href={usage.href} className="text-primary hover:underline flex items-center gap-1 text-[11px]">
                                            {t('recordings.detail.configure')}
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
