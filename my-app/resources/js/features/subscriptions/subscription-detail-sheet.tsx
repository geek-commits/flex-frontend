import {
    RiCheckLine,
    RiExternalLinkLine,
    RiMailSendLine,
    RiRefreshLine,
    RiShieldCheckLine,
} from '@remixicon/react';
import React from 'react';
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
    if (!record) {
        return null;
    }

    return (
        <FlexDetailSheet
            open={open}
            onOpenChange={onOpenChange}
            title={record.accountName}
            meta={`${record.plan} Plan · ${record.seats} Seats · ${record.remainingDays} days remaining`}
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
                        Send Reminder Email
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
                        Renew Subscription
                    </Button>
                </div>
            }
        >
            <div className="flex flex-col gap-5">
                {/* Expiry Overview Card */}
                <div className="p-3.5 rounded-lg border bg-muted/20 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-flex-text-muted">
                            Subscription Status
                        </span>
                        <SubscriptionStatusBadge
                            status={record.status}
                            remainingDays={record.remainingDays}
                        />
                    </div>
                    <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-2xl font-bold text-flex-text-primary flex-numeric">
                            {record.remainingDays} {record.remainingDays === 1 ? 'day' : 'days'}
                        </span>
                        <span className="text-xs text-flex-text-muted">remaining until expiry</span>
                    </div>
                    <p className="text-[11px] text-flex-text-muted">
                        Expires on{' '}
                        <span className="font-semibold text-flex-text-primary">
                            {new Date(record.expiresAt).toLocaleDateString([], {
                                dateStyle: 'full',
                            })}
                        </span>
                    </p>
                </div>

                {/* Account & Billing */}
                <div className="flex flex-col">
                    <span className="text-[11px] font-semibold text-flex-text-muted uppercase tracking-wider mb-2">
                        Account & Contract
                    </span>
                    <DetailRow label="Subscription ID">
                        <span className="font-mono text-[11px]">{record.id}</span>
                    </DetailRow>
                    <DetailRow label="Billing Contact">
                        <span className="font-mono text-[11px]">{record.contactEmail}</span>
                    </DetailRow>
                    <DetailRow label="Tier & Plan">{record.plan}</DetailRow>
                    <DetailRow label="Seat Allocation">{record.seats} agent licenses</DetailRow>
                    <DetailRow label="Contract Amount">
                        ${record.amount.toLocaleString()} {record.currency} ({record.billingCycle})
                    </DetailRow>
                    <DetailRow label="Renewal Policy">
                        {record.autoRenew ? 'Automatic renewal active' : 'Manual invoice renewal'}
                    </DetailRow>
                    <DetailRow label="Last Payment">
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
                            Notification Delivery
                        </span>
                        <a
                            href="/admin/mail-config"
                            className="text-primary hover:underline flex items-center gap-1 text-[11px]"
                        >
                            Mail Config
                            <RiExternalLinkLine className="size-3" />
                        </a>
                    </div>

                    <div className="p-3 rounded border bg-card text-xs flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <span className="text-flex-text-muted">SMTP Server:</span>
                            <span
                                className={`font-semibold flex items-center gap-1 ${
                                    mailStatus.isReady ? 'text-success' : 'text-warning'
                                }`}
                            >
                                {mailStatus.isReady ? (
                                    <>
                                        <RiShieldCheckLine className="size-3.5" />
                                        Connected & Active
                                    </>
                                ) : (
                                    'Disconnected / Untested'
                                )}
                            </span>
                        </div>

                        <div className="flex items-center justify-between border-t border-border/40 pt-2">
                            <span className="text-flex-text-muted">5-Day Expiry Reminder:</span>
                            <span className="font-medium text-flex-text-primary">
                                {record.reminderSent ? (
                                    <span className="text-success inline-flex items-center gap-1">
                                        <RiCheckLine className="size-3.5" />
                                        Sent{' '}
                                        {record.reminderSentAt &&
                                            `(${new Date(record.reminderSentAt).toLocaleDateString()})`}
                                    </span>
                                ) : (
                                    'Not sent'
                                )}
                            </span>
                        </div>

                        <div className="flex items-center justify-between border-t border-border/40 pt-2">
                            <span className="text-flex-text-muted">Expiry Notice:</span>
                            <span className="font-medium text-flex-text-primary">
                                {record.expiryNoticeSent ? (
                                    <span className="text-destructive inline-flex items-center gap-1">
                                        <RiCheckLine className="size-3.5" />
                                        Sent
                                    </span>
                                ) : (
                                    'None'
                                )}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </FlexDetailSheet>
    );
}
