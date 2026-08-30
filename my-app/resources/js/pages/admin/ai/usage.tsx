import React from 'react';
import { FlexEmptyState } from '@/components/flex/flex-empty-state';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AiSubPage } from '@/features/ai/ai-sub-page';
import { useAiCenter } from '@/features/ai/use-ai-center';

const formatTokens = (value: number | null) =>
    value === null ? 'No data' : value >= 1_000_000 ? `${(value / 1_000_000).toFixed(1)}M` : value.toLocaleString('en-US');

export default function AiUsagePage() {
    const { data } = useAiCenter();
    const { usage } = data;

    return (
        <AiSubPage
            titleKey="ai.usage.title"
            subtitleKey="ai.usage.subtitle"
        >
            <div className="flex flex-col gap-6 w-full">
                <Card className="bg-card border-border shadow-2xs">
                    <CardHeader className="p-4 pb-2 border-b border-border">
                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Usage
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {usage.length === 0 ? (
                            <FlexEmptyState
                                title="No usage data"
                                description="Usage and cost records will appear here."
                                className="py-10"
                            />
                        ) : (
                            <div className="divide-y divide-border">
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                    <span>Queue</span>
                                    <span>Sessions</span>
                                    <span>Tokens</span>
                                    <span>Est. Cost</span>
                                </div>
                                {usage.map((row) => (
                                    <div
                                        key={row.id}
                                        className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-4 py-3 items-center"
                                    >
                                        <span className="text-sm font-medium text-foreground">{row.queue}</span>
                                        <span className="text-sm text-muted-foreground">{row.sessions}</span>
                                        <span className="text-sm text-muted-foreground">{formatTokens(row.tokens)}</span>
                                        <span className="text-sm font-semibold text-foreground">
                                            {row.costUsd === null ? 'No data' : `$${row.costUsd.toFixed(2)}`}
                                        </span>
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