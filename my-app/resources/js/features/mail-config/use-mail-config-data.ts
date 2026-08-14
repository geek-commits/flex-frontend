import { useCallback, useState } from 'react';
import { mailRepository } from '@/domain/mail-repository';
import type {
    MailConfigDraft,
    MailConfigRecord,
    SendTestEmailResult,
    TestConnectionResult,
} from '@/domain/mail-types';

export function useMailConfigData() {
    const [config, setConfig] = useState<MailConfigRecord>(() => mailRepository.getConfig());
    const [isSaving, setIsSaving] = useState(false);
    const [isTestingConnection, setIsTestingConnection] = useState(false);
    const [isSendingTestEmail, setIsSendingTestEmail] = useState(false);
    const [connectionResult, setConnectionResult] = useState<TestConnectionResult | null>(null);
    const [sendResult, setSendResult] = useState<SendTestEmailResult | null>(null);

    const refresh = useCallback(() => {
        setConfig(mailRepository.getConfig());
    }, []);

    const saveConfig = useCallback((draft: MailConfigDraft) => {
        setIsSaving(true);
        const res = mailRepository.updateConfig(draft);
        setIsSaving(false);

        if (res.ok) {
            setConfig(res.config);
        }

        return res;
    }, []);

    const testConnection = useCallback(async () => {
        setIsTestingConnection(true);
        setConnectionResult(null);

        try {
            const res = await mailRepository.testConnection();
            setConnectionResult(res);
            refresh();

            return res;
        } finally {
            setIsTestingConnection(false);
        }
    }, [refresh]);

    const sendTestEmail = useCallback(async (recipientEmail: string) => {
        setIsSendingTestEmail(true);
        setSendResult(null);

        try {
            const res = await mailRepository.sendTestEmail(recipientEmail);
            setSendResult(res);
            refresh();

            return res;
        } finally {
            setIsSendingTestEmail(false);
        }
    }, [refresh]);

    return {
        config,
        isSaving,
        isTestingConnection,
        isSendingTestEmail,
        connectionResult,
        sendResult,
        saveConfig,
        testConnection,
        sendTestEmail,
        refresh,
    };
}
