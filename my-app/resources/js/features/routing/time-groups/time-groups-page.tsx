import { RiAddLine, RiSearchLine } from '@remixicon/react';
import React, { useCallback, useMemo, useState } from 'react';
import { FlexEmptyState } from '@/components/flex/flex-empty-state';
import { FlexErrorState } from '@/components/flex/flex-error-state';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { routingRepository } from '@/domain/routing-repository';
import type { TimeGroupRecord } from '@/domain/routing-types';
import { RoutingShell } from '@/features/routing/routing-shell';
import { TimeGroupDeleteDialog } from '@/features/routing/time-groups/time-group-delete-dialog';
import { TimeGroupFormSheet } from '@/features/routing/time-groups/time-group-form-sheet';
import { TimeGroupTable } from '@/features/routing/time-groups/time-group-table';

export function TimeGroupsPage() {
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
                setError('Time Group data could not be retrieved.');
            }

            setIsLoading(false);
        }, 350);
    }, []);

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
            title="Time Groups"
            subtitle="Define reusable schedules for time-based routing."
            actions={
                <Button size="sm" className="gap-1.5 text-xs" onClick={openCreate}>
                    <RiAddLine className="size-4" />
                    Add Time Group
                </Button>
            }
        >
            <div className="flex flex-col gap-[var(--flex-space-section)] w-full">
                <div className="relative w-full lg:w-72">
                    <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-flex-text-muted" />
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search time groups..."
                        aria-label="Search time groups"
                        className="pl-9 h-9 text-xs"
                    />
                </div>

                {error ? (
                    <FlexErrorState
                        title="Couldn't load time groups"
                        description={error}
                        action={
                            <Button variant="outline" size="sm" className="text-xs" onClick={refresh}>
                                Try Again
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
                        title={records.length === 0 ? 'No time groups configured' : 'No time groups match your search'}
                        description={
                            records.length === 0
                                ? 'Create a reusable schedule for time-based routing.'
                                : 'Try changing your search.'
                        }
                        action={
                            records.length === 0 ? (
                                <Button variant="outline" size="sm" className="text-xs" onClick={openCreate}>
                                    Add Time Group
                                </Button>
                            ) : undefined
                        }
                    />
                ) : (
                    <TimeGroupTable records={filtered} onEdit={openEdit} onDelete={openDelete} />
                )}

                <p className="text-[10px] text-flex-text-muted">
                    POC mock adapter — `RoutingRepository` boundary; replace with the real routing backend in rollout.
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
