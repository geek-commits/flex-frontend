import { Head } from '@inertiajs/react';

import React from 'react';

import { ModuleDirectory } from '@/components/flex/module-directory';
import type { ModuleItem } from '@/components/flex/module-directory';
import { SETTINGS_MODULES } from '@/domain/modules';
import { AdminShell } from '@/layouts/admin-shell';



export default function SettingsDirectoryPage() {
    const modules: ModuleItem[] = SETTINGS_MODULES;

    return (
        <AdminShell
            title="System Settings"
            subtitle="Configure Telephony Engine, Media, Security & Routing Parameters"
            
        >
            <Head title="System Settings — Flex Contact Center" />
            <ModuleDirectory
                title="Settings Catalog"
                description="Manage all core contact center parameters."
                modules={modules}
            />
        </AdminShell>
    );
}
