import type { Table } from '@tanstack/react-table';
import type { DataGridFeatures } from '@/components/reui/data-grid/data-grid';
import { DataGridColumnVisibility } from '@/components/reui/data-grid/data-grid-column-visibility';
import { Button } from '@/components/ui/button';
import type { TenantRecord } from '@/features/tenants/shared/types';

export interface TenantsResultMetaProps {
    table: Table<DataGridFeatures, TenantRecord>;
    shown: number;
    total: number;
}

export function TenantsResultMeta({ table, shown, total }: TenantsResultMetaProps) {
    return (
        <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-flex-text-muted">
                {shown} of {total} tenants
            </span>
            <DataGridColumnVisibility
                table={table}
                trigger={<Button variant="outline" size="sm" className="gap-1.5 text-xs">Columns</Button>}
            />
        </div>
    );
}
