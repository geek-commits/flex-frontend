export type MailEncryption = 'TLS' | 'SSL' | 'None';
export type MailConnectionStatus = 'connected' | 'disconnected' | 'untested' | 'testing' | 'failed';

export interface MailConfigRecord {
    fromName: string;
    fromAddress: string;
    replyTo?: string;
    smtpHost: string;
    port: number;
    encryption: MailEncryption;
    username: string;
    hasPassword: boolean; // Password is write-only; never exposed client-side
    active: boolean;
    status: MailConnectionStatus;
    lastTestedAt?: string;
    lastTestError?: string;
    updatedAt: string;
}

export interface MailConfigDraft {
    fromName: string;
    fromAddress: string;
    replyTo?: string;
    smtpHost: string;
    port: number;
    encryption: MailEncryption;
    username: string;
    password?: string; // Optional: only provided when setting/changing secret
    active: boolean;
}

export interface TestConnectionResult {
    ok: boolean;
    status: MailConnectionStatus;
    latencyMs?: number;
    message: string;
    testedAt: string;
}

export interface SendTestEmailResult {
    ok: boolean;
    recipient: string;
    messageId?: string;
    message: string;
    sentAt: string;
}
