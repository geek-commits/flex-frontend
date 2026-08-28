import { Head } from '@inertiajs/react';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useCapabilities } from '@/auth/capabilities';
import { scheduledReportsRepository } from '@/domain/scheduled-reports-repository';
import { ReportExportMenu } from '@/features/reports/report-export-menu';
import { ReportFilterBar } from '@/features/reports/report-filter-bar';
import { ReportLibrary } from '@/features/reports/report-library';
import { getReportById, REPORTS } from '@/features/reports/report-registry';
import type { ReportQuery } from '@/features/reports/report-types';
import { ReportViewer } from '@/features/reports/report-viewer';
import { DeleteScheduleDialog } from '@/features/reports/scheduled/delete-schedule-dialog';
import { ExecutionHistorySheet } from '@/features/reports/scheduled/execution-history-sheet';
import { ScheduleFormSheet } from '@/features/reports/scheduled/schedule-form-sheet';
import { ScheduledReportsPage } from '@/features/reports/scheduled/scheduled-reports-page';
import type { ScheduledReportRecord } from '@/features/reports/scheduled/scheduled-types';
import { ReportViewerContent } from '@/features/reports/viewers';
import { AdminShell } from '@/layouts/admin-shell';



const DEFAULT_QUERY: ReportQuery = {};

type ReportsView = 'library' | 'viewer' | 'scheduled';

export function ReportsPage() {
    const { t } = useTranslation('supervision');
    const { has } = useCapabilities();
    const [view, setView] = useState<ReportsView>('library');
    const [activeReportId, setActiveReportId] = useState<string>();
    const [query, setQuery] = useState<ReportQuery>(DEFAULT_QUERY);
    const [scheduledRecords, setScheduledRecords] = useState<ScheduledReportRecord[]>(() =>
        scheduledReportsRepository.querySchedules()
    );
    const [scheduleFormOpen, setScheduleFormOpen] = useState(false);
    const [editingScheduleId, setEditingScheduleId] = useState<string>();
    const [executionScheduleId, setExecutionScheduleId] = useState<string>();
    const [deleteScheduleId, setDeleteScheduleId] = useState<string>();

    const editingSchedule = editingScheduleId ? scheduledRecords.find((record) => record.id === editingScheduleId) : undefined;
    const executionSchedule = executionScheduleId ? scheduledRecords.find((record) => record.id === executionScheduleId) : undefined;
    const deleteSchedule = deleteScheduleId ? scheduledRecords.find((record) => record.id === deleteScheduleId) : undefined;

    const refreshSchedules = useCallback(() => {
        setScheduledRecords(scheduledReportsRepository.querySchedules());
    }, []);

    const openCreateSchedule = useCallback(() => {
        setEditingScheduleId(undefined);
        setScheduleFormOpen(true);
    }, []);

    const openEditSchedule = useCallback((schedule: ScheduledReportRecord) => {
        setEditingScheduleId(schedule.id);
        setScheduleFormOpen(true);
    }, []);

    const openExecutionHistory = useCallback((schedule: ScheduledReportRecord) => {
        setExecutionScheduleId(schedule.id);
    }, []);

    const openDeleteSchedule = useCallback((schedule: ScheduledReportRecord) => {
        setDeleteScheduleId(schedule.id);
    }, []);

    const retrySchedule = useCallback((schedule: ScheduledReportRecord) => {
        scheduledReportsRepository.retrySchedule(schedule.id);
        setScheduledRecords(scheduledReportsRepository.querySchedules());
        toast.success('Retry started');
    }, []);

    const permittedReports = useMemo(() => REPORTS.filter((report) => has(report.permission)), [has]);

    const activeReport = activeReportId ? getReportById(activeReportId) : undefined;

    const openLibrary = useCallback(() => {
        setView('library');
        setActiveReportId(undefined);
    }, []);

    const openScheduled = useCallback(() => {
        setScheduledRecords(scheduledReportsRepository.querySchedules());
        setView('scheduled');
    }, []);

    const openReport = useCallback((report: { id: string }) => {
        setActiveReportId(report.id);
        setView('viewer');
    }, []);

    return (
        <AdminShell
            title={t('reports.title')}
            subtitle={t('reports.subtitle')}
            
        >
            <Head title={t('reports.headTitle')} />

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
                    renderExport={(report) => <ReportExportMenu report={report} query={query} />}
                    renderResult={(run) => <ReportViewerContent run={run} report={activeReport} query={query} />}
                />
            )}

            {view === 'scheduled' && (
                <ScheduledReportsPage
                    records={scheduledRecords}
                    onBackToLibrary={openLibrary}
                    onCreate={openCreateSchedule}
                    onEdit={openEditSchedule}
                    onViewLogs={openExecutionHistory}
                    onRetry={retrySchedule}
                    onDelete={openDeleteSchedule}
                />
            )}

            <ExecutionHistorySheet
                schedule={executionSchedule}
                onOpenChange={(open) => !open && setExecutionScheduleId(undefined)}
            />

            <DeleteScheduleDialog
                schedule={deleteSchedule}
                onOpenChange={(open) => !open && setDeleteScheduleId(undefined)}
                onDeleted={refreshSchedules}
            />

            <ScheduleFormSheet
                key={editingScheduleId ?? 'new'}
                open={scheduleFormOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        setEditingScheduleId(undefined);
                    }

                    setScheduleFormOpen(open);
                }}
                editing={editingSchedule}
                onSaved={refreshSchedules}
            />
        </AdminShell>
    );
}
