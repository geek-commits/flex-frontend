import { Link } from '@inertiajs/react';
import { RiEyeLine, RiPencilLine } from '@remixicon/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
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

const alignClass = (a: 'start' | 'end' | 'center' | undefined) =>
    a === 'end' ? 'text-end' : a === 'center' ? 'text-center' : 'text-start';

/** Dense Time Condition directory table showing the Time Group relationship. */
export function TimeConditionTable({ records, onView, onEdit }: TimeConditionTableProps) {
    const { t } = useTranslation('administration');

    const headers: { key: string; label: string; align: 'start' | 'end' | 'center' }[] = [
        { key: 'condition', label: t('timeConditions.columns.condition'), align: 'start' },
        { key: 'timeGroup', label: t('timeConditions.columns.timeGroup'), align: 'start' },
        { key: 'matchDestination', label: t('timeConditions.columns.matchDestination'), align: 'start' },
        { key: 'fallback', label: t('timeConditions.columns.fallback'), align: 'start' },
        { key: 'status', label: t('timeConditions.columns.status'), align: 'start' },
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
                        {records.map((condition) => {
                            const group = resolveTimeGroup(condition.timeGroupId);

                            return (
                                <tr key={condition.id} className="border-b border-border last:border-b-0 hover:bg-flex-layer-hover transition-colors">
                                    <td className="px-4 py-2.5 text-xs font-semibold text-flex-text-primary whitespace-nowrap text-start">{condition.name}</td>
                                    <td className="px-4 py-2.5 text-xs text-flex-text-primary whitespace-nowrap text-start">
                                        {group.missing ? (
                                            <span className="text-destructive">{group.description}</span>
                                        ) : (
                                            <Link href="/admin/time-groups" className="text-primary hover:underline">
                                                {group.description}
                                            </Link>
                                        )}
                                    </td>
                                    <td className="px-4 py-2.5 text-xs text-flex-text-primary whitespace-nowrap text-start">{formatDestination(condition.matchDestination)}</td>
                                    <td className="px-4 py-2.5 text-xs text-flex-text-muted whitespace-nowrap text-start">{formatDestination(condition.noMatchDestination)}</td>
                                    <td className="px-4 py-2.5 text-start"><RoutingStatusBadge status={condition.status} /></td>
                                    <td className="px-4 py-2.5 text-center">
                                        <div className="flex items-center gap-0.5 justify-center">
                                            <Button variant="ghost" size="icon-xs" title={t('timeConditions.table.view')} aria-label={t('timeConditions.table.viewAria', { name: condition.name })} onClick={() => onView(condition)}>
                                                <RiEyeLine className="size-3.5" />
                                            </Button>
                                            <Button variant="ghost" size="icon-xs" title={t('timeConditions.table.edit')} aria-label={t('timeConditions.table.editAria', { name: condition.name })} onClick={() => onEdit(condition)}>
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
