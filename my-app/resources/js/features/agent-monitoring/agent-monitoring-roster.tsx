import type { Table } from '@tanstack/react-table';
import { FlexEmptyState } from '@/components/flex/flex-empty-state';
import {
    DataGrid,
    DataGridContainer,
} from '@/components/reui/data-grid/data-grid';
import type { DataGridFeatures } from '@/components/reui/data-grid/data-grid';
import { DataGridScrollArea } from '@/components/reui/data-grid/data-grid-scroll-area';
import { DataGridTable } from '@/components/reui/data-grid/data-grid-table';
import type { MonitoringAgentRow } from '@/features/agent-monitoring/use-agent-monitoring';

export interface AgentMonitoringRosterProps {
    table: Table<DataGridFeatures, MonitoringAgentRow>;
    rows: MonitoringAgentRow[];
    isLoading?: boolean;
}

/**
 * Canonical Agent Monitoring roster on the ReUI data grid. Column grammar
 * mirrors the other FLEX data workspaces (semantic alignment + grid dividers)
 * and is backed entirely by the Agent Monitoring runtime (`useAgentMonitoring`).
 * Monitoring-specific actions are intentionally omitted until a real capability
 * exists (e.g. Whisper).
 */
export function AgentMonitoringRoster({ table, rows, isLoading }: AgentMonitoringRosterProps) {
    return (
        <DataGrid
            table={table}
            recordCount={rows?.length || 0}
            isLoading={isLoading}
            loadingMode="spinner"
            emptyMessage={
                <FlexEmptyState
                    title="No agents online"
                    description="Agent activity will appear here once agents come online."
                />
            }
            tableLayout={{
                columnsMovable: true,
            }}
        >
            <DataGridContainer>
                <DataGridScrollArea>
                    <DataGridTable />
                </DataGridScrollArea>
            </DataGridContainer>
        </DataGrid>
    );
}
