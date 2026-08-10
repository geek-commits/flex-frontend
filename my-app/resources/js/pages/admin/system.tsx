import { Head } from '@inertiajs/react';
import {
    RiDatabase2Line,
    RiShieldCheckLine,
    RiRouterLine,
    RiMailLine,
    RiSurveyLine,
    RiRefreshLine,
    RiCheckboxCircleLine,
    RiAlertLine,
    RiCloseCircleLine,
    RiServerLine,
    RiCpuLine,
    RiHardDriveLine,
    RiWifiLine,
} from '@remixicon/react';
import React from 'react';
import type { ContextSidebarGroup } from '@/components/flex/context-sidebar';
import { MetricCard, MetricGroup } from '@/components/flex/metric-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AdminShell } from '@/layouts/admin-shell';

type ServiceHealth = 'operational' | 'degraded' | 'down';

interface ServiceStatus {
    name: string;
    description: string;
    status: ServiceHealth;
    latencyMs?: number;
    lastChecked: string;
    icon: React.ComponentType<{ className?: string }>;
}

function HealthBadge({ status }: { status: ServiceHealth }) {
    const map: Record<ServiceHealth, { label: string; className: string; Icon: typeof RiCheckboxCircleLine }> = {
        operational: {
            label: 'Operational',
            className: 'bg-status-live-bg text-status-live border-status-live/30',
            Icon: RiCheckboxCircleLine,
        },
        degraded: {
            label: 'Degraded',
            className: 'bg-status-stale-bg text-status-stale border-status-stale/30',
            Icon: RiAlertLine,
        },
        down: {
            label: 'Down',
            className: 'bg-status-disconnected-bg text-status-disconnected border-status-disconnected/30',
            Icon: RiCloseCircleLine,
        },
    };

    const { label, className, Icon } = map[status];

    return (
        <Badge variant="outline" className={`flex items-center gap-1 capitalize text-[11px] ${className}`}>
            <Icon className="size-3" />
            {label}
        </Badge>
    );
}

const systemContextGroups: ContextSidebarGroup[] = [
    {
        groupTitle: 'Operations',
        items: [
            { title: 'System & Infrastructure', href: '/admin/system', icon: RiServerLine, capability: 'system.view' },
            { title: 'Reports & Analytics', href: '/admin/reports', icon: RiDatabase2Line, capability: 'reports.view' },
            { title: 'AI Center', href: '/admin/ai', icon: RiCpuLine, capability: 'ai.view' },
        ],
    },
    {
        groupTitle: 'Administration',
        items: [
            { title: 'Management Console', href: '/admin/console', icon: RiShieldCheckLine, capability: 'console.view' },
            { title: 'Call Records (CDR)', href: '/admin/cdr', icon: RiHardDriveLine, capability: 'cdr.view' },
            { title: 'Call Campaigns', href: '/admin/campaigns', icon: RiWifiLine, capability: 'campaigns.view' },
        ],
    },
    {
        groupTitle: 'Security',
        items: [{ title: 'Account Security', href: '/settings/security', icon: RiShieldCheckLine, capability: 'settings.manage' }],
    },
];

