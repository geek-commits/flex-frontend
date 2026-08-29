import { RiWifiLine, RiMicLine, RiSpeedUpLine, RiPulseLine } from '@remixicon/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface DiagnosticPanelProps {
    connectionHealth?: string;
    downlinkMbps?: number;
    rttMs?: number;
    micPermission?: 'granted' | 'denied' | 'prompt';
    jitterMs?: number;
    onRunDiagnostic?: () => void;
}

export function DiagnosticPanel({
    connectionHealth = 'Good',
    downlinkMbps = 45.2,
    rttMs = 28,
    micPermission = 'granted',
    jitterMs = 2.4,
    onRunDiagnostic,
}: DiagnosticPanelProps) {
    const { t } = useTranslation('agent');

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
            <Card className="bg-card border-border shadow-2xs">
                <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        {t('diagnostics.panel.networkStatus')}
                    </CardTitle>
                    <RiWifiLine className="size-4 text-status-live" />
                </CardHeader>
                <CardContent className="p-4 pt-0 flex flex-col gap-2">
                    <div className="flex items-baseline justify-between">
                        <span className="text-xl font-bold text-foreground">{connectionHealth}</span>
                        <span className="text-xs text-status-live font-semibold bg-status-live-bg px-2 py-0.5 rounded">
                            {t('diagnostics.panel.stable')}
                        </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border">
                        <span>{t('diagnostics.panel.rtt')}</span>
                        <span className="font-mono font-semibold text-foreground">{rttMs} ms</span>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-card border-border shadow-2xs">
                <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        {t('diagnostics.panel.bandwidthJitter')}
                    </CardTitle>
                    <RiSpeedUpLine className="size-4 text-primary" />
                </CardHeader>
                <CardContent className="p-4 pt-0 flex flex-col gap-2">
                    <div className="flex items-baseline justify-between">
                        <span className="text-xl font-bold text-foreground">{downlinkMbps} Mbps</span>
                        <span className="text-xs text-muted-foreground">{t('diagnostics.panel.downlink')}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border">
                        <span>{t('diagnostics.panel.audioJitter')}</span>
                        <span className="font-mono font-semibold text-foreground">{jitterMs} ms</span>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-card border-border shadow-2xs">
                <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        {t('diagnostics.panel.audioDevice')}
                    </CardTitle>
                    <RiMicLine className="size-4 text-primary" />
                </CardHeader>
                <CardContent className="p-4 pt-0 flex flex-col gap-2">
                    <div className="flex items-baseline justify-between">
                        <span className="text-sm font-bold text-foreground capitalize">
                            {t('diagnostics.panel.microphone')}: {micPermission}
                        </span>
                        <span className="size-2 rounded-full bg-status-live" />
                    </div>
                    <div className="pt-1 border-t border-border flex justify-end">
                        <Button variant="outline" size="sm" onClick={onRunDiagnostic} className="gap-1" aria-label={t('diagnostics.panel.runCheck')}>
                            <RiPulseLine className="size-3" />
                            <span>{t('diagnostics.panel.runCheck')}</span>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
