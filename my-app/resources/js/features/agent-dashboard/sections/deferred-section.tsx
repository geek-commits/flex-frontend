import React from 'react';
import { FlexEmptyState } from '@/components/flex/flex-empty-state';
import { Card, CardContent } from '@/components/ui/card';
import type { DeferredSection } from '../agent-dashboard-types';

export interface DeferredSectionCardProps {
    title: string;
    section: DeferredSection;
}

/**
 * Honest deferred section — the runtime has no backing for this surface, so it
 * renders an accurate empty state with the reason instead of fabricated data
 * (AGENTS.md: never invent domain metrics the runtime does not implement).
 */
export function DeferredSectionCard({ title, section }: DeferredSectionCardProps) {
    return (
        <Card className="bg-card border-border shadow-2xs">
            <CardContent className="p-4">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                    {title}
                </div>
                <FlexEmptyState
                    title="Not available yet"
                    description={section.reason}
                    className="py-6"
                />
            </CardContent>
        </Card>
    );
}