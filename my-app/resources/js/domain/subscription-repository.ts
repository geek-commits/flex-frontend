import { INITIAL_SUBSCRIPTIONS } from '@/data/subscriptions.mock';
import type {
    SubscriptionDraft,
    SubscriptionQuery,
    SubscriptionRecord,
    SubscriptionSummary,
} from '@/domain/subscription-types';

class SubscriptionRepository {
    private records: SubscriptionRecord[] = [...INITIAL_SUBSCRIPTIONS];

    public getAll(): SubscriptionRecord[] {
        return [...this.records];
    }

    public getById(id: string): SubscriptionRecord | undefined {
        return this.records.find((r) => r.id === id);
    }

    public querySubscriptions(query: SubscriptionQuery = {}): SubscriptionRecord[] {
        return this.records.filter((rec) => {
            if (query.status && rec.status !== query.status) {
                return false;
            }

            if (query.plan && rec.plan !== query.plan) {
                return false;
            }

            if (query.expiringOnly && (rec.remainingDays > 5 || rec.remainingDays <= 0)) {
                return false;
            }

            if (query.search) {
                const s = query.search.toLowerCase();
                const matchAccount = rec.accountName.toLowerCase().includes(s);
                const matchEmail = rec.contactEmail.toLowerCase().includes(s);
                const matchId = rec.id.toLowerCase().includes(s);
                const matchPlan = rec.plan.toLowerCase().includes(s);

                if (!matchAccount && !matchEmail && !matchId && !matchPlan) {
                    return false;
                }
            }

            return true;
        });
    }

    public getSummary(): SubscriptionSummary {
        const activeCount = this.records.filter((r) => r.status === 'active').length;
        const expiringCount = this.records.filter((r) => r.remainingDays <= 5 && r.remainingDays > 0 && r.status !== 'expired').length;
        const expiredCount = this.records.filter((r) => r.status === 'expired' || r.remainingDays <= 0).length;
        const trialCount = this.records.filter((r) => r.status === 'trial').length;
        const totalSeats = this.records.reduce((acc, r) => acc + r.seats, 0);

        return {
            totalSubscriptions: this.records.length,
            activeCount,
            expiringCount,
            expiredCount,
            trialCount,
            totalSeats,
        };
    }

    public triggerReminder(id: string): { ok: boolean; record?: SubscriptionRecord; reason?: string } {
        const index = this.records.findIndex((r) => r.id === id);

        if (index === -1) {
            return { ok: false, reason: 'Subscription not found' };
        }

        const current = this.records[index];
        const updated: SubscriptionRecord = {
            ...current,
            reminderSent: true,
            reminderSentAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        this.records[index] = updated;

        return { ok: true, record: updated };
    }

    public renewSubscription(id: string, months: number = 1): { ok: boolean; record?: SubscriptionRecord; reason?: string } {
        const index = this.records.findIndex((r) => r.id === id);

        if (index === -1) {
            return { ok: false, reason: 'Subscription not found' };
        }

        const current = this.records[index];
        const baseDate = new Date(current.status === 'expired' ? new Date() : current.expiresAt);
        baseDate.setMonth(baseDate.getMonth() + months);

        const now = new Date();
        const diffTime = baseDate.getTime() - now.getTime();
        const remainingDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

        const updated: SubscriptionRecord = {
            ...current,
            status: 'active',
            expiresAt: baseDate.toISOString(),
            remainingDays,
            lastPaymentDate: new Date().toISOString(),
            lastPaymentStatus: 'successful',
            reminderSent: false,
            reminderSentAt: undefined,
            expiryNoticeSent: false,
            expiryNoticeSentAt: undefined,
            updatedAt: new Date().toISOString(),
        };

        this.records[index] = updated;

        return { ok: true, record: updated };
    }

    public updateSubscription(id: string, patch: Partial<SubscriptionDraft>): { ok: boolean; record?: SubscriptionRecord; reason?: string } {
        const index = this.records.findIndex((r) => r.id === id);

        if (index === -1) {
            return { ok: false, reason: 'Subscription not found' };
        }

        const current = this.records[index];
        const updated: SubscriptionRecord = {
            ...current,
            ...patch,
            updatedAt: new Date().toISOString(),
        };

        this.records[index] = updated;

        return { ok: true, record: updated };
    }
}

export const subscriptionRepository = new SubscriptionRepository();
