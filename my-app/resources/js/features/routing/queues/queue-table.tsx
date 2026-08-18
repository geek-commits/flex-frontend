import { RiEyeLine, RiPencilLine, RiTeamLine } from '@remixicon/react';
import React from 'react';
import { Button } from '@/components/ui/button';
import type { QueueRecord } from '@/domain/routing-types';
import { QUEUE_STRATEGY_LABELS } from '@/features/routing/queues/queue-labels';
import { RoutingStatusBadge } from '@/features/routing/shared/routing-status';

export interface QueueTableProps {
    records: QueueRecord[];
    onView: (queue: QueueRecord) => void;
    onEdit: (queue: QueueRecord) => void;
    onMembers: (queue: QueueRecord) => void;
}

/** Dense queue directory table. */
export function QueueTable({ records, onView, onEdit, onMembers }: QueueTableProps) {
    return (
        <div className="overflow-hidden rounded-lg border border-flex-workspace-divider bg-flex-workspace-surface">
            <div className="overflow-x-auto">
                <table className="flex-table-grid w-full text-sm">
                    <thead>
                        <tr className="border-b border-border bg-muted/40 text-left">
                            {['Queue', 'Extension', 'Strategy', 'Members', 'Ring Timeout', 'Status', ''].map((header, index) => (
                                <th key={index} className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-flex-text-muted whitespace-nowrap">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {records.map((queue) => (
                            <tr key={queue.id} className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors">
                                <td className="px-4 py-2.5">
                                    <span className="block text-xs font-semibold text-flex-text-primary whitespace-nowrap">{queue.name}</span>
                                    {queue.description && (
                                        <span className="block text-[10px] text-flex-text-muted truncate max-w-[220px]">{queue.description}</span>
                                    )}
                                </td>
                                <td className="px-4 py-2.5 font-mono text-xs text-flex-text-muted whitespace-nowrap">{queue.extension}</td>
                                <td className="px-4 py-2.5 text-xs text-flex-text-primary whitespace-nowrap">{QUEUE_STRATEGY_LABELS[queue.strategy]}</td>
                                <td className="px-4 py-2.5 text-xs tabular-nums text-flex-text-primary">{queue.memberCount}</td>
                                <td className="px-4 py-2.5 text-xs tabular-nums text-flex-text-primary whitespace-nowrap">{queue.ringTimeout}s</td>
                                <td className="px-4 py-2.5"><RoutingStatusBadge status={queue.status} /></td>
                                <td className="px-4 py-2.5">
                                    <div className="flex items-center gap-0.5 justify-end">
                                        <Button variant="ghost" size="icon-xs" title="View" aria-label={`View ${queue.name}`} onClick={() => onView(queue)}>
                                            <RiEyeLine className="size-3.5" />
                                        </Button>
                                        <Button variant="ghost" size="icon-xs" title="Members" aria-label={`Members of ${queue.name}`} onClick={() => onMembers(queue)}>
                                            <RiTeamLine className="size-3.5" />
                                        </Button>
                                        <Button variant="ghost" size="icon-xs" title="Edit" aria-label={`Edit ${queue.name}`} onClick={() => onEdit(queue)}>
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
