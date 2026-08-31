import { Head, usePage } from '@inertiajs/react';
import { RiPauseLine, RiPlayFill } from '@remixicon/react';
import { motion, useReducedMotion } from 'motion/react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BackLink } from '@/components/flex/back-link';
import { FlexStatus } from '@/components/flex/flex-status';
import type { FlexStatusTone } from '@/components/flex/flex-status';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getCallTimeline } from '@/data/cdr-events.mock';
import { cdrRepository } from '@/domain/cdr-repository';
import type { CDRRecord } from '@/domain/types';
import { AdminShell } from '@/layouts/admin-shell';
import { statusToneClasses } from '@/lib/status-styles';

const STATUS_META: Record<CDRRecord['status'], { labelKey: 'cdr.status.answered' | 'cdr.status.missed' | 'cdr.status.voicemail' | 'cdr.status.transferred'; tone: FlexStatusTone }> = {
    answered: { labelKey: 'cdr.status.answered', tone: 'success' },
    missed: { labelKey: 'cdr.status.missed', tone: 'danger' },
    voicemail: { labelKey: 'cdr.status.voicemail', tone: 'warning' },
    transferred: { labelKey: 'cdr.status.transferred', tone: 'info' },
};

const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;

    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

export default function CdrDetailPage() {
    const { t } = useTranslation('supervision');
    const recordId = (usePage().props as { record?: string }).record ?? '';
    const record = cdrRepository.getById(recordId);
    const [playing, setPlaying] = useState(false);
    const reduced = useReducedMotion();

    const status = record ? STATUS_META[record.status] : undefined;

    return (
        <AdminShell title={t('cdr.page.title')} subtitle={record ? record.id : t('cdr.page.subtitleNotFound')} actions={undefined}>
            <Head title={t('cdr.page.headTitle', { id: recordId })} />

            <div className="flex flex-col gap-4 w-full">
                <BackLink href="/admin/cdr" label={t('cdr.page.back')} />

                {!record ? (
                    <Card className="bg-card border-border shadow-2xs">
                        <CardContent className="p-8 text-center text-sm text-muted-foreground">
                            {t('cdr.page.notFoundDetail', { id: recordId })}
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
                                            <span className="text-[length:var(--flex-font-size-page-title)] font-medium font-mono text-foreground tracking-tight">
                                                {record.customerPhone}
                                            </span>
                                            <FlexStatus tone={status?.tone ?? 'neutral'} className="capitalize">
                                                {status ? t(status.labelKey) : t('cdr.detail.notFound')}
                                            </FlexStatus>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            {record.date} · {record.queueName} · {record.agentName}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2 flex-wrap">
                                        {/* Download/Call Back actions hidden — no backend handler, retain truthful Recording tile */}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    <div className="p-3 rounded-lg bg-muted/40 border border-border flex flex-col">
                                        <span className="text-[10px] uppercase font-semibold text-muted-foreground">{t('cdr.detail.queue')}</span>
                                        <span className="text-sm font-semibold text-foreground truncate">{record.queueName}</span>
                                    </div>
                                    <div className="p-3 rounded-lg bg-muted/40 border border-border flex flex-col">
                                        <span className="text-[10px] uppercase font-semibold text-muted-foreground">{t('cdr.detail.agent')}</span>
                                        <span className="text-sm font-semibold text-foreground truncate">{record.agentName}</span>
                                    </div>
                                    <div className="p-3 rounded-lg bg-muted/40 border border-border flex flex-col">
                                        <span className="text-[10px] uppercase font-semibold text-muted-foreground">{t('cdr.detail.duration')}</span>
                                        <span className="text-sm font-semibold text-foreground font-mono">{formatDuration(record.durationSeconds)}</span>
                                    </div>
                                    <div className="p-3 rounded-lg bg-muted/40 border border-border flex flex-col">
                                        <span className="text-[10px] uppercase font-semibold text-muted-foreground">{t('cdr.detail.recording')}</span>
                                        <span className="text-sm font-semibold text-foreground">
                                            {record.hasRecording ? t('cdr.detail.recordingAvailable') : t('cdr.detail.recordingNone')}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recording player (mock) */}
                        {record.hasRecording && (
                            <Card className="bg-card border-border shadow-2xs">
                                <CardHeader className="p-4 pb-2 border-b border-border">
                                    <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                        {t('cdr.page.recordingTitle')}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 flex items-center gap-3">
                                    <Button
                                        variant="outline"
                                        size="icon-sm"
                                        title={t(playing ? 'cdr.detail.pause' : 'cdr.detail.play')}
                                        aria-label={t(playing ? 'cdr.detail.pause' : 'cdr.detail.play')}
                                        onClick={() => setPlaying((p) => !p)}
                                    >
                                        {playing ? (
                                            <motion.span key="pause" className="inline-flex" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: reduced ? 0 : 0.15, ease: 'easeOut' }}>
                                                <RiPauseLine className="size-4" />
                                            </motion.span>
                                        ) : (
                                            <motion.span key="play" className="inline-flex" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: reduced ? 0 : 0.15, ease: 'easeOut' }}>
                                                <RiPlayFill className="size-4 text-primary" />
                                            </motion.span>
                                        )}
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
                                    {t('cdr.page.timelineTitle')}
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
                                                    <span className="text-xs font-semibold text-foreground">{t(event.titleKey, event.titleParams)}</span>
                                                </div>
                                                {event.descriptionKey && (
                                                    <p className="text-[11px] text-muted-foreground mt-0.5">{t(event.descriptionKey, event.descriptionParams)}</p>
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
