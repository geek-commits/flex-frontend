/**
 * Domain types for Call Recordings & System Audio Prompts.
 *
 * Workspace: Administration
 * Surface: /admin/recordings
 */

export type RecordingCategory =
    | 'ivr-prompt'
    | 'queue-announcement'
    | 'voicemail-greeting'
    | 'hold-music'
    | 'system-announcement';

export interface RecordingUsage {
    type: 'IVR' | 'Queue' | 'Time Condition' | 'Voicemail';
    name: string;
    href?: string;
}

export interface RecordingRecord {
    id: string;
    name: string;
    filename: string;
    category: RecordingCategory;
    duration: string;
    durationSeconds: number;
    format: 'WAV' | 'MP3';
    fileSizeBytes: number;
    description: string;
    updatedAt: string;
    url?: string;
    usages: RecordingUsage[];
}

export interface RecordingDraft {
    name: string;
    filename: string;
    category: RecordingCategory;
    format: 'WAV' | 'MP3';
    duration?: string;
    durationSeconds?: number;
    fileSizeBytes?: number;
    description: string;
    url?: string;
}

export interface RecordingQuery {
    search?: string;
    category?: RecordingCategory | 'all';
    format?: 'WAV' | 'MP3' | 'all';
}

export interface RecordingSummary {
    totalRecordings: number;
    totalDurationSeconds: number;
    totalFileSizeBytes: number;
    ivrPromptsCount: number;
    queueAudioCount: number;
}

export type RecordingMutationError =
    | 'titleRequired'
    | 'filenameRequired'
    | 'notFound'
    | 'titleEmpty'
    | 'inUse';

export type RecordingMutationResult =
    | { ok: true; record: RecordingRecord }
    | {
          ok: false;
          error: RecordingMutationError;
          params?: {
              usageNames?: string;
          };
      };
