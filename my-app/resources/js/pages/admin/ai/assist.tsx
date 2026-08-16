import React from 'react';
import { FlexEmptyState } from '@/components/flex/flex-empty-state';
import { StatusBadge } from '@/components/flex/status-badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Toggle } from '@/components/ui/toggle';
import { AiSubPage } from '@/features/ai/ai-sub-page';
import { useAiCenter } from '@/features/ai/use-ai-center';

export default function AiAssistPage() {
    const { data, setAssistEnabled } = useAiCenter();
    const { assistConfig } = data;

    return (
        <AiSubPage
            title="Agent Assist"
            subtitle="Real-time suggestions surfaced to agents during customer interactions"
        >
            <div className="flex flex-col gap-6 w-full">
                <Card className="bg-card border-border shadow-2xs">
                    <CardHeader className="p-4 pb-2 border-b border-border">
                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Enablement
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 flex items-center justify-between gap-4">
                        <div className="flex flex-col gap-0.5">
                            <span className="text-sm font-semibold text-foreground">Agent Assist enabled</span>
                            <span className="text-[11px] text-muted-foreground">
                                Suggestions are configuration-only in this POC; no suggestion content is invented.
                            </span>
                        </div>
                        <Toggle
                            pressed={assistConfig.enabled}
                            onPressedChange={setAssistEnabled}
                            variant="outline"
                            aria-label="Toggle Agent Assist"
                        >
                            {assistConfig.enabled ? 'Enabled' : 'Disabled'}
                        </Toggle>
                    </CardContent>
                </Card>

                <Card className="bg-card border-border shadow-2xs">
                    <CardHeader className="p-4 pb-2 border-b border-border">
                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Runtime Metrics
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 grid grid-cols-2 gap-4">
                        <div className="p-3 rounded-lg bg-muted/40 border border-border flex flex-col">
                            <span className="text-[10px] uppercase font-semibold text-muted-foreground">Status</span>
                            <div className="mt-1">
                                <StatusBadge domain="ai" status={assistConfig.enabled ? 'enabled' : 'disabled'} />
                            </div>
                        </div>
                        <div className="p-3 rounded-lg bg-muted/40 border border-border flex flex-col">
                            <span className="text-[10px] uppercase font-semibold text-muted-foreground">Adoption Rate</span>
                            <span className="text-lg font-bold text-foreground">
                                {assistConfig.adoptionRate === null ? 'No data' : `${assistConfig.adoptionRate}%`}
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <FlexEmptyState
                    title="Agent Assist suggestions are not modeled"
                    description="Suggestion content, feedback, and latency require a real Agent Assist runtime. This POC exposes configuration only."
                    className="py-10"
                />
            </div>
        </AiSubPage>
    );
}