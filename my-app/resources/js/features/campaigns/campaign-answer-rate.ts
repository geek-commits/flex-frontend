import type { CampaignStatus } from '@/types/flex';

/**
 * Answer-rate presentation rule (UI-only, not backend business logic).
 * Draft/Scheduled campaigns with no calls show a neutral dash rather than red.
 */
export function answerRateTone(
    answered: number,
    dialed: number,
    status: CampaignStatus
): { value: number | null; className: string } {
    if (dialed <= 0) {
        return { value: status === 'draft' || status === 'scheduled' ? null : 0, className: 'text-flex-text-muted' };
    }

    const rate = Math.round((answered / dialed) * 100);

    if (rate >= 85) {
        return { value: rate, className: 'text-status-live' };
    }

    if (rate >= 70) {
        return { value: rate, className: 'text-status-stale' };
    }

    return { value: rate, className: 'text-destructive' };
}
