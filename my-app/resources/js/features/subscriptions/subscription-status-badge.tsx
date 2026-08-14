import React from 'react';
import { FlexStatus } from '@/components/flex/flex-status';
import type { SubscriptionStatus } from '@/domain/subscription-types';

export interface SubscriptionStatusBadgeProps {
    status: SubscriptionStatus;
    remainingDays?: number;
    className?: string;
}

export function SubscriptionStatusBadge({ status, remainingDays, className = '' }: SubscriptionStatusBadgeProps) {
    if (status === 'active') {
        return (
            <FlexStatus tone="success" className={className}>
                Active
            </FlexStatus>
        );
    }

    if (status === 'expiring') {
        return (
            <FlexStatus tone="warning" className={className}>
                Expiring {remainingDays !== undefined ? `(${remainingDays}d)` : ''}
            </FlexStatus>
        );
    }

    if (status === 'expired') {
        return (
            <FlexStatus tone="danger" className={className}>
                Expired
            </FlexStatus>
        );
    }

    if (status === 'trial') {
        return (
            <FlexStatus tone="info" className={className}>
                Trial
            </FlexStatus>
        );
    }

    return (
        <FlexStatus tone="neutral" className={className}>
            {status}
        </FlexStatus>
    );
}
