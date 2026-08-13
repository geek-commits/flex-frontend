import React from 'react';
import { FlexDetailSheet } from '@/components/flex/flex-detail-sheet';
import { FlexStatus } from '@/components/flex/flex-status';
import { roleLabels } from '@/domain/access-repository';
import type { UserAccount } from '@/features/access-management/shared/types';
import { formatLastActivity, USER_STATUS_TONE } from '@/features/access-management/users/user-status';

export interface UserDetailSheetProps {
    user?: UserAccount;
    onOpenChange: (open: boolean) => void;
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex items-start justify-between gap-4">
            <span className="text-xs text-flex-text-muted shrink-0">{label}</span>
            <span className="text-xs text-flex-text-primary text-right">{children}</span>
        </div>
    );
}

export function UserDetailSheet({ user, onOpenChange }: UserDetailSheetProps) {
    return (
        <FlexDetailSheet
            open={!!user}
            onOpenChange={onOpenChange}
            title={user?.name ?? 'User'}
            meta={user?.email}
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
