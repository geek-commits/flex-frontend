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

export interface UserResetPasswordDialogProps {
    user?: UserAccount;
    onOpenChange: (open: boolean) => void;
}

export function UserResetPasswordDialog({ user, onOpenChange }: UserResetPasswordDialogProps) {
    const { t } = useTranslation('administration');
    const [sending, setSending] = useState(false);

    const handleSend = () => {
        if (!user) {
            return;
        }

        setSending(true);
        setTimeout(() => {
            try {
                accessRepository.resetPasswordLink(user.id);
                toast.success(t('users.resetPassword.success'));
            } catch {
                toast.error(t('users.resetPassword.failed'));
            }

            setSending(false);
            onOpenChange(false);
        }, 400);
    };

    return (
        <AlertDialog open={!!user} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{t('users.resetPassword.title')}</AlertDialogTitle>
                    <AlertDialogDescription>{t('users.resetPassword.description', { email: user?.email })}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={sending}>{t('users.resetPassword.cancel')}</AlertDialogCancel>
                    <AlertDialogAction onClick={handleSend} disabled={sending}>
                        {sending ? t('users.resetPassword.sending') : t('users.resetPassword.send')}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
