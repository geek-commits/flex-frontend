import {
    RiAddLine,
    RiFilterOffLine,
    RiRefreshLine,
    RiSearchLine,
} from '@remixicon/react';
import type { Table } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { FlexDataWorkspaceToolbar } from '@/components/flex/flex-data-workspace-toolbar';
import { FlexViewSwitcher } from '@/components/flex/flex-view-switcher';
import type { DataGridFeatures } from '@/components/reui/data-grid/data-grid';
import { DataGridColumnVisibility } from '@/components/reui/data-grid/data-grid-column-visibility';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { CampaignRecord } from '@/domain/types';
import { CAMPAIGN_STATUS_OPTIONS } from '@/features/campaigns/campaign-status';
import type { CampaignStatus } from '@/types/flex';

export type CampaignStatusFilter = 'all' | CampaignStatus;

export interface CampaignsToolbarProps {
    table: Table<DataGridFeatures, CampaignRecord>;
    search: string;
    onSearchChange: (value: string) => void;
    statusFilter: CampaignStatusFilter;
    onStatusFilterChange: (value: CampaignStatusFilter) => void;
    hasActiveFilters: boolean;
    onClearFilters: () => void;
    onRefresh: () => void;
    isRefreshing?: boolean;
    onAdd: () => void;
}

export function CampaignsToolbar({
    table,
    search,
    onSearchChange,
    statusFilter,
    onStatusFilterChange,
    hasActiveFilters,
    onClearFilters,
    onRefresh,
    isRefreshing,
    onAdd,
}: CampaignsToolbarProps) {
    const { t } = useTranslation('supervision');

    const quickFilters: { value: CampaignStatusFilter; label: string }[] = [
        { value: 'all', label: t('campaigns.filters.all') },
        ...CAMPAIGN_STATUS_OPTIONS.map((status) => ({
            value: status as CampaignStatusFilter,
            label: t(`campaigns.status.${status}`),
        })),
    ];

    return (
        <FlexDataWorkspaceToolbar
            scope={
                <>
                    <FlexViewSwitcher
                        value={statusFilter}
                        onValueChange={(value) =>
                            onStatusFilterChange(value as CampaignStatusFilter)
                        }
                        options={quickFilters}
                        ariaLabel={t('campaigns.toolbar.filterLabel')}
                    />

                    {hasActiveFilters && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-1.5 text-xs"
                            onClick={onClearFilters}
                        >
                            <RiFilterOffLine className="size-3.5" />
                            {t('campaigns.toolbar.clear')}
                        </Button>
                    )}
                </>
            }

            actions={
                <>
                    <div className="relative w-full lg:w-64">
                        <RiSearchLine className="absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-flex-text-muted" />
                        <Input
                            value={search}
                            onChange={(e) => onSearchChange(e.target.value)}
                            placeholder={t(
                                'campaigns.toolbar.searchPlaceholder',
                            )}
                            size="sm"
                            className="pl-8"
                            aria-label={t('campaigns.toolbar.searchAriaLabel')}
                        />
                    </div>

                    <DataGridColumnVisibility
                        table={table}
                        trigger={
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-1.5 text-xs"
                            >
                                {t('campaigns.toolbar.columns')}
                            </Button>
                        }
                    />

                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 text-xs"
                        onClick={onRefresh}
                        disabled={isRefreshing}
                    >
                        <RiRefreshLine className="size-3.5" />
                        {t('campaigns.toolbar.refresh')}
                    </Button>

                    <Button
                        size="sm"
                        className="gap-1.5 text-xs"
                        onClick={onAdd}
                    >
                        <RiAddLine className="size-4" />
                        {t('campaigns.toolbar.newCampaign')}
                    </Button>
                </>
            }
        />
    );
}
