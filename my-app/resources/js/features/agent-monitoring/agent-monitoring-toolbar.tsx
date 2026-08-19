import { RiFilter3Line, RiFilterOffLine, RiSearchLine } from '@remixicon/react';
import type { Table } from '@tanstack/react-table';
import { useMemo } from 'react';
import type { DataGridFeatures } from '@/components/reui/data-grid/data-grid';
import { DataGridColumnVisibility } from '@/components/reui/data-grid/data-grid-column-visibility';
import type { Filter, FilterFieldConfig } from '@/components/reui/filters';
import { Filters } from '@/components/reui/filters';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MONITORING_STATE_ORDER } from '@/features/agent-monitoring/use-agent-monitoring';
import type { MonitoringAgentRow } from '@/features/agent-monitoring/use-agent-monitoring';
import { agentStateMap } from '@/lib/status-styles';

export interface AgentMonitoringToolbarProps {
    table: Table<DataGridFeatures, MonitoringAgentRow>;
    search: string;
    onSearchChange: (value: string) => void;
    filters: Filter<string>[];
    onFiltersChange: (filters: Filter<string>[]) => void;
    queues: string[];
    hasActiveFilters: boolean;
    onClearFilters: () => void;
}

export function AgentMonitoringToolbar({
    table,
    search,
    onSearchChange,
    filters,
    onFiltersChange,
    queues,
    hasActiveFilters,
    onClearFilters,
}: AgentMonitoringToolbarProps) {
    const hasPopoverFilters = filters.some(
        (filter) =>
            filter.values?.length > 0 &&
            filter.values.some((value) => value !== ''),
    );

    const fields = useMemo<FilterFieldConfig<string>[]>(
        () => [
            {
                key: 'state',
                label: 'State',
                type: 'select',
                searchable: true,
                className: 'w-[180px]',
                options: MONITORING_STATE_ORDER.map((state) => ({
                    value: state,
                    label: agentStateMap[state].label,
                })),
            },
            {
                key: 'queue',
                label: 'Queue',
                type: 'select',
                searchable: true,
                className: 'w-[200px]',
                options: queues.map((queue) => ({ value: queue, label: queue })),
            },
        ],
        [queues],
    );

    return (
        <div className="flex flex-col gap-3 px-3 py-2.5 lg:flex-row lg:items-center lg:justify-between">
            {/* Left group — scope & filters */}
            <div className="flex items-center gap-2 flex-wrap">
                <Filters
                    filters={filters}
                    fields={fields}
                    onChange={onFiltersChange}
                    size="sm"
                    trigger={
                        <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                            <RiFilter3Line className="size-3.5" />
                            Filters
                            {hasPopoverFilters && (
                                <span className="size-1.5 rounded-full bg-primary" />
                            )}
                        </Button>
                    }
                />
                {hasActiveFilters && (
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={onClearFilters}>
                        <RiFilterOffLine className="size-3.5" />
                        Clear
                    </Button>
                )}
            </div>

            {/* Right group — search, columns */}
            <div className="flex items-center gap-2 flex-wrap">
                <div className="relative w-full lg:w-64">
                    <RiSearchLine className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-flex-text-muted" />
                    <Input
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Search agents by name or extension..."
                        className="pl-8"
                        size="sm"
                        aria-label="Search agents"
                    />
                </div>

                <DataGridColumnVisibility
                    table={table}
                    trigger={<Button variant="outline" size="sm" className="gap-1.5 text-xs">Columns</Button>}
                />
            </div>
        </div>
    );
}
