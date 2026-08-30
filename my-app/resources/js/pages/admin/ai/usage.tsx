import React from 'react';
import { useTranslation } from 'react-i18next';
import { FlexEmptyState } from '@/components/flex/flex-empty-state';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AiSubPage } from '@/features/ai/ai-sub-page';
import { useAiCenter } from '@/features/ai/use-ai-center';

export default function AiUsagePage() {
    const { t, i18n } = useTranslation('administration');
    const { data } = useAiCenter();
    const { usage } = data;
    const locale = i18n.language;

    const formatTokens = (value: number | null) => {
        if (value === null) {
            return t('ai.usage.noData');
        }

        if (value >= 1_000_000) {
            return `${(value / 1_000_000).toFixed(1)}M`;
        }

        return new Intl.NumberFormat(locale).format(value);
    };

    const formatCost = (value: number | null) => {
        if (value === null) {
            return t('ai.usage.noData');
        }

        return new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD', currencyDisplay: 'symbol' }).format(value);
    };

    return (
        <AiSubPage
            titleKey="ai.usage.title"
            subtitleKey="ai.usage.subtitle"
        >
            <div className="flex flex-col gap-6 w-full">
                <Card className="bg-card border-border shadow-2xs">
                    <CardHeader className="p-4 pb-2 border-b border-border">
                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            {t('ai.usage.usageTitle')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {usage.length === 0 ? (
                            <FlexEmptyState
                                title={t('ai.usage.emptyTitle')}
                                description={t('ai.usage.emptyDescription')}
                                className="py-10"
                            />
                        ) : (
                            <div className="divide-y divide-border">
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                    <span>{t('ai.usage.table.queue')}</span>
                                    <span>{t('ai.usage.table.sessions')}</span>
                                    <span>{t('ai.usage.table.tokens')}</span>
                                    <span>{t('ai.usage.table.estimatedCost')}</span>
                                </div>
                                {usage.map((row) => (
                                    <div
                                        key={row.id}
                                        className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-4 py-3 items-center"
                                    >
                                        <span className="text-sm font-medium text-foreground">{row.queue}</span>
                                        <span className="text-sm text-muted-foreground">
                                            {new Intl.NumberFormat(locale).format(row.sessions)}
                                        </span>
                                        <span className="text-sm text-muted-foreground">{formatTokens(row.tokens)}</span>
                                        <span className="text-sm font-semibold text-foreground">{formatCost(row.costUsd)}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AiSubPage>
    );
}
