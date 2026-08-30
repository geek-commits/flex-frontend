import { RiRefreshLine } from '@remixicon/react';
import React from 'react';
import { FlexEmptyState } from '@/components/flex/flex-empty-state';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AiSubPage } from '@/features/ai/ai-sub-page';
import { useAiCenter } from '@/features/ai/use-ai-center';

export default function AiKnowledgePage() {
    const { data, reindexVault } = useAiCenter();
    const { knowledgeItems, knowledgeVaults } = data;

    return (
        <AiSubPage
            titleKey="ai.knowledge.title"
            subtitleKey="ai.knowledge.subtitle"
        >
            <div className="flex flex-col gap-6 w-full">
                {/* Vaults */}
                <Card className="bg-card border-border shadow-2xs">
                    <CardHeader className="p-4 pb-2 border-b border-border">
                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Knowledge Vaults
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 flex flex-col gap-3">
                        {knowledgeVaults.length === 0 ? (
                            <FlexEmptyState
                                title="No knowledge vaults"
                                description="Indexed knowledge will appear here once configured."
                                className="py-8"
                            />
                        ) : (
                            knowledgeVaults.map((vault) => (
                                <div
                                    key={vault.id}
                                    className="flex items-center justify-between gap-3 p-3 rounded-lg bg-muted/40 border border-border"
                                >
                                    <div className="flex flex-col gap-0.5 min-w-0">
                                        <span className="text-sm font-semibold text-foreground truncate">{vault.name}</span>
                                        <span className="text-[11px] text-muted-foreground">
                                            {vault.queue} · {vault.itemCount} items · {vault.updatedToday} updated today
                                        </span>
                                    </div>
                                    <Button
                                        variant={vault.indexed ? 'outline' : 'secondary'}
                                        size="sm"
                                        className="gap-1.5 text-xs shrink-0"
                                        onClick={() => reindexVault(vault.id)}
                                    >
                                        <RiRefreshLine className="size-3.5" />
                                        {vault.indexed ? 'Reindex' : 'Index'}
                                    </Button>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>

                {/* Items */}
                <Card className="bg-card border-border shadow-2xs">
                    <CardHeader className="p-4 pb-2 border-b border-border">
                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Knowledge Items
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {knowledgeItems.length === 0 ? (
                            <FlexEmptyState
                                title="No knowledge items"
                                description="Indexed knowledge items will appear here."
                                className="py-8"
                            />
                        ) : (
                            <div className="divide-y divide-border">
                                {knowledgeItems.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between gap-3 p-3 px-4">
                                        <div className="flex flex-col gap-0.5 min-w-0">
                                            <span className="text-sm font-medium text-foreground truncate">{item.title}</span>
                                            <span className="text-[11px] text-muted-foreground">
                                                {item.vault} · {item.queue}
                                            </span>
                                        </div>
                                        <span
                                            className={`text-[11px] font-semibold shrink-0 ${
                                                item.indexed ? 'text-status-live' : 'text-status-disconnected'
                                            }`}
                                        >
                                            {item.indexed ? 'Indexed' : 'Pending'}
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