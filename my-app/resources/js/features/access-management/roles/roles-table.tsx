import { RiEditLine } from '@remixicon/react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { RoleRecord } from '@/features/access-management/shared/permission-catalog';
import { permissionModuleLabel } from '@/features/access-management/shared/permission-catalog';

export interface RolesTableProps {
    records: RoleRecord[];
    isLoading: boolean;
    emptyMessage: ReactNode;
    onEdit: (role: RoleRecord) => void;
}

/**
 * Roles directory — the runtime only defines the three canonical roles, so a
 * simple table (no pagination) is the right shape. Permission and user counts
 * come from real POC data; nothing is invented.
 */
export function RolesTable({ records, isLoading, emptyMessage, onEdit }: RolesTableProps) {
    if (isLoading) {
        return (
            <div className="flex flex-col gap-2">
                {Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton key={index} className="h-12 w-full" />
                ))}
            </div>
        );
    }

    if (records.length === 0) {
        return <div className="w-full">{emptyMessage}</div>;
    }

    return (
        <div className="overflow-x-auto rounded-lg border border-border bg-background">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-border bg-muted/40 text-left">
                        <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-flex-text-muted whitespace-nowrap">Role</th>
                        <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-flex-text-muted whitespace-nowrap">Permissions</th>
                        <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-flex-text-muted whitespace-nowrap">Users</th>
                        <th className="px-4 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wider text-flex-text-muted whitespace-nowrap">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {records.map((role) => (
                        <tr key={role.id} className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors">
                            <td className="px-4 py-3">
                                <span className="font-semibold text-flex-text-primary">{role.name}</span>
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center rounded-full border border-border bg-muted px-2 py-0.5 text-[11px] font-semibold text-flex-text-primary">
                                        {role.permissions.length}
                                    </span>
                                    <span
                                        className="text-xs text-flex-text-muted truncate max-w-[180px]"
                                        title={
                                            role.permissions.length > 0
                                                ? Array.from(new Set(role.permissions.map(permissionModuleLabel))).join(' · ')
                                                : undefined
                                        }
                                    >
                                        {role.permissions.length > 0
                                            ? Array.from(new Set(role.permissions.map(permissionModuleLabel))).join(' · ')
                                            : 'No permissions'}
                                    </span>
                                </div>
                            </td>
                            <td className="px-4 py-3">
                                <span className="text-xs text-flex-text-primary">{role.userCount}</span>
                            </td>
                            <td className="px-4 py-3 text-right">
                                <Button
                                    variant="ghost"
                                    size="icon-xs"
                                    title="Edit role"
                                    aria-label={`Edit ${role.name}`}
                                    onClick={() => onEdit(role)}
                                >
                                    <RiEditLine className="size-3.5" />
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}