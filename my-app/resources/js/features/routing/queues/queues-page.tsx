import { RiAddLine, RiSearchLine } from '@remixicon/react';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlexEmptyState } from '@/components/flex/flex-empty-state';
import { FlexErrorState } from '@/components/flex/flex-error-state';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { routingRepository } from '@/domain/routing-repository';
import type { QueueRecord, QueueStrategy } from '@/domain/routing-types';
import { QueueDeleteDialog } from '@/features/routing/queues/queue-delete-dialog';
import { QueueDetailSheet } from '@/features/routing/queues/queue-detail-sheet';
import { QueueFormSheet } from '@/features/routing/queues/queue-form-sheet';
import { QueueMembersSheet } from '@/features/routing/queues/queue-members-sheet';
import { QueueTable } from '@/features/routing/queues/queue-table';
import { RoutingShell } from '@/features/routing/routing-shell';

const STRATEGY_FILTERS: (QueueStrategy | 'all')[] = ['all', 'ring-all', 'least-recent', 'fewest-calls', 'random'];

export function QueuesPage() {
    const { t } = useTranslation('administration');
    const [records, setRecords] = useState<QueueRecord[]>(() => routingRepository.queryQueues());
    const [search, setSearch] = useState('');
    const [strategyFilter, setStrategyFilter] = useState<QueueStrategy | 'all'>('all');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>();
    const [detailId, setDetailId] = useState<string>();
    const [formOpen, setFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<string>();
    const [deleteId, setDeleteId] = useState<string>();
    const [membersQueueId, setMembersQueueId] = useState<string>();

    const detailQueue = detailId ? records.find((queue) => queue.id === detailId) : undefined;
    const editingQueue = editingId ? records.find((queue) => queue.id === editingId) : undefined;
    const deleteQueue = deleteId ? records.find((queue) => queue.id === deleteId) : undefined;
    const membersQueue = membersQueueId ? records.find((queue) => queue.id === membersQueueId) : undefined;

    const refresh = useCallback(() => {
        setIsLoading(true);
        setError(undefined);
        setTimeout(() => {
            try {
                setRecords(routingRepository.queryQueues());
            } catch {
                setError(t('queues.error.generic'));
            }

            setIsLoading(false);
        }, 350);
    }, [t]);

    const openCreate = () => {
        setEditingId(undefined);
        setFormOpen(true);
    };

    const openEdit = (queue: QueueRecord) => {
        setDetailId(undefined);
        setEditingId(queue.id);
        setFormOpen(true);
    };

    const openDetail = (queue: QueueRecord) => setDetailId(queue.id);
    const openDelete = (queue: QueueRecord) => setDeleteId(queue.id);
    const openMembers = (queue: QueueRecord) => {
        setDetailId(undefined);
        setMembersQueueId(queue.id);
    };

    const handleSaved = () => setRecords(routingRepository.queryQueues());

    const filtered = useMemo(() => {
        const needle = search.trim().toLowerCase();

        return records.filter((queue) => {
            const matchesSearch =
                !needle ||
                queue.name.toLowerCase().includes(needle) ||
                queue.extension.toLowerCase().includes(needle) ||
                queue.description.toLowerCase().includes(needle);
            const matchesStrategy = strategyFilter === 'all' || queue.strategy === strategyFilter;

            return matchesSearch && matchesStrategy;
        });
    }, [records, search, strategyFilter]);

    return (
        <RoutingShell
            title={t('queues.title')}
            subtitle={t('queues.subtitle')}
            actions={
                <Button size="sm" className="gap-1.5 text-xs" onClick={openCreate}>
                    <RiAddLine className="size-4" />
                    {t('queues.actions.addQueue')}
                </Button>
            }
        >
            <div className="flex flex-col gap-[var(--flex-space-section)] w-full">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:flex-wrap">
                    <div className="relative w-full lg:w-72">
                        <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-flex-text-muted" />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder={t('queues.toolbar.searchPlaceholder')}
                            aria-label={t('queues.toolbar.searchAriaLabel')}
                            className="pl-9 h-9 text-xs"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Label htmlFor="queue-strategy" className="text-xs font-semibold text-flex-text-muted">
                            {t('queues.toolbar.strategyLabel')}
                        </Label>
                        <Select value={strategyFilter} onValueChange={(value) => setStrategyFilter((value as QueueStrategy | 'all') ?? 'all')}>
                            <SelectTrigger id="queue-strategy" className="w-40 h-9 text-xs">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {STRATEGY_FILTERS.map((strategy) => (
                                    <SelectItem key={strategy} value={strategy} className="text-xs capitalize">
                                        {strategy === 'all' ? t('queues.toolbar.allStrategies') : t(`queues.toolbar.strategies.${strategy}`)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {error ? (
                    <FlexErrorState
                        title={t('queues.error.title')}
                        description={error}
                        action={
                            <Button variant="outline" size="sm" className="text-xs" onClick={refresh}>
                                {t('queues.error.retry')}
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
                        title={records.length === 0 ? t('queues.empty.noQueuesTitle') : t('queues.empty.noMatchTitle')}
                        description={
                            records.length === 0
                                ? t('queues.empty.noQueuesDescription')
                                : t('queues.empty.noMatchDescription')
                        }
                        illustration={records.length === 0 ? 'empty-queues' : undefined}
                        action={
                            records.length === 0 ? (
                                <Button variant="outline" size="sm" className="text-xs" onClick={openCreate}>
                                    {t('queues.empty.addQueue')}
                                </Button>
                            ) : (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-xs"
                                    onClick={() => {
                                        setSearch('');
                                        setStrategyFilter('all');
                                    }}
                                >
                                    {t('queues.empty.clearFilters')}
                                </Button>
                            )
                        }
                    />
                ) : (
                    <QueueTable
                        records={filtered}
                        onView={openDetail}
                        onEdit={openEdit}
                        onMembers={openMembers}
                    />
                )}

                <p className="text-[10px] text-flex-text-muted">
                    {t('queues.footerHint')}
                </p>
            </div>

            <QueueDetailSheet
                queue={detailQueue}
                onOpenChange={(open) => !open && setDetailId(undefined)}
                onEdit={openEdit}
                onMembers={openMembers}
                onDelete={openDelete}
            />

            <QueueMembersSheet
                queue={membersQueue}
                onOpenChange={(open) => !open && setMembersQueueId(undefined)}
                onChanged={handleSaved}
            />

            <QueueFormSheet
                key={editingId ?? 'new'}
                open={formOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        setEditingId(undefined);
                    }

                    setFormOpen(open);
                }}
                editing={editingQueue}
                onSaved={handleSaved}
            />

            <QueueDeleteDialog
                queue={deleteQueue}
                onOpenChange={(open) => !open && setDeleteId(undefined)}
                onDeleted={handleSaved}
            />
        </RoutingShell>
    );
}
