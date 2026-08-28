import { Head } from '@inertiajs/react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PermissionsTab } from '@/features/access-management/roles/permissions-tab';
import { RolesTab } from '@/features/access-management/roles/roles-tab';
import { AdminShell } from '@/layouts/admin-shell';



export function RolesPermissionsPage() {
    const { t } = useTranslation('administration');
    const [tab, setTab] = useState<'roles' | 'permissions'>('roles');

    return (
        <AdminShell
            title={t('roles.title')}
            subtitle={t('roles.subtitle')}
            
        >
            <Head title={t('roles.headTitle')} />

            <Tabs value={tab} onValueChange={(value) => setTab((value as 'roles' | 'permissions') ?? 'roles')}>
                <TabsList variant="line" className="mb-4">
                    <TabsTrigger value="roles">{t('roles.tabs.roles')}</TabsTrigger>
                    <TabsTrigger value="permissions">{t('roles.tabs.permissions')}</TabsTrigger>
                </TabsList>

                <TabsContent value="roles">
                    <RolesTab />
                </TabsContent>
                <TabsContent value="permissions">
                    <PermissionsTab />
                </TabsContent>
            </Tabs>
        </AdminShell>
    );
}