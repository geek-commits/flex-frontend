import React from 'react';
import { useTranslation } from 'react-i18next';
import { FlexEmptyState } from '@/components/flex/flex-empty-state';
import { Card, CardContent } from '@/components/ui/card';
import type { DeferredSection, DeferredTitleKey } from '../agent-dashboard-types';

export interface DeferredSectionCardProps {
    titleKey: DeferredTitleKey;
    section: DeferredSection;
}

/**
 * Honest deferred section — the runtime has no backing for this surface, so it
 * renders an accurate empty state with the reason instead of fabricated data
 * (AGENTS.md: never invent domain metrics the runtime does not implement).
 */
export function DeferredSectionCard({ titleKey, section }: DeferredSectionCardProps) {
    const { t } = useTranslation('agent');

    return (
        <Card className="bg-card border-border shadow-2xs">
            <CardContent className="p-4">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                    {t(titleKey)}
                </div>
                <FlexEmptyState title={t('dashboard.deferred.notAvailable')} description={t(section.reasonKey)} className="py-6" />
            </CardContent>
        </Card>
    );
}
