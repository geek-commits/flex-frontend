import { Head } from '@inertiajs/react';
import {
    RiCustomerServiceLine,
    RiPhoneLine,
    RiTimeLine,
    RiShieldCheckLine,
    RiStackLine,
    RiRefreshLine,
    RiUserStarLine,
    RiLineChartLine,
} from '@remixicon/react';
import React, { useState } from 'react';
import { MetricCard, MetricGroup } from '@/components/flex/metric-card';
import { StatusBadge } from '@/components/flex/status-badge';
import { CallVolumeChart, QueueSlaChart } from '@/components/flex/trend-charts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AdminShell } from '@/layouts/admin-shell';
import type { AgentState } from '@/types/flex';

interface AgentRosterEntry {
    id: string;
    name: string;
    extension: string;
    queue: string;
    state: AgentState;
    callDuration?: string;
    callsToday: number;
    aht: string;
}

export default function ContactCenterDashboard() {
    const [, setRefreshed] = useState(0);

    const agentRoster: AgentRosterEntry[] = [
        { id: 'a1', name: 'John Doe', extension: '1001', queue: 'Customer Support', state: 'talking', callDuration: '02:14', callsToday: 18, aht: '03:22' },
        { id: 'a2', name: 'Sarah Smith', extension: '1002', queue: 'Sales & Inquiries', state: 'ready', callsToday: 12, aht: '02:45' },
        { id: 'a3', name: 'Michael Brown', extension: '1003', queue: 'Technical Escalations', state: 'wrap-up', callsToday: 9, aht: '06:10' },
        { id: 'a4', name: 'Amina Hassan', extension: '1004', queue: 'Customer Support', state: 'talking', callDuration: '05:31', callsToday: 22, aht: '03:55' },
        { id: 'a5', name: 'Peter Ndungu', extension: '1005', queue: 'Sales & Inquiries', state: 'ready', callsToday: 15, aht: '02:18' },
        { id: 'a6', name: 'Grace Mwanga', extension: '1006', queue: 'Customer Support', state: 'break', callsToday: 8, aht: '04:02' },
        { id: 'a7', name: 'David Kiprotich', extension: '1007', queue: 'Technical Escalations', state: 'not-ready', callsToday: 5, aht: '07:44' },
        { id: 'a8', name: 'Fatuma Ally', extension: '1008', queue: 'Customer Support', state: 'talking', callDuration: '00:48', callsToday: 20, aht: '03:11' },
    ];

    return (
        <AdminShell
            title="Contact Center Dashboard"
            subtitle="Real-Time Operational Analytics & Telephony Monitoring"
            actions={
                <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => setRefreshed((n) => n + 1)}>
                    <RiRefreshLine className="size-3.5" />
                    <span>Refresh Live Data</span>
                </Button>
            }
        >
            <Head title="Contact Center Dashboard — Flex Contact Center" />

            <div className="flex flex-col gap-6 w-full">
                {/* 1. Agent Activity Overview */}
                <div className="flex flex-col gap-2.5">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                            <RiCustomerServiceLine className="size-4 text-primary" />
                            <span>Agent Activity Overview</span>
                        </h2>
                        <span className="text-[11px] text-muted-foreground font-medium">
                            {agentRoster.length} Agents Logged In
                        </span>
                    </div>

                    <MetricGroup>
                        <MetricCard
                            title="Talking"
                            value={agentRoster.filter((a) => a.state === 'talking').length}
                            description="Agents on active call"
                            icon={RiCustomerServiceLine}
                            trend={{ value: '12%', positive: true }}
                        />
                        <MetricCard
                            title="Ready"
                            value={agentRoster.filter((a) => a.state === 'ready').length}
                            description="Available for incoming calls"
                            icon={RiCustomerServiceLine}
                        />
                        <MetricCard
                            title="Wrap Up"
                            value={agentRoster.filter((a) => a.state === 'wrap-up').length}
                            description="Completing post-call work"
                            icon={RiTimeLine}
                        />
                        <MetricCard
                            title="Not Ready / Break"
                            value={agentRoster.filter((a) => a.state === 'break' || a.state === 'not-ready').length}
                            description="On break or away"
                            icon={RiCustomerServiceLine}
                        />
                    </MetricGroup>
                </div>

                {/* 1b. Call Volume & Trends */}
                <Card className="bg-card border-border shadow-2xs">
                    <CardHeader className="p-4 pb-2 border-b border-border">
                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                                <RiLineChartLine className="size-4 text-primary" />
                                Call Volume — Last 14 Days
                            </span>
                            <span className="text-[11px] text-muted-foreground font-medium">Answered vs missed</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                        <CallVolumeChart />
                    </CardContent>
                </Card>

                {/* 2. Active Calls & SLA Performance */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Active Calls Breakdown */}
                    <Card className="bg-card border-border shadow-2xs">
                        <CardHeader className="p-4 pb-2 border-b border-border">
                            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                                <span className="flex items-center gap-1.5">
                                    <RiPhoneLine className="size-4 text-primary" />
                                    Active Calls & Traffic
                                </span>
                                <span className="text-xs font-semibold text-primary flex items-center gap-1">
                                    <span className="size-1.5 rounded-full bg-status-live inline-block" />
                                    Live
                                </span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 flex flex-col gap-3">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                <div className="p-3 rounded-lg bg-muted/40 border border-border flex flex-col">
                                    <span className="text-[10px] uppercase font-semibold text-muted-foreground">Incoming</span>
                                    <span className="text-lg font-bold text-foreground">18</span>
                                </div>
                                <div className="p-3 rounded-lg bg-muted/40 border border-border flex flex-col">
                                    <span className="text-[10px] uppercase font-semibold text-muted-foreground">Outgoing</span>
                                    <span className="text-lg font-bold text-foreground">6</span>
                                </div>
                                <div className="p-3 rounded-lg bg-muted/40 border border-border flex flex-col">
                                    <span className="text-[10px] uppercase font-semibold text-muted-foreground">Waiting</span>
                                    <span className="text-lg font-bold text-status-stale">3</span>
                                </div>
                                <div className="p-3 rounded-lg bg-muted/40 border border-border flex flex-col">
                                    <span className="text-[10px] uppercase font-semibold text-muted-foreground">Answered</span>
                                    <span className="text-lg font-bold text-status-live">15</span>
                                </div>
                            </div>

                            <div className="pt-2 flex items-center justify-between text-xs text-muted-foreground border-t border-border">
                                <span>Overall Answering Rate:</span>
                                <span className="font-bold text-foreground">91.4%</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* SLA Performance */}
                    <Card className="bg-card border-border shadow-2xs">
                        <CardHeader className="p-4 pb-2 border-b border-border">
                            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                                <span className="flex items-center gap-1.5">
                                    <RiShieldCheckLine className="size-4 text-status-live" />
                                    Service Level Agreement (SLA)
                                </span>
                                <span className="text-xs font-semibold text-status-live">Target: 90%</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 flex flex-col gap-3">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                <div className="p-3 rounded-lg bg-muted/40 border border-border flex flex-col">
                                    <span className="text-[10px] uppercase font-semibold text-muted-foreground">Within SLA</span>
                                    <span className="text-lg font-bold text-status-live">93.2%</span>
                                </div>
                                <div className="p-3 rounded-lg bg-muted/40 border border-border flex flex-col">
                                    <span className="text-[10px] uppercase font-semibold text-muted-foreground">Avg Wait</span>
                                    <span className="text-lg font-bold text-foreground">00:14</span>
                                </div>
                                <div className="p-3 rounded-lg bg-muted/40 border border-border flex flex-col">
                                    <span className="text-[10px] uppercase font-semibold text-muted-foreground">Avg Talk Time</span>
                                    <span className="text-lg font-bold text-foreground">03:45</span>
                                </div>
                                <div className="p-3 rounded-lg bg-muted/40 border border-border flex flex-col">
                                    <span className="text-[10px] uppercase font-semibold text-muted-foreground">Abandoned</span>
                                    <span className="text-lg font-bold text-status-disconnected">2</span>
                                </div>
                            </div>

                            <div className="pt-2 flex items-center justify-between text-xs text-muted-foreground border-t border-border">
                                <span>Caller Abandonment Rate:</span>
                                <span className="font-bold text-foreground">2.1%</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* 3. Inbound Queue Live Status */}
                <Card className="bg-card border-border shadow-2xs">
                    <CardHeader className="p-4 pb-2 border-b border-border">
                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                            <RiStackLine className="size-4 text-primary" />
                            Live Inbound Queues
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className="border-b border-border text-muted-foreground font-semibold uppercase text-[10px]">
                                    <th className="pb-2">Queue Name</th>
                                    <th className="pb-2">In Queue</th>
                                    <th className="pb-2">Longest Wait</th>
                                    <th className="pb-2">Agents Available</th>
                                    <th className="pb-2">Service Level</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                <tr className="hover:bg-muted/30">
                                    <td className="py-2.5 font-semibold text-foreground">Customer Support</td>
                                    <td className="py-2.5 font-bold text-status-stale">2</td>
                                    <td className="py-2.5 font-mono text-muted-foreground">00:32</td>
                                    <td className="py-2.5 text-foreground">4 / 6</td>
                                    <td className="py-2.5 font-bold text-status-live">94.5%</td>
                                </tr>
                                <tr className="hover:bg-muted/30">
                                    <td className="py-2.5 font-semibold text-foreground">Sales & Inquiries</td>
                                    <td className="py-2.5 font-bold text-foreground">0</td>
                                    <td className="py-2.5 font-mono text-muted-foreground">00:00</td>
                                    <td className="py-2.5 text-foreground">2 / 3</td>
                                    <td className="py-2.5 font-bold text-status-live">98.0%</td>
                                </tr>
                                <tr className="hover:bg-muted/30">
                                    <td className="py-2.5 font-semibold text-foreground">Technical Escalations</td>
                                    <td className="py-2.5 font-bold text-status-stale">1</td>
                                    <td className="py-2.5 font-mono text-muted-foreground">01:05</td>
                                    <td className="py-2.5 text-foreground">1 / 3</td>
                                    <td className="py-2.5 font-bold text-status-stale">86.2%</td>
                                </tr>
                            </tbody>
                        </table>
                    </CardContent>
                </Card>

                {/* 3b. Queue SLA Performance */}
                <Card className="bg-card border-border shadow-2xs">
                    <CardHeader className="p-4 pb-2 border-b border-border">
                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                                <RiShieldCheckLine className="size-4 text-status-live" />
                                Queue SLA Performance
                            </span>
                            <span className="text-[11px] text-muted-foreground font-medium">% within SLA</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                        <QueueSlaChart />
                    </CardContent>
                </Card>

                {/* 4. Live Agent Wallboard */}
                <Card className="bg-card border-border shadow-2xs">
                    <CardHeader className="p-4 pb-2 border-b border-border">
                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                                <RiUserStarLine className="size-4 text-primary" />
                                Live Agent Wallboard
                            </span>
                            <span className="flex items-center gap-1.5">
                                <RiLineChartLine className="size-3.5 text-status-live" />
                                <span className="text-[11px] text-status-live font-semibold">
                                    {agentRoster.reduce((s, a) => s + a.callsToday, 0)} calls today
                                </span>
                            </span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className="border-b border-border text-muted-foreground font-semibold uppercase text-[10px]">
                                    <th className="pb-2">Agent</th>
                                    <th className="pb-2">Ext.</th>
                                    <th className="pb-2">Queue</th>
                                    <th className="pb-2">State</th>
                                    <th className="pb-2">Call Duration</th>
                                    <th className="pb-2">Calls Today</th>
                                    <th className="pb-2">Avg Handle Time</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {agentRoster.map((agent) => (
                                    <tr key={agent.id} className="hover:bg-muted/30">
                                        <td className="py-2.5 font-semibold text-foreground">{agent.name}</td>
                                        <td className="py-2.5 font-mono text-muted-foreground">{agent.extension}</td>
                                        <td className="py-2.5 text-muted-foreground">{agent.queue}</td>
                                        <td className="py-2.5">
                                            <StatusBadge domain="agent" status={agent.state} />
                                        </td>
                                        <td className="py-2.5 font-mono text-foreground">
                                            {agent.callDuration ?? <span className="text-muted-foreground">—</span>}
                                        </td>
                                        <td className="py-2.5 font-bold text-foreground">{agent.callsToday}</td>
                                        <td className="py-2.5 font-mono text-muted-foreground">{agent.aht}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </div>
        </AdminShell>
    );
}
