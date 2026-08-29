import { RiDeleteBin6Line, RiEditLine, RiEyeLine, RiPauseFill, RiPlayFill } from '@remixicon/react';
import type { ColumnDef } from '@tanstack/react-table';
import type { TFunction } from 'i18next';
import { FlexStatus } from '@/components/flex/flex-status';
import { SearchHighlight } from '@/components/flex/search-highlight';
import type { DataGridFeatures } from '@/components/reui/data-grid/data-grid';
import { DataGridColumnHeader } from '@/components/reui/data-grid/data-grid-column-header';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { CampaignRecord } from '@/domain/types';
import { answerRateTone } from '@/features/campaigns/campaign-answer-rate';
import { CampaignProgress } from '@/features/campaigns/campaign-progress';
import { CAMPAIGN_STATUS_TONE } from '@/features/campaigns/campaign-status';

export interface CampaignRowHandlers {
    onView: (record: CampaignRecord) => void;
    onEdit: (record: CampaignRecord) => void;
    onToggleStatus: (record: CampaignRecord) => void;
    onDelete: (record: CampaignRecord) => void;
    statusBusyId?: string;
}


type TF = TFunction<'supervision', undefined>;

export function campaignColumns(t: TF, handlers: CampaignRowHandlers): ColumnDef<DataGridFeatures, CampaignRecord>[] {
    const { onView, onEdit, onToggleStatus, onDelete, statusBusyId } = handlers;

    return [
        {
            accessorKey: 'title',
            id: 'campaign',
            header: ({ column }) => <DataGridColumnHeader title={t('campaigns.columns.campaign')} column={column} />,
            cell: ({ row, table }) => {
                const queryText = (table.options.meta as { search?: string } | undefined)?.search ?? '';

                return (
                    <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-flex-text-primary truncate">
                            <SearchHighlight text={row.original.title} query={queryText} />
                        </span>
                        <span className="text-[10px] text-flex-text-muted truncate">
                            <SearchHighlight text={row.original.destination} query={queryText} />
                        </span>
                    </div>
                );
            },
            size: 260,
            enableSorting: true,
            meta: { kind: 'identity', align: 'start', skeleton: <Skeleton className="h-4 w-28" /> },
        },
        {
            accessorKey: 'scheduleTime',
            id: 'schedule',
            header: ({ column }) => <DataGridColumnHeader title={t('campaigns.columns.schedule')} column={column} />,
            cell: ({ getValue }) => <span className="font-mono text-flex-text-muted">{getValue() as string}</span>,
            size: 150,
            enableSorting: true,
            meta: { kind: 'date', align: 'start', skeleton: <Skeleton className="h-4 w-20" /> },
        },
        {
            accessorKey: 'totalContacts',
            id: 'progress',
            header: ({ column }) => <DataGridColumnHeader title={t('campaigns.columns.progress')} column={column} />,
            cell: ({ row }) => (
                <CampaignProgress completed={row.original.dialedCount} total={row.original.totalContacts} />
            ),
            size: 150,
            enableSorting: false,
            meta: { kind: 'numeric', align: 'start', skeleton: <Skeleton className="h-4 w-24" /> },
        },
        {
            accessorKey: 'answeredCount',
            id: 'answerRate',
            header: ({ column }) => <DataGridColumnHeader title={t('campaigns.columns.answerRate')} column={column} />,
            cell: ({ row }) => {
                const tone = answerRateTone(row.original.answeredCount, row.original.dialedCount, row.original.status);

                return <span className={`font-bold text-xs flex-numeric ${tone.className}`}>{tone.text}</span>;
            },
            size: 110,
            enableSorting: true,
            meta: { kind: 'percentage', align: 'end', skeleton: <Skeleton className="h-4 w-10" /> },
        },
        {
            accessorKey: 'status',
            id: 'status',
            header: ({ column }) => <DataGridColumnHeader title={t('campaigns.columns.status')} column={column} />,
            cell: ({ row }) => (
                <FlexStatus tone={CAMPAIGN_STATUS_TONE[row.original.status]} className="capitalize">
                    {t(`campaigns.status.${row.original.status}`)}
                </FlexStatus>
            ),
            size: 120,
            enableSorting: true,
            meta: { kind: 'status', align: 'start', skeleton: <Skeleton className="h-4 w-16 rounded-full" /> },
        },
        {
            id: 'actions',
            header: t('campaigns.columns.actions'),
            cell: ({ row }) => (
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon-xs"
                        title={t('campaigns.actions.view')}
                        onClick={(e) => {
                            e.stopPropagation();
                            onView(row.original);
                        }}
                    >
                        <RiEyeLine className="size-3.5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon-xs"
                        title={t('campaigns.actions.edit')}
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(row.original);
                        }}
                    >
                        <RiEditLine className="size-3.5" />
                    </Button>
                    {(row.original.status === 'active' || row.original.status === 'paused') && (
                        <Button
                            variant="ghost"
                            size="icon-xs"
                            title={row.original.status === 'active' ? t('campaigns.actions.pause') : t('campaigns.actions.start')}
                            disabled={statusBusyId === row.original.id}
                            onClick={(e) => {
                                e.stopPropagation();
                                onToggleStatus(row.original);
                            }}
                        >
                            {row.original.status === 'active' ? (
                                <RiPauseFill className="size-3.5 text-status-stale" />
                            ) : (
                                <RiPlayFill className="size-3.5 text-status-live" />
                            )}
                        </Button>
                    )}
                    <Button
                        variant="ghost"
                        size="icon-xs"
                        title={t('campaigns.actions.delete')}
                        className="text-destructive hover:text-destructive/80"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(row.original);
                        }}
                    >
                        <RiDeleteBin6Line className="size-3.5" />
                    </Button>
                </div>
            ),
            size: 150,
            enableSorting: false,
            enableHiding: false,
            meta: { kind: 'action', align: 'center' },
        },
    ];
}
