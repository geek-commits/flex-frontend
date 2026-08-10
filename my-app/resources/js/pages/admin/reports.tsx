import { Head } from '@inertiajs/react';
import {
    RiFilePdfLine,
    RiFileExcelLine,
    RiEyeLine,
    RiFileTextLine,
    RiCalendarLine,
    RiTimeLine,
    RiDownload2Line,
    RiCheckboxCircleLine,
    RiLoaderLine,
    RiHistoryLine,
} from '@remixicon/react';
import React, { useState } from 'react';
import { DateRangeSelect } from '@/components/flex/date-range-select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AdminShell } from '@/layouts/admin-shell';

export interface ReportItem {
    id: string;
    title: string;
    description: string;
    category: string;
    estimatedRows?: string;
}

interface ScheduledReport {
    id: string;
    title: string;
    schedule: string;
    format: 'PDF' | 'Excel';
    lastRun: string;
    status: 'completed' | 'running' | 'scheduled';
}

export default function ReportsPage() {
    const [dateFrom, setDateFrom] = useState<string | undefined>('2026-08-01');
    const [dateTo, setDateTo] = useState<string | undefined>('2026-08-07');

    const reportCatalog: ReportItem[] = [
        {
            id: 'rep-cc-perf',
            title: 'Contact Center Performance',
            description: 'Comprehensive operational summary of total calls, SLAs, queues, and handling times.',
            category: 'Operational Overview',
            estimatedRows: '~480 rows',
        },
        {
            id: 'rep-off-hours',
            title: 'Off Working Hours Call Log',
            description: 'Call attempts received outside official operational schedules.',
            category: 'Operational Overview',
            estimatedRows: '~34 rows',
        },
        {
            id: 'rep-agent-perf',
            title: 'Agent Performance Report',
            description: 'Individual agent statistics: answered count, AHT, wrap-up time, and idle duration.',
            category: 'Agent Analytics',
            estimatedRows: '~12 agents',
        },
        {
            id: 'rep-attendance',
            title: 'Agent Login & Attendance',
            description: 'Agent login/logout times, session duration, and break patterns.',
            category: 'Agent Analytics',
            estimatedRows: '~12 agents',
        },
        {
            id: 'rep-queue-logs',
            title: 'Queue Report & Logs',
            description: 'Inbound queue metrics, peak volume hours, hold times, and SLA compliance.',
            category: 'Queue Analytics',
            estimatedRows: '~3 queues',
        },
        {
            id: 'rep-ivr',
            title: 'IVR & Keypress Analytics',
            description: 'Customer navigation breakdown across IVR tree menus and options.',
            category: 'Customer Journey',
            estimatedRows: '~6 nodes',
        },
        {
            id: 'rep-outgoing',
            title: 'Outgoing Calls Summary',
            description: 'Agent outgoing call volumes, completion rates, and provider minute usage.',
            category: 'Telephony Usage',
            estimatedRows: '~210 rows',
        },
        {
            id: 'rep-recordings',
            title: 'Recordings & Audit Report',
            description: 'Archived audio file catalog, storage consumption, and retention audit.',
            category: 'Quality & Audit',
            estimatedRows: '~310 files',
        },
        {
            id: 'rep-yearly',
            title: 'Yearly Performance Trends',
            description: 'Multi-month trend analysis of volume growth, capacity planning, and SLA.',
            category: 'Executive Reports',
            estimatedRows: '12 months',
        },
    ];

    const scheduledReports: ScheduledReport[] = [
        {
            id: 'sched-1',
            title: 'Contact Center Performance — Daily',
            schedule: 'Every day at 08:00 AM',
            format: 'PDF',
            lastRun: 'Today 08:00 AM',
            status: 'completed',
        },
        {
            id: 'sched-2',
            title: 'Agent Performance Report — Weekly',
            schedule: 'Every Monday at 07:30 AM',
            format: 'Excel',
            lastRun: '2026-08-04 07:30 AM',
            status: 'completed',
        },
        {
            id: 'sched-3',
            title: 'Yearly Performance Trends — Monthly',
            schedule: '1st of every month at 09:00 AM',
            format: 'PDF',
            lastRun: 'Running now...',
            status: 'running',
        },
    ];

    const categories = Array.from(new Set(reportCatalog.map((r) => r.category)));

    const statusMap = {
        completed: { label: 'Completed', className: 'bg-status-live-bg text-status-live border-status-live/30', Icon: RiCheckboxCircleLine },
        running: { label: 'Running', className: 'bg-primary/10 text-primary border-primary/20', Icon: RiLoaderLine },
        scheduled: { label: 'Scheduled', className: 'bg-muted text-muted-foreground border-border', Icon: RiCalendarLine },
    };

    return (
        <AdminShell
            title="Reports & Analytics"
            subtitle="Operational Performance Catalog, PDF & Excel Export Engine"
        >
            <Head title="Reports Engine — Flex Contact Center" />

            <div className="flex flex-col gap-6 w-full">
                {/* Date Range Filter */}
                <Card className="bg-card border-border shadow-2xs">
                    <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground shrink-0">
                                <RiCalendarLine className="size-3.5" />
                                <span>Reporting Period</span>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <DateRangeSelect
                                    from={dateFrom}
                                    to={dateTo}
                                    onRangeChange={(from, to) => {
                                        setDateFrom(from);
                                        setDateTo(to);
                                    }}
                                />
                                <span className="text-[11px] text-muted-foreground hidden sm:block">
                                    (Applied to all exports)
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Report Catalog */}
                {categories.map((category) => {
                    const reports = reportCatalog.filter((r) => r.category === category);

                    return (
                        <div key={category} className="flex flex-col gap-3">
                            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                <RiFileTextLine className="size-3.5" />
                                {category}
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {reports.map((rep) => (
                                    <Card key={rep.id} className="bg-card border-border hover:border-primary/30 shadow-2xs transition-all group">
                                        <CardContent className="p-4 flex flex-col justify-between h-full gap-3">
                                            <div className="flex items-start gap-3">
                                                <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0 group-hover:bg-primary/15 transition-colors">
                                                    <RiFileTextLine className="size-5" />
                                                </div>
                                                <div className="flex flex-col flex-1 min-w-0">
                                                    <div className="flex items-center justify-between gap-2">
                                                        <h3 className="text-xs font-semibold text-foreground truncate">{rep.title}</h3>
                                                        {rep.estimatedRows && (
                                                            <span className="text-[10px] text-muted-foreground shrink-0">{rep.estimatedRows}</span>
                                                        )}
                                                    </div>
                                                    <p className="text-[11px] text-muted-foreground mt-0.5">{rep.description}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between gap-1.5 pt-2 border-t border-border">
                                                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                                    <RiTimeLine className="size-3" />
                                                    <span>{dateFrom} — {dateTo}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Button variant="ghost" size="xs" className="gap-1 text-[11px]">
                                                        <RiEyeLine className="size-3" />
                                                        <span>Preview</span>
                                                    </Button>
                                                    <Button variant="outline" size="xs" className="gap-1 text-[11px] text-rose-600 dark:text-rose-400">
                                                        <RiFilePdfLine className="size-3" />
                                                        <span>PDF</span>
                                                    </Button>
                                                    <Button variant="outline" size="xs" className="gap-1 text-[11px] text-emerald-600 dark:text-emerald-400">
                                                        <RiFileExcelLine className="size-3" />
                                                        <span>Excel</span>
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    );
                })}

                {/* Scheduled Reports */}
                <Card className="bg-card border-border shadow-2xs">
                    <CardHeader className="p-4 pb-2 border-b border-border">
                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                            <RiHistoryLine className="size-4 text-primary" />
                            Scheduled Report Jobs
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className="border-b border-border text-muted-foreground font-semibold uppercase text-[10px]">
                                    <th className="pb-2">Report</th>
                                    <th className="pb-2">Schedule</th>
                                    <th className="pb-2">Format</th>
                                    <th className="pb-2">Last Run</th>
                                    <th className="pb-2">Status</th>
                                    <th className="pb-2"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {scheduledReports.map((sched) => {
                                    const { label, className, Icon } = statusMap[sched.status];

                                    return (
                                        <tr key={sched.id} className="hover:bg-muted/30">
                                            <td className="py-3 font-semibold text-foreground">{sched.title}</td>
                                            <td className="py-3 text-muted-foreground">{sched.schedule}</td>
                                            <td className="py-3">
                                                <span className={`font-bold text-[11px] ${sched.format === 'PDF' ? 'text-rose-500' : 'text-emerald-600 dark:text-emerald-400'}`}>
                                                    {sched.format}
                                                </span>
                                            </td>
                                            <td className="py-3 font-mono text-muted-foreground">{sched.lastRun}</td>
                                            <td className="py-3">
                                                <Badge variant="outline" className={`flex items-center gap-1 w-fit text-[11px] ${className}`}>
                                                    <Icon className="size-3" />
                                                    {label}
                                                </Badge>
                                            </td>
                                            <td className="py-3">
                                                <Button variant="ghost" size="icon-xs" title="Download">
                                                    <RiDownload2Line className="size-3.5" />
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </div>
        </AdminShell>
    );
}
