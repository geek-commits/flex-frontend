export type SubscriptionStatus = 'active' | 'expiring' | 'expired' | 'trial' | 'cancelled';
export type SubscriptionPlan = 'Starter' | 'Professional' | 'Enterprise' | 'Custom' | 'Trial';
export type BillingCycle = 'monthly' | 'annual';

export interface SubscriptionRecord {
    id: string;
    accountName: string;
    contactEmail: string;
    plan: SubscriptionPlan;
    status: SubscriptionStatus;
    seats: number;
    billingCycle: BillingCycle;
    startDate: string; // ISO
    expiresAt: string; // ISO
    remainingDays: number;
    amount: number;
    currency: string;
    autoRenew: boolean;
    lastPaymentDate: string; // ISO
    lastPaymentStatus: 'successful' | 'pending' | 'failed';
    reminderSent: boolean;
    reminderSentAt?: string;
    expiryNoticeSent: boolean;
    expiryNoticeSentAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface SubscriptionDraft {
    accountName: string;
    contactEmail: string;
    plan: SubscriptionPlan;
    seats: number;
    billingCycle: BillingCycle;
    expiresAt: string;
    amount: number;
    currency: string;
    autoRenew: boolean;
}

export interface SubscriptionQuery {
    search?: string;
    status?: SubscriptionStatus;
    plan?: SubscriptionPlan;
    expiringOnly?: boolean;
}

export interface SubscriptionSummary {
    totalSubscriptions: number;
    activeCount: number;
    expiringCount: number; // remainingDays <= 5 and > 0
    expiredCount: number;
    trialCount: number;
    totalSeats: number;
}
