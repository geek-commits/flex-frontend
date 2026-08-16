import { RiLoginCircleLine, RiMore2Line, RiUserStarLine } from '@remixicon/react';
import type { ColumnDef } from '@tanstack/react-table';
import { FlexStatus } from '@/components/flex/flex-status';
import { SearchHighlight } from '@/components/flex/search-highlight';
import type { DataGridFeatures } from '@/components/reui/data-grid/data-grid';
import { DataGridColumnHeader } from '@/components/reui/data-grid/data-grid-column-header';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import type { TenantRecord, TenantStatus } from '@/features/tenants/shared/types';
import { formatTenantDate, TENANT_STATUS_LABELS, TENANT_STATUS_TONE } from '@/features/tenants/tenant-status';

export type TenantRowAction = 'enter' | 'edit' | 'view' | 'setStatus';

export interface TenantRowHandlers {
    onView: (tenant: TenantRecord) => void;
    onEdit: (tenant: TenantRecord) => void;
    onEnter: (tenant: TenantRecord) => void;
    onSetStatus: (tenant: TenantRecord, status: TenantStatus) => void;
}

export function tenantColumns(handlers: TenantRowHandlers): ColumnDef<DataGridFeatures, TenantRecord>[] {
    const { onView, onEdit, onEnter, onSetStatus } = handlers;

    return [
        {
            accessorKey: 'name',
            id: 'tenant',
            header: ({ column }) => <DataGridColumnHeader title="Tenant" column={column} />,
            cell: ({ row, table }) => {
                const queryText = (table.options.meta as { search?: string } | undefined)?.search ?? '';

                return (
                    <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-flex-text-primary truncate">
                            <SearchHighlight text={row.original.name} query={queryText} />
                        </span>
                        <span className="text-[10px] text-flex-text-muted truncate">
                            <SearchHighlight text={row.original.domain} query={queryText} />
                        </span>
                    </div>
                );
            },
            size: 240,
            enableSorting: true,
            meta: { skeleton: <Skeleton className="h-4 w-28" /> },
        },
        {
            accessorKey: 'contact',
            id: 'contact',
            header: ({ column }) => <DataGridColumnHeader title="Contact" column={column} />,
            cell: ({ row }) => (
                <div className="flex flex-col min-w-0">
                    <span className="text-xs text-flex-text-primary truncate">
                        <SearchHighlight text={row.original.contact} query={(row.table.options.meta as { search?: string } | undefined)?.search ?? ''} />
                    </span>
                    <span className="text-[10px] text-flex-text-muted truncate">{row.original.email}</span>
                </div>
            ),
            size: 200,
            enableSorting: true,
            meta: { skeleton: <Skeleton className="h-4 w-24" /> },
        },
        {
            accessorKey: 'phone',
            id: 'phone',
            header: ({ column }) => <DataGridColumnHeader title="Phone" column={column} />,
            cell: ({ getValue }) => <span className="font-mono text-xs text-flex-text-muted">{getValue() as string}</span>,
            size: 160,
            enableSorting: true,
            meta: { skeleton: <Skeleton className="h-4 w-24" /> },
        },
        {
            accessorKey: 'status',
            id: 'status',
            header: ({ column }) => <DataGridColumnHeader title="Status" column={column} />,
            cell: ({ row }) => (
                <FlexStatus tone={TENANT_STATUS_TONE[row.original.status]} className="capitalize">
                    {TENANT_STATUS_LABELS[row.original.status]}
                </FlexStatus>
            ),
            size: 120,
            enableSorting: true,
            meta: { skeleton: <Skeleton className="h-4 w-16 rounded-full" /> },
        },
        {
            accessorKey: 'createdAt',
            id: 'createdAt',
            header: ({ column }) => <DataGridColumnHeader title="Created" column={column} />,
            cell: ({ getValue }) => (
                <span className="text-xs text-flex-text-muted">{formatTenantDate(getValue() as string)}</span>
            ),
            size: 120,
            enableSorting: true,
            meta: { skeleton: <Skeleton className="h-4 w-20" /> },
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => {
                const tenant = row.original;

                return (
                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon-xs" title="View tenant" onClick={() => onView(tenant)}>
                            <RiUserStarLine className="size-3.5" />
                        </Button>
                        <DropdownMenu>
                        <DropdownMenuTrigger
                            render={
                                <Button variant="ghost" size="icon-xs" title="Tenant actions" aria-label={`Actions for ${tenant.name}`}>
                                    <RiMore2Line className="size-3.5" />
                                </Button>
                            }
                        />
                            <DropdownMenuContent align="end" className="w-44">
                                <DropdownMenuLabel className="text-xs font-semibold">{tenant.name}</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-xs" onSelect={() => onEdit(tenant)}>
                                    Edit tenant
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-xs" onSelect={() => onEnter(tenant)}>
                                    <RiLoginCircleLine className="size-3.5" />
                                    Enter tenant
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {tenant.status === 'active' ? (
                                    <DropdownMenuItem className="text-xs" onSelect={() => onSetStatus(tenant, 'disabled')}>
                                        Disable tenant
                                    </DropdownMenuItem>
                                ) : (
                                    <DropdownMenuItem className="text-xs" onSelect={() => onSetStatus(tenant, 'active')}>
                                        Enable tenant
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
            size: 80,
            enableSorting: false,
            enableHiding: false,
        },
    ];
}
