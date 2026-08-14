import React from 'react';
import { FlexDetailSheet } from '@/components/flex/flex-detail-sheet';
import { AttemptHistory } from '@/features/customer-recovery/attempt-history';
import { CallbackAction } from '@/features/customer-recovery/callback-action';
import { RecoveryOwnership } from '@/features/customer-recovery/recovery-ownership';
import { RecoveryStatus } from '@/features/customer-recovery/recovery-status';
import type { RecoveryRecord } from '@/features/customer-recovery/recovery-types';
import { VoicemailPlayer } from '@/features/customer-recovery/voicemail-player';

export interface RecoveryDetailSheetProps {
    record?: RecoveryRecord;
    currentAgent: { id: string; name: string };
    onOpenChange: (open: boolean) => void;
    onRecordChanged: (record: RecoveryRecord) => void;
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex items-start justify-between gap-4">
            <span className="text-xs text-flex-text-muted shrink-0">{label}</span>
            <span className="text-xs text-flex-text-primary text-right">{children}</span>
        </div>
    );
}

/** Recovery detail — inspect context and act on a callback without leaving the queue. */
export function RecoveryDetailSheet({ record, currentAgent, onOpenChange, onRecordChanged }: RecoveryDetailSheetProps) {
    const open = !!record;

    return (
        <FlexDetailSheet
            open={open}
            onOpenChange={onOpenChange}
            title={record?.customerName ?? 'Unknown customer'}
            meta={record?.phoneNumber}
            footer={
                record ? (
                    <CallbackAction record={record} currentAgent={currentAgent} onChanged={onRecordChanged} />
                ) : undefined
            }
        >
            <div className="flex flex-col gap-3">
                <DetailRow label="Phone">
                    <span className="font-mono">{record?.phoneNumber ?? '—'}</span>
                </DetailRow>
                <DetailRow label="Missed At">
                    {record
                        ? Number.isNaN(new Date(record.missedAt).getTime())
                            ? record.missedAt
                            : new Date(record.missedAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })
                        : '—'}
                </DetailRow>
                <DetailRow label="Queue">{record?.queueName ?? '—'}</DetailRow>
                <DetailRow label="Category">{record?.category ?? '—'}</DetailRow>
                <DetailRow label="Status">
                    {record && <RecoveryStatus status={record.status} />}
                </DetailRow>
                <DetailRow label="Ownership">
                    {record && <RecoveryOwnership record={record} currentAgentId={currentAgent.id} />}
                </DetailRow>
                <DetailRow label="Attempts">{record?.attempts ?? 0}</DetailRow>
                {record?.voicemail.hasVoicemail && (
                    <DetailRow label="Voicemail">
                        <VoicemailPlayer voicemail={record.voicemail} />
                    </DetailRow>
                )}
                {record && (
                    <div className="mt-1 flex flex-col gap-1.5">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-flex-text-muted">Attempt History</p>
                        <AttemptHistory attempts={record.attemptHistory} />
                    </div>
                )}
            </div>
        </FlexDetailSheet>
    );
}
