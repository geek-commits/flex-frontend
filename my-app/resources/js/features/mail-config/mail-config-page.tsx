import { Head } from '@inertiajs/react';
import { RiArrowRightLine, RiInformationLine } from '@remixicon/react';
import React from 'react';
import { Button } from '@/components/ui/button';
import { MailConfigForm } from '@/features/mail-config/mail-config-form';
import { MailStatusBanner } from '@/features/mail-config/mail-status-banner';
import { MailTestConnectionCard } from '@/features/mail-config/mail-test-connection-card';
import { MailTestEmailCard } from '@/features/mail-config/mail-test-email-card';
import { useMailConfigData } from '@/features/mail-config/use-mail-config-data';
import { AdminShell } from '@/layouts/admin-shell';

export function MailConfigPage() {
    const {
        config,
        isSaving,
        isTestingConnection,
        isSendingTestEmail,
        connectionResult,
        sendResult,
        saveConfig,
        testConnection,
        sendTestEmail,
    } = useMailConfigData();

    return (
        <AdminShell
            title="Mail Configuration"
            subtitle="Configure and test the SMTP server used for system notifications and alerts."
        >
            <Head title="Mail Configuration — Flex Contact Center" />

            <div className="flex flex-col gap-[var(--flex-space-section)] w-full max-w-4xl">
                {/* Live Status Banner */}
                <MailStatusBanner config={config} />

                {/* Main Configuration Form */}
                <MailConfigForm
                    config={config}
                    isSaving={isSaving}
                    onSave={saveConfig}
                />

                {/* Testing & Verification Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <MailTestConnectionCard
                        isTesting={isTestingConnection}
                        result={connectionResult}
                        onTest={testConnection}
                    />

                    <MailTestEmailCard
                        isSending={isSendingTestEmail}
                        result={sendResult}
                        onSend={sendTestEmail}
                    />
                </div>

                {/* Operational Cross-Link to Subscriptions */}
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/20 border text-xs">
                    <div className="flex items-center gap-2 text-flex-text-muted">
                        <RiInformationLine className="size-4 shrink-0 text-flex-text-primary" />
                        <span>
                            Mail delivery powers 5-day expiration reminders and payment confirmations for accounts.
                        </span>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1 text-xs text-primary hover:underline shrink-0"
                        onClick={() => {
                            window.location.href = '/admin/subscription';
                        }}
                    >
                        View Subscriptions
                        <RiArrowRightLine className="size-3.5" />
                    </Button>
                </div>
            </div>
        </AdminShell>
    );
}
