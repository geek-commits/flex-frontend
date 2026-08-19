import type { ReactNode } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import type { PermissionDefinition } from '@/features/access-management/shared/permission-catalog';

export interface PermissionsTableProps {
    records: PermissionDefinition[];
    isLoading: boolean;
    emptyMessage: ReactNode;
}

/**
 * Permissions catalog — the runtime has no edit/delete for permission
 * definitions, so this table is read-only by design (plan §63, §65).
 */
export function PermissionsTable({ records, isLoading, emptyMessage }: PermissionsTableProps) {
    if (isLoading) {
        return (
            <div className="flex flex-col gap-2">
                {Array.from({ length: 6 }).map((_, index) => (
                    <Skeleton key={index} className="h-10 w-full" />
                ))}
            </div>
        );
    }

    if (records.length === 0) {
        return <div className="w-full">{emptyMessage}</div>;
    }

    return (
        <div className="overflow-x-auto rounded-lg border border-border bg-background">
            <table className="flex-table-grid w-full text-sm">
                <thead>
                    <tr className="border-b border-border bg-muted/40 text-left">
                        <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-flex-text-muted whitespace-nowrap text-start">Permission</th>
                        <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-flex-text-muted whitespace-nowrap text-start">Type</th>
                        <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-flex-text-muted whitespace-nowrap text-start">Module</th>
                    </tr>
                </thead>
                <tbody>
                    {records.map((permission) => (
                        <tr key={permission.id} className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors">
                            <td className="px-4 py-2.5 text-start">
                                <span className="font-medium text-flex-text-primary">{permission.name}</span>
                                <span className="ml-2 font-mono text-[10px] text-flex-text-muted">{permission.id}</span>
                            </td>
                            <td className="px-4 py-2.5 text-start">
                                <span className="inline-flex items-center rounded-full border border-border bg-muted px-2 py-0.5 text-[11px] font-semibold text-flex-text-primary">
                                    {permission.type}
                                </span>
                            </td>
                            <td className="px-4 py-2.5 text-start">
                                <span className="text-xs text-flex-text-primary">{permission.module}</span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}