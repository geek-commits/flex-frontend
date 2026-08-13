import type { Table } from '@tanstack/react-table';
import type { DataGridFeatures } from '@/components/reui/data-grid/data-grid';
import { DataGridColumnVisibility } from '@/components/reui/data-grid/data-grid-column-visibility';
import { Button } from '@/components/ui/button';
import type { UserAccount } from '@/features/access-management/shared/types';

export interface UsersResultMetaProps {
    table: Table<DataGridFeatures, UserAccount>;
    shown: number;
    total: number;
}

export function UsersResultMeta({ table, shown, total }: UsersResultMetaProps) {
    return (
        <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-flex-text-muted">
                {shown} of {total} users
            </span>
            <DataGridColumnVisibility
                table={table}
                trigger={<Button variant="outline" size="sm" className="gap-1.5 text-xs">Columns</Button>}
            />
        </div>
    );
}
