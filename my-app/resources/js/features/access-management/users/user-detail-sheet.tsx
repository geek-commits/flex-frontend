import { RiDeleteBin6Line, RiEditLine, RiLockPasswordLine, RiRefreshLine, RiUserForbidLine } from '@remixicon/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FlexDetailSheet } from '@/components/flex/flex-detail-sheet';
import { FlexStatus } from '@/components/flex/flex-status';
import { Button } from '@/components/ui/button';
import { ROLE_LABEL_KEYS } from '@/features/access-management/shared/role-options';
import type { UserAccount } from '@/features/access-management/shared/types';
import type { UserLifecycleAction } from '@/features/access-management/users/user-lifecycle-dialog';
import { formatLastActivity, USER_STATUS_KEYS, USER_STATUS_TONE } from '@/features/access-management/users/user-status';

export interface UserDetailSheetProps {
    user?: UserAccount;
    onOpenChange: (open: boolean) => void;
    onEdit?: (user: UserAccount) => void;
    onResetPassword?: (user: UserAccount) => void;
    onLifecycle?: (user: UserAccount, action: UserLifecycleAction) => void;
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex items-start justify-between gap-4">
            <span className="text-xs text-flex-text-muted shrink-0">{label}</span>
            <span className="text-xs text-flex-text-primary text-right">{children}</span>
        </div>
    );
}

export function UserDetailSheet({ user, onOpenChange, onEdit, onResetPassword, onLifecycle }: UserDetailSheetProps) {
    const { t, i18n } = useTranslation('administration');

    return (
        <FlexDetailSheet
            open={!!user}
            onOpenChange={onOpenChange}
            title={user?.name ?? t('users.detail.fallbackTitle')}
            meta={user?.email}
            footer={
                user && (onEdit || onResetPassword || onLifecycle) ? (
                    <>
                        {user.status === 'deleted' ? (
                            onLifecycle && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-1.5 text-xs"
                                    onClick={() => {
                                        onLifecycle(user, 'restore');
                                        onOpenChange(false);
                                    }}
                                >
                                    <RiRefreshLine className="size-3.5" />
                                    {t('users.detail.restoreUser')}
                                </Button>
                            )
                        ) : (
                            <>
                                {onResetPassword && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-1.5 text-xs"
                                        onClick={() => {
                                            onResetPassword(user);
                                            onOpenChange(false);
                                        }}
                                    >
                                        <RiLockPasswordLine className="size-3.5" />
                                        {t('users.detail.sendPasswordReset')}
                                    </Button>
                                )}
                                {onEdit && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-1.5 text-xs"
                                        onClick={() => {
                                            onEdit(user);
                                            onOpenChange(false);
                                        }}
                                    >
                                        <RiEditLine className="size-3.5" />
                                        {t('users.detail.editUser')}
                                    </Button>
                                )}
                                {user.status === 'active' && onLifecycle && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-1.5 text-xs"
                                        onClick={() => {
                                            onLifecycle(user, 'deactivate');
                                            onOpenChange(false);
                                        }}
                                    >
                                        <RiUserForbidLine className="size-3.5" />
                                        {t('users.detail.deactivate')}
                                    </Button>
                                )}
                                {onLifecycle && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-1.5 text-xs text-destructive"
                                        onClick={() => {
                                            onLifecycle(user, 'remove');
                                            onOpenChange(false);
                                        }}
                                    >
                                        <RiDeleteBin6Line className="size-3.5" />
                                        {t('users.detail.removeUser')}
                                    </Button>
                                )}
                            </>
                        )}
                    </>
                ) : undefined
            }
        >
            <div className="flex flex-col gap-3">
                <DetailRow label={t('users.detail.status')}>
                    {user && (
                        <FlexStatus tone={USER_STATUS_TONE[user.status]} className="capitalize">
                            {t(USER_STATUS_KEYS[user.status])}
                        </FlexStatus>
                    )}
                </DetailRow>
                <DetailRow label={t('users.detail.role')}>{user && t(ROLE_LABEL_KEYS[user.role])}</DetailRow>
                <DetailRow label={t('users.detail.username')}>{user?.username ?? '—'}</DetailRow>
                <DetailRow label={t('users.detail.organization')}>{user?.organization ?? '—'}</DetailRow>
                <DetailRow label={t('users.detail.lastActivity')}>{user && formatLastActivity(user.lastActivity, i18n.language)}</DetailRow>
                <DetailRow label={t('users.detail.created')}>{user && formatLastActivity(user.createdAt, i18n.language)}</DetailRow>
            </div>
        </FlexDetailSheet>
    );
}
