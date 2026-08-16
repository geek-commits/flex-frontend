import React from 'react';
import { FlexIcon } from '@/components/flex/iconography';
import { StatusBadge } from '@/components/flex/status-badge';
import { Card, CardContent } from '@/components/ui/card';
import type { AIFeatureInfo } from '../ai-types';

export interface AIFeatureStatusGridProps {
    features: AIFeatureInfo[];
}

/**
 * AI feature status directory — uses the shared StatusBadge (ai domain) so
 * every AI feature maps to the canonical status colors. Status is always
 * text-readable (never color-only). Config hints surface the next step.
 */
export function AIFeatureStatusGrid({ features }: AIFeatureStatusGridProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feat) => (
                <Card key={feat.id} className="bg-card border-border shadow-2xs">
                    <CardContent className="p-4 flex flex-col justify-between h-full gap-3">
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                                    <FlexIcon name={featureIcon(feat.id)} size="lg" />
                                </div>
                                <div className="flex flex-col">
                                    <h3 className="text-xs font-semibold text-foreground">{feat.title}</h3>
                                    <p className="text-[11px] text-muted-foreground mt-0.5">{feat.description}</p>
                                </div>
                            </div>
                            <StatusBadge domain="ai" status={feat.status} />
                        </div>
                        {feat.configHint && (
                            <p className="text-[11px] text-muted-foreground border-t border-border pt-2">
                                {feat.configHint}
                            </p>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

function featureIcon(id: string) {
    switch (id) {
        case 'assist':
            return 'ai-copilot';
        case 'knowledge':
            return 'knowledge-base';
        case 'voice':
            return 'voice-assistants';
        case 'gateway':
        default:
            return 'ai-overview';
    }
}