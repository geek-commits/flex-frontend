export type SupportTicketStatus = 'open' | 'in-progress' | 'resolved';
export type SupportCategory = 'audioHardware' | 'telephonyRouting' | 'crmIntegration' | 'accountLogin';

export const SUPPORT_CATEGORY_IDS: readonly SupportCategory[] = ['audioHardware', 'telephonyRouting', 'crmIntegration', 'accountLogin'] as const;

export const SUPPORT_STATUS_KEY: Record<SupportTicketStatus, string> = {
    open: 'support.status.open',
    'in-progress': 'support.status.inProgress',
    resolved: 'support.status.resolved',
} as const;

export const SUPPORT_CATEGORY_KEY: Record<SupportCategory, string> = {
    audioHardware: 'support.categories.audioHardware',
    telephonyRouting: 'support.categories.telephonyRouting',
    crmIntegration: 'support.categories.crmIntegration',
    accountLogin: 'support.categories.accountLogin',
} as const;

export interface SupportTicket {
    id: string;
    subject: string;
    category: SupportCategory;
    status: SupportTicketStatus;
    createdAt: string;
}

export interface SupportData {
    tickets: SupportTicket[];
    categories: SupportCategory[];
}

export interface SupportSubmission {
    category: SupportCategory;
    subject: string;
}