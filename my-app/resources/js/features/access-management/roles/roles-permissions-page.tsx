import { Head } from '@inertiajs/react';
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PermissionsTab } from '@/features/access-management/roles/permissions-tab';
import { RolesTab } from '@/features/access-management/roles/roles-tab';
import { AdminShell } from '@/layouts/admin-shell';



export function RolesPermissionsPage() {
    const [tab, setTab] = useState<'roles' | 'permissions'>('roles');

    return (
        <AdminShell
            title="Roles & Permissions"
            subtitle="Manage roles, permissions, and access for administrators."
            
        >
            <Head title="Roles & Permissions — Flex Contact Center" />

            <Tabs value={tab} onValueChange={(value) => setTab((value as 'roles' | 'permissions') ?? 'roles')}>
                <TabsList variant="line" className="mb-4">
                    <TabsTrigger value="roles">Roles</TabsTrigger>
                    <TabsTrigger value="permissions">Permissions</TabsTrigger>
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