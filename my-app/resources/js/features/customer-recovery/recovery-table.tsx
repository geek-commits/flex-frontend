import type { Table } from '@tanstack/react-table';
import React from 'react';
import { FlexEmptyState } from '@/components/flex/flex-empty-state';
import { FlexErrorState } from '@/components/flex/flex-error-state';
import {
    DataGrid,
    DataGridContainer,
} from '@/components/reui/data-grid/data-grid';
import type { DataGridFeatures } from '@/components/reui/data-grid/data-grid';
import { DataGridPagination } from '@/components/reui/data-grid/data-grid-pagination';
import { DataGridScrollArea } from '@/components/reui/data-grid/data-grid-scroll-area';
import { DataGridTable } from '@/components/reui/data-grid/data-grid-table';
import { Button } from '@/components/ui/button';
import type { RecoveryRecord } from '@/features/customer-recovery/recovery-types';

export interface RecoveryTableProps {
    table: Table<DataGridFeatures, RecoveryRecord>;
    records: RecoveryRecord[];
    isLoading: boolean;
    error?: string;
    onRefresh: () => void;
    onRowClick: (record: RecoveryRecord) => void;
    emptyMessage?: React.ReactNode;
}

export function RecoveryTable({
    table,
    records,
    isLoading,
    error,
    onRefresh,
    onRowClick,
    emptyMessage,
}: RecoveryTableProps) {
    if (error) {
        return (
            <FlexErrorState
                title="Couldn't load missed calls"
                description={error}
                action={
                    <Button variant="outline" size="sm" className="text-xs" onClick={onRefresh}>
                        Try Again
                    </Button>
                }
            />
        );
    }

    return (
        <DataGrid
            table={table}
            recordCount={records?.length || 0}
            isLoading={isLoading}
            loadingMode="skeleton"
            emptyMessage={
                emptyMessage ?? (
                    <FlexEmptyState
                        title="No missed calls to recover"
                        description="New missed calls will appear here when follow-up is needed."
                    />
                )
            }
            tableLayout={{ dense: true, columnsMovable: true }}
            onRowClick={onRowClick}
        >
            <div className="w-full space-y-2.5">
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