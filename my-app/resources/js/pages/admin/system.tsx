import { Head } from '@inertiajs/react';
import { RiRefreshLine } from '@remixicon/react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlexStatus } from '@/components/flex/flex-status';
import type { FlexStatusTone } from '@/components/flex/flex-status';
import { FlexIcon } from '@/components/flex/iconography';
import { MetricCard, MetricGroup } from '@/components/flex/metric-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ServiceHealth } from '@/features/system/system-types';
import { useSystem } from '@/features/system/use-system';
import { AdminShell } from '@/layouts/admin-shell';

const HEALTH_TONE: Record<ServiceHealth, FlexStatusTone> = {
    operational: 'success',
    degraded: 'warning',
    down: 'danger',
};

const RESOURCE_TONE: Record<string, string> = {
    primary: 'bg-primary',
    live: 'bg-status-live',
    sky: 'bg-sky-500',
};



export default function SystemPage() {
    const { t } = useTranslation('administration');
    const { data, refresh } = useSystem();
    const [refreshing, setRefreshing] = useState(false);
    const { services, serverResources, backups, summary } = data;

    const handleRefresh = () => {
        setRefreshing(true);
        refresh();
        // POC: refresh re-reads the current synthetic snapshot; a real backend
        // poll would replace this. Avoids a dead control while keeping honest
        // semantics for the no-op refresh.
        setTimeout(() => setRefreshing(false), 500);
    };

    return (
        <AdminShell
            title={t('system.title')}
            subtitle={t('system.subtitle')}
            
            actions={
                <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={handleRefresh}>
                    <RiRefreshLine className={`size-3.5 ${refreshing ? 'animate-spin' : ''}`} />
                    <span>{refreshing ? t('system.refreshing') : t('system.refresh')}</span>
                </Button>
            }
        >
            <Head title={t('system.headTitle')} />

            <div className="flex flex-col gap-6 w-full">
                {/* 1. Infrastructure Health Overview */}
                <div className="flex flex-col gap-2.5">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <FlexIcon name="infrastructure" className="text-primary" />
                        <span>{t('system.infrastructureHealth')}</span>
                    </h2>
                    <MetricGroup>
                        <MetricCard
                            title={t('system.metrics.operational')}
                            value={summary.operationalCount}
                            description={t('system.metrics.operationalDescription')}
                        />
                        <MetricCard
                            title={t('system.metrics.degraded')}
                            value={summary.degradedCount}
                            description={t('system.metrics.degradedDescription')}
                        />
                        <MetricCard
                            title={t('system.metrics.down')}
                            value={summary.downCount}
                            description={t('system.metrics.downDescription')}
                        />
                        <MetricCard
                            title={t('system.metrics.uptime')}
                            value={summary.uptime30d}
                            description={t('system.metrics.uptimeDescription')}
                        />
                    </MetricGroup>
                </div>

                {/* 2. Server Resources + Backup Status */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="bg-card border-border shadow-2xs">
                        <CardHeader className="p-4 pb-2 border-b border-border">
                            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                <FlexIcon name="server-resources" className="text-primary" />
                                {t('system.serverResources')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 flex flex-col gap-4">
                            {serverResources.map((r) => (
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
                                            className={`h-full rounded-full ${RESOURCE_TONE[r.tone]} transition-all`}
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
                                <FlexIcon name="backup-status" className="text-primary" />
                                {t('system.backupStatus')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 flex flex-col gap-3">
                            {backups.map((b) => (
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
                            <FlexIcon name="service-health" className="text-primary" />
                            {t('system.serviceHealthMatrix')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 overflow-x-auto">
                        <table className="flex-table-grid w-full text-left text-xs">
                            <thead>
                                <tr className="border-b border-border text-muted-foreground font-semibold uppercase text-[10px]">
                                    <th className="pb-2">{t('system.table.service')}</th>
                                    <th className="pb-2">{t('system.table.status')}</th>
                                    <th className="pb-2">{t('system.table.latency')}</th>
                                    <th className="pb-2">{t('system.table.lastChecked')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {services.map((svc) => {
                                    return (
                                        <tr key={svc.id} className="hover:bg-muted/30">
                                            <td className="py-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="p-1.5 rounded-md bg-muted/50 text-muted-foreground shrink-0">
                                                        <FlexIcon name={svc.icon} size="sm" />
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
                                                <FlexStatus tone={HEALTH_TONE[svc.status]} className="capitalize text-[11px]">
                                                    {svc.status}
                                                </FlexStatus>
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

                <p className="text-[10px] text-flex-text-muted">
                    {t('system.footer')}
                </p>
            </div>
        </AdminShell>
    );
}
