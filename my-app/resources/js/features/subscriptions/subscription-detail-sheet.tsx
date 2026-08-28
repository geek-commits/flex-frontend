import {
    RiCheckLine,
    RiExternalLinkLine,
    RiMailSendLine,
    RiRefreshLine,
    RiShieldCheckLine,
} from '@remixicon/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FlexDetailSheet } from '@/components/flex/flex-detail-sheet';
import { Button } from '@/components/ui/button';
import type { MailConnectionStatus } from '@/domain/mail-types';
import type { SubscriptionRecord } from '@/domain/subscription-types';
import { SubscriptionStatusBadge } from '@/features/subscriptions/subscription-status-badge';

export interface SubscriptionDetailSheetProps {
    record?: SubscriptionRecord;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mailStatus: { active: boolean; status: MailConnectionStatus; isReady: boolean };
    onTriggerReminder: (record: SubscriptionRecord) => void;
    onRenew: (record: SubscriptionRecord) => void;
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex items-start justify-between gap-4 py-1.5 border-b border-border/40 last:border-0">
            <span className="text-xs text-flex-text-muted shrink-0">{label}</span>
            <span className="text-xs text-flex-text-primary text-right font-medium">{children}</span>
        </div>
    );
}

export function SubscriptionDetailSheet({
    record,
    open,
    onOpenChange,
    mailStatus,
    onTriggerReminder,
    onRenew,
}: SubscriptionDetailSheetProps) {
    const { t } = useTranslation('administration');
    if (!record) {
        return null;
    }

    const metaKey = record.remainingDays === 1 ? 'subscriptions.detail.meta_one' : 'subscriptions.detail.meta_other';
    return (
        <FlexDetailSheet
            open={open}
            onOpenChange={onOpenChange}
            title={record.accountName}
            meta={t(metaKey, { plan: record.plan, seats: record.seats, days: record.remainingDays })}
            footer={
                <div className="flex items-center justify-between gap-2 w-full">
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 text-xs"
                        onClick={() => {
                            onOpenChange(false);
                            onTriggerReminder(record);
                        }}
                    >
                        <RiMailSendLine className="size-3.5" />
                        {t('subscriptions.detail.sendReminder')}
                    </Button>
                    <Button
                        size="sm"
                        className="gap-1.5 text-xs"
                        onClick={() => {
                            onOpenChange(false);
                            onRenew(record);
                        }}
                    >
                        <RiRefreshLine className="size-3.5" />
                        {t('subscriptions.detail.renew')}
                    </Button>
                </div>
            }
        >
            <div className="flex flex-col gap-5">
                {/* Expiry Overview Card */}
                <div className="p-3.5 rounded-lg border bg-muted/20 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-flex-text-muted">
                            {t('subscriptions.detail.statusLabel')}
                        </span>
                        <SubscriptionStatusBadge
                            status={record.status}
                            remainingDays={record.remainingDays}
                        />
                    </div>
                    <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-2xl font-bold text-flex-text-primary flex-numeric">
                            {t(record.remainingDays === 1 ? 'subscriptions.detail.daysRemaining_one' : 'subscriptions.detail.daysRemaining_other', { count: record.remainingDays })}
                        </span>
                        <span className="text-xs text-flex-text-muted">{t('subscriptions.detail.remainingUntilExpiry')}</span>
                    </div>
                    <p className="text-[11px] text-flex-text-muted">
                        {t('subscriptions.detail.expiresOn', { date: new Date(record.expiresAt).toLocaleDateString([], { dateStyle: 'full' }) })}
                    </p>
                </div>

                {/* Account & Billing */}
                <div className="flex flex-col">
                    <span className="text-[11px] font-semibold text-flex-text-muted uppercase tracking-wider mb-2">
                        {t('subscriptions.detail.accountContract')}
                    </span>
                    <DetailRow label={t('subscriptions.detail.subscriptionId')}>
                        <span className="font-mono text-[11px]">{record.id}</span>
                    </DetailRow>
                    <DetailRow label={t('subscriptions.detail.billingContact')}>
                        <span className="font-mono text-[11px]">{record.contactEmail}</span>
                    </DetailRow>
                    <DetailRow label={t('subscriptions.detail.tierPlan')}>{record.plan}</DetailRow>
                    <DetailRow label={t('subscriptions.detail.seatAllocation')}>{t(record.seats === 1 ? 'subscriptions.detail.seatAllocationValue_one' : 'subscriptions.detail.seatAllocationValue_other', { count: record.seats })}</DetailRow>
                    <DetailRow label={t('subscriptions.detail.contractAmount')}>
                        ${record.amount.toLocaleString()} {record.currency} ({record.billingCycle})
                    </DetailRow>
                    <DetailRow label={t('subscriptions.detail.renewalPolicy')}>
                        {record.autoRenew ? t('subscriptions.detail.autoRenewActive') : t('subscriptions.detail.manualRenewal')}
                    </DetailRow>
                    <DetailRow label={t('subscriptions.detail.lastPayment')}>
                        {new Date(record.lastPaymentDate).toLocaleDateString([], {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                        })}{' '}
                        <span className="text-success font-normal">({record.lastPaymentStatus})</span>
                    </DetailRow>
                </div>

                {/* Notification Delivery Readiness */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-flex-text-muted uppercase tracking-wider">
                            {t('subscriptions.detail.notificationDelivery')}
                        </span>
                        <a
                            href="/admin/mail-config"
                            className="text-primary hover:underline flex items-center gap-1 text-[11px]"
                        >
                            {t('subscriptions.detail.mailConfig')}
                            <RiExternalLinkLine className="size-3" />
                        </a>
                    </div>

                    <div className="p-3 rounded border bg-card text-xs flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <span className="text-flex-text-muted">{t('subscriptions.detail.smtpServer')}</span>
                            <span
                                className={`font-semibold flex items-center gap-1 ${
                                    mailStatus.isReady ? 'text-success' : 'text-warning'
                                }`}
                            >
                                {mailStatus.isReady ? (
                                    <>
                                        <RiShieldCheckLine className="size-3.5" />
                                        {t('subscriptions.detail.connectedActive')}
                                    </>
                                ) : (
                                    t('subscriptions.detail.disconnected')
                                )}
                            </span>
                        </div>

                        <div className="flex items-center justify-between border-t border-border/40 pt-2">
                            <span className="text-flex-text-muted">{t('subscriptions.detail.expiryReminder')}</span>
                            <span className="font-medium text-flex-text-primary">
                                {record.reminderSent ? (
                                    <span className="text-success inline-flex items-center gap-1">
                                        <RiCheckLine className="size-3.5" />
                                        {record.reminderSentAt
                                            ? t('subscriptions.detail.sentAt', { date: new Date(record.reminderSentAt).toLocaleDateString() })
                                            : t('subscriptions.detail.sent')}
                                    </span>
                                ) : (
                                    t('subscriptions.detail.none')
                                )}
                            </span>
                        </div>

                        <div className="flex items-center justify-between border-t border-border/40 pt-2">
                            <span className="text-flex-text-muted">{t('subscriptions.detail.expiryNotice')}</span>
                            <span className="font-medium text-flex-text-primary">
                                {record.expiryNoticeSent ? (
                                    <span className="text-destructive inline-flex items-center gap-1">
                                        <RiCheckLine className="size-3.5" />
                                        {t('subscriptions.detail.sent')}
                                    </span>
                                ) : (
                                    t('subscriptions.detail.none')
                                )}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </FlexDetailSheet>
    );
}
