export type SupportTicketStatus = 'open' | 'in-progress' | 'resolved';

export interface SupportTicket {
    id: string;
    subject: string;
    category: string;
    status: SupportTicketStatus;
    createdAt: string;
}

export interface SupportData {
    tickets: SupportTicket[];
    categories: string[];
}

export interface SupportSubmission {
    category: string;
    subject: string;
}