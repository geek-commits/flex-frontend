import { RiDeleteBin6Line, RiEditLine, RiLockPasswordLine, RiRefreshLine, RiUserForbidLine } from '@remixicon/react';
import React from 'react';
import { FlexDetailSheet } from '@/components/flex/flex-detail-sheet';
import { FlexStatus } from '@/components/flex/flex-status';
import { Button } from '@/components/ui/button';
import { roleLabels } from '@/domain/access-repository';
import type { UserAccount } from '@/features/access-management/shared/types';
import type { UserLifecycleAction } from '@/features/access-management/users/user-lifecycle-dialog';
import { formatLastActivity, USER_STATUS_TONE } from '@/features/access-management/users/user-status';

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
    return (
        <FlexDetailSheet
            open={!!user}
            onOpenChange={onOpenChange}
            title={user?.name ?? 'User'}
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
                                    Restore User
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
                                        Send Password Reset Link
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
                                        Edit User
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
                                        Deactivate
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
                                        Remove User
                                    </Button>
                                )}
                            </>
                        )}
                    </>
                ) : undefined
            }
        >
            <div className="flex flex-col gap-3">
                <DetailRow label="Status">
                    {user && (
                        <FlexStatus tone={USER_STATUS_TONE[user.status]} className="capitalize">
                            {user.status}
                        </FlexStatus>
                    )}
                </DetailRow>
                <DetailRow label="Role">{user && roleLabels[user.role]}</DetailRow>
                <DetailRow label="Username">{user?.username ?? '—'}</DetailRow>
                <DetailRow label="Organization">{user?.organization ?? '—'}</DetailRow>
                <DetailRow label="Last activity">{user && formatLastActivity(user.lastActivity)}</DetailRow>
                <DetailRow label="Created">{user && formatLastActivity(user.createdAt)}</DetailRow>
            </div>
        </FlexDetailSheet>
    );
}
