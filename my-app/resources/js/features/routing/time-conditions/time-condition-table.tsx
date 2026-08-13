import { Link } from '@inertiajs/react';
import { RiEyeLine, RiPencilLine } from '@remixicon/react';
import React from 'react';
import { Button } from '@/components/ui/button';
import type { TimeConditionRecord } from '@/domain/routing-types';
import { formatDestination } from '@/domain/routing-types';
import { RoutingStatusBadge } from '@/features/routing/shared/routing-status';
import { resolveTimeGroup } from '@/features/routing/shared/time-group-resolver';

export interface TimeConditionTableProps {
    records: TimeConditionRecord[];
    onView: (condition: TimeConditionRecord) => void;
    onEdit: (condition: TimeConditionRecord) => void;
}

/** Dense Time Condition directory table showing the Time Group relationship. */
export function TimeConditionTable({ records, onView, onEdit }: TimeConditionTableProps) {
    return (
        <div className="overflow-hidden rounded-lg border border-border bg-background">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-border bg-muted/40 text-left">
                            {['Condition', 'Time Group', 'Match Destination', 'Fallback', 'Status', ''].map((header, index) => (
                                <th key={index} className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-flex-text-muted whitespace-nowrap">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {records.map((condition) => {
                            const group = resolveTimeGroup(condition.timeGroupId);

                            return (
                                <tr key={condition.id} className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors">
                                    <td className="px-4 py-2.5 text-xs font-semibold text-flex-text-primary whitespace-nowrap">{condition.name}</td>
                                    <td className="px-4 py-2.5 text-xs text-flex-text-primary whitespace-nowrap">
                                        {group.missing ? (
                                            <span className="text-destructive">{group.description}</span>
                                        ) : (
                                            <Link href="/admin/time-groups" className="text-primary hover:underline">
                                                {group.description}
                                            </Link>
                                        )}
                                    </td>
                                    <td className="px-4 py-2.5 text-xs text-flex-text-primary whitespace-nowrap">{formatDestination(condition.matchDestination)}</td>
                                    <td className="px-4 py-2.5 text-xs text-flex-text-muted whitespace-nowrap">{formatDestination(condition.noMatchDestination)}</td>
                                    <td className="px-4 py-2.5"><RoutingStatusBadge status={condition.status} /></td>
                                    <td className="px-4 py-2.5">
                                        <div className="flex items-center gap-0.5 justify-end">
                                            <Button variant="ghost" size="icon-xs" title="View" aria-label={`View ${condition.name}`} onClick={() => onView(condition)}>
                                                <RiEyeLine className="size-3.5" />
                                            </Button>
                                            <Button variant="ghost" size="icon-xs" title="Edit" aria-label={`Edit ${condition.name}`} onClick={() => onEdit(condition)}>
                                                <RiPencilLine className="size-3.5" />
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
