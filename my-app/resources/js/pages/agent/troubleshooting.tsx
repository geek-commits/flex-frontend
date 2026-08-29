import { Head } from '@inertiajs/react';
import { RiMicLine, RiPulseLine, RiRefreshLine, RiVolumeUpLine, RiPhoneLine } from '@remixicon/react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DiagnosticPanel } from '@/components/flex/diagnostic-panel';
import { FlexStatus } from '@/components/flex/flex-status';
import type { FlexStatusTone } from '@/components/flex/flex-status';
import { FlexIcon } from '@/components/flex/iconography';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { DiagnosticResult } from '@/features/diagnostics/diagnostics-types';
import { useDiagnostics } from '@/features/diagnostics/use-diagnostics';
import { AgentShell } from '@/layouts/agent-shell';

const RESULT_TONE: Record<DiagnosticResult, FlexStatusTone> = {
    pass: 'success',
    warn: 'warning',
    fail: 'danger',
    pending: 'neutral',
};

const RESULT_KEY: Record<DiagnosticResult, string> = {
    pass: 'troubleshooting.resultPass',
    warn: 'troubleshooting.resultWarn',
    fail: 'troubleshooting.resultFail',
    pending: 'troubleshooting.notRun',
};

export default function TroubleshootingPage() {
    const { t } = useTranslation('agent');
    const { data, hasRun, runDiagnostics } = useDiagnostics();
    const [micDevice, setMicDevice] = useState('default');
    const [speakerDevice, setSpeakerDevice] = useState('default');
    const [isRunning, setIsRunning] = useState(false);

    const { checks } = data;

    const handleRunDiagnostic = () => {
        setIsRunning(true);
        setTimeout(() => {
            setIsRunning(false);
            runDiagnostics();
        }, 1500);
    };

    const passCount = checks.filter((d) => d.result === 'pass').length;
    const warnCount = checks.filter((d) => d.result === 'warn').length;
    const failCount = checks.filter((d) => d.result === 'fail').length;

    return (
        <AgentShell title={t('troubleshooting.title')}>
            <Head title={t('troubleshooting.headTitle')} />

            <div className="flex flex-col gap-6 w-full">
                <DiagnosticPanel />

                <Card className="bg-card border-border shadow-2xs">
                    <CardHeader className="p-4 pb-2 border-b border-border">
                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                            <RiMicLine className="size-4 text-primary" />
                            {t('troubleshooting.audioDeviceSelection')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-medium text-foreground">{t('troubleshooting.microphoneInput')}</label>
                                <Select value={micDevice} onValueChange={(value) => setMicDevice(value ?? 'default')}>
                                    <SelectTrigger className="h-9 text-xs" aria-label={t('troubleshooting.microphoneInput')}>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="default" className="text-xs">{t('troubleshooting.defaultMicrophone')}</SelectItem>
                                        <SelectItem value="headset" className="text-xs">{t('troubleshooting.usbHeadsetMic')}</SelectItem>
                                        <SelectItem value="builtin" className="text-xs">{t('troubleshooting.builtInMicrophone')}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-medium text-foreground">{t('troubleshooting.speakerOutput')}</label>
                                <Select value={speakerDevice} onValueChange={(value) => setSpeakerDevice(value ?? 'default')}>
                                    <SelectTrigger className="h-9 text-xs" aria-label={t('troubleshooting.speakerOutput')}>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="default" className="text-xs">{t('troubleshooting.defaultSpeakers')}</SelectItem>
                                        <SelectItem value="headset" className="text-xs">{t('troubleshooting.usbHeadsetSpeaker')}</SelectItem>
                                        <SelectItem value="builtin" className="text-xs">{t('troubleshooting.builtInSpeakers')}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-2">
                            <Button variant="outline" size="sm" className="gap-1.5 text-xs" aria-label={t('troubleshooting.playTestTone')}>
                                <RiVolumeUpLine className="size-3.5" />
                                <span>{t('troubleshooting.playTestTone')}</span>
                            </Button>
                            <span className="text-[11px] text-muted-foreground">{t('troubleshooting.verifySpeaker')}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-card border-border shadow-2xs">
                    <CardHeader className="p-4 pb-2 border-b border-border">
                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                                <RiPulseLine className="size-4 text-primary" />
                                {t('troubleshooting.fullDiagnosticSuite')}
                            </span>
                            <div className="flex items-center gap-2">
                                {hasRun && (
                                    <div className="flex items-center gap-2 text-[11px]">
                                        <span className="text-status-live font-semibold">{t('troubleshooting.pass', { count: passCount })}</span>
                                        {warnCount > 0 && <span className="text-status-stale font-semibold">{t('troubleshooting.warn', { count: warnCount })}</span>}
                                        {failCount > 0 && <span className="text-destructive font-semibold">{t('troubleshooting.fail', { count: failCount })}</span>}
                                    </div>
                                )}
                                <Button size="sm" variant="outline" className="gap-1.5 text-xs" onClick={handleRunDiagnostic} disabled={isRunning} aria-label={isRunning ? t('troubleshooting.running') : t('troubleshooting.runAllChecks')}>
                                    <RiRefreshLine className={`size-3.5 ${isRunning ? 'animate-spin' : ''}`} />
                                    <span>{isRunning ? t('troubleshooting.running') : t('troubleshooting.runAllChecks')}</span>
                                </Button>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                        <div className="flex flex-col divide-y divide-border">
                            {checks.map((check) => (
                                <div key={check.id} className="py-3 flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="p-1.5 rounded-md bg-muted/50 text-muted-foreground shrink-0">
                                            <FlexIcon name={check.icon} size="sm" />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="text-xs font-semibold text-foreground">{t(check.labelKey)}</div>
                                            <div className="text-[11px] text-muted-foreground">{t(check.descriptionKey)}</div>
                                            {hasRun && check.detail && (
                                                <div className="text-[10px] font-mono text-muted-foreground/70 mt-0.5">{check.detail}</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="shrink-0">
                                        {hasRun ? (
                                            <FlexStatus tone={RESULT_TONE[check.result]} className="capitalize text-[11px]">
                                                {t(RESULT_KEY[check.result])}
                                            </FlexStatus>
                                        ) : (
                                            <span className="text-[11px] text-muted-foreground italic">{t('troubleshooting.notRun')}</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-card border-border shadow-2xs">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between gap-4 text-xs">
                            <div>
                                <div className="font-semibold text-foreground">{t('troubleshooting.stillExperiencing')}</div>
                                <div className="text-muted-foreground mt-0.5">{t('troubleshooting.contactAdminDescription')}</div>
                            </div>
                            <Button size="sm" variant="outline" className="gap-1.5 text-xs shrink-0" aria-label={t('troubleshooting.contactSupport')}>
                                <RiPhoneLine className="size-3.5" />
                                <span>{t('troubleshooting.contactSupport')}</span>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AgentShell>
    );
}
