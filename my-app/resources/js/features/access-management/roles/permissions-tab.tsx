import { RiAddLine, RiRefreshLine } from '@remixicon/react';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlexEmptyState } from '@/components/flex/flex-empty-state';
import { FlexErrorState } from '@/components/flex/flex-error-state';
import { FlexWorkbenchShell } from '@/components/flex/flex-workbench-shell';
import { Button } from '@/components/ui/button';
import { accessRepository } from '@/domain/access-repository';
import { PermissionFormSheet } from '@/features/access-management/roles/permission-form-sheet';
import { PermissionsTable } from '@/features/access-management/roles/permissions-table';
import type { PermissionDefinition } from '@/features/access-management/shared/permission-catalog';

export function PermissionsTab() {
    const { t } = useTranslation('administration');
    const [records, setRecords] = useState<PermissionDefinition[]>(() => accessRepository.queryPermissions());
    const [isLoading, setIsLoading] = useState(false);
    type PermissionErrorKey = 'roles.permissions.error.generic';
    const [error, setError] = useState<PermissionErrorKey>();
    const [formOpen, setFormOpen] = useState(false);

    const refresh = useCallback(() => {
        setIsLoading(true);
        setError(undefined);
        setTimeout(() => {
            try {
                setRecords(accessRepository.queryPermissions());
            } catch {
                setError('roles.permissions.error.generic');
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
                <p className="text-xs text-flex-text-muted">{t('roles.permissions.description')}</p>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={refresh} disabled={isLoading}>
                        <RiRefreshLine className="size-3.5" />
                        <span>{t('roles.permissions.toolbar.refresh')}</span>
                    </Button>
                    <Button size="sm" className="gap-1.5 text-xs" onClick={() => setFormOpen(true)}>
                        <RiAddLine className="size-4" />
                        <span>{t('roles.permissions.toolbar.addPermission')}</span>
                    </Button>
                </div>
            </div>

            {error ? (
                <FlexErrorState
                    title={t('roles.error.permissionsTitle')}
                    description={t(error)}
                    action={
                        <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={refresh}>
                            <RiRefreshLine className="size-3.5" />
                            {t('roles.permissions.tryAgain')}
                        </Button>
                    }
                />
            ) : (
                <FlexWorkbenchShell>
                    <PermissionsTable
                        records={records}
                        isLoading={isLoading}
                        emptyMessage={
                            <FlexEmptyState
                                title={t('roles.permissions.empty.title')}
                                description={t('roles.permissions.empty.description')}
                                action={
                                    <Button variant="outline" size="sm" className="text-xs" onClick={() => setFormOpen(true)}>
                                        {t('roles.permissions.toolbar.addPermission')}
                                    </Button>
                                }
                            />
                        }
                    />
                </FlexWorkbenchShell>
            )}

            <p className="text-[10px] text-flex-text-muted">{t('roles.footerHint')}</p>

            <PermissionFormSheet open={formOpen} onOpenChange={setFormOpen} onSaved={handleSaved} />
        </div>
    );
}