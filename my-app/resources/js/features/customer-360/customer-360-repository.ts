import { cdrRepository } from '@/domain/cdr-repository';
import { recoveryRepository } from '@/domain/recovery-repository';
import { getCustomer360SocialActivities } from './customer-360-social-mock';

export type TimelineType = 'call' | 'social' | 'callback' | 'voicemail';

export interface CustomerTimelineItem {
    id: string;
    type: TimelineType;
    occurredAt: string;
    title: string;
    summary?: string;
    route?: string;
    sourceRecordId: string;
    permissions?: string[];
}

function normalizePhone(v: string): string {
    return v.replace(/[\s-]/g, '').toLowerCase();
}

export function resolveCustomerTimeline(phoneOrHandle: string): { displayName: string; phone: string; items: CustomerTimelineItem[] } {
    const normalized = normalizePhone(phoneOrHandle);
    const isPhone = normalized.startsWith('+');
    const items: CustomerTimelineItem[] = [];
    let displayName = phoneOrHandle;

    // CDR — match by customerPhone
    for (const r of cdrRepository.query({ search: isPhone ? normalized : undefined })) {
        if (normalizePhone(r.customerPhone) === normalized) {
            items.push({
                id: `cdr-${r.id}`,
                type: 'call',
                occurredAt: r.date.replace(' ', 'T'),
                title: `${r.status === 'missed' ? 'Missed call' : 'Call'} · ${r.queueName}`,
                summary: `${r.agentName} · ${Math.round(r.durationSeconds / 60)}m`,
                route: '/admin/cdr',
                sourceRecordId: r.id,
                permissions: ['cdr.view'],
            });

            if (displayName === phoneOrHandle) {
                displayName = r.customerPhone;
            }
        }
    }

    // Social — Customer 360 POC mock (decoupled from native Social Inbox; external Social owns realtime)
    for (const c of getCustomer360SocialActivities()) {
        const participantNorm = normalizePhone(c.participant);
        const nameNorm = (c.displayName ?? '').toLowerCase();

        if (participantNorm === normalized || nameNorm === normalized.toLowerCase()) {
            items.push({
                id: `social-${c.id}`,
                type: 'social',
                occurredAt: c.lastActivityAt,
                title: `${c.channel} · ${c.displayName}`,
                summary: c.latestPreview,
                route: '/agent/social',
                sourceRecordId: c.id,
                permissions: ['social.view'],
            });
            displayName = c.displayName ?? displayName;
        }
    }

    // Recovery — missed calls / voicemail
    for (const r of recoveryRepository.queryRecords({ search: isPhone ? normalized : undefined })) {
        if (normalizePhone(r.phoneNumber) === normalized) {
            const isVoicemail = r.category === 'voicemail';
            items.push({
                id: `rec-${r.id}`,
                type: isVoicemail ? 'voicemail' : 'callback',
                occurredAt: r.missedAt,
                title: isVoicemail ? 'Voicemail' : 'Missed call · callback',
                summary: `${r.queueName} · ${r.status}`,
                route: '/agent/missed-calls',
                sourceRecordId: r.id,
                permissions: ['missed-calls.view'],
            });
            displayName = r.customerName || displayName;
        }
    }

    items.sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime());

    return { displayName, phone: isPhone ? phoneOrHandle : normalized, items };
}
