import type { Table } from '@tanstack/react-table';
import type { ReactNode } from 'react';
import { DataGrid, DataGridContainer } from '@/components/reui/data-grid/data-grid';
import type { DataGridFeatures } from '@/components/reui/data-grid/data-grid';
import { DataGridPagination } from '@/components/reui/data-grid/data-grid-pagination';
import { DataGridScrollArea } from '@/components/reui/data-grid/data-grid-scroll-area';
import { DataGridTable } from '@/components/reui/data-grid/data-grid-table';
import type { TenantRecord } from '@/features/tenants/shared/types';
import { TenantsResultMeta } from '@/features/tenants/tenants-result-meta';

export interface TenantsTableProps {
    table: Table<DataGridFeatures, TenantRecord>;
    recordCount: number;
    isLoading: boolean;
    emptyMessage: ReactNode;
    onRowClick?: (tenant: TenantRecord) => void;
    total: number;
}

export function TenantsTable({ table, recordCount, isLoading, emptyMessage, onRowClick, total }: TenantsTableProps) {
    return (
        <DataGrid
            table={table}
            recordCount={recordCount}
            isLoading={isLoading}
            loadingMode="skeleton"
            emptyMessage={emptyMessage}
            tableLayout={{
                dense: true,
                columnsMovable: true,
            }}
            onRowClick={onRowClick}
        >
            <div className="w-full space-y-2.5">
                <TenantsResultMeta shown={recordCount} total={total} />
                <DataGridContainer>
                    <DataGridScrollArea>
                        <DataGridTable />
                    </DataGridScrollArea>
                </DataGridContainer>
                <DataGridPagination />
            </div>
        </DataGrid>
    );
}
