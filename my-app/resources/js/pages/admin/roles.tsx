import { Head } from '@inertiajs/react';
import React from 'react';
import { AdminShell } from '@/layouts/admin-shell';

export default function RolesPermissionsWorkspace() {
    return (
        <AdminShell
            title="Roles & Permissions"
            subtitle="Manage roles, permissions, and access for administrators."
        >
            <Head title="Roles & Permissions — Flex Contact Center" />
        </AdminShell>
    );
}