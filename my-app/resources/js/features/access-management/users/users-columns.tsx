import { RiEditLine, RiEyeLine } from '@remixicon/react';
import type { ColumnDef } from '@tanstack/react-table';
import { FlexStatus } from '@/components/flex/flex-status';
import { SearchHighlight } from '@/components/flex/search-highlight';
import type { DataGridFeatures } from '@/components/reui/data-grid/data-grid';
import { DataGridColumnHeader } from '@/components/reui/data-grid/data-grid-column-header';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { roleLabels } from '@/domain/access-repository';
import type { UserAccount } from '@/features/access-management/shared/types';
import { formatLastActivity, USER_STATUS_TONE } from '@/features/access-management/users/user-status';

export interface UserRowHandlers {
    onView: (user: UserAccount) => void;
    onEdit: (user: UserAccount) => void;
}

export function userColumns(handlers: UserRowHandlers): ColumnDef<DataGridFeatures, UserAccount>[] {
    const { onView, onEdit } = handlers;

    return [
        {
            accessorKey: 'name',
            id: 'user',
            header: ({ column }) => <DataGridColumnHeader title="User" column={column} />,
            cell: ({ row, table }) => {
                const queryText = (table.options.meta as { search?: string } | undefined)?.search ?? '';

                return (
                    <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-flex-text-primary truncate">
                            <SearchHighlight text={row.original.name} query={queryText} />
                        </span>
                        <span className="text-[10px] text-flex-text-muted truncate">
                            <SearchHighlight text={row.original.email} query={queryText} />
                        </span>
                    </div>
                );
            },
            size: 240,
            enableSorting: true,
            meta: { skeleton: <Skeleton className="h-4 w-28" /> },
        },
        {
            accessorKey: 'username',
            id: 'username',
            header: ({ column }) => <DataGridColumnHeader title="Username" column={column} />,
            cell: ({ getValue }) => <span className="font-mono text-xs text-flex-text-muted">{getValue() as string}</span>,
            size: 150,
            enableSorting: true,
            meta: { skeleton: <Skeleton className="h-4 w-20" /> },
        },
        {
            accessorKey: 'role',
            id: 'role',
            header: ({ column }) => <DataGridColumnHeader title="Role" column={column} />,
            cell: ({ row }) => <span className="text-xs text-flex-text-primary">{roleLabels[row.original.role]}</span>,
            size: 150,
            enableSorting: true,
            meta: { skeleton: <Skeleton className="h-4 w-16" /> },
        },
        {
            accessorKey: 'organization',
            id: 'organization',
            header: ({ column }) => <DataGridColumnHeader title="Organization" column={column} />,
            cell: ({ getValue }) => <span className="text-xs text-flex-text-primary">{getValue() as string}</span>,
            size: 160,
            enableSorting: true,
            meta: { skeleton: <Skeleton className="h-4 w-24" /> },
        },
        {
            accessorKey: 'status',
            id: 'status',
            header: ({ column }) => <DataGridColumnHeader title="Status" column={column} />,
            cell: ({ row }) => (
                <FlexStatus tone={USER_STATUS_TONE[row.original.status]} className="capitalize">
                    {row.original.status}
                </FlexStatus>
            ),
            size: 110,
            enableSorting: true,
            meta: { skeleton: <Skeleton className="h-4 w-16 rounded-full" /> },
        },
        {
            accessorKey: 'lastActivity',
            id: 'lastActivity',
            header: ({ column }) => <DataGridColumnHeader title="Last Activity" column={column} />,
            cell: ({ getValue }) => (
                <span className="text-xs text-flex-text-muted">{formatLastActivity(getValue() as string | undefined)}</span>
            ),
            size: 170,
            enableSorting: true,
            meta: { skeleton: <Skeleton className="h-4 w-24" /> },
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon-xs"
                        title="View user"
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
                        title="Edit user"
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(row.original);
                        }}
                    >
                        <RiEditLine className="size-3.5" />
                    </Button>
                </div>
            ),
            size: 90,
            enableSorting: false,
            enableHiding: false,
        },
    ];
}
