import { RECORDINGS_MOCK_DATA } from '@/data/recordings.mock';
import type { RecordingDraft, RecordingMutationResult, RecordingQuery, RecordingRecord, RecordingSummary } from '@/domain/recording-types';

/**
 * Call Recordings & System Audio repository boundary.
 *
 * POC MOCK — manages in-memory audio files and metadata, simulating backend
 * authoritativeness with safety checks for in-use routing dependencies.
 */
export interface RecordingRepository {
    queryRecordings(query: RecordingQuery): RecordingRecord[];
    getById(id: string): RecordingRecord | undefined;
    createRecording(draft: RecordingDraft): RecordingMutationResult;
    updateRecording(id: string, patch: Partial<RecordingDraft>): RecordingMutationResult;
    replaceAudio(id: string, fileData: { filename: string; format: 'WAV' | 'MP3'; duration?: string; durationSeconds?: number; fileSizeBytes?: number; url?: string }): RecordingMutationResult;
    deleteRecording(id: string, force?: boolean): RecordingMutationResult;
    getSummary(): RecordingSummary;
}

const recordings: RecordingRecord[] = [...RECORDINGS_MOCK_DATA];

function clone(record: RecordingRecord): RecordingRecord {
    return {
        ...record,
        usages: record.usages.map((u) => ({ ...u })),
    };
}

function matches(query: RecordingQuery, record: RecordingRecord): boolean {
    const search = query.search?.trim().toLowerCase();

    const matchesSearch =
        !search ||
        record.name.toLowerCase().includes(search) ||
        record.filename.toLowerCase().includes(search) ||
        record.description.toLowerCase().includes(search);

    const matchesCategory =
        !query.category || query.category === 'all' || record.category === query.category;

    const matchesFormat =
        !query.format || query.format === 'all' || record.format === query.format;

    return matchesSearch && matchesCategory && matchesFormat;
}

export const recordingRepository: RecordingRepository = {
    queryRecordings(query: RecordingQuery) {
        return recordings.filter((record) => matches(query, record)).map(clone);
    },

    getById(id: string) {
        const record = recordings.find((r) => r.id === id);

        return record ? clone(record) : undefined;
    },

    createRecording(draft: RecordingDraft): RecordingMutationResult {
        if (!draft.name.trim()) {
            return { ok: false, error: 'titleRequired' };
        }

        if (!draft.filename.trim()) {
            return { ok: false, error: 'filenameRequired' };
        }

        const id = `rec-${Date.now()}`;
        const newRecord: RecordingRecord = {
            id,
            name: draft.name.trim(),
            filename: draft.filename.trim(),
            category: draft.category,
            duration: draft.duration ?? '0:30',
            durationSeconds: draft.durationSeconds ?? 30,
            format: draft.format,
            fileSizeBytes: draft.fileSizeBytes ?? 320000,
            description: draft.description.trim(),
            updatedAt: new Date().toISOString(),
            url: draft.url ?? 'https://cdn.freesound.org/previews/320/320655_5260872-lq.mp3',
            usages: [],
        };

        recordings.unshift(newRecord);

        return { ok: true, record: clone(newRecord) };
    },

    updateRecording(id: string, patch: Partial<RecordingDraft>): RecordingMutationResult {
        const index = recordings.findIndex((r) => r.id === id);

        if (index === -1) {
            return { ok: false, error: 'notFound' };
        }

        const existing = recordings[index];

        if (patch.name !== undefined && !patch.name.trim()) {
            return { ok: false, error: 'titleEmpty' };
        }

        const updated: RecordingRecord = {
            ...existing,
            name: patch.name !== undefined ? patch.name.trim() : existing.name,
            filename: patch.filename !== undefined ? patch.filename.trim() : existing.filename,
            category: patch.category ?? existing.category,
            description: patch.description !== undefined ? patch.description.trim() : existing.description,
            format: patch.format ?? existing.format,
            duration: patch.duration ?? existing.duration,
            durationSeconds: patch.durationSeconds ?? existing.durationSeconds,
            fileSizeBytes: patch.fileSizeBytes ?? existing.fileSizeBytes,
            url: patch.url ?? existing.url,
            updatedAt: new Date().toISOString(),
        };

        recordings[index] = updated;

        return { ok: true, record: clone(updated) };
    },

    replaceAudio(id: string, fileData): RecordingMutationResult {
        const index = recordings.findIndex((r) => r.id === id);

        if (index === -1) {
            return { ok: false, error: 'notFound' };
        }

        const existing = recordings[index];
        const updated: RecordingRecord = {
            ...existing,
            filename: fileData.filename,
            format: fileData.format,
            duration: fileData.duration ?? existing.duration,
            durationSeconds: fileData.durationSeconds ?? existing.durationSeconds,
            fileSizeBytes: fileData.fileSizeBytes ?? existing.fileSizeBytes,
            url: fileData.url ?? existing.url,
            updatedAt: new Date().toISOString(),
        };

        recordings[index] = updated;

        return { ok: true, record: clone(updated) };
    },

    deleteRecording(id: string, force = false): RecordingMutationResult {
        const index = recordings.findIndex((r) => r.id === id);

        if (index === -1) {
            return { ok: false, error: 'notFound' };
        }

        const record = recordings[index];

        if (!force && record.usages.length > 0) {
            const usageNames = record.usages.map((u) => `${u.type}: ${u.name}`).join(', ');

            return {
                ok: false,
                error: 'inUse',
                params: {
                    usageNames,
                },
            };
        }

        const deleted = clone(record);
        recordings.splice(index, 1);

        return { ok: true, record: deleted };
    },

    getSummary(): RecordingSummary {
        const totalRecordings = recordings.length;
        const totalDurationSeconds = recordings.reduce((acc, r) => acc + r.durationSeconds, 0);
        const totalFileSizeBytes = recordings.reduce((acc, r) => acc + r.fileSizeBytes, 0);
        const ivrPromptsCount = recordings.filter((r) => r.category === 'ivr-prompt').length;
        const queueAudioCount = recordings.filter((r) => r.category === 'queue-announcement' || r.category === 'hold-music').length;

        return {
            totalRecordings,
            totalDurationSeconds,
            totalFileSizeBytes,
            ivrPromptsCount,
            queueAudioCount,
        };
    },
};
