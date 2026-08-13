import { Head } from '@inertiajs/react';
import React from 'react';
import { CONSOLE_MODULES } from '@/domain/modules';
import { ConsoleModuleDirectory } from '@/features/management-console/console-module-directory';
import { AdminShell } from '@/layouts/admin-shell';

export default function ManagementConsole() {
    return (
        <AdminShell
            title="Management Console"
            subtitle="Central administration for FLEX."
        >
            <Head title="Management Console — Flex Contact Center" />
            <ConsoleModuleDirectory modules={CONSOLE_MODULES} />
        </AdminShell>
    );
}