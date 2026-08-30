import type { ColumnDef } from '@tanstack/react-table';
import type { TFunction } from 'i18next';
import type { DataGridFeatures } from '@/components/reui/data-grid/data-grid';
import { DataGridColumnHeader } from '@/components/reui/data-grid/data-grid-column-header';
import { CallbackAction } from '@/features/customer-recovery/callback-action';
import { RecoveryOwnership } from '@/features/customer-recovery/recovery-ownership';
import { RecoveryStatus } from '@/features/customer-recovery/recovery-status';
import type { RecoveryRecord } from '@/features/customer-recovery/recovery-types';
import { VoicemailPlayer } from '@/features/customer-recovery/voicemail-player';

type AgentT = TFunction<'agent', undefined>;

function formatMissedAt(value: string, t: AgentT): string {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    const today = new Date();

    const sameDay = date.toDateString() === today.toDateString();
    const yesterday = new Date(today);

    yesterday.setDate(today.getDate() - 1);

    if (sameDay) {
        return `${t('recovery.today')}, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }

    if (date.toDateString() === yesterday.toDateString()) {
        return `${t('recovery.yesterday')}, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }

    return date.toLocaleDateString([], { day: 'numeric', month: 'short' }) + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function recoveryColumns(
    currentAgent: { id: string; name: string },
    onRecordChanged: (record: RecoveryRecord) => void,
    t: AgentT,
): ColumnDef<DataGridFeatures, RecoveryRecord>[] {
    return [
        {
            accessorKey: 'phoneNumber',
            id: 'customer',
            header: ({ column }) => <DataGridColumnHeader title={t('recovery.columns.customerPhone')} column={column} />,
            cell: ({ row }) => (
                <div className="flex min-w-0 flex-col">
                    <span className="truncate text-[13px] font-medium text-flex-text-primary">
                        {row.original.customerName ?? t('recovery.unknownCustomer')}
                    </span>
                    <span className="flex-numeric text-xs text-flex-text-muted">{row.original.phoneNumber}</span>
                </div>
            ),
            size: 260,
            enableSorting: true,
            meta: { kind: 'identity', align: 'start', headerTitle: t('recovery.columns.customerPhone') },
        },
        {
            accessorKey: 'missedAt',
            id: 'missedAt',
            header: ({ column }) => <DataGridColumnHeader title={t('recovery.columns.missedAt')} column={column} />,
            cell: ({ getValue }) => (
                <span className="flex-numeric text-xs whitespace-nowrap text-flex-text-muted">{formatMissedAt(getValue() as string, t)}</span>
            ),
            size: 160,
            enableSorting: true,
            meta: { kind: 'date', align: 'start', headerTitle: t('recovery.columns.missedAt') },
        },
        {
            accessorKey: 'queueName',
            id: 'queue',
            header: ({ column }) => <DataGridColumnHeader title={t('recovery.columns.queue')} column={column} />,
            cell: ({ getValue }) => <span className="text-xs text-flex-text-primary">{getValue() as string}</span>,
            size: 220,
            enableSorting: true,
            meta: { kind: 'text', align: 'start', headerTitle: t('recovery.columns.queue') },
        },
        {
            accessorKey: 'category',
            id: 'category',
            header: t('recovery.columns.category'),
            cell: ({ getValue }) => <span className="text-xs text-flex-text-primary">{getValue() as string}</span>,
            size: 200,
            meta: { kind: 'text', align: 'start' },
        },
        {
            accessorKey: 'attempts',
            id: 'attempts',
            header: t('recovery.columns.attempts'),
            cell: ({ getValue }) => <span className="flex-numeric text-xs text-flex-text-primary">{getValue() as number}</span>,
            size: 88,
            meta: { kind: 'numeric', align: 'end' },
        },
        {
            id: 'voicemail',
            header: t('recovery.columns.voicemail'),
            cell: ({ row }) => (
                <VoicemailPlayer
                    voicemail={row.original.voicemail}
                    compact
                    callerLabel={row.original.customerName ?? row.original.phoneNumber}
                />
            ),
            size: 160,
            meta: { kind: 'icon', align: 'start' },
        },
        {
            id: 'ownership',
            header: t('recovery.columns.ownership'),
            cell: ({ row }) => <RecoveryOwnership record={row.original} currentAgentId={currentAgent.id} />,
            size: 220,
            meta: { kind: 'text', align: 'start' },
        },
        {
            accessorKey: 'status',
            id: 'status',
            header: ({ column }) => <DataGridColumnHeader title={t('recovery.columns.status')} column={column} />,
            cell: ({ row }) => <RecoveryStatus status={row.original.status} />,
            size: 200,
            enableSorting: true,
            meta: { kind: 'status', align: 'start', headerTitle: t('recovery.columns.status') },
        },
        {
            id: 'action',
            header: t('recovery.columns.action'),
            cell: ({ row }) => (
                <CallbackAction
                    record={row.original}
                    currentAgent={currentAgent}
                    onChanged={onRecordChanged}
                />
            ),
            size: 140,
            enableHiding: false,
            enableSorting: false,
            meta: { kind: 'action', align: 'center' },
        },
    ];
}