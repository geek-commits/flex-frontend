import type { Table } from '@tanstack/react-table';
import type { ReactNode } from 'react';
import { DataGrid, DataGridContainer } from '@/components/reui/data-grid/data-grid';
import type { DataGridFeatures } from '@/components/reui/data-grid/data-grid';
import { DataGridPagination } from '@/components/reui/data-grid/data-grid-pagination';
import { DataGridScrollArea } from '@/components/reui/data-grid/data-grid-scroll-area';
import { DataGridTable } from '@/components/reui/data-grid/data-grid-table';
import type { CampaignRecord } from '@/domain/types';
import { CampaignsResultMeta } from '@/features/campaigns/campaigns-result-meta';

export interface CampaignsTableProps {
    table: Table<DataGridFeatures, CampaignRecord>;
    recordCount: number;
    isLoading: boolean;
    emptyMessage: ReactNode;
    onRowClick?: (record: CampaignRecord) => void;
    total: number;
}

/**
 * Campaigns table composition on the shared ReUI data grid —
 * same operational language as CDR.
 */
export function CampaignsTable({
    table,
    recordCount,
    isLoading,
    emptyMessage,
    onRowClick,
    total,
}: CampaignsTableProps) {
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
                <CampaignsResultMeta table={table} shown={recordCount} total={total} />
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
