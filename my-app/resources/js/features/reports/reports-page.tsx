import { Head } from '@inertiajs/react';
import React, { useCallback, useMemo, useState } from 'react';
import { useCapabilities } from '@/auth/capabilities';
import type { ContextSidebarGroup } from '@/components/flex/context-sidebar';
import { ReportLibrary } from '@/features/reports/report-library';
import { REPORTS } from '@/features/reports/report-registry';
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

type ReportsView = 'library' | 'scheduled';

export function ReportsPage() {
    const { has } = useCapabilities();
    const [view, setView] = useState<ReportsView>('library');

    const permittedReports = useMemo(() => REPORTS.filter((report) => has(report.permission)), [has]);

    const openScheduled = useCallback(() => setView('scheduled'), []);

    return (
        <AdminShell
            title="Reports & Analytics"
            subtitle="Operational and historical reporting across FLEX."
            contextTitle="Analytics & Reporting"
            contextSubtitle="Reports, charts & analytics"
            contextGroups={reportsContextGroups}
        >
            <Head title="Reports & Analytics — Flex Contact Center" />

            {view === 'library' ? (
                <ReportLibrary reports={permittedReports} onOpen={() => undefined} onOpenScheduled={openScheduled} />
            ) : (
                <p className="text-xs text-flex-text-muted">Scheduled Reports — coming in a later phase.</p>
            )}
        </AdminShell>
    );
}
