import { Head } from '@inertiajs/react';
import React from 'react';
import type { ContextSidebarGroup } from '@/components/flex/context-sidebar';
import { AdminShell } from '@/layouts/admin-shell';

const reportsContextGroups: ContextSidebarGroup[] = [
    {
        groupTitle: 'Analytics & Reporting',
        items: [
            { title: 'Reports & Analytics', href: '/admin/reports', capability: 'reports.view' },
            { title: 'Call Statistics', href: '/admin/stats', capability: 'reports.view' },
            { title: 'Flex Charts', href: '/admin/charts', capability: 'reports.view' },
            { title: 'Survey Monitoring', href: '/admin/surveys', capability: 'reports.view' },
        ],
    },
    {
        groupTitle: 'Administration',
        items: [
            { title: 'Management Console', href: '/admin/console', capability: 'console.view' },
        ],
    },
];

export function ReportsPage() {
    return (
        <AdminShell
            title="Reports & Analytics"
            subtitle="Operational and historical reporting across FLEX."
            contextTitle="Analytics & Reporting"
            contextSubtitle="Reports, charts & analytics"
            contextGroups={reportsContextGroups}
        >
            <Head title="Reports & Analytics — Flex Contact Center" />
        </AdminShell>
    );
}
