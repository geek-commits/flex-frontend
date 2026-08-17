import { Head } from '@inertiajs/react';
import {
    RiMicLine,
    RiPulseLine,
    RiRefreshLine,
    RiVolumeUpLine,
    RiPhoneLine,
} from '@remixicon/react';
import React, { useState } from 'react';
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

export default function TroubleshootingPage() {
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
        <AgentShell
            title="Troubleshooting & Diagnostics"
            subtitle="Network Health, WebRTC Audio & Device Permissions"
        >
            <Head title="Troubleshooting — Flex Contact Center" />

            <div className="flex flex-col gap-6 w-full">
                {/* Live Metric Cards */}
                <DiagnosticPanel />

                {/* Device Selection */}
                <Card className="bg-card border-border shadow-2xs">
                    <CardHeader className="p-4 pb-2 border-b border-border">
                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                            <RiMicLine className="size-4 text-primary" />
                            Audio Device Selection
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-medium text-foreground">Microphone Input</label>
                                <Select value={micDevice} onValueChange={(value) => setMicDevice(value ?? 'default')}>
                                    <SelectTrigger className="h-9 text-xs">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="default" className="text-xs">Default Microphone</SelectItem>
                                        <SelectItem value="headset" className="text-xs">USB Headset Mic (Plantronics)</SelectItem>
                                        <SelectItem value="builtin" className="text-xs">Built-in Microphone</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-medium text-foreground">Speaker Output</label>
                                <Select value={speakerDevice} onValueChange={(value) => setSpeakerDevice(value ?? 'default')}>
                                    <SelectTrigger className="h-9 text-xs">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="default" className="text-xs">Default Speakers</SelectItem>
                                        <SelectItem value="headset" className="text-xs">USB Headset Speaker (Plantronics)</SelectItem>
                                        <SelectItem value="builtin" className="text-xs">Built-in Speakers</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-2">
                            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                                <RiVolumeUpLine className="size-3.5" />
                                <span>Play Test Tone</span>
                            </Button>
                            <span className="text-[11px] text-muted-foreground">Verify speaker output is audible</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Full Diagnostic Check Suite */}
                <Card className="bg-card border-border shadow-2xs">
                    <CardHeader className="p-4 pb-2 border-b border-border">
                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                                <RiPulseLine className="size-4 text-primary" />
                                Full Diagnostic Suite
                            </span>
                            <div className="flex items-center gap-2">
                                {hasRun && (
                                    <div className="flex items-center gap-2 text-[11px]">
                                        <span className="text-status-live font-semibold">{passCount} Pass</span>
                                        {warnCount > 0 && <span className="text-status-stale font-semibold">{warnCount} Warn</span>}
                                        {failCount > 0 && <span className="text-destructive font-semibold">{failCount} Fail</span>}
                                    </div>
                                )}
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="gap-1.5 text-xs"
                                    onClick={handleRunDiagnostic}
                                    disabled={isRunning}
                                >
                                    <RiRefreshLine className={`size-3.5 ${isRunning ? 'animate-spin' : ''}`} />
                                    <span>{isRunning ? 'Running...' : 'Run All Checks'}</span>
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
                                            <div className="text-xs font-semibold text-foreground">{check.label}</div>
                                            <div className="text-[11px] text-muted-foreground">{check.description}</div>
                                            {hasRun && check.detail && (
                                                <div className="text-[10px] font-mono text-muted-foreground/70 mt-0.5">{check.detail}</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="shrink-0">
                                        {hasRun ? (
                                            <FlexStatus tone={RESULT_TONE[check.result]} className="capitalize text-[11px]">
                                                {check.result}
                                            </FlexStatus>
                                        ) : (
                                            <span className="text-[11px] text-muted-foreground italic">Not run</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Escalation Help */}
                <Card className="bg-card border-border shadow-2xs">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between gap-4 text-xs">
                            <div>
                                <div className="font-semibold text-foreground">Still experiencing issues?</div>
                                <div className="text-muted-foreground mt-0.5">
                                    Contact your system administrator or submit a support ticket with the diagnostic report above.
                                </div>
                            </div>
                            <Button size="sm" variant="outline" className="gap-1.5 text-xs shrink-0">
                                <RiPhoneLine className="size-3.5" />
                                <span>Contact IT Support</span>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AgentShell>
    );
}