import { RiEyeLine, RiPencilLine } from '@remixicon/react';
import React from 'react';
import { Button } from '@/components/ui/button';
import type { IVRRecord } from '@/domain/routing-types';
import { formatDestination } from '@/domain/routing-types';
import { RoutingStatusBadge } from '@/features/routing/shared/routing-status';

export interface IVRTableProps {
    records: IVRRecord[];
    onView: (ivr: IVRRecord) => void;
    onEdit: (ivr: IVRRecord) => void;
}

/** Dense IVR directory table. */
export function IVRTable({ records, onView, onEdit }: IVRTableProps) {
    return (
        <div className="overflow-hidden rounded-lg border border-border bg-background">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-border bg-muted/40 text-left">
                            {['IVR', 'Prompt', 'Entries', 'Default Destination', 'Status', ''].map((header, index) => (
                                <th key={index} className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-flex-text-muted whitespace-nowrap">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {records.map((ivr) => (
                            <tr key={ivr.id} className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors">
                                <td className="px-4 py-2.5 text-xs font-semibold text-flex-text-primary whitespace-nowrap">{ivr.name}</td>
                                <td className="px-4 py-2.5 font-mono text-xs text-flex-text-muted">{ivr.prompt}</td>
                                <td className="px-4 py-2.5 text-xs tabular-nums text-flex-text-primary">{ivr.entries.length}</td>
                                <td className="px-4 py-2.5 text-xs text-flex-text-primary whitespace-nowrap">{formatDestination(ivr.defaultDestination)}</td>
                                <td className="px-4 py-2.5"><RoutingStatusBadge status={ivr.status} /></td>
                                <td className="px-4 py-2.5">
                                    <div className="flex items-center gap-0.5 justify-end">
                                        <Button variant="ghost" size="icon-xs" title="View" aria-label={`View ${ivr.name}`} onClick={() => onView(ivr)}>
                                            <RiEyeLine className="size-3.5" />
                                        </Button>
                                        <Button variant="ghost" size="icon-xs" title="Edit" aria-label={`Edit ${ivr.name}`} onClick={() => onEdit(ivr)}>
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
