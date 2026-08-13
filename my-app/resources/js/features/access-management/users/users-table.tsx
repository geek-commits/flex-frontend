import type { Table } from '@tanstack/react-table';
import type { ReactNode } from 'react';
import { DataGrid, DataGridContainer } from '@/components/reui/data-grid/data-grid';
import type { DataGridFeatures } from '@/components/reui/data-grid/data-grid';
import { DataGridPagination } from '@/components/reui/data-grid/data-grid-pagination';
import { DataGridScrollArea } from '@/components/reui/data-grid/data-grid-scroll-area';
import { DataGridTable } from '@/components/reui/data-grid/data-grid-table';
import type { UserAccount } from '@/features/access-management/shared/types';
import { UsersResultMeta } from '@/features/access-management/users/users-result-meta';

export interface UsersTableProps {
    table: Table<DataGridFeatures, UserAccount>;
    recordCount: number;
    isLoading: boolean;
    emptyMessage: ReactNode;
    onRowClick?: (user: UserAccount) => void;
    total: number;
}

/**
 * Users table composition on the shared ReUI data grid —
 * same operational language as CDR and Campaigns.
 */
export function UsersTable({ table, recordCount, isLoading, emptyMessage, onRowClick, total }: UsersTableProps) {
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
                <UsersResultMeta table={table} shown={recordCount} total={total} />
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
