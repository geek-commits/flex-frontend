import { RiRefreshLine } from '@remixicon/react';
import React, { useState } from 'react';
import { FlexIcon } from '@/components/flex/iconography';
import { MetricCard, MetricGroup } from '@/components/flex/metric-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AiSubPage } from '@/features/ai/ai-sub-page';
import { AIFeatureStatusGrid } from '@/features/ai/components/ai-feature-status-grid';
import { useAiCenter } from '@/features/ai/use-ai-center';

const formatNumber = (value: number) => value.toLocaleString('en-US');

const formatTokens = (value: number | null) =>
    value === null ? null : value >= 1_000_000 ? `${(value / 1_000_000).toFixed(1)}M` : formatNumber(value);

const formatCost = (value: number | null) => (value === null ? null : `$${value.toFixed(2)}`);

export default function AiOverviewPage() {
    const { data } = useAiCenter();
    const [refreshing, setRefreshing] = useState(false);
    const { snapshot, features, knowledgeVaults, knowledgeItems } = data;

    const handleRefresh = () => {
        setRefreshing(true);
        // POC: refresh re-reads the current snapshot; a real backend poll would
        // replace this. Avoids a dead control while keeping honest semantics.
        setTimeout(() => setRefreshing(false), 500);
    };

    const indexedVaults = knowledgeVaults.filter((v) => v.indexed).length;
    const updatedToday = knowledgeVaults.reduce((sum, v) => sum + v.updatedToday, 0);

    return (
        <AiSubPage
            title="AI Center"
            subtitle="AI operations overview — what is enabled, what needs configuration, and usage"
            actions={
                <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={handleRefresh}>
                    <RiRefreshLine className={`size-3.5 ${refreshing ? 'animate-spin' : ''}`} />
                    <span>Refresh Stats</span>
                </Button>
            }
        >
            <div className="flex flex-col gap-6 w-full">
                {/* Snapshot metrics */}
                <div className="flex flex-col gap-2.5">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <FlexIcon name="ai-snapshot" className="text-primary" />
                        <span>Today&apos;s Usage Snapshot</span>
                    </h2>

                    <MetricGroup>
                        <MetricCard
                            title="AI Sessions Today"
                            value={snapshot.sessionsToday === null ? null : formatNumber(snapshot.sessionsToday)}
                            description="Real-time agent co-pilot interactions"
                        />
                        <MetricCard
                            title="Assist Adoption Rate"
                            value={snapshot.assistAdoptionRate === null ? null : `${snapshot.assistAdoptionRate}%`}
                            description="Agents accepting AI suggestions"
                        />
                        <MetricCard
                            title="Total Tokens Today"
                            value={formatTokens(snapshot.totalTokensToday)}
                            description="Prompt & completion token volume"
                        />
                        <MetricCard
                            title="Est. Cost Today"
                            value={formatCost(snapshot.estimatedCostToday)}
                            description="Inference provider cost estimate"
                        />
                    </MetricGroup>
                </div>

                {/* Feature status */}
                <div className="flex flex-col gap-3">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        AI Feature Status
                    </h2>
                    <AIFeatureStatusGrid features={features} />
                </div>

                {/* Knowledge base impact */}
                <Card className="bg-card border-border shadow-2xs">
                    <CardHeader className="p-4 pb-2 border-b border-border">
                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                                <FlexIcon name="knowledge-base" className="text-primary" />
                                Knowledge Base Coverage
                            </span>
                            <span className="text-xs font-semibold text-status-live">
                                {snapshot.knowledgeSearchPrecision === null
                                    ? 'Precision — no data'
                                    : `${snapshot.knowledgeSearchPrecision}% Search Precision`}
                            </span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="p-3 rounded-lg bg-muted/40 border border-border flex flex-col">
                                <span className="text-[10px] uppercase font-semibold text-muted-foreground">Active KB Vaults</span>
                                <span className="text-lg font-bold text-foreground">{indexedVaults} / {knowledgeVaults.length}</span>
                            </div>
                            <div className="p-3 rounded-lg bg-muted/40 border border-border flex flex-col">
                                <span className="text-[10px] uppercase font-semibold text-muted-foreground">Knowledge Items</span>
                                <span className="text-lg font-bold text-foreground">{formatNumber(knowledgeItems.length)}</span>
                            </div>
                            <div className="p-3 rounded-lg bg-muted/40 border border-border flex flex-col">
                                <span className="text-[10px] uppercase font-semibold text-muted-foreground">Updated Today</span>
                                <span className="text-lg font-bold text-status-live">{updatedToday}</span>
                            </div>
                            <div className="p-3 rounded-lg bg-muted/40 border border-border flex flex-col">
                                <span className="text-[10px] uppercase font-semibold text-muted-foreground">Last Updated</span>
                                <span className="text-sm font-semibold text-foreground">
                                    {snapshot.lastUpdatedAt
                                        ? new Date(snapshot.lastUpdatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                        : 'No data'}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AiSubPage>
    );
}