import { Head } from '@inertiajs/react';
import React, { useState } from 'react';
import { useCapabilities } from '@/auth/capabilities';
import { CONSOLE_MODULES } from '@/domain/modules';
import { ConsoleModuleDirectory } from '@/features/management-console/console-module-directory';
import { ConsoleSearch } from '@/features/management-console/console-search';
import { filterModulesByPermission, useVisibleModules } from '@/features/management-console/use-visible-modules';
import { AdminShell } from '@/layouts/admin-shell';

export default function ManagementConsole() {
    const [query, setQuery] = useState('');
    const { has } = useCapabilities();
    const permittedModules = filterModulesByPermission(CONSOLE_MODULES, has);
    const visibleModules = useVisibleModules({ modules: CONSOLE_MODULES, query, has });

    return (
        <AdminShell
            title="Management Console"
            subtitle="Central administration for FLEX."
        >
            <Head title="Management Console — Flex Contact Center" />
            <div className="flex w-full flex-col gap-[var(--flex-space-section)]">
                <ConsoleSearch value={query} onChange={setQuery} />
                <ConsoleModuleDirectory modules={visibleModules} query={query} hasPermittedModules={permittedModules.length > 0} />
            </div>
        </AdminShell>
    );
}