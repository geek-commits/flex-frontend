/**
 * Synthetic campaign contact-list mock for the POC.
 *
 * POC MOCK — deterministic per campaign. The real backend must provide the
 * contact/disposition contract later.
 */

export interface CampaignContact {
    id: string;
    phone: string;
    name: string;
    status: 'queued' | 'dialed' | 'answered' | 'failed' | 'not-answered';
    dialedAt?: string;
    durationSeconds?: number;
}

const NAMES = ['Amani Njoki', 'Zawadi Mrema', 'Baraka Mushi', 'Neema Komba', 'Juma Salim', 'Rehema Ally', 'Ibrahim Hassan', 'Sauda Omar', 'Emmanuel Mwakasege', 'Halima Said', 'Frank Massawe', 'Pili Daudi'];

const STATUS_CYCLE: CampaignContact['status'][] = ['answered', 'answered', 'queued', 'not-answered', 'answered', 'failed', 'queued', 'answered', 'dialed', 'queued', 'answered', 'not-answered'];

export function getCampaignContacts(campaignId: string, count = 12): CampaignContact[] {
    const base = campaignId.length % 10 + 1;

    return Array.from({ length: count }, (_, index) => {
        const status = STATUS_CYCLE[(base + index) % STATUS_CYCLE.length];
        const isAnswered = status === 'answered';

        return {
            id: `${campaignId}-contact-${index + 1}`,
            phone: `+255 7${(base + index * 3 + 10).toString().padStart(2, '0')} ${String(100 + ((base + index) * 7) % 890).padStart(3, '0')}`,
            name: NAMES[(base + index) % NAMES.length],
            status,
            dialedAt: isAnswered || status === 'not-answered' || status === 'failed' ? `2026-08-${String(7 + (index % 3)).padStart(2, '0')} ${String(9 + (index % 9)).padStart(2, '0')}:${String((index * 7) % 60).padStart(2, '0')}` : undefined,
            durationSeconds: isAnswered ? 60 + ((base + index) * 11) % 420 : undefined,
        };
    });
}
