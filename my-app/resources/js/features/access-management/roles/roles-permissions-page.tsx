import { Head } from '@inertiajs/react';
import React from 'react';
import type { ContextSidebarGroup } from '@/components/flex/context-sidebar';
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
    return (
        <AdminShell
            title="Roles & Permissions"
            subtitle="Manage roles, permissions, and access for administrators."
            contextTitle="People & Access"
            contextSubtitle="Users, roles & permissions"
            contextGroups={rolesContextGroups}
        >
            <Head title="Roles & Permissions — Flex Contact Center" />
        </AdminShell>
    );
}
