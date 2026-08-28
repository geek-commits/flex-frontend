import { RiAddLine, RiSearchLine } from '@remixicon/react';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlexEmptyState } from '@/components/flex/flex-empty-state';
import { FlexErrorState } from '@/components/flex/flex-error-state';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { routingRepository } from '@/domain/routing-repository';
import type { TimeConditionRecord } from '@/domain/routing-types';
import { RoutingShell } from '@/features/routing/routing-shell';
import { resolveTimeGroup } from '@/features/routing/shared/time-group-resolver';
import { TimeConditionDeleteDialog } from '@/features/routing/time-conditions/time-condition-delete-dialog';
import { TimeConditionDetailSheet } from '@/features/routing/time-conditions/time-condition-detail-sheet';
import { TimeConditionFormSheet } from '@/features/routing/time-conditions/time-condition-form-sheet';
import { TimeConditionTable } from '@/features/routing/time-conditions/time-condition-table';

export function TimeConditionsPage() {
    const { t } = useTranslation('administration');
    const [records, setRecords] = useState<TimeConditionRecord[]>(() => routingRepository.queryTimeConditions());
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>();
    const [detailId, setDetailId] = useState<string>();
    const [formOpen, setFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<string>();
    const [deleteId, setDeleteId] = useState<string>();

    const detailCondition = detailId ? records.find((condition) => condition.id === detailId) : undefined;
    const editingCondition = editingId ? records.find((condition) => condition.id === editingId) : undefined;
    const deleteCondition = deleteId ? records.find((condition) => condition.id === deleteId) : undefined;

    const refresh = useCallback(() => {
        setIsLoading(true);
        setError(undefined);
        setTimeout(() => {
            try {
                setRecords(routingRepository.queryTimeConditions());
            } catch {
                setError(t('timeConditions.error.generic'));
            }

            setIsLoading(false);
        }, 350);
    }, [t]);

    const openCreate = () => {
        setEditingId(undefined);
        setFormOpen(true);
    };

    const openEdit = (condition: TimeConditionRecord) => {
        setDetailId(undefined);
        setEditingId(condition.id);
        setFormOpen(true);
    };

    const openDetail = (condition: TimeConditionRecord) => setDetailId(condition.id);
    const openDelete = (condition: TimeConditionRecord) => setDeleteId(condition.id);

    const handleSaved = () => setRecords(routingRepository.queryTimeConditions());

    const filtered = useMemo(() => {
        const needle = search.trim().toLowerCase();

        if (!needle) {
            return records;
        }

        return records.filter((condition) => {
            const group = resolveTimeGroup(condition.timeGroupId);

            return condition.name.toLowerCase().includes(needle) || group.description.toLowerCase().includes(needle);
        });
    }, [records, search]);

    return (
        <RoutingShell
            title={t('timeConditions.title')}
            subtitle={t('timeConditions.subtitle')}
            actions={
                <Button size="sm" className="gap-1.5 text-xs" onClick={openCreate}>
                    <RiAddLine className="size-4" />
                    {t('timeConditions.actions.addTimeCondition')}
                </Button>
            }
        >
            <div className="flex flex-col gap-[var(--flex-space-section)] w-full">
                <div className="relative w-full lg:w-72">
                    <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-flex-text-muted" />
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={t('timeConditions.toolbar.searchPlaceholder')}
                        aria-label={t('timeConditions.toolbar.searchAriaLabel')}
                        className="pl-9 h-9 text-xs"
                    />
                </div>

                {error ? (
                    <FlexErrorState
                        title={t('timeConditions.error.title')}
                        description={error}
                        action={
                            <Button variant="outline" size="sm" className="text-xs" onClick={refresh}>
                                {t('timeConditions.error.retry')}
                            </Button>
                        }
                    />
                ) : isLoading ? (
                    <div className="flex flex-col gap-2">
                        {Array.from({ length: 3 }).map((_, index) => (
                            <Skeleton key={index} className="h-12 w-full" />
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <FlexEmptyState
                        title={records.length === 0 ? t('timeConditions.empty.noConditionsTitle') : t('timeConditions.empty.noMatchTitle')}
                        description={
                            records.length === 0
                                ? t('timeConditions.empty.noConditionsDescription')
                                : t('timeConditions.empty.noMatchDescription')
                        }
                        action={
                            records.length === 0 ? (
                                <Button variant="outline" size="sm" className="text-xs" onClick={openCreate}>
                                    {t('timeConditions.empty.addTimeCondition')}
                                </Button>
                            ) : undefined
                        }
                    />
                ) : (
                    <TimeConditionTable records={filtered} onView={openDetail} onEdit={openEdit} />
                )}

                <p className="text-[10px] text-flex-text-muted">
                    {t('timeConditions.footerHint')}
                </p>
            </div>

            <TimeConditionDetailSheet
                condition={detailCondition}
                onOpenChange={(open) => !open && setDetailId(undefined)}
                onEdit={openEdit}
                onDelete={openDelete}
            />

            <TimeConditionFormSheet
                key={editingId ?? 'new'}
                open={formOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        setEditingId(undefined);
                    }

                    setFormOpen(open);
                }}
                editing={editingCondition}
                onSaved={handleSaved}
            />

            <TimeConditionDeleteDialog
                condition={deleteCondition}
                onOpenChange={(open) => !open && setDeleteId(undefined)}
                onDeleted={handleSaved}
            />
        </RoutingShell>
    );
}
