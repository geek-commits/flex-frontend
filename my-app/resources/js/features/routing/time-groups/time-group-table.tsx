import { RiDeleteBin6Line, RiPencilLine } from '@remixicon/react';
import React from 'react';
import { Button } from '@/components/ui/button';
import { routingRepository } from '@/domain/routing-repository';
import type { TimeGroupRecord } from '@/domain/routing-types';
import { formatTimeGroupSummary } from '@/features/routing/time-groups/time-group-summary';

export interface TimeGroupTableProps {
    records: TimeGroupRecord[];
    onEdit: (group: TimeGroupRecord) => void;
    onDelete: (group: TimeGroupRecord) => void;
}

/** Dense Time Group directory table with schedule summaries and usage. */
export function TimeGroupTable({ records, onEdit, onDelete }: TimeGroupTableProps) {
    return (
        <div className="overflow-hidden rounded-lg border border-border bg-background">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-border bg-muted/40 text-left">
                            {['Time Group', 'Schedule', 'Entries', 'Used By', ''].map((header, index) => (
                                <th key={index} className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-flex-text-muted whitespace-nowrap">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {records.map((group) => {
                            const usage = routingRepository.timeGroupUsage(group.id);

                            return (
                                <tr key={group.id} className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors">
                                    <td className="px-4 py-2.5 text-xs font-semibold text-flex-text-primary whitespace-nowrap">{group.description}</td>
                                    <td className="px-4 py-2.5 text-xs text-flex-text-primary whitespace-nowrap">
                                        {formatTimeGroupSummary(group.entries)}
                                    </td>
                                    <td className="px-4 py-2.5 text-xs tabular-nums text-flex-text-primary">{group.entries.length}</td>
                                    <td className="px-4 py-2.5 text-xs text-flex-text-muted">
                                        {usage > 0 ? `${usage} condition${usage === 1 ? '' : 's'}` : 'Not used'}
                                    </td>
                                    <td className="px-4 py-2.5">
                                        <div className="flex items-center gap-0.5 justify-end">
                                            <Button variant="ghost" size="icon-xs" title="Edit" aria-label={`Edit ${group.description}`} onClick={() => onEdit(group)}>
                                                <RiPencilLine className="size-3.5" />
                                            </Button>
                                            <Button variant="ghost" size="icon-xs" title="Delete" aria-label={`Delete ${group.description}`} className="text-destructive" onClick={() => onDelete(group)}>
                                                <RiDeleteBin6Line className="size-3.5" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
