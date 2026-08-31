import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
import { accessRepository } from '@/domain/access-repository';
import type { UserAccount } from '@/features/access-management/shared/types';

export type UserLifecycleAction = 'deactivate' | 'remove' | 'restore';

export interface UserLifecycleDialogProps {
    user?: UserAccount;
    action?: UserLifecycleAction;
    onOpenChange: (open: boolean) => void;
    onCompleted?: () => void;
}

const USER_LIFECYCLE_KEYS = {
    deactivate: {
        title: 'users.lifecycle.deactivate.title',
        description: 'users.lifecycle.deactivate.description',
        confirm: 'users.lifecycle.deactivate.confirm',
        busy: 'users.lifecycle.deactivate.busy',
        success: 'users.lifecycle.deactivate.success',
    },
    remove: {
        title: 'users.lifecycle.remove.title',
        description: 'users.lifecycle.remove.description',
        confirm: 'users.lifecycle.remove.confirm',
        busy: 'users.lifecycle.remove.busy',
        success: 'users.lifecycle.remove.success',
    },
    restore: {
        title: 'users.lifecycle.restore.title',
        description: 'users.lifecycle.restore.description',
        confirm: 'users.lifecycle.restore.confirm',
        busy: 'users.lifecycle.restore.busy',
        success: 'users.lifecycle.restore.success',
    },
} as const;

export function UserLifecycleDialog({ user, action, onOpenChange, onCompleted }: UserLifecycleDialogProps) {
    const { t } = useTranslation('administration');
    const [busy, setBusy] = useState(false);

    const open = !!user && !!action;

    const handleConfirm = () => {
        if (!user || !action) {
            return;
        }

        setBusy(true);
        setTimeout(() => {
            try {
                if (action === 'deactivate') {
                    accessRepository.deactivateUser(user.id);
                    toast.success(t(USER_LIFECYCLE_KEYS.deactivate.success, { name: user.name }));
                } else if (action === 'remove') {
                    accessRepository.softDeleteUser(user.id);
                    toast.success(t(USER_LIFECYCLE_KEYS.remove.success, { name: user.name }));
                } else {
                    accessRepository.restoreUser(user.id);
                    toast.success(t(USER_LIFECYCLE_KEYS.restore.success, { name: user.name }));
                }
            } catch {
                toast.error(t('users.lifecycle.actionFailed'));
            }

            setBusy(false);
            onOpenChange(false);
            onCompleted?.();
        }, 400);
    };

    const meta = action ? USER_LIFECYCLE_KEYS[action] : USER_LIFECYCLE_KEYS.deactivate;

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{t(meta.title)}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {action === 'remove'
                            ? t('users.lifecycle.remove.description', { name: user?.name })
                            : action === 'deactivate'
                              ? t('users.lifecycle.deactivate.description', { name: user?.name })
                              : t('users.lifecycle.restore.description', { name: user?.name })}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={busy}>{t('users.lifecycle.cancel')}</AlertDialogCancel>
                    <AlertDialogAction variant={action === 'restore' ? undefined : 'destructive'} onClick={handleConfirm} disabled={busy}>
                        {busy ? t(meta.busy) : t(meta.confirm)}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
