import { RiAddLine, RiRefreshLine } from '@remixicon/react';
import React, { useCallback, useState } from 'react';
import { FlexEmptyState } from '@/components/flex/flex-empty-state';
import { FlexErrorState } from '@/components/flex/flex-error-state';
import { Button } from '@/components/ui/button';
import { accessRepository } from '@/domain/access-repository';
import { PermissionFormSheet } from '@/features/access-management/roles/permission-form-sheet';
import { PermissionsTable } from '@/features/access-management/roles/permissions-table';
import type { PermissionDefinition } from '@/features/access-management/shared/permission-catalog';

export function PermissionsTab() {
    const [records, setRecords] = useState<PermissionDefinition[]>(() => accessRepository.queryPermissions());
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>();
    const [formOpen, setFormOpen] = useState(false);

    const refresh = useCallback(() => {
        setIsLoading(true);
        setError(undefined);
        setTimeout(() => {
            try {
                setRecords(accessRepository.queryPermissions());
            } catch {
                setError('Permission data could not be retrieved.');
            }

            setIsLoading(false);
        }, 350);
    }, []);

    const handleSaved = () => {
        setRecords(accessRepository.queryPermissions());
    };

    return (
        <div className="flex flex-col gap-[var(--flex-space-section)] w-full">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-flex-text-muted">
                    Permission definitions that exist in this system, grouped by module.
                </p>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={refresh} disabled={isLoading}>
                        <RiRefreshLine className="size-3.5" />
                        <span>Refresh</span>
                    </Button>
                    <Button size="sm" className="gap-1.5 text-xs" onClick={() => setFormOpen(true)}>
                        <RiAddLine className="size-4" />
                        <span>Add Permission</span>
                    </Button>
                </div>
            </div>

            {error ? (
                <FlexErrorState
                    title="Couldn't load permissions"
                    description={error}
                    action={
                        <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={refresh}>
                            <RiRefreshLine className="size-3.5" />
                            Try again
                        </Button>
                    }
                />
            ) : (
                <PermissionsTable
                    records={records}
                    isLoading={isLoading}
                    emptyMessage={
                        <FlexEmptyState
                            title="No permissions yet"
                            description="Add your first permission definition."
                            action={
                                <Button variant="outline" size="sm" className="text-xs" onClick={() => setFormOpen(true)}>
                                    Add Permission
                                </Button>
                            }
                        />
                    }
                />
            )}

            <p className="text-[10px] text-flex-text-muted">
                POC mock adapter — `AccessRepository` boundary; replace with the real permissions backend in rollout.
            </p>

            <PermissionFormSheet open={formOpen} onOpenChange={setFormOpen} onSaved={handleSaved} />
        </div>
    );
}