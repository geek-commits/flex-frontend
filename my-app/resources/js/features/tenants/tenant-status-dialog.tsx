import React, { useState } from 'react';
import { toast } from 'sonner';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { tenantRepository } from '@/domain/tenant-repository';
import type { TenantRecord, TenantStatus } from '@/features/tenants/shared/types';

export interface TenantStatusDialogProps {
    tenant?: TenantRecord;
    status?: TenantStatus;
    onOpenChange: (open: boolean) => void;
    onCompleted?: () => void;
}

export function TenantStatusDialog({ tenant, status, onOpenChange, onCompleted }: TenantStatusDialogProps) {
    const [busy, setBusy] = useState(false);

    const open = !!tenant && !!status;
    const enabling = status === 'active';

    const handleConfirm = () => {
        if (!tenant || !status) {
            return;
        }

        setBusy(true);
        setTimeout(() => {
            try {
                tenantRepository.setStatus(tenant.id, status);
                toast.success(`${tenant.name} ${enabling ? 'enabled' : 'disabled'}`);
            } catch {
                toast.error('The action could not be completed. Try again.');
            }

            setBusy(false);
            onOpenChange(false);
            onCompleted?.();
        }, 400);
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{enabling ? 'Enable tenant?' : 'Disable tenant?'}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {enabling
                            ? `${tenant?.name} will be enabled and able to operate again.`
                            : `${tenant?.name} will be disabled and will no longer be able to operate. You can re-enable the tenant later.`}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={busy}>Cancel</AlertDialogCancel>
                    <AlertDialogAction variant={enabling ? undefined : 'destructive'} onClick={handleConfirm} disabled={busy}>
                        {busy ? (enabling ? 'Enabling…' : 'Disabling…') : enabling ? 'Enable' : 'Disable'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
