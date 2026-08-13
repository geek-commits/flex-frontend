import { RiAddLine, RiSearchLine } from '@remixicon/react';
import React, { useCallback, useMemo, useState } from 'react';
import { FlexEmptyState } from '@/components/flex/flex-empty-state';
import { FlexErrorState } from '@/components/flex/flex-error-state';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { routingRepository } from '@/domain/routing-repository';
import type { IVRRecord } from '@/domain/routing-types';
import { IVRDeleteDialog } from '@/features/routing/ivr/ivr-delete-dialog';
import { IVRDetailSheet } from '@/features/routing/ivr/ivr-detail-sheet';
import { IVRFormSheet } from '@/features/routing/ivr/ivr-form-sheet';
import { IVRTable } from '@/features/routing/ivr/ivr-table';
import { RoutingShell } from '@/features/routing/routing-shell';

export function IVRPage() {
    const [records, setRecords] = useState<IVRRecord[]>(() => routingRepository.queryIVRs());
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>();
    const [detailId, setDetailId] = useState<string>();
    const [formOpen, setFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<string>();
    const [deleteId, setDeleteId] = useState<string>();

    const detailIVR = detailId ? records.find((ivr) => ivr.id === detailId) : undefined;
    const editingIVR = editingId ? records.find((ivr) => ivr.id === editingId) : undefined;
    const deleteIVR = deleteId ? records.find((ivr) => ivr.id === deleteId) : undefined;

    const refresh = useCallback(() => {
        setIsLoading(true);
        setError(undefined);
        setTimeout(() => {
            try {
                setRecords(routingRepository.queryIVRs());
            } catch {
                setError('IVR data could not be retrieved.');
            }

            setIsLoading(false);
        }, 350);
    }, []);

    const openCreate = () => {
        setEditingId(undefined);
        setFormOpen(true);
    };

    const openEdit = (ivr: IVRRecord) => {
        setDetailId(undefined);
        setEditingId(ivr.id);
        setFormOpen(true);
    };

    const openDetail = (ivr: IVRRecord) => setDetailId(ivr.id);
    const openDelete = (ivr: IVRRecord) => setDeleteId(ivr.id);

    const handleSaved = () => setRecords(routingRepository.queryIVRs());

    const filtered = useMemo(() => {
        const needle = search.trim().toLowerCase();

        if (!needle) {
            return records;
        }

        return records.filter(
            (ivr) => ivr.name.toLowerCase().includes(needle) || ivr.prompt.toLowerCase().includes(needle)
        );
    }, [records, search]);

    return (
        <RoutingShell
            title="IVR"
            subtitle="Configure interactive voice response menus."
            actions={
                <Button size="sm" className="gap-1.5 text-xs" onClick={openCreate}>
                    <RiAddLine className="size-4" />
                    Add IVR
                </Button>
            }
        >
            <div className="flex flex-col gap-[var(--flex-space-section)] w-full">
                <div className="relative w-full lg:w-72">
                    <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-flex-text-muted" />
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search IVR menus..."
                        aria-label="Search IVR menus"
                        className="pl-9 h-9 text-xs"
                    />
                </div>

                {error ? (
                    <FlexErrorState
                        title="Couldn't load IVR menus"
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
                        title={records.length === 0 ? 'No IVR menus configured' : 'No IVR menus match your search'}
                        description={
                            records.length === 0
                                ? 'Create an IVR menu to route callers by keypress.'
                                : 'Try changing your search.'
                        }
                        action={
                            records.length === 0 ? (
                                <Button variant="outline" size="sm" className="text-xs" onClick={openCreate}>
                                    Add IVR
                                </Button>
                            ) : undefined
                        }
                    />
                ) : (
                    <IVRTable records={filtered} onView={openDetail} onEdit={openEdit} />
                )}

                <p className="text-[10px] text-flex-text-muted">
                    POC mock adapter — `RoutingRepository` boundary; replace with the real routing backend in rollout.
                </p>
            </div>

            <IVRDetailSheet
                ivr={detailIVR}
                onOpenChange={(open) => !open && setDetailId(undefined)}
                onEdit={openEdit}
                onDelete={openDelete}
            />

            <IVRFormSheet
                key={editingId ?? 'new'}
                open={formOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        setEditingId(undefined);
                    }

                    setFormOpen(open);
                }}
                editing={editingIVR}
                onSaved={handleSaved}
            />

            <IVRDeleteDialog
                ivr={deleteIVR}
                onOpenChange={(open) => !open && setDeleteId(undefined)}
                onDeleted={handleSaved}
            />
        </RoutingShell>
    );
}