export default function SystemPage() {
    const services: ServiceStatus[] = [
        {
            name: 'Primary SIP Trunk — Airtel TZ',
            description: 'Inbound/outbound voice carrier registration',
            status: 'operational',
            latencyMs: 12,
            lastChecked: '30s ago',
            icon: RiRouterLine,
        },
        {
            name: 'Secondary SIP Trunk — TTCL',
            description: 'Failover carrier registration',
            status: 'operational',
            latencyMs: 18,
            lastChecked: '30s ago',
            icon: RiRouterLine,
        },
        {
            name: 'WebRTC Media Server',
            description: 'FreeSWITCH RTP / SRTP media relay',
            status: 'operational',
            latencyMs: 4,
            lastChecked: '30s ago',
            icon: RiWifiLine,
        },
        {
            name: 'Database — MySQL Primary',
            description: 'Read/write database server',
            status: 'operational',
            latencyMs: 2,
            lastChecked: '30s ago',
            icon: RiDatabase2Line,
        },
        {
            name: 'Database — MySQL Replica',
            description: 'Read replica for analytics queries',
            status: 'degraded',
            latencyMs: 145,
            lastChecked: '30s ago',
            icon: RiDatabase2Line,
        },
        {
            name: 'SSL / TLS Certificate',
            description: 'HTTPS & WebRTC certificate validity',
            status: 'operational',
            latencyMs: undefined,
            lastChecked: '5m ago',
            icon: RiShieldCheckLine,
        },
        {
            name: 'Mail Gateway (SMTP)',
            description: 'Postfix relay for notification delivery',
            status: 'operational',
            latencyMs: 35,
            lastChecked: '5m ago',
            icon: RiMailLine,
        },
        {
            name: 'Survey Monitoring Daemon',
            description: 'CSAT / NPS background dispatch worker',
            status: 'operational',
            latencyMs: undefined,
            lastChecked: '2m ago',
            icon: RiSurveyLine,
        },
    ];

    const operationalCount = services.filter((s) => s.status === 'operational').length;
    const degradedCount = services.filter((s) => s.status === 'degraded').length;
    const downCount = services.filter((s) => s.status === 'down').length;

    return (
        <AdminShell
            title="System & Infrastructure"
            subtitle="Platform Health, Backups, TLS Certificates & Gateway Connections"
            contextTitle="System"
            contextSubtitle="Infrastructure administration"
            contextGroups={systemContextGroups}
            actions={
                <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                    <RiRefreshLine className="size-3.5" />
                    <span>Refresh Status</span>
                </Button>
            }
        >
            <Head title="System & Infrastructure — Flex Contact Center" />

            <div className="flex flex-col gap-6 w-full">
                {/* 1. Infrastructure Health Overview */}
                <div className="flex flex-col gap-2.5">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <RiServerLine className="size-4 text-primary" />
                        <span>Infrastructure Health Overview</span>
                    </h2>
                    <MetricGroup>
                        <MetricCard
                            title="Operational"
                            value={operationalCount}
                            description="Services fully functional"
                            icon={RiCheckboxCircleLine}
                        />
                        <MetricCard
                            title="Degraded"
                            value={degradedCount}
                            description="Services with elevated latency"
                            icon={RiAlertLine}
                        />
                        <MetricCard
                            title="Down"
                            value={downCount}
                            description="Services unreachable"
                            icon={RiCloseCircleLine}
                        />
                        <MetricCard
                            title="Uptime (30d)"
                            value="99.8%"
                            description="Platform availability SLA"
                            icon={RiServerLine}
                        />
                    </MetricGroup>
                </div>

                {/* 2. Server Resources */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="bg-card border-border shadow-2xs">
                        <CardHeader className="p-4 pb-2 border-b border-border">
                            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                <RiCpuLine className="size-4 text-primary" />
                                Server Resources
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 flex flex-col gap-4">
                            {[
                                { label: 'CPU Usage', value: 34, unit: '%', color: 'bg-primary' },
                                { label: 'RAM Usage', value: 58, unit: '%', color: 'bg-primary' },
                                { label: 'Disk I/O', value: 22, unit: '%', color: 'bg-status-live' },
                                { label: 'Network Out', value: 41, unit: '%', color: 'bg-sky-500' },
                            ].map((r) => (
                                <div key={r.label} className="flex flex-col gap-1.5">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="font-medium text-foreground">{r.label}</span>
                                        <span className="font-bold text-muted-foreground">
                                            {r.value}
                                            {r.unit}
                                        </span>
                                    </div>
                                    <div className="h-1.5 rounded-full bg-muted/60 overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${r.color} transition-all`}
                                            style={{ width: `${r.value}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="bg-card border-border shadow-2xs">
                        <CardHeader className="p-4 pb-2 border-b border-border">
                            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                <RiHardDriveLine className="size-4 text-primary" />
                                Backup Status
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 flex flex-col gap-3">
                            {[
                                { label: 'Last Full Backup', value: 'Today 02:00 AM', ok: true },
                                { label: 'Last Incremental', value: 'Today 08:00 AM', ok: true },
                                { label: 'Backup Storage Used', value: '42.8 GB / 200 GB', ok: true },
                                { label: 'Retention Policy', value: '30 days rolling', ok: true },
                                { label: 'Offsite Replication', value: 'Enabled — Google Cloud Storage', ok: true },
                                { label: 'Last Restore Test', value: '2026-07-15 — PASSED', ok: true },
                            ].map((b) => (
                                <div key={b.label} className="flex items-center justify-between text-xs">
                                    <span className="text-muted-foreground">{b.label}</span>
                                    <span className={`font-semibold ${b.ok ? 'text-foreground' : 'text-destructive'}`}>
                                        {b.value}
                                    </span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* 3. Service Health Table */}
                <Card className="bg-card border-border shadow-2xs">
                    <CardHeader className="p-4 pb-2 border-b border-border">
                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                            <RiWifiLine className="size-4 text-primary" />
                            Service Health Matrix
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className="border-b border-border text-muted-foreground font-semibold uppercase text-[10px]">
                                    <th className="pb-2">Service</th>
                                    <th className="pb-2">Status</th>
                                    <th className="pb-2">Latency</th>
                                    <th className="pb-2">Last Checked</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {services.map((svc) => {
                                    const Icon = svc.icon;

                                    return (
                                        <tr key={svc.name} className="hover:bg-muted/30">
                                            <td className="py-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="p-1.5 rounded-md bg-muted/50 text-muted-foreground shrink-0">
                                                        <Icon className="size-3.5" />
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-foreground">{svc.name}</div>
                                                        <div className="text-[10px] text-muted-foreground">
                                                            {svc.description}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3">
                                                <HealthBadge status={svc.status} />
                                            </td>
                                            <td className="py-3 font-mono text-muted-foreground">
                                                {svc.latencyMs !== undefined ? `${svc.latencyMs}ms` : '—'}
                                            </td>
                                            <td className="py-3 text-muted-foreground">{svc.lastChecked}</td>
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
