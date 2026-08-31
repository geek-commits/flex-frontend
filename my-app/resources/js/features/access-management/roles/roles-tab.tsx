import { RiAddLine, RiRefreshLine } from '@remixicon/react';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlexEmptyState } from '@/components/flex/flex-empty-state';
import { FlexErrorState } from '@/components/flex/flex-error-state';
import { FlexWorkbenchShell } from '@/components/flex/flex-workbench-shell';
import { Button } from '@/components/ui/button';
import { accessRepository } from '@/domain/access-repository';
import { RoleFormSheet } from '@/features/access-management/roles/role-form-sheet';
import { RolesTable } from '@/features/access-management/roles/roles-table';
import type { RoleRecord } from '@/features/access-management/shared/permission-catalog';

export function RolesTab() {
    const { t } = useTranslation('administration');
    const [records, setRecords] = useState<RoleRecord[]>(() => accessRepository.queryRoles());
    const [isLoading, setIsLoading] = useState(false);
    type RoleErrorKey = 'roles.error.generic';
    const [error, setError] = useState<RoleErrorKey>();

    const refresh = useCallback(() => {
        setIsLoading(true);
        setError(undefined);
        setTimeout(() => {
            try {
                setRecords(accessRepository.queryRoles());
            } catch {
                setError('roles.error.generic');
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

    const [formOpen, setFormOpen] = useState(false);
    const [editing, setEditing] = useState<RoleRecord>();

    const handleSaved = () => {
        setRecords(accessRepository.queryRoles());
        setEditing(undefined);
    };

    return (
        <div className="flex flex-col gap-[var(--flex-space-section)] w-full">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-flex-text-muted">{t('roles.description')}</p>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={refresh} disabled={isLoading}>
                        <RiRefreshLine className="size-3.5" />
                        <span>{t('roles.refresh')}</span>
                    </Button>
                    <Button size="sm" className="gap-1.5 text-xs" onClick={openAdd}>
                        <RiAddLine className="size-4" />
                        <span>{t('roles.addRole')}</span>
                    </Button>
                </div>
            </div>

            {error ? (
                <FlexErrorState
                    title={t('roles.error.rolesTitle')}
                    description={t(error)}
                    action={
                        <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={refresh}>
                            <RiRefreshLine className="size-3.5" />
                            {t('roles.tryAgain')}
                        </Button>
                    }
                />
            ) : (
                <FlexWorkbenchShell>
                    <RolesTable
                        records={records}
                        isLoading={isLoading}
                        onEdit={openEdit}
                        emptyMessage={
                            <FlexEmptyState
                                title={t('roles.empty.noRolesTitle')}
                                description={t('roles.empty.noRolesDescription')}
                                action={
                                    <Button variant="outline" size="sm" className="text-xs" onClick={openAdd}>
                                        {t('roles.empty.addRole')}
                                    </Button>
                                }
                            />
                        }
                    />
                </FlexWorkbenchShell>
            )}

            <p className="text-[10px] text-flex-text-muted">{t('roles.footerHint')}</p>

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
