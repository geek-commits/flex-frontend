import React from 'react';
import { FlexEmptyState } from '@/components/flex/flex-empty-state';
import { StatusBadge } from '@/components/flex/status-badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { AiSubPage } from '@/features/ai/ai-sub-page';
import { useAiCenter } from '@/features/ai/use-ai-center';

export default function AiVoicePage() {
    const { t } = useTranslation('administration');
    const { data } = useAiCenter();
    const { voiceConfig } = data;

    return (
        // @ts-expect-error — pending Batch 10-11 typed union
        <AiSubPage
            titleKey="ai.voice.title"
            subtitleKey="ai.voice.subtitle"
        >
            <div className="flex flex-col gap-6 w-full">
                <Card className="bg-card border-border shadow-2xs">
                    <CardHeader className="p-4 pb-2 border-b border-border">
                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Status
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                            <StatusBadge
                                domain="ai"
                                status={voiceConfig.enabled ? 'enabled' : 'configuration-required'}
                            />
                            <span className="text-sm text-muted-foreground">
                                {voiceConfig.enabled
                                    ? 'Virtual assistants are enabled.'
                                    : 'Configuration required before this feature can be used.'}
                            </span>
                        </div>

                        <div className="flex flex-col gap-1.5 pt-2 border-t border-border">
                            {voiceConfig.capabilityNotes.map((note, idx) => (
                                <p key={idx} className="text-[11px] text-muted-foreground">
                                    · {note}
                                </p>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <FlexEmptyState
                    title="Voice AI is configuration-only"
                    description="No runtime Voice AI bot builder or speech/voice configuration exists. A provider connection and telephony-safe configuration are required."
                    className="py-10"
                />
            </div>
        </AiSubPage>
    );
}