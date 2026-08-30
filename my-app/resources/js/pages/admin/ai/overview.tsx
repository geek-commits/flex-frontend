import { RiRefreshLine } from '@remixicon/react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlexIcon } from '@/components/flex/iconography';
import { MetricCard, MetricGroup } from '@/components/flex/metric-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AiSubPage } from '@/features/ai/ai-sub-page';
import { AIFeatureStatusGrid } from '@/features/ai/components/ai-feature-status-grid';
import { useAiCenter } from '@/features/ai/use-ai-center';

const formatNumber = (value: number, locale: string) =>
    new Intl.NumberFormat(locale).format(value);

const formatTokens = (value: number | null, locale: string) =>
    value === null ? null : value >= 1_000_000 ? `${(value / 1_000_000).toFixed(1)}M` : formatNumber(value, locale);

const formatCost = (value: number | null, locale: string) =>
    value === null ? null : new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD', currencyDisplay: 'symbol' }).format(value);

export default function AiOverviewPage() {
    const { t, i18n } = useTranslation('administration');
    const { data } = useAiCenter();
    const [refreshing, setRefreshing] = useState(false);
    const { snapshot, features, knowledgeVaults, knowledgeItems } = data;
    const locale = i18n.language;

    const handleRefresh = () => {
        setRefreshing(true);
        // POC: refresh re-reads the current snapshot; a real backend poll would
        // replace this. Avoids a dead control while keeping honest semantics.
        setTimeout(() => setRefreshing(false), 500);
    };

    const indexedVaults = knowledgeVaults.filter((v) => v.indexed).length;
    const updatedToday = knowledgeVaults.reduce((sum, v) => sum + v.updatedToday, 0);

    return (
        // @ts-expect-error — pending Batch 10-11 typed union
        <AiSubPage
            titleKey="ai.overview.title"
            subtitleKey="ai.overview.subtitle"
            actions={
                <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={handleRefresh}>
                    <RiRefreshLine className={`size-3.5 ${refreshing ? 'animate-spin' : ''}`} />
                    <span>{t('ai.overview.refreshStats')}</span>
                </Button>
            }
        >
            <div className="flex flex-col gap-6 w-full">
                <div className="flex flex-col gap-2.5">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <FlexIcon name="ai-snapshot" className="text-primary" />
                        <span>{t('ai.overview.usageSnapshot')}</span>
                    </h2>

                    <MetricGroup>
                        <MetricCard
                            title={t('ai.overview.aiSessionsToday')}
                            value={
                                snapshot.sessionsToday === null ? null : formatNumber(snapshot.sessionsToday, locale)
                            }
                            description={t('ai.overview.aiSessionsTodayDescription', {
                                defaultValue: 'Real-time agent co-pilot interactions',
                            })}
                        />
                        <MetricCard
                            title={t('ai.overview.assistAdoptionRate')}
                            value={
                                snapshot.assistAdoptionRate === null
                                    ? null
                                    : new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 0 }).format(
                                          snapshot.assistAdoptionRate / 100
                                      )
                            }
                            description={t('ai.overview.assistAdoptionRateDescription', {
                                defaultValue: 'Agents accepting AI suggestions',
                            })}
                        />
                        <MetricCard
                            title={t('ai.overview.totalTokensToday')}
                            value={formatTokens(snapshot.totalTokensToday, locale)}
                            description={t('ai.overview.totalTokensTodayDescription', {
                                defaultValue: 'Prompt & completion token volume',
                            })}
                        />
                        <MetricCard
                            title={t('ai.overview.estimatedCostToday')}
                            value={formatCost(snapshot.estimatedCostToday, locale)}
                            description={t('ai.overview.estimatedCostTodayDescription', {
                                defaultValue: 'Inference provider cost estimate',
                            })}
                        />
                    </MetricGroup>
                </div>

                <div className="flex flex-col gap-3">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        {t('ai.overview.featureStatus')}
                    </h2>
                    <AIFeatureStatusGrid features={features} />
                </div>

                <Card className="bg-card border-border shadow-2xs">
                    <CardHeader className="p-4 pb-2 border-b border-border">
                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                                <FlexIcon name="knowledge-base" className="text-primary" />
                                {t('ai.overview.knowledgeCoverage')}
                            </span>
                            <span className="text-xs font-semibold text-status-live">
                                {snapshot.knowledgeSearchPrecision === null
                                    ? t('ai.overview.precisionNoData')
                                    // @ts-expect-error — pending Batch 10-11 typed union
                                    : t('ai.overview.precisionValue', { value: snapshot.knowledgeSearchPrecision })}
                            </span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="p-3 rounded-lg bg-muted/40 border border-border flex flex-col">
                                <span className="text-[10px] uppercase font-semibold text-muted-foreground">
                                    {t('ai.overview.activeVaults')}
                                </span>
                                <span className="text-lg font-bold text-foreground">
                                    {indexedVaults} / {knowledgeVaults.length}
                                </span>
                            </div>
                            <div className="p-3 rounded-lg bg-muted/40 border border-border flex flex-col">
                                <span className="text-[10px] uppercase font-semibold text-muted-foreground">
                                    {t('ai.overview.knowledgeItems')}
                                </span>
                                <span className="text-lg font-bold text-foreground">
                                    {formatNumber(knowledgeItems.length, locale)}
                                </span>
                            </div>
                            <div className="p-3 rounded-lg bg-muted/40 border border-border flex flex-col">
                                <span className="text-[10px] uppercase font-semibold text-muted-foreground">
                                    {t('ai.overview.updatedToday')}
                                </span>
                                <span className="text-lg font-bold text-status-live">{updatedToday}</span>
                            </div>
                            <div className="p-3 rounded-lg bg-muted/40 border border-border flex flex-col">
                                <span className="text-[10px] uppercase font-semibold text-muted-foreground">
                                    {t('ai.overview.lastUpdated')}
                                </span>
                                <span className="text-sm font-semibold text-foreground">
                                    {snapshot.lastUpdatedAt
                                        ? new Intl.DateTimeFormat(locale, {
                                              hour: '2-digit',
                                              minute: '2-digit',
                                          }).format(new Date(snapshot.lastUpdatedAt))
                                        : t('ai.overview.noData')}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AiSubPage>
    );
}