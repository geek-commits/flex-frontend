import { INITIAL_MAIL_CONFIG } from '@/data/mail-config.mock';
import type {
    MailConfigDraft,
    MailConfigRecord,
    SendTestEmailResult,
    TestConnectionResult,
} from '@/domain/mail-types';

class MailRepository {
    private config: MailConfigRecord = { ...INITIAL_MAIL_CONFIG };
    private storedPasswordSecret = 'super-secret-smtp-pass'; // In-memory simulated secret

    public getConfig(): MailConfigRecord {
        return { ...this.config };
    }

    public updateConfig(draft: MailConfigDraft): { ok: boolean; config: MailConfigRecord; reason?: string } {
        if (!draft.smtpHost.trim()) {
            return { ok: false, config: this.config, reason: 'SMTP Host is required' };
        }

        if (!draft.port || draft.port < 1 || draft.port > 65535) {
            return { ok: false, config: this.config, reason: 'Valid port (1-65535) is required' };
        }

        if (!draft.fromName.trim()) {
            return { ok: false, config: this.config, reason: 'From Name is required' };
        }

        if (draft.password && draft.password.trim().length > 0) {
            this.storedPasswordSecret = draft.password;
            this.config.hasPassword = true;
        }

        this.config = {
            ...this.config,
            fromName: draft.fromName.trim(),
            fromAddress: draft.fromAddress.trim(),
            replyTo: draft.replyTo?.trim() || undefined,
            smtpHost: draft.smtpHost.trim(),
            port: Number(draft.port),
            encryption: draft.encryption,
            username: draft.username.trim(),
            active: draft.active,
            updatedAt: new Date().toISOString(),
        };

        return { ok: true, config: { ...this.config } };
    }

    public async testConnection(): Promise<TestConnectionResult> {
        this.config.status = 'testing';

        await new Promise((resolve) => setTimeout(resolve, 800));

        if (!this.config.smtpHost || !this.config.username) {
            this.config.status = 'failed';
            this.config.lastTestedAt = new Date().toISOString();
            this.config.lastTestError = 'SMTP host or username missing';

            return {
                ok: false,
                status: 'failed',
                message: 'Connection failed: SMTP host and username must be configured.',
                testedAt: this.config.lastTestedAt,
            };
        }

        const isSuccess = !this.config.smtpHost.includes('invalid') && this.config.port > 0;

        if (isSuccess) {
            this.config.status = 'connected';
            this.config.lastTestedAt = new Date().toISOString();
            this.config.lastTestError = undefined;

            return {
                ok: true,
                status: 'connected',
                latencyMs: 142,
                message: `Successfully connected to ${this.config.smtpHost}:${this.config.port} via ${this.config.encryption}.`,
                testedAt: this.config.lastTestedAt,
            };
        } else {
            this.config.status = 'failed';
            this.config.lastTestedAt = new Date().toISOString();
            this.config.lastTestError = 'Connection timed out after 5000ms';

            return {
                ok: false,
                status: 'failed',
                message: 'Connection failed: Could not establish handshake with SMTP server.',
                testedAt: this.config.lastTestedAt,
            };
        }
    }

    public async sendTestEmail(recipientEmail: string): Promise<SendTestEmailResult> {
        if (!recipientEmail || !recipientEmail.includes('@')) {
            return {
                ok: false,
                recipient: recipientEmail,
                message: 'Invalid recipient email address.',
                sentAt: new Date().toISOString(),
            };
        }

        if (this.config.status !== 'connected') {
            const conn = await this.testConnection();

            if (!conn.ok) {
                return {
                    ok: false,
                    recipient: recipientEmail,
                    message: `Cannot send test email: SMTP server is not reachable (${conn.message}).`,
                    sentAt: new Date().toISOString(),
                };
            }
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));

        return {
            ok: true,
            recipient: recipientEmail,
            messageId: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            message: `Test email successfully queued and delivered to ${recipientEmail}.`,
            sentAt: new Date().toISOString(),
        };
    }

    public getStatus(): { active: boolean; status: MailConfigRecord['status']; isReady: boolean } {
        return {
            active: this.config.active,
            status: this.config.status,
            isReady: this.config.active && this.config.status === 'connected',
        };
    }
}

export const mailRepository = new MailRepository();
