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

export type RecordingCategoryKey =
    | 'recordings.categories.ivrPrompt'
    | 'recordings.categories.queueAnnouncement'
    | 'recordings.categories.voicemailGreeting'
    | 'recordings.categories.holdMusic'
    | 'recordings.categories.systemAnnouncement';

export const RECORDING_CATEGORY_KEYS = {
    'ivr-prompt': 'recordings.categories.ivrPrompt',
    'queue-announcement': 'recordings.categories.queueAnnouncement',
    'voicemail-greeting': 'recordings.categories.voicemailGreeting',
    'hold-music': 'recordings.categories.holdMusic',
    'system-announcement': 'recordings.categories.systemAnnouncement',
} as const satisfies Record<RecordingCategory, RecordingCategoryKey>;

export type RecordingUsageType = 'IVR' | 'Queue' | 'Time Condition' | 'Voicemail';

export type RecordingUsageTypeKey =
    | 'recordings.usageTypes.ivr'
    | 'recordings.usageTypes.queue'
    | 'recordings.usageTypes.timeCondition'
    | 'recordings.usageTypes.voicemail';

export const RECORDING_USAGE_TYPE_KEYS = {
    IVR: 'recordings.usageTypes.ivr',
    Queue: 'recordings.usageTypes.queue',
    'Time Condition': 'recordings.usageTypes.timeCondition',
    Voicemail: 'recordings.usageTypes.voicemail',
} as const satisfies Record<RecordingUsageType, RecordingUsageTypeKey>;

export interface RecordingUsage {
    type: RecordingUsageType;
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
