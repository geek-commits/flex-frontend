import React from 'react';
import { useTranslation } from 'react-i18next';
import { FlexStatus } from '@/components/flex/flex-status';
import type { SubscriptionStatus } from '@/domain/subscription-types';

export interface SubscriptionStatusBadgeProps {
    status: SubscriptionStatus;
    remainingDays?: number;
    className?: string;
}

export function SubscriptionStatusBadge({ status, remainingDays, className = '' }: SubscriptionStatusBadgeProps) {
    const { t } = useTranslation('administration');

    if (status === 'active') {
        return (
            <FlexStatus tone="success" className={className}>
                {t('subscriptions.status.active')}
            </FlexStatus>
        );
    }

    if (status === 'expiring') {
        return (
            <FlexStatus tone="warning" className={className}>
                {remainingDays !== undefined ? t('subscriptions.status.expiring', { days: remainingDays }) : t('subscriptions.status.active')}
            </FlexStatus>
        );
    }

    if (status === 'expired') {
        return (
            <FlexStatus tone="danger" className={className}>
                {t('subscriptions.status.expired')}
            </FlexStatus>
        );
    }

    if (status === 'trial') {
        return (
            <FlexStatus tone="info" className={className}>
                {t('subscriptions.status.trial')}
            </FlexStatus>
        );
    }

    return (
        <FlexStatus tone="neutral" className={className}>
            {status}
        </FlexStatus>
    );
}
