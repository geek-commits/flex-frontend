import { Head } from '@inertiajs/react';
import React from 'react';
import { ModuleDirectory  } from '@/components/flex/module-directory';
import type {ModuleItem} from '@/components/flex/module-directory';
import { CONSOLE_MODULES } from '@/domain/modules';
import { AdminShell } from '@/layouts/admin-shell';

export default function ManagementConsole() {
    const modules: ModuleItem[] = CONSOLE_MODULES;

    return (
        <AdminShell
            title="Management Console"
            subtitle="Central Directory for Contact Center Administration"
        >
            <Head title="Management Console — Flex Contact Center" />
            <ModuleDirectory
                title="Application Modules"
                description="Access operational tools, telephony routing, reporting, and settings."
                modules={modules}
            />
        </AdminShell>
    );
}
