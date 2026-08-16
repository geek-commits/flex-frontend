import { RiEditLine } from '@remixicon/react';
import React from 'react';
import { FlexDetailSheet } from '@/components/flex/flex-detail-sheet';
import { FlexStatus } from '@/components/flex/flex-status';
import { Button } from '@/components/ui/button';
import type { TenantRecord } from '@/features/tenants/shared/types';
import { formatTenantDate, TENANT_STATUS_LABELS, TENANT_STATUS_TONE } from '@/features/tenants/tenant-status';

export interface TenantDetailSheetProps {
    tenant?: TenantRecord;
    onOpenChange: (open: boolean) => void;
    onEdit?: (tenant: TenantRecord) => void;
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex items-start justify-between gap-4">
            <span className="text-xs text-flex-text-muted shrink-0">{label}</span>
            <span className="text-xs text-flex-text-primary text-right">{children}</span>
        </div>
    );
}

export function TenantDetailSheet({ tenant, onOpenChange, onEdit }: TenantDetailSheetProps) {
    return (
        <FlexDetailSheet
            open={!!tenant}
            onOpenChange={onOpenChange}
            title={tenant?.name ?? 'Tenant'}
            meta={tenant ? `${tenant.domain} · ${formatTenantDate(tenant.createdAt)}` : undefined}
            footer={
                tenant && onEdit ? (
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 text-xs"
                        onClick={() => {
                            onEdit(tenant);
                            onOpenChange(false);
                        }}
                    >
                        <RiEditLine className="size-3.5" />
                        Edit Tenant
                    </Button>
                ) : undefined
            }
        >
            <div className="flex items-center gap-2">
                <FlexStatus tone={tenant ? TENANT_STATUS_TONE[tenant.status] : 'neutral'} className="capitalize">
                    {tenant ? TENANT_STATUS_LABELS[tenant.status] : '—'}
                </FlexStatus>
            </div>

            <div className="flex flex-col gap-3">
                <DetailRow label="Tenant name">{tenant?.name ?? '—'}</DetailRow>
                <DetailRow label="Domain">{tenant?.domain ?? '—'}</DetailRow>
                <DetailRow label="Contact name">{tenant?.contact ?? '—'}</DetailRow>
                <DetailRow label="Contact email">{tenant?.email ?? '—'}</DetailRow>
                <DetailRow label="Phone">{tenant?.phone || '—'}</DetailRow>
                <DetailRow label="Created">{tenant ? formatTenantDate(tenant.createdAt) : '—'}</DetailRow>
            </div>
        </FlexDetailSheet>
    );
}
