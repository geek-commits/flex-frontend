import React from 'react';
import { useTranslation } from 'react-i18next';
import { FlexEmptyState } from '@/components/flex/flex-empty-state';
import { StatusBadge } from '@/components/flex/status-badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Toggle } from '@/components/ui/toggle';
import { AiSubPage } from '@/features/ai/ai-sub-page';
import { useAiCenter } from '@/features/ai/use-ai-center';

export default function AiAssistPage() {
    const { t, i18n } = useTranslation('administration');
    const { data, setAssistEnabled } = useAiCenter();
    const { assistConfig } = data;
    const locale = i18n.language;

    return (
        <AiSubPage
            titleKey="ai.assist.title"
            subtitleKey="ai.assist.subtitle"
        >
            <div className="flex flex-col gap-6 w-full">
                <Card className="bg-card border-border shadow-2xs">
                    <CardHeader className="p-4 pb-2 border-b border-border">
                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            {t('ai.assist.enablementTitle')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 flex items-center justify-between gap-4">
                        <div className="flex flex-col gap-0.5">
                            <span className="text-sm font-semibold text-foreground">
                                {assistConfig.enabled ? t('ai.assist.enabled') : t('ai.assist.disabled')}
                            </span>
                            <span className="text-[11px] text-muted-foreground">{t('ai.assist.enablementDescription')}</span>
                        </div>
                        <Toggle
                            pressed={assistConfig.enabled}
                            onPressedChange={setAssistEnabled}
                            variant="outline"
                            aria-label={t('ai.assist.toggleAria')}
                        >
                            {assistConfig.enabled ? t('ai.assist.enabledLabel') : t('ai.assist.disabledLabel')}
                        </Toggle>
                    </CardContent>
                </Card>

                <Card className="bg-card border-border shadow-2xs">
                    <CardHeader className="p-4 pb-2 border-b border-border">
                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            {t('ai.assist.metricsTitle')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 grid grid-cols-2 gap-4">
                        <div className="p-3 rounded-lg bg-muted/40 border border-border flex flex-col">
                            <span className="text-[10px] uppercase font-semibold text-muted-foreground">
                                {t('ai.assist.metrics.status')}
                            </span>
                            <div className="mt-1">
                                <StatusBadge domain="ai" status={assistConfig.enabled ? 'enabled' : 'disabled'} />
                            </div>
                        </div>
                        <div className="p-3 rounded-lg bg-muted/40 border border-border flex flex-col">
                            <span className="text-[10px] uppercase font-semibold text-muted-foreground">
                                {t('ai.assist.metrics.adoptionRate')}
                            </span>
                            <span className="text-lg font-bold text-foreground">
                                {assistConfig.adoptionRate === null
                                    ? t('ai.assist.metrics.noData')
                                    : new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 0 }).format(
                                          assistConfig.adoptionRate / 100
                                      )}
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <FlexEmptyState
                    title={t('ai.assist.emptyTitle')}
                    description={t('ai.assist.emptyDescription')}
                    className="py-10"
                />
            </div>
        </AiSubPage>
    );
}
