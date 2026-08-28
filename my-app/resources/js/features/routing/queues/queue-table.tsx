import { RiEyeLine, RiPencilLine, RiTeamLine } from '@remixicon/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import type { QueueRecord } from '@/domain/routing-types';
import { RoutingStatusBadge } from '@/features/routing/shared/routing-status';

export interface QueueTableProps {
    records: QueueRecord[];
    onView: (queue: QueueRecord) => void;
    onEdit: (queue: QueueRecord) => void;
    onMembers: (queue: QueueRecord) => void;
}

/** Dense queue directory table. */
export function QueueTable({ records, onView, onEdit, onMembers }: QueueTableProps) {
    const { t } = useTranslation('administration');

    const headers: { key: string; label: string; align: 'start' | 'end' | 'center' }[] = [
        { key: 'queue', label: t('queues.columns.queue'), align: 'start' },
        { key: 'extension', label: t('queues.columns.extension'), align: 'start' },
        { key: 'strategy', label: t('queues.columns.strategy'), align: 'start' },
        { key: 'members', label: t('queues.columns.members'), align: 'end' },
        { key: 'ringTimeout', label: t('queues.columns.ringTimeout'), align: 'end' },
        { key: 'status', label: t('queues.columns.status'), align: 'start' },
        { key: 'actions', label: '', align: 'center' },
    ];

    const alignClass = (align: 'start' | 'end' | 'center') =>
        align === 'end' ? 'text-end' : align === 'center' ? 'text-center' : 'text-start';

    return (
        <div className="overflow-hidden rounded-lg border border-flex-workspace-divider bg-flex-workspace-surface">
            <div className="overflow-x-auto">
                <table className="flex-table-grid w-full text-sm">
                    <thead>
                        <tr className="border-b border-border bg-muted/40 text-left">
                            {headers.map((header) => (
                                <th
                                    key={header.key}
                                    className={`px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-flex-text-muted whitespace-nowrap ${alignClass(header.align)}`}
                                >
                                    {header.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {records.map((queue) => (
                            <tr key={queue.id} className="border-b border-border last:border-b-0 hover:bg-flex-layer-hover transition-colors">
                                <td className="px-4 py-2.5 text-start">
                                    <span className="block text-xs font-semibold text-flex-text-primary whitespace-nowrap">{queue.name}</span>
                                    {queue.description && (
                                        <span className="block text-[10px] text-flex-text-muted truncate max-w-[220px]">{queue.description}</span>
                                    )}
                                </td>
                                <td className="px-4 py-2.5 font-mono text-xs text-flex-text-muted whitespace-nowrap text-start">{queue.extension}</td>
                                <td className="px-4 py-2.5 text-xs text-flex-text-primary whitespace-nowrap text-start">{t(`queues.toolbar.strategies.${queue.strategy}`)}</td>
                                <td className="px-4 py-2.5 text-xs tabular-nums text-flex-text-primary text-end">{queue.memberCount}</td>
                                <td className="px-4 py-2.5 text-xs tabular-nums text-flex-text-primary whitespace-nowrap text-end">{queue.ringTimeout}s</td>
                                <td className="px-4 py-2.5 text-start"><RoutingStatusBadge status={queue.status} /></td>
                                <td className="px-4 py-2.5 text-center">
                                    <div className="flex items-center gap-0.5 justify-center">
                                        <Button variant="ghost" size="icon-xs" title={t('queues.table.view')} aria-label={t('queues.table.viewAria', { name: queue.name })} onClick={() => onView(queue)}>
                                            <RiEyeLine className="size-3.5" />
                                        </Button>
                                        <Button variant="ghost" size="icon-xs" title={t('queues.table.members')} aria-label={t('queues.table.membersAria', { name: queue.name })} onClick={() => onMembers(queue)}>
                                            <RiTeamLine className="size-3.5" />
                                        </Button>
                                        <Button variant="ghost" size="icon-xs" title={t('queues.table.edit')} aria-label={t('queues.table.editAria', { name: queue.name })} onClick={() => onEdit(queue)}>
                                            <RiPencilLine className="size-3.5" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
