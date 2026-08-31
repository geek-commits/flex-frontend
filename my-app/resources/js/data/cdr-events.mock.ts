import type { CDRRecord } from '@/domain/types';
import type { StatusTone } from '@/lib/status-styles';

/**
 * Synthetic CDR call-timeline mock for the POC.
 *
 * POC MOCK — deterministic, derived from the record's status. The real backend
 * must provide the actual call events contract later.
 */

export type TimelineTitleKey =
    | 'cdr.timeline.callInitiated.title'
    | 'cdr.timeline.noAnswer.title'
    | 'cdr.timeline.callMissed.title'
    | 'cdr.timeline.voicemailLeft.title'
    | 'cdr.timeline.voicemailSaved.title'
    | 'cdr.timeline.agentConnected.title'
    | 'cdr.timeline.callTransferred.title'
    | 'cdr.timeline.callEnded.title';

export type TimelineDescriptionKey =
    | 'cdr.timeline.callInitiated.description'
    | 'cdr.timeline.noAnswer.description'
    | 'cdr.timeline.callMissed.description'
    | 'cdr.timeline.voicemailLeft.description'
    | 'cdr.timeline.agentConnected.description'
    | 'cdr.timeline.callTransferred.description'
    | 'cdr.timeline.callEnded.description';

export interface CallTimelineEvent {
    id: string;
    at: string;
    titleKey: TimelineTitleKey;
    descriptionKey?: TimelineDescriptionKey;
    titleParams?: Record<string, string | number>;
    descriptionParams?: Record<string, string | number>;
    tone: StatusTone;
}

export function getCallTimeline(record: CDRRecord): CallTimelineEvent[] {
    const events: CallTimelineEvent[] = [
        {
            id: `${record.id}-ring`,
            at: '00:00:00',
            titleKey: 'cdr.timeline.callInitiated.title',
            descriptionKey: 'cdr.timeline.callInitiated.description',
            descriptionParams: { queue: record.queueName },
            tone: 'talking',
        },
    ];

    if (record.status === 'missed') {
        events.push({
            id: `${record.id}-noanswer`,
            at: '00:00:20',
            titleKey: 'cdr.timeline.noAnswer.title',
            descriptionKey: 'cdr.timeline.noAnswer.description',
            tone: 'disconnected',
        });
        events.push({
            id: `${record.id}-end`,
            at: '00:00:25',
            titleKey: 'cdr.timeline.callMissed.title',
            descriptionKey: 'cdr.timeline.callMissed.description',
            tone: 'stale',
        });

        return events;
    }

    if (record.status === 'voicemail') {
        events.push({
            id: `${record.id}-vm`,
            at: '00:00:22',
            titleKey: 'cdr.timeline.voicemailLeft.title',
            descriptionKey: 'cdr.timeline.voicemailLeft.description',
            tone: 'stale',
        });
        events.push({
            id: `${record.id}-end`,
            at: '00:00:25',
            titleKey: 'cdr.timeline.voicemailSaved.title',
            tone: 'neutral',
        });

        return events;
    }

    events.push({
        id: `${record.id}-connect`,
        at: '00:00:08',
        titleKey: 'cdr.timeline.agentConnected.title',
        descriptionKey: 'cdr.timeline.agentConnected.description',
        descriptionParams: { agent: record.agentName },
        tone: 'live',
    });

    if (record.status === 'transferred') {
        events.push({
            id: `${record.id}-transfer`,
            at: '00:01:12',
            titleKey: 'cdr.timeline.callTransferred.title',
            descriptionKey: 'cdr.timeline.callTransferred.description',
            descriptionParams: { queue: record.queueName },
            tone: 'talking',
        });
    }

    const duration = Math.max(record.durationSeconds, 30);
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    const endAt = `00:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    const durationStr = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    events.push({
        id: `${record.id}-end`,
        at: endAt,
        titleKey: 'cdr.timeline.callEnded.title',
        descriptionKey: 'cdr.timeline.callEnded.description',
        descriptionParams: { duration: durationStr },
        tone: 'neutral',
    });

    return events;
}
