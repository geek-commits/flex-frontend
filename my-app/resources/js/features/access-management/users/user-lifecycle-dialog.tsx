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
import { accessRepository } from '@/domain/access-repository';
import type { UserAccount } from '@/features/access-management/shared/types';

export type UserLifecycleAction = 'deactivate' | 'remove' | 'restore';

export interface UserLifecycleDialogProps {
    user?: UserAccount;
    action?: UserLifecycleAction;
    onOpenChange: (open: boolean) => void;
    onCompleted?: () => void;
}

const ACTION_META: Record<UserLifecycleAction, { title: string; confirm: string; busy: string }> = {
    deactivate: {
        title: 'Deactivate user?',
        confirm: 'Deactivate',
        busy: 'Deactivating…',
    },
    remove: {
        title: 'Remove user?',
        confirm: 'Remove User',
        busy: 'Removing…',
    },
    restore: {
        title: 'Restore user?',
        confirm: 'Restore User',
        busy: 'Restoring…',
    },
};

export function UserLifecycleDialog({ user, action, onOpenChange, onCompleted }: UserLifecycleDialogProps) {
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
                    toast.success(`${user.name} deactivated`);
                } else if (action === 'remove') {
                    accessRepository.softDeleteUser(user.id);
                    toast.success(`${user.name} removed`);
                } else {
                    accessRepository.restoreUser(user.id);
                    toast.success(`${user.name} restored`);
                }
            } catch {
                toast.error('The action could not be completed. Try again.');
            }

            setBusy(false);
            onOpenChange(false);
            onCompleted?.();
        }, 400);
    };

    const meta = action ? ACTION_META[action] : ACTION_META.deactivate;

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{meta.title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {action === 'remove'
                            ? `${user?.name} will be removed from the active user list and can be restored later.`
                            : action === 'deactivate'
                              ? `${user?.name} will no longer be able to sign in. You can reactivate the user later.`
                              : `${user?.name} will return to the active user list.`}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={busy}>Cancel</AlertDialogCancel>
                    <AlertDialogAction variant={action === 'restore' ? undefined : 'destructive'} onClick={handleConfirm} disabled={busy}>
                        {busy ? meta.busy : meta.confirm}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}