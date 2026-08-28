import { RiAlertLine, RiArrowRightLine } from '@remixicon/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import type { MailConnectionStatus } from '@/domain/mail-types';

export interface SubscriptionMailNoticeProps {
    mailStatus: { active: boolean; status: MailConnectionStatus; isReady: boolean };
}

export function SubscriptionMailNotice({ mailStatus }: SubscriptionMailNoticeProps) {
    const { t } = useTranslation('administration');

    if (mailStatus.isReady) {
        return null;
    }

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-lg border border-warning/30 bg-warning/5 text-xs text-flex-text-primary">
            <div className="flex items-start gap-2.5">
                <RiAlertLine className="size-4 text-warning shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                    <span className="font-semibold text-flex-text-primary">
                        {t('subscriptions.mailNotice.title')}
                    </span>
                    <span className="text-flex-text-muted">
                        {t('subscriptions.mailNotice.description')}
                    </span>
                </div>
            </div>

            <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs self-start sm:self-auto border-warning/40 hover:bg-warning/10"
                onClick={() => {
                    window.location.href = '/admin/mail-config';
                }}
            >
                {t('subscriptions.mailNotice.configure')}
                <RiArrowRightLine className="size-3.5" />
            </Button>
        </div>
    );
}
