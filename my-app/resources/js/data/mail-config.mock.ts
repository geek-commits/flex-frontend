import type { MailConfigRecord } from '@/domain/mail-types';

export const INITIAL_MAIL_CONFIG: MailConfigRecord = {
    fromName: 'Flex Contact Center',
    fromAddress: 'notifications@flex-cc.internal',
    replyTo: 'support@flex-cc.internal',
    smtpHost: 'smtp.office365.com',
    port: 587,
    encryption: 'TLS',
    username: 'notifications@flex-cc.internal',
    hasPassword: true,
    active: true,
    status: 'connected',
    lastTestedAt: '2026-08-14T18:00:00Z',
    updatedAt: '2026-08-14T18:00:00Z',
};
