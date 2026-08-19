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

const alignClass = (a: 'start' | 'end' | 'center' | undefined) =>
    a === 'end' ? 'text-end' : a === 'center' ? 'text-center' : 'text-start';

const headers: { label: string; align: 'start' | 'end' | 'center' }[] = [
    { label: 'IVR', align: 'start' },
    { label: 'Prompt', align: 'start' },
    { label: 'Entries', align: 'end' },
    { label: 'Default Destination', align: 'start' },
    { label: 'Status', align: 'start' },
    { label: '', align: 'center' },
];

/** Dense IVR directory table. */
export function IVRTable({ records, onView, onEdit }: IVRTableProps) {
    return (
        <div className="overflow-hidden rounded-lg border border-flex-workspace-divider bg-flex-workspace-surface">
            <div className="overflow-x-auto">
                <table className="flex-table-grid w-full text-sm">
                    <thead>
                        <tr className="border-b border-border bg-muted/40 text-left">
                            {headers.map((header, index) => (
                                <th key={index} className={`px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-flex-text-muted whitespace-nowrap ${alignClass(header.align)}`}>
                                    {header.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {records.map((ivr) => (
                            <tr key={ivr.id} className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors">
                                <td className="px-4 py-2.5 text-xs font-semibold text-flex-text-primary whitespace-nowrap text-start">{ivr.name}</td>
                                <td className="px-4 py-2.5 font-mono text-xs text-flex-text-muted text-start">{ivr.prompt}</td>
                                <td className="px-4 py-2.5 text-xs tabular-nums text-flex-text-primary text-end">{ivr.entries.length}</td>
                                <td className="px-4 py-2.5 text-xs text-flex-text-primary whitespace-nowrap text-start">{formatDestination(ivr.defaultDestination)}</td>
                                <td className="px-4 py-2.5 text-start"><RoutingStatusBadge status={ivr.status} /></td>
                                <td className="px-4 py-2.5 text-center">
                                    <div className="flex items-center gap-0.5 justify-center">
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
