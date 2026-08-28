import { RiEyeLine, RiPencilLine } from '@remixicon/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
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

/** Dense IVR directory table. */
export function IVRTable({ records, onView, onEdit }: IVRTableProps) {
    const { t } = useTranslation('administration');

    const headers: { key: string; label: string; align: 'start' | 'end' | 'center' }[] = [
        { key: 'ivr', label: t('ivr.columns.ivr'), align: 'start' },
        { key: 'prompt', label: t('ivr.columns.prompt'), align: 'start' },
        { key: 'entries', label: t('ivr.columns.entries'), align: 'end' },
        { key: 'defaultDestination', label: t('ivr.columns.defaultDestination'), align: 'start' },
        { key: 'status', label: t('ivr.columns.status'), align: 'start' },
        { key: 'actions', label: '', align: 'center' },
    ];

    return (
        <div className="overflow-hidden rounded-lg border border-flex-workspace-divider bg-flex-workspace-surface">
            <div className="overflow-x-auto">
                <table className="flex-table-grid w-full text-sm">
                    <thead>
                        <tr className="border-b border-border bg-muted/40 text-left">
                            {headers.map((header) => (
                                <th key={header.key} className={`px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-flex-text-muted whitespace-nowrap ${alignClass(header.align)}`}>
                                    {header.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {records.map((ivr) => (
                            <tr key={ivr.id} className="border-b border-border last:border-b-0 hover:bg-flex-layer-hover transition-colors">
                                <td className="px-4 py-2.5 text-xs font-semibold text-flex-text-primary whitespace-nowrap text-start">{ivr.name}</td>
                                <td className="px-4 py-2.5 font-mono text-xs text-flex-text-muted text-start">{ivr.prompt}</td>
                                <td className="px-4 py-2.5 text-xs tabular-nums text-flex-text-primary text-end">{ivr.entries.length}</td>
                                <td className="px-4 py-2.5 text-xs text-flex-text-primary whitespace-nowrap text-start">{formatDestination(ivr.defaultDestination)}</td>
                                <td className="px-4 py-2.5 text-start"><RoutingStatusBadge status={ivr.status} /></td>
                                <td className="px-4 py-2.5 text-center">
                                    <div className="flex items-center gap-0.5 justify-center">
                                        <Button variant="ghost" size="icon-xs" title={t('ivr.table.view')} aria-label={t('ivr.table.viewAria', { name: ivr.name })} onClick={() => onView(ivr)}>
                                            <RiEyeLine className="size-3.5" />
                                        </Button>
                                        <Button variant="ghost" size="icon-xs" title={t('ivr.table.edit')} aria-label={t('ivr.table.editAria', { name: ivr.name })} onClick={() => onEdit(ivr)}>
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
