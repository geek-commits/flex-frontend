import { RiAddLine, RiRefreshLine } from '@remixicon/react';
import React, { useCallback, useState } from 'react';
import { FlexEmptyState } from '@/components/flex/flex-empty-state';
import { FlexErrorState } from '@/components/flex/flex-error-state';
import { Button } from '@/components/ui/button';
import { accessRepository } from '@/domain/access-repository';
import { RoleFormSheet } from '@/features/access-management/roles/role-form-sheet';
import { RolesTable } from '@/features/access-management/roles/roles-table';
import type { RoleRecord } from '@/features/access-management/shared/permission-catalog';

export function RolesTab() {
    const [records, setRecords] = useState<RoleRecord[]>(() => accessRepository.queryRoles());
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>();
    const [formOpen, setFormOpen] = useState(false);
    const [editing, setEditing] = useState<RoleRecord>();

    const refresh = useCallback(() => {
        setIsLoading(true);
        setError(undefined);
        setTimeout(() => {
            try {
                setRecords(accessRepository.queryRoles());
            } catch {
                setError('Role data could not be retrieved.');
            }

            setIsLoading(false);
        }, 350);
    }, []);

    const openAdd = () => {
        setEditing(undefined);
        setFormOpen(true);
    };

    const openEdit = (role: RoleRecord) => {
        setEditing(role);
        setFormOpen(true);
    };

    const handleSaved = () => {
        setRecords(accessRepository.queryRoles());
        setEditing(undefined);
    };

    return (
        <div className="flex flex-col gap-[var(--flex-space-section)] w-full">
            <div className="flex items-center justify-between gap-2">
                <p className="text-xs text-flex-text-muted">
                    Roles define the permissions granted to users within this tenant.
                </p>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={refresh} disabled={isLoading}>
                        <RiRefreshLine className="size-3.5" />
                        <span>Refresh</span>
                    </Button>
                    <Button size="sm" className="gap-1.5 text-xs" onClick={openAdd}>
                        <RiAddLine className="size-4" />
                        <span>Add Role</span>
                    </Button>
                </div>
            </div>

            {error ? (
                <FlexErrorState
                    title="Couldn't load roles"
                    description={error}
                    action={
                        <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={refresh}>
                            <RiRefreshLine className="size-3.5" />
                            Try again
                        </Button>
                    }
                />
            ) : (
                <RolesTable
                    records={records}
                    isLoading={isLoading}
                    onEdit={openEdit}
                    emptyMessage={
                        <FlexEmptyState
                            title="No roles yet"
                            description="Add your first role to define access for users."
                            action={
                                <Button variant="outline" size="sm" className="text-xs" onClick={openAdd}>
                                    Add Role
                                </Button>
                            }
                        />
                    }
                />
            )}

            <p className="text-[10px] text-flex-text-muted">
                POC mock adapter — `AccessRepository` boundary; replace with the real roles backend in rollout.
            </p>

            <RoleFormSheet
                key={editing?.id ?? 'new'}
                open={formOpen}
                onOpenChange={setFormOpen}
                editing={editing}
                onSaved={handleSaved}
            />
        </div>
    );
}