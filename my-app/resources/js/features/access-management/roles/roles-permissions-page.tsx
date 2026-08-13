import { Head } from '@inertiajs/react';
import React, { useState } from 'react';
import type { ContextSidebarGroup } from '@/components/flex/context-sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PermissionsTab } from '@/features/access-management/roles/permissions-tab';
import { RolesTab } from '@/features/access-management/roles/roles-tab';
import { AdminShell } from '@/layouts/admin-shell';

const rolesContextGroups: ContextSidebarGroup[] = [
    {
        groupTitle: 'People & Access',
        items: [
            { title: 'Users', href: '/admin/users', capability: 'roles.manage' },
            { title: 'Roles & Permissions', href: '/admin/roles', capability: 'roles.manage' },
        ],
    },
    {
        groupTitle: 'Administration',
        items: [
            { title: 'Management Console', href: '/admin/console', capability: 'console.view' },
        ],
    },
];

export function RolesPermissionsPage() {
    const [tab, setTab] = useState<'roles' | 'permissions'>('roles');

    return (
        <AdminShell
            title="Roles & Permissions"
            subtitle="Manage roles, permissions, and access for administrators."
            contextTitle="People & Access"
            contextSubtitle="Users, roles & permissions"
            contextGroups={rolesContextGroups}
        >
            <Head title="Roles & Permissions — Flex Contact Center" />

            <Tabs value={tab} onValueChange={(value) => setTab((value as 'roles' | 'permissions') ?? 'roles')}>
                <TabsList className="mb-4">
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