import { Head } from '@inertiajs/react';
import { RiEqualizerLine, RiFileSettingsLine, RiGroupLine, RiRouterLine, RiSettings3Line, RiShieldKeyholeLine, RiSurveyLine, RiUserStarLine } from '@remixicon/react';
import React from 'react';
import type { ContextSidebarGroup } from '@/components/flex/context-sidebar';
import { ModuleDirectory } from '@/components/flex/module-directory';
import type { ModuleItem } from '@/components/flex/module-directory';
import { SETTINGS_MODULES } from '@/domain/modules';
import { AdminShell } from '@/layouts/admin-shell';

const settingsContextGroups: ContextSidebarGroup[] = [
    {
        groupTitle: 'Account',
        items: [
            { title: 'Profile', href: '/settings/profile', icon: RiUserStarLine, capability: 'settings.manage' },
            { title: 'Security', href: '/settings/security', icon: RiShieldKeyholeLine, capability: 'settings.manage' },
            { title: 'Appearance', href: '/settings/appearance', icon: RiSettings3Line, capability: 'settings.manage' },
        ],
    },
    {
        groupTitle: 'Telephony Operations',
        items: [
            { title: 'Call Records (CDR)', href: '/admin/cdr', icon: RiFileSettingsLine, capability: 'cdr.view' },
            { title: 'Call Campaigns', href: '/admin/campaigns', icon: RiSurveyLine, capability: 'campaigns.view' },
            { title: 'Reports & Analytics', href: '/admin/reports', icon: RiEqualizerLine, capability: 'reports.view' },
        ],
    },
    {
        groupTitle: 'Platform',
        items: [
            { title: 'System & Infrastructure', href: '/admin/system', icon: RiRouterLine, capability: 'system.view' },
            { title: 'AI Center', href: '/admin/ai', icon: RiGroupLine, capability: 'ai.view' },
        ],
    },
];

export default function SettingsDirectoryPage() {
    const modules: ModuleItem[] = SETTINGS_MODULES;

    return (
        <AdminShell
            title="System Settings"
            subtitle="Configure Telephony Engine, Media, Security & Routing Parameters"
            contextTitle="Settings"
            contextSubtitle="Search & navigate settings"
            contextGroups={settingsContextGroups}
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
