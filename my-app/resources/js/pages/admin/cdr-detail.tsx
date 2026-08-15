import { Head, usePage } from '@inertiajs/react';
import { RiDownload2Line, RiPhoneLine, RiExportLine, RiPlayFill, RiPauseLine } from '@remixicon/react';
import React, { useState } from 'react';
import { BackLink } from '@/components/flex/back-link';
import type { ContextSidebarGroup } from '@/components/flex/context-sidebar';
import { FlexStatus  } from '@/components/flex/flex-status';
import type {FlexStatusTone} from '@/components/flex/flex-status';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getCallTimeline } from '@/data/cdr-events.mock';
import { cdrRepository } from '@/domain/cdr-repository';
import type { CDRRecord } from '@/domain/types';
import { AdminShell } from '@/layouts/admin-shell';
import { statusToneClasses } from '@/lib/status-styles';

const cdrContextGroups: ContextSidebarGroup[] = [
    {
        groupTitle: 'Telephony',
        items: [
            { title: 'Call Records (CDR)', href: '/admin/cdr', icon: 'call-records', capability: 'cdr.view' },
            { title: 'Call Campaigns', href: '/admin/campaigns', icon: 'campaigns', capability: 'campaigns.view' },
            { title: 'Reports & Analytics', href: '/admin/reports', icon: 'reports', capability: 'reports.view' },
        ],
    },
];

const STATUS_META: Record<CDRRecord['status'], { label: string; tone: FlexStatusTone }> = {
    answered: { label: 'Answered', tone: 'success' },
    missed: { label: 'Missed', tone: 'danger' },
    voicemail: { label: 'Voicemail', tone: 'warning' },
    transferred: { label: 'Transferred', tone: 'info' },
};

const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;

    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

export default function CdrDetailPage() {
    const recordId = (usePage().props as { record?: string }).record ?? '';
    const record = cdrRepository.getById(recordId);
    const [playing, setPlaying] = useState(false);

    const status = record ? STATUS_META[record.status] : undefined;

    return (
        <AdminShell
            title="Call Detail Record"
            subtitle={record ? record.id : 'Record not found'}
            contextTitle="Telephony"
            contextSubtitle="Call records & operations"
            contextGroups={cdrContextGroups}
            actions={
                <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                    <RiExportLine className="size-3.5" />
                    Export
                </Button>
            }
        >
            <Head title={`Call Detail ${recordId} — Flex Contact Center`} />

            <div className="flex flex-col gap-4 w-full">
                <BackLink href="/admin/cdr" label="Back to Call Records" />

                {!record ? (
                    <Card className="bg-card border-border shadow-2xs">
                        <CardContent className="p-8 text-center text-sm text-muted-foreground">
                            Call record <span className="font-mono">{recordId}</span> could not be found.
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        {/* Entity header */}
                        <Card className="bg-card border-border shadow-2xs">
                            <CardContent className="p-5 flex flex-col gap-5">
                                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                                    <div className="flex flex-col gap-1.5">
                                        <div className="flex items-center gap-2.5">
                                            <span className="text-2xl font-bold font-mono text-foreground tracking-tight">
                                                {record.customerPhone}
                                            </span>
                                            <FlexStatus tone={status?.tone ?? 'neutral'} className="capitalize">
                                                {status?.label ?? 'Unknown'}
                                            </FlexStatus>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            {record.date} · {record.queueName} · {record.agentName}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2 flex-wrap">
                                        <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                                            <RiDownload2Line className="size-3.5" />
                                            Download Recording
                                        </Button>
                                        <Button size="sm" className="gap-1.5 text-xs">
                                            <RiPhoneLine className="size-3.5" />
                                            Call Back
                                        </Button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    <div className="p-3 rounded-lg bg-muted/40 border border-border flex flex-col">
                                        <span className="text-[10px] uppercase font-semibold text-muted-foreground">Queue</span>
                                        <span className="text-sm font-semibold text-foreground truncate">{record.queueName}</span>
                                    </div>
                                    <div className="p-3 rounded-lg bg-muted/40 border border-border flex flex-col">
                                        <span className="text-[10px] uppercase font-semibold text-muted-foreground">Agent</span>
                                        <span className="text-sm font-semibold text-foreground truncate">{record.agentName}</span>
                                    </div>
                                    <div className="p-3 rounded-lg bg-muted/40 border border-border flex flex-col">
                                        <span className="text-[10px] uppercase font-semibold text-muted-foreground">Duration</span>
                                        <span className="text-sm font-semibold text-foreground font-mono">{formatDuration(record.durationSeconds)}</span>
                                    </div>
                                    <div className="p-3 rounded-lg bg-muted/40 border border-border flex flex-col">
                                        <span className="text-[10px] uppercase font-semibold text-muted-foreground">Recording</span>
                                        <span className="text-sm font-semibold text-foreground">{record.hasRecording ? 'Available' : 'None'}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recording player (mock) */}
                        {record.hasRecording && (
                            <Card className="bg-card border-border shadow-2xs">
                                <CardHeader className="p-4 pb-2 border-b border-border">
                                    <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                        Recording
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 flex items-center gap-3">
                                    <Button
                                        variant="outline"
                                        size="icon-sm"
                                        title={playing ? 'Pause' : 'Play'}
                                        onClick={() => setPlaying((p) => !p)}
                                    >
                                        {playing ? <RiPauseLine className="size-4" /> : <RiPlayFill className="size-4 text-primary" />}
                                    </Button>
                                    <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                                        <div className={`h-full bg-primary rounded-full transition-all ${playing ? 'w-2/3' : 'w-0'}`} />
                                    </div>
                                    <span className="font-mono text-xs text-muted-foreground">{formatDuration(record.durationSeconds)}</span>
                                </CardContent>
                            </Card>
                        )}

                        {/* Call timeline */}
                        <Card className="bg-card border-border shadow-2xs">
                            <CardHeader className="p-4 pb-2 border-b border-border">
                                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    Call Timeline
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 flex flex-col gap-0">
                                {getCallTimeline(record).map((event, index, all) => {
                                    const eventTone = statusToneClasses[event.tone];

                                    return (
                                        <div key={event.id} className="flex gap-3">
                                            <div className="flex flex-col items-center">
                                                <span className={`mt-1 size-2 rounded-full ${eventTone.dotClass}`} />
                                                {index < all.length - 1 && <span className="w-px flex-1 bg-border" />}
                                            </div>
                                            <div className={`pb-4 min-w-0 ${index === all.length - 1 ? 'pb-0' : ''}`}>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono text-[11px] text-muted-foreground">{event.at}</span>
                                                    <span className="text-xs font-semibold text-foreground">{event.title}</span>
                                                </div>
                                                {event.description && (
                                                    <p className="text-[11px] text-muted-foreground mt-0.5">{event.description}</p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </CardContent>
                        </Card>
                    </>
                )}
            </div>
        </AdminShell>
    );
}
