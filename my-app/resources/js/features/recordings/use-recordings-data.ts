import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { recordingRepository } from '@/domain/recording-repository';
import type {
    RecordingDraft,
    RecordingQuery,
    RecordingSummary,
} from '@/domain/recording-types';

/**
 * Feature data hook for Call Recordings & System Audio.
 * Owns data query, client-side filtering, CRUD dispatch, and summary calculations.
 */
export function useRecordingsData() {
    const [query, setQuery] = useState<RecordingQuery>({});
    const [isLoading, setIsLoading] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0);
    const [lastUpdated, setLastUpdated] = useState<Date>(() => new Date());
    const loadTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    const records = useMemo(() => {
        void refreshKey;

        return recordingRepository.queryRecordings(query);
    }, [query, refreshKey]);

    const summary: RecordingSummary = useMemo(() => {
        void refreshKey;

        return recordingRepository.getSummary();
    }, [refreshKey]);

    const refresh = useCallback(() => {
        setRefreshKey((k) => k + 1);
        setLastUpdated(new Date());
    }, []);

    useEffect(() => {
        loadTimerRef.current = setTimeout(() => {
            setIsLoading(false);
            setLastUpdated(new Date());
        }, 300);

        return () => {
            if (loadTimerRef.current) {
                clearTimeout(loadTimerRef.current);
            }
        };
    }, []);

    const create = useCallback((draft: RecordingDraft) => {
        const result = recordingRepository.createRecording(draft);

        if (result.ok) {
            refresh();
        }

        return result;
    }, [refresh]);

    const update = useCallback((id: string, patch: Partial<RecordingDraft>) => {
        const result = recordingRepository.updateRecording(id, patch);

        if (result.ok) {
            refresh();
        }

        return result;
    }, [refresh]);

    const replaceAudio = useCallback((id: string, fileData: { filename: string; format: 'WAV' | 'MP3'; duration?: string; durationSeconds?: number; fileSizeBytes?: number; url?: string }) => {
        const result = recordingRepository.replaceAudio(id, fileData);

        if (result.ok) {
            refresh();
        }

        return result;
    }, [refresh]);

    const remove = useCallback((id: string, force = false) => {
        const result = recordingRepository.deleteRecording(id, force);

        if (result.ok) {
            refresh();
        }

        return result;
    }, [refresh]);

    const getById = useCallback((id: string) => recordingRepository.getById(id), []);

    return {
        records,
        summary,
        query,
        setQuery,
        isLoading,
        lastUpdated,
        refresh,
        create,
        update,
        replaceAudio,
        remove,
        getById,
    };
}
