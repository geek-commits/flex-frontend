import type { Table } from '@tanstack/react-table';
import type { DataGridFeatures } from '@/components/reui/data-grid/data-grid';
import { DataGridColumnVisibility } from '@/components/reui/data-grid/data-grid-column-visibility';
import { Button } from '@/components/ui/button';
import type { CampaignRecord } from '@/domain/types';

export interface CampaignsResultMetaProps {
    table: Table<DataGridFeatures, CampaignRecord>;
    shown: number;
    total: number;
}

export function CampaignsResultMeta({ table, shown, total }: CampaignsResultMetaProps) {
    return (
        <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-flex-text-muted">
                {shown} of {total} campaigns
            </span>
            <DataGridColumnVisibility
                table={table}
                trigger={<Button variant="outline" size="sm" className="gap-1.5 text-xs">Columns</Button>}
            />
        </div>
    );
}
