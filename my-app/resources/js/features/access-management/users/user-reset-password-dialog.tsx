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

export interface UserResetPasswordDialogProps {
    user?: UserAccount;
    onOpenChange: (open: boolean) => void;
}

export function UserResetPasswordDialog({ user, onOpenChange }: UserResetPasswordDialogProps) {
    const [sending, setSending] = useState(false);

    const handleSend = () => {
        if (!user) {
            return;
        }

        setSending(true);
        setTimeout(() => {
            try {
                accessRepository.resetPasswordLink(user.id);
                toast.success('Password reset link sent.');
            } catch {
                toast.error('Couldn’t send the password reset link. Try again.');
            }

            setSending(false);
            onOpenChange(false);
        }, 400);
    };

    return (
        <AlertDialog open={!!user} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Send password reset link?</AlertDialogTitle>
                    <AlertDialogDescription>
                        A reset link will be sent to {user?.email}. The user will set a new password through the link.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={sending}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleSend} disabled={sending}>
                        {sending ? 'Sending…' : 'Send Reset Link'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}