import { RiAddLine } from '@remixicon/react';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlexEmptyState } from '@/components/flex/flex-empty-state';
import { FlexErrorState } from '@/components/flex/flex-error-state';
import { FlexWorkbenchShell } from '@/components/flex/flex-workbench-shell';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { routingRepository } from '@/domain/routing-repository';
import type { TimeGroupRecord } from '@/domain/routing-types';
import { RoutingShell } from '@/features/routing/routing-shell';
import { RoutingWorkspaceToolbar } from '@/features/routing/shared/routing-workspace-toolbar';
import { TimeGroupDeleteDialog } from '@/features/routing/time-groups/time-group-delete-dialog';
import { TimeGroupFormSheet } from '@/features/routing/time-groups/time-group-form-sheet';
import { TimeGroupTable } from '@/features/routing/time-groups/time-group-table';

export function TimeGroupsPage() {
    const { t } = useTranslation('administration');
    const [records, setRecords] = useState<TimeGroupRecord[]>(() => routingRepository.queryTimeGroups());
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>();
    const [formOpen, setFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<string>();
    const [deleteId, setDeleteId] = useState<string>();

    const editingGroup = editingId ? records.find((group) => group.id === editingId) : undefined;
    const deleteGroup = deleteId ? records.find((group) => group.id === deleteId) : undefined;

    const refresh = useCallback(() => {
        setIsLoading(true);
        setError(undefined);
        setTimeout(() => {
            try {
                setRecords(routingRepository.queryTimeGroups());
            } catch {
                setError(t('timeGroups.error.generic'));
            }

            setIsLoading(false);
        }, 350);
    }, [t]);

    const openCreate = () => {
        setEditingId(undefined);
        setFormOpen(true);
    };

    const openEdit = (group: TimeGroupRecord) => {
        setEditingId(group.id);
        setFormOpen(true);
    };

    const openDelete = (group: TimeGroupRecord) => setDeleteId(group.id);

    const handleSaved = () => setRecords(routingRepository.queryTimeGroups());

    const filtered = useMemo(() => {
        const needle = search.trim().toLowerCase();

        if (!needle) {
            return records;
        }

        return records.filter((group) => group.description.toLowerCase().includes(needle));
    }, [records, search]);

    return (
        <RoutingShell
            title={t('timeGroups.title')}
            subtitle={t('timeGroups.subtitle')}
            actions={
                <Button size="sm" className="gap-1.5 text-xs" onClick={openCreate}>
                    <RiAddLine className="size-4" />
                    {t('timeGroups.actions.addTimeGroup')}
                </Button>
            }
        >
            <div className="flex flex-col gap-[var(--flex-space-section)] w-full">
                {error ? (
                    <FlexErrorState
                        title={t('timeGroups.error.title')}
                        description={error}
                        action={
                            <Button variant="outline" size="sm" className="text-xs" onClick={refresh}>
                                {t('timeGroups.error.retry')}
                            </Button>
                        }
                    />
                ) : (
                    <FlexWorkbenchShell
                        variant="primary"
                        toolbar={
                            <RoutingWorkspaceToolbar
                                search={search}
                                onSearchChange={setSearch}
                                searchPlaceholder={t('timeGroups.toolbar.searchPlaceholder')}
                                searchAriaLabel={t('timeGroups.toolbar.searchAriaLabel')}
                                hasActiveFilters={Boolean(search)}
                                onClearFilters={() => setSearch('')}
                                clearLabel={t('timeGroups.empty.clearFilters')}
                            />
                        }
                    >
                        {isLoading ? (
                            <div className="flex flex-col gap-2 p-4">
                                {Array.from({ length: 3 }).map((_, index) => (
                                    <Skeleton key={index} className="h-12 w-full" />
                                ))}
                            </div>
                        ) : filtered.length === 0 ? (
                            <FlexEmptyState
                                title={records.length === 0 ? t('timeGroups.empty.noTimeGroupsTitle') : t('timeGroups.empty.noMatchTitle')}
                                description={records.length === 0 ? t('timeGroups.empty.noTimeGroupsDescription') : t('timeGroups.empty.noMatchDescription')}
                                action={records.length === 0 ? <Button variant="outline" size="sm" className="text-xs" onClick={openCreate}>{t('timeGroups.empty.addTimeGroup')}</Button> : undefined}
                            />
                        ) : (
                            <TimeGroupTable records={filtered} onEdit={openEdit} onDelete={openDelete} />
                        )}
                    </FlexWorkbenchShell>
                )}

                <p className="text-[10px] text-flex-text-muted">
                    {t('timeGroups.footerHint')}
                </p>
            </div>

            <TimeGroupFormSheet
                key={editingId ?? 'new'}
                open={formOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        setEditingId(undefined);
                    }

                    setFormOpen(open);
                }}
                editing={editingGroup}
                onSaved={handleSaved}
            />

            <TimeGroupDeleteDialog
                group={deleteGroup}
                onOpenChange={(open) => !open && setDeleteId(undefined)}
                onDeleted={handleSaved}
            />
        </RoutingShell>
    );
}
