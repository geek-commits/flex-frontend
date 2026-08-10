import type { CDRRecord } from '@/domain/types';
import type { StatusTone } from '@/lib/status-styles';

/**
 * Synthetic CDR call-timeline mock for the POC.
 *
 * POC MOCK — deterministic, derived from the record's status. The real backend
 * must provide the actual call events contract later.
 */

export interface CallTimelineEvent {
    id: string;
    at: string;
    title: string;
    description?: string;
    tone: StatusTone;
}

export function getCallTimeline(record: CDRRecord): CallTimelineEvent[] {
    const events: CallTimelineEvent[] = [
        {
            id: `${record.id}-ring`,
            at: '00:00:00',
            title: 'Call initiated',
            description: `Inbound to ${record.queueName}`,
            tone: 'talking',
        },
    ];

    if (record.status === 'missed') {
        events.push({
            id: `${record.id}-noanswer`,
            at: '00:00:20',
            title: 'No answer',
            description: 'Caller hung up before an agent could answer',
            tone: 'disconnected',
        });
        events.push({
            id: `${record.id}-end`,
            at: '00:00:25',
            title: 'Call missed',
            description: 'Logged to missed-calls for follow-up',
            tone: 'stale',
        });

        return events;
    }

    if (record.status === 'voicemail') {
        events.push({
            id: `${record.id}-vm`,
            at: '00:00:22',
            title: 'Voicemail left',
            description: 'Caller left a message on the queue voicemail',
            tone: 'stale',
        });
        events.push({
            id: `${record.id}-end`,
            at: '00:00:25',
            title: 'Voicemail saved',
            tone: 'neutral',
        });

        return events;
    }

    events.push({
        id: `${record.id}-connect`,
        at: '00:00:08',
        title: 'Agent connected',
        description: `${record.agentName} accepted the call`,
        tone: 'live',
    });

    if (record.status === 'transferred') {
        events.push({
            id: `${record.id}-transfer`,
            at: '00:01:12',
            title: 'Call transferred',
            description: `Transferred to another agent in ${record.queueName}`,
            tone: 'talking',
        });
    }

    const duration = Math.max(record.durationSeconds, 30);
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    const endAt = `00:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    events.push({
        id: `${record.id}-end`,
        at: endAt,
        title: 'Call ended',
        description: `Duration ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`,
        tone: 'neutral',
    });

    return events;
}
