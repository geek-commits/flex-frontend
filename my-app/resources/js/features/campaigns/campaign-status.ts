import type { FlexStatusTone } from '@/components/flex/flex-status';
import type { CampaignStatus } from '@/types/flex';

/**
 * Campaign lifecycle → shared FLEX semantic tones.
 * Domain presentation rule (UI), not backend business logic.
 */
export const CAMPAIGN_STATUS_TONE: Record<CampaignStatus, FlexStatusTone> = {
    active: 'success',
    paused: 'warning',
    scheduled: 'info',
    completed: 'neutral',
    draft: 'neutral',
};

export const CAMPAIGN_STATUS_OPTIONS: CampaignStatus[] = ['draft', 'scheduled', 'active', 'paused', 'completed'];

export function formatSchedule(value: string): string {
    const normalized = value.replace(' ', 'T');

    return normalized;
}
