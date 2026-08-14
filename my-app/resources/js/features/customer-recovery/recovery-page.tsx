import { Head } from '@inertiajs/react';
import React from 'react';
import { RecoveryTable } from '@/features/customer-recovery/recovery-table';
import { RecoveryToolbar } from '@/features/customer-recovery/recovery-toolbar';
import { useRecoveryData } from '@/features/customer-recovery/use-recovery-data';
import { AgentShell } from '@/layouts/agent-shell';

/**
 * Customer Recovery workspace — missed-call triage + voicemail + callback.
 * The page is the recovery surface; telephony state stays in the canonical
 * workspace store.
 */
export function RecoveryPage() {
    const { records, query, setQuery, isLoading, error, refresh, mutate, currentAgent, summary, lastUpdated } = useRecoveryData();

    const queues = Array.from(new Set(records.map((record) => record.queueName))).sort();

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
                    onRowClick={() => undefined}
                    onRecordChanged={(record) => mutate(record)}
                />
            </div>
        </AgentShell>
    );
}
