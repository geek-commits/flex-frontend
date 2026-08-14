import { Head } from '@inertiajs/react';
import React, { useState } from 'react';
import { RecoveryDetailSheet } from '@/features/customer-recovery/recovery-detail-sheet';
import { RecoveryTable } from '@/features/customer-recovery/recovery-table';
import { RecoveryToolbar } from '@/features/customer-recovery/recovery-toolbar';
import type { RecoveryRecord } from '@/features/customer-recovery/recovery-types';
import { useRecoveryData } from '@/features/customer-recovery/use-recovery-data';
import { AgentShell } from '@/layouts/agent-shell';

/**
 * Customer Recovery workspace — missed-call triage + voicemail + callback.
 * The page is the recovery surface; telephony state stays in the canonical
 * workspace store.
 */
export function RecoveryPage() {
    const { records, query, setQuery, isLoading, error, refresh, getById, mutate, currentAgent, summary, lastUpdated } = useRecoveryData();
    const [detailId, setDetailId] = useState<string>();

    const detailRecord = detailId ? getById(detailId) ?? records.find((record) => record.id === detailId) : undefined;

    const queues = Array.from(new Set(records.map((record) => record.queueName))).sort();

    const handleRecordChanged = (record: RecoveryRecord) => {
        mutate(record);

        if (detailId === record.id) {
            setDetailId(undefined);
        }
    };

    return (
        <AgentShell title="Missed Calls & Voicemail" subtitle="Recover missed customer interactions and review voicemail.">
            <Head title="Missed Calls & Voicemail — Flex Contact Center" />

            <div className="flex flex-col gap-[var(--flex-space-section)] w-full">
                <div className="flex items-center gap-4 text-xs text-flex-text-muted flex-wrap">
                    <span>
                        <span className="font-semibold text-flex-text-primary">{summary.unclaimedCount}</span> unresolved
                    </span>
                    <span>
                        <span className="font-semibold text-flex-text-primary">{summary.claimedByMeCount}</span> claimed by me
                    </span>
                    <span>
                        <span className="font-semibold text-flex-text-primary">{summary.voicemailCount}</span> with voicemail
                    </span>
                    <span className="ml-auto">
                        Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>

                <RecoveryToolbar query={query} queues={queues} onQueryChange={setQuery} />

                <RecoveryTable
                    records={records}
                    currentAgent={currentAgent}
                    isLoading={isLoading}
                    error={error}
                    onRefresh={refresh}
                    onRowClick={(record) => setDetailId(record.id)}
                    onRecordChanged={handleRecordChanged}
                />
            </div>

            <RecoveryDetailSheet
                record={detailRecord}
                currentAgent={currentAgent}
                onOpenChange={(open) => !open && setDetailId(undefined)}
                onRecordChanged={handleRecordChanged}
            />
        </AgentShell>
    );
}
