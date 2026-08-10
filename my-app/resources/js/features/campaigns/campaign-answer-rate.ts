import type { CampaignStatus } from '@/types/flex';

/**
 * Answer-rate presentation rule (UI-only, not backend business logic).
 * Draft/Scheduled campaigns with no calls show a neutral dash rather than red.
 */
export function answerRateTone(
    answered: number,
    dialed: number,
    status: CampaignStatus
): { text: string; className: string } {
    if (dialed <= 0) {
        return { text: status === 'draft' || status === 'scheduled' ? '—' : '0%', className: 'text-flex-text-muted' };
    }

    const rate = Math.round((answered / dialed) * 100);

    if (rate >= 85) {
        return { text: `${rate}%`, className: 'text-status-live' };
    }

    if (rate >= 70) {
        return { text: `${rate}%`, className: 'text-status-stale' };
    }

    return { text: `${rate}%`, className: 'text-destructive' };
}
