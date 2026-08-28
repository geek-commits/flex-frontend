import { Head } from '@inertiajs/react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { FlexWorkbenchShell } from '@/components/flex/flex-workbench-shell';
import { FlexMetricItem } from '@/components/flex/metrics/flex-metric-item';
import { FlexMetricStrip } from '@/components/flex/metrics/flex-metric-strip';
import type { SubscriptionRecord } from '@/domain/subscription-types';
import { SubscriptionDetailSheet } from '@/features/subscriptions/subscription-detail-sheet';
import { SubscriptionMailNotice } from '@/features/subscriptions/subscription-mail-notice';
import { SubscriptionRenewDialog } from '@/features/subscriptions/subscription-renew-dialog';
import { SubscriptionToolbar } from '@/features/subscriptions/subscription-toolbar';
import { SubscriptionsTable } from '@/features/subscriptions/subscriptions-table';
import { useSubscriptionsData } from '@/features/subscriptions/use-subscriptions-data';
import { AdminShell } from '@/layouts/admin-shell';

export function SubscriptionsPage() {
    const { t } = useTranslation('administration');
    const {
        records,
        summary,
        mailStatus,
        query,
        setQuery,
        isLoading,
        lastUpdated,
        triggerReminder,
        renewSubscription,
    } = useSubscriptionsData();

    const [selectedRecord, setSelectedRecord] = useState<SubscriptionRecord>();
    const [detailOpen, setDetailOpen] = useState(false);

    const [renewOpen, setRenewOpen] = useState(false);
    const [renewingRecord, setRenewingRecord] = useState<SubscriptionRecord>();

    const handleRowClick = (record: SubscriptionRecord) => {
        setSelectedRecord(record);
        setDetailOpen(true);
    };

    const handleTriggerReminder = (record: SubscriptionRecord) => {
        if (!mailStatus.isReady) {
            toast.warning(t('subscriptions.toast.queuedWarning'));
        }

        const res = triggerReminder(record.id);

        if (res.ok) {
            toast.success(t('subscriptions.toast.sent', { email: record.contactEmail }));

            if (selectedRecord?.id === record.id) {
                setSelectedRecord(res.record);
            }
        } else {
            toast.error(res.reason ?? t('subscriptions.toast.sendFailed'));
        }
    };

    const handleRenewClick = (record: SubscriptionRecord) => {
        setRenewingRecord(record);
        setRenewOpen(true);
    };

    const handleConfirmRenew = (record: SubscriptionRecord, months: number) => {
        const res = renewSubscription(record.id, months);

        if (res.ok) {
            // Use custom key: subscriptions.toast.month_one/other maps to month label via t
            const monthLabel = months === 1 ? t('subscriptions.toast.month_one') : t('subscriptions.toast.month_other');
            toast.success(
                t('subscriptions.toast.renewed', { account: record.accountName, months, unit: monthLabel })
            );
            setRenewOpen(false);

            if (selectedRecord?.id === record.id) {
                setSelectedRecord(res.record);
            }
        } else {
            toast.error(res.reason ?? t('subscriptions.toast.renewFailed'));
        }
    };

    return (
        <AdminShell
            title={t('subscriptions.title')}
            subtitle={t('subscriptions.subtitle')}
        >
            <Head title={t('subscriptions.headTitle')} />

            <div className="flex flex-col gap-[var(--flex-space-section)] w-full">
                {/* Metric Summary Strip */}
                <FlexMetricStrip>
                    <FlexMetricItem label={t('subscriptions.metrics.totalAccounts')} value={summary.totalSubscriptions} />
                    <FlexMetricItem label={t('subscriptions.metrics.active')} value={summary.activeCount} />
                    <FlexMetricItem
                        label={t('subscriptions.metrics.expiringSoon')}
                        value={summary.expiringCount}
                        description={summary.expiringCount > 0 ? t('subscriptions.metrics.expiringActionNeeded') : undefined}
                    />
                    <FlexMetricItem label={t('subscriptions.metrics.expired')} value={summary.expiredCount} />
                    <FlexMetricItem label={t('subscriptions.metrics.totalSeats')} value={summary.totalSeats} />
                </FlexMetricStrip>

                {/* Mail Delivery Notice if SMTP is not ready */}
                <SubscriptionMailNotice mailStatus={mailStatus} />

                <div className="flex items-center justify-between text-xs text-flex-text-muted">
                    <span>
                        {t(records.length === 1 ? 'subscriptions.showing_one' : 'subscriptions.showing_other', { count: records.length })}
                    </span>
                    <span>
                        {t('subscriptions.updated', { time: lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) })}
                    </span>
                </div>

                {/* Toolbar */}
                <SubscriptionToolbar query={query} onQueryChange={setQuery} />

                {/* Main Table */}
                <FlexWorkbenchShell variant="primary">
                    <SubscriptionsTable
                        records={records}
                        isLoading={isLoading}
                        onRowClick={handleRowClick}
                        onTriggerReminder={handleTriggerReminder}
                        onRenew={handleRenewClick}
                    />
                </FlexWorkbenchShell>
            </div>

            {/* Detail Sheet */}
            <SubscriptionDetailSheet
                record={selectedRecord}
                open={detailOpen}
                onOpenChange={setDetailOpen}
                mailStatus={mailStatus}
                onTriggerReminder={handleTriggerReminder}
                onRenew={handleRenewClick}
            />

            {/* Renew Dialog */}
            <SubscriptionRenewDialog
                record={renewingRecord}
                open={renewOpen}
                onOpenChange={setRenewOpen}
                onConfirm={handleConfirmRenew}
            />
        </AdminShell>
    );
}
