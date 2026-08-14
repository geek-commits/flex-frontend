import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { recoveryRepository } from '@/domain/recovery-repository';
import type { RecoveryQuery, RecoveryRecord } from '@/features/customer-recovery/recovery-types';

const CURRENT_AGENT = { id: 'u1', name: 'Grace Mwanga' };

/**
 * Single feature-level data owner for the customer-recovery workspace.
 * Owns the missed-call records, filters, refresh, freshness, and mutation
 * reconciliation. Telephony state stays in the canonical workspace store.
 */
export function useRecoveryData() {
    const [query, setQuery] = useState<RecoveryQuery>({});
    const [isLoading, setIsLoading] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0);
    const [overrides, setOverrides] = useState<Record<string, RecoveryRecord>>({});
    const [lastUpdated, setLastUpdated] = useState<Date>(() => new Date());
    const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
    const loadTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    // Base list derived from the query (synchronous client-side mock filtering).
    const baseRecords = useMemo(() => {
        void refreshKey;

        return recoveryRepository.queryRecords(query);
    }, [query, refreshKey]);

    // Apply in-session mutation overrides on top of the base list.
    const records = useMemo(
        () => baseRecords.map((record) => overrides[record.id] ?? record),
        [baseRecords, overrides]
    );

    // Stable error contract; the mock adapter does not fail, so this stays
    // undefined in normal operation (a real backend supplies errors).
    const error: string | undefined = undefined;

    const refresh = useCallback(() => {
        setRefreshKey((k) => k + 1);
        setOverrides({});
        setLastUpdated(new Date());
    }, []);

    // Initial load.
    useEffect(() => {
        loadTimerRef.current = setTimeout(() => {
            setIsLoading(false);
            setLastUpdated(new Date());
        }, 350);

        return () => {
            if (loadTimerRef.current) {
                clearTimeout(loadTimerRef.current);
            }
        };
    }, []);

    // Background refresh (single interval, no duplicate polling).
    useEffect(() => {
        timerRef.current = setInterval(() => {
            setRefreshKey((k) => k + 1);
            setOverrides({});
            setLastUpdated(new Date());
        }, 30000);

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);

    const getById = useCallback((id: string) => recoveryRepository.getById(id), []);

    // Merge an authoritative mutated record back into the list (and the repo).
    const mutate = useCallback((record: RecoveryRecord) => {
        setOverrides((prev) => ({ ...prev, [record.id]: record }));
        setRefreshKey((k) => k + 1);
        setLastUpdated(new Date());
    }, []);

    const summary = useMemo(() => {
        const unclaimedCount = records.filter((record) => !record.claimedBy && record.status !== 'resolved').length;
        const claimedByMeCount = records.filter((record) => record.claimedBy?.id === CURRENT_AGENT.id).length;
        const voicemailCount = records.filter((record) => record.voicemail.hasVoicemail).length;

        return { unclaimedCount, claimedByMeCount, voicemailCount };
    }, [records]);

    return {
        records,
        query,
        setQuery,
        isLoading,
        error,
        refresh,
        getById,
        mutate,
        currentAgent: CURRENT_AGENT,
        summary,
        lastUpdated,
    };
}
