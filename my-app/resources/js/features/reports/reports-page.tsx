import { Head } from '@inertiajs/react';
import React, { useCallback, useMemo, useState } from 'react';
import { useCapabilities } from '@/auth/capabilities';
import type { ContextSidebarGroup } from '@/components/flex/context-sidebar';
import { ReportFilterBar } from '@/features/reports/report-filter-bar';
import { ReportLibrary } from '@/features/reports/report-library';
import { getReportById, REPORTS } from '@/features/reports/report-registry';
import { ReportResults } from '@/features/reports/report-results';
import type { ReportQuery, ReportRun } from '@/features/reports/report-types';
import { ReportViewer } from '@/features/reports/report-viewer';
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

const DEFAULT_QUERY: ReportQuery = {};

type ReportsView = 'library' | 'viewer' | 'scheduled';

export function ReportsPage() {
    const { has } = useCapabilities();
    const [view, setView] = useState<ReportsView>('library');
    const [activeReportId, setActiveReportId] = useState<string>();
    const [query, setQuery] = useState<ReportQuery>(DEFAULT_QUERY);

    const permittedReports = useMemo(() => REPORTS.filter((report) => has(report.permission)), [has]);

    const activeReport = activeReportId ? getReportById(activeReportId) : undefined;

    const openLibrary = useCallback(() => {
        setView('library');
        setActiveReportId(undefined);
    }, []);

    const openScheduled = useCallback(() => setView('scheduled'), []);

    const openReport = useCallback((report: { id: string }) => {
        setActiveReportId(report.id);
        setView('viewer');
    }, []);

    return (
        <AdminShell
            title="Reports & Analytics"
            subtitle="Operational and historical reporting across FLEX."
            contextTitle="Analytics & Reporting"
            contextSubtitle="Reports, charts & analytics"
            contextGroups={reportsContextGroups}
        >
            <Head title="Reports & Analytics — Flex Contact Center" />

            {view === 'library' && (
                <ReportLibrary reports={permittedReports} onOpen={openReport} onOpenScheduled={openScheduled} />
            )}

            {view === 'viewer' && activeReport && (
                <ReportViewer
                    report={activeReport}
                    query={query}
                    onQueryChange={setQuery}
                    onBack={openLibrary}
                    renderFilters={(q, change) => <ReportFilterBar report={activeReport} query={q} onQueryChange={change} />}
                    renderResult={(run: ReportRun) => <ReportResults run={run} />}
                />
            )}

            {view === 'scheduled' && (
                <p className="text-xs text-flex-text-muted">Scheduled Reports — coming in a later phase.</p>
            )}
        </AdminShell>
    );
}
