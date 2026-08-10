import type { Table } from '@tanstack/react-table';
import type { DataGridFeatures } from '@/components/reui/data-grid/data-grid';
import { DataGridColumnVisibility } from '@/components/reui/data-grid/data-grid-column-visibility';
import { Button } from '@/components/ui/button';
import type { CDRRecord } from '@/domain/types';
import { QUICK_FILTERS  } from '@/features/cdr/cdr-toolbar';
import type {QuickFilter} from '@/features/cdr/cdr-toolbar';

export interface CdrResultMetaProps {
    table: Table<DataGridFeatures, CDRRecord>;
    shown: number;
    total: number;
    quickFilter: QuickFilter;
}

export function CdrResultMeta({ table, shown, total, quickFilter }: CdrResultMetaProps) {
    return (
        <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-flex-text-muted">
                {shown} of {total} records
                {quickFilter !== 'all' && (
                    <span className="ml-2 text-flex-text-muted/70">
                        • quick: {QUICK_FILTERS.find((f) => f.value === quickFilter)?.label}
                    </span>
                )}
            </span>
            <DataGridColumnVisibility
                table={table}
                trigger={<Button variant="outline" size="sm" className="gap-1.5 text-xs">Columns</Button>}
            />
        </div>
    );
}
