import { Head } from '@inertiajs/react';
import React from 'react';
import { AdminShell } from '@/layouts/admin-shell';

export default function UsersWorkspace() {
    return (
        <AdminShell
            title="Users"
            subtitle="Manage user accounts and access."
        >
            <Head title="Users — Flex Contact Center" />
        </AdminShell>
    );
}