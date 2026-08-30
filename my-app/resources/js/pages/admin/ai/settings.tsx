import React from 'react';
import { FlexEmptyState } from '@/components/flex/flex-empty-state';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AiSubPage } from '@/features/ai/ai-sub-page';
import { useAiCenter } from '@/features/ai/use-ai-center';

export default function AiSettingsPage() {
    const { data } = useAiCenter();
    const { settings } = data;

    return (
        <AiSubPage
            titleKey="ai.settings.title"
            subtitleKey="ai.settings.subtitle"
        >
            <div className="flex flex-col gap-6 w-full">
                <Card className="bg-card border-border shadow-2xs">
                    <CardHeader className="p-4 pb-2 border-b border-border">
                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Global AI
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 flex items-center justify-between gap-3">
                        <span className="text-sm text-foreground">
                            Global AI Center {settings.globalEnabled ? 'is enabled' : 'is disabled'}
                        </span>
                    </CardContent>
                </Card>

                <Card className="bg-card border-border shadow-2xs">
                    <CardHeader className="p-4 pb-2 border-b border-border">
                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Dependencies
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 flex flex-col gap-2">
                        {settings.dependencyNotes.length === 0 ? (
                            <FlexEmptyState
                                title="No dependency notes"
                                description="Configuration dependencies will appear here."
                                className="py-6"
                            />
                        ) : (
                            settings.dependencyNotes.map((note, idx) => (
                                <p key={idx} className="text-[11px] text-muted-foreground">
                                    · {note}
                                </p>
                            ))
                        )}
                    </CardContent>
                </Card>

                <FlexEmptyState
                    title="Settings are configuration-only"
                    description="Frontend toggles never override backend authority. Tenant AI settings and feature toggles require the real runtime."
                    className="py-10"
                />
            </div>
        </AiSubPage>
    );
}