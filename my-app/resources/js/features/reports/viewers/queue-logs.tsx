import { RiFilterOffLine } from '@remixicon/react';
import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { ReportRun, QueueEvent } from '@/features/reports/report-types';
import { QueueEventBadge } from '@/features/reports/viewers/queue-event-badge';

const EVENT_FILTERS: (QueueEvent | 'all')[] = ['all', 'ENTERQUEUE', 'CONNECT', 'ABANDON', 'COMPLETECALLER', 'TRANSFER'];

/**
 * Queue Logs — a technical/operational log workspace. High-density event table
 * with raw telephony event semantics preserved. No KPI cards as the primary
 * surface.
 */
export function QueueLogsViewer({ run }: { run: ReportRun }) {
    const data = run.data as { reportId: 'queue-logs'; rows: QueueLogRow[] };
    const [eventFilter, setEventFilter] = useState<QueueEvent | 'all'>('all');

    const agents = useMemo(() => Array.from(new Set(data.rows.map((row) => row.agent))).sort(), [data.rows]);
    const [agentFilter, setAgentFilter] = useState<string>('all');

    const filtered = data.rows.filter((row) => {
        const matchesEvent = eventFilter === 'all' || row.event === eventFilter;
        const matchesAgent = agentFilter === 'all' || row.agent === agentFilter;

        return matchesEvent && matchesAgent;
    });

    const hasFilters = eventFilter !== 'all' || agentFilter !== 'all';

    const clearFilters = () => {
        setEventFilter('all');
        setAgentFilter('all');
    };

    return (
        <div className="flex flex-col gap-[var(--flex-space-section)] w-full">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4 lg:flex-wrap">
                <div className="flex items-center gap-2">
                    <Label htmlFor="ql-event" className="text-xs font-semibold text-flex-text-muted">
                        Event
                    </Label>
                    <Select value={eventFilter} onValueChange={(value) => setEventFilter((value as QueueEvent | 'all') ?? 'all')}>
                        <SelectTrigger id="ql-event" className="w-44 h-9 text-xs">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {EVENT_FILTERS.map((event) => (
                                <SelectItem key={event} value={event} className="font-mono text-xs">
                                    {event === 'all' ? 'All events' : event}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center gap-2">
                    <Label htmlFor="ql-agent" className="text-xs font-semibold text-flex-text-muted">
                        Agent
                    </Label>
                    <Select value={agentFilter} onValueChange={(value) => setAgentFilter(value ?? 'all')}>
                        <SelectTrigger id="ql-agent" className="w-48 h-9 text-xs">
                            <SelectValue placeholder="All agents" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all" className="text-xs">
                                All agents
                            </SelectItem>
                            {agents.map((agent) => (
                                <SelectItem key={agent} value={agent} className="text-xs">
                                    {agent}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {hasFilters && (
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={clearFilters}>
                        <RiFilterOffLine className="size-3.5" />
                        Clear filters
                    </Button>
                )}
            </div>

            <div className="overflow-hidden rounded-lg border border-border bg-background">
                <div className="overflow-x-auto">
                    <table className="flex-table-grid w-full text-sm">
                        <thead>
                            <tr className="border-b border-border bg-muted/40 text-left">
                                {['Date', 'Agent', 'Customer', 'Queue', 'Event', 'Duration'].map((header) => (
                                    <th key={header} className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-flex-text-muted whitespace-nowrap">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((row, index) => (
                                <tr key={index} className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors">
                                    <td className="px-4 py-2.5 text-xs tabular-nums text-flex-text-muted whitespace-nowrap">{row.date}</td>
                                    <td className="px-4 py-2.5 text-xs text-flex-text-primary whitespace-nowrap">{row.agent}</td>
                                    <td className="px-4 py-2.5 font-mono text-xs text-flex-text-primary whitespace-nowrap">{row.customer}</td>
                                    <td className="px-4 py-2.5 text-xs text-flex-text-primary whitespace-nowrap">{row.queue}</td>
                                    <td className="px-4 py-2.5"><QueueEventBadge event={row.event} /></td>
                                    <td className="px-4 py-2.5 text-xs tabular-nums text-flex-text-primary whitespace-nowrap">{row.duration}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filtered.length === 0 && (
                    <p className="px-4 py-8 text-center text-xs text-flex-text-muted">
                        No log events match these filters.
                    </p>
                )}
            </div>
        </div>
    );
}

interface QueueLogRow {
    date: string;
    agent: string;
    customer: string;
    queue: string;
    event: QueueEvent;
    duration: string;
}
