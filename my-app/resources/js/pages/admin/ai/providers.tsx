import React from 'react';
import { FlexEmptyState } from '@/components/flex/flex-empty-state';
import { StatusBadge } from '@/components/flex/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AiSubPage } from '@/features/ai/ai-sub-page';
import { useAiCenter } from '@/features/ai/use-ai-center';

export default function AiProvidersPage() {
    const { data, testProviderConnection } = useAiCenter();
    const { providers } = data;

    return (
        // @ts-expect-error — pending Batch 10-11 typed union
        <AiSubPage
            titleKey="ai.providers.title"
            subtitleKey="ai.providers.subtitle"
        >
            <div className="flex flex-col gap-6 w-full">
                <Card className="bg-card border-border shadow-2xs">
                    <CardHeader className="p-4 pb-2 border-b border-border">
                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Providers
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {providers.length === 0 ? (
                            <FlexEmptyState
                                title="No providers configured"
                                description="Connected inference providers will appear here."
                                className="py-10"
                            />
                        ) : (
                            <div className="divide-y divide-border">
                                {providers.map((provider) => (
                                    <div key={provider.id} className="flex items-center justify-between gap-3 p-3 px-4">
                                        <div className="flex flex-col gap-0.5 min-w-0">
                                            <span className="text-sm font-semibold text-foreground truncate">
                                                {provider.name}
                                            </span>
                                            <span className="text-[11px] text-muted-foreground">
                                                Model: {provider.model} ·{' '}
                                                {provider.secretConfigured ? 'Secret configured' : 'No secret configured'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            {provider.testStatus && (
                                                <StatusBadge
                                                    domain="ai"
                                                    status={provider.testStatus === 'success' ? 'enabled' : 'configuration-required'}
                                                />
                                            )}
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-xs"
                                                onClick={() => testProviderConnection(provider.id)}
                                            >
                                                Test connection
                                            </Button>
                                        </div>
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