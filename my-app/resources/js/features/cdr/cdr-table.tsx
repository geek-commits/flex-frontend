import type { Table } from '@tanstack/react-table';
import type { ReactNode } from 'react';
import {
    DataGrid,
    DataGridContainer
    
} from '@/components/reui/data-grid/data-grid';
import type {DataGridFeatures} from '@/components/reui/data-grid/data-grid';
import { DataGridPagination } from '@/components/reui/data-grid/data-grid-pagination';
import { DataGridScrollArea } from '@/components/reui/data-grid/data-grid-scroll-area';
import { DataGridTable } from '@/components/reui/data-grid/data-grid-table';
import type { CDRRecord } from '@/domain/types';
import { CdrResultMeta } from '@/features/cdr/cdr-result-meta';
import type { QuickFilter } from '@/features/cdr/cdr-toolbar';

export interface CdrTableProps {
    table: Table<DataGridFeatures, CDRRecord>;
    recordCount: number;
    isLoading: boolean;
    emptyMessage: ReactNode;
    onRowClick?: (record: CDRRecord) => void;
    quickFilter: QuickFilter;
    total: number;
}

/**
 * CDR table composition on the ReUI data grid — reusable pattern for
 * FLEX data-heavy workspaces.
 */
export function CdrTable({
    table,
    recordCount,
    isLoading,
    emptyMessage,
    onRowClick,
    quickFilter,
    total,
}: CdrTableProps) {
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
                <CdrResultMeta table={table} shown={recordCount} total={total} quickFilter={quickFilter} />
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
