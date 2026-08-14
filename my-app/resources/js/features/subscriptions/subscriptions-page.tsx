import { Head } from '@inertiajs/react';
import React, { useState } from 'react';
import { toast } from 'sonner';
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
            toast.warning(
                'Reminder email queued, but Mail Server is disconnected. Configure SMTP to deliver.'
            );
        }

        const res = triggerReminder(record.id);

        if (res.ok) {
            toast.success(`Reminder notification sent to ${record.contactEmail}`);

            if (selectedRecord?.id === record.id) {
                setSelectedRecord(res.record);
            }
        } else {
            toast.error(res.reason ?? 'Failed to send reminder');
        }
    };

    const handleRenewClick = (record: SubscriptionRecord) => {
        setRenewingRecord(record);
        setRenewOpen(true);
    };

    const handleConfirmRenew = (record: SubscriptionRecord, months: number) => {
        const res = renewSubscription(record.id, months);

        if (res.ok) {
            toast.success(
                `Renewed ${record.accountName} for +${months} ${months === 1 ? 'month' : 'months'}`
            );
            setRenewOpen(false);

            if (selectedRecord?.id === record.id) {
                setSelectedRecord(res.record);
            }
        } else {
            toast.error(res.reason ?? 'Renewal failed');
        }
    };

    return (
        <AdminShell
            title="Subscription Management"
            subtitle="Track subscription status, remaining days, reminders, and renewal activity."
        >
            <Head title="Subscriptions — Flex Contact Center" />

            <div className="flex flex-col gap-[var(--flex-space-section)] w-full">
                {/* Metric Summary Strip */}
                <FlexMetricStrip>
                    <FlexMetricItem label="Total Accounts" value={summary.totalSubscriptions} />
                    <FlexMetricItem label="Active" value={summary.activeCount} />
                    <FlexMetricItem
                        label="Expiring Soon (≤5d)"
                        value={summary.expiringCount}
                        description={summary.expiringCount > 0 ? 'Action needed' : undefined}
                    />
                    <FlexMetricItem label="Expired" value={summary.expiredCount} />
                    <FlexMetricItem label="Total Seats" value={summary.totalSeats} />
                </FlexMetricStrip>

                {/* Mail Delivery Notice if SMTP is not ready */}
                <SubscriptionMailNotice mailStatus={mailStatus} />

                <div className="flex items-center justify-between text-xs text-flex-text-muted">
                    <span>
                        Showing <span className="font-semibold text-flex-text-primary">{records.length}</span> subscriptions
                    </span>
                    <span>
                        Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>

                {/* Toolbar */}
                <SubscriptionToolbar query={query} onQueryChange={setQuery} />

                {/* Main Table */}
                <SubscriptionsTable
                    records={records}
                    isLoading={isLoading}
                    onRowClick={handleRowClick}
                    onTriggerReminder={handleTriggerReminder}
                    onRenew={handleRenewClick}
                />
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
