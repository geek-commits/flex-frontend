import React from 'react';
import { FlexIcon, FlexIllustration } from '@/components/flex/iconography';
import type { FlexIllustrationName } from '@/components/flex/iconography';
import type { FlexIconName } from '@/components/flex/iconography';

export interface FlexEmptyStateProps {
    title: string;
    description?: string;
    action?: React.ReactNode;
    className?: string;
    /** Cartoon illustration for larger empty/setup surfaces. When absent, uses the compact line icon. */
    illustration?: FlexIllustrationName;
    /** Line icon override; defaults to empty-inbox. */
    icon?: FlexIconName;
}

/**
 * Shared FLEX empty state — what is empty, why, and what to do next.
 * The illustration is secondary to title, explanation, and action.
 */
export function FlexEmptyState({ title, description, action, className, illustration, icon = 'empty-inbox' }: FlexEmptyStateProps) {
    return (
        <div className={`flex flex-col items-center justify-center gap-2 text-center py-10 px-4 ${className ?? ''}`}>
            {illustration ? (
                <FlexIllustration name={illustration} className="mb-1 text-flex-text-disabled" />
            ) : (
                <FlexIcon name={icon} size="xl" className="text-flex-text-disabled" />
            )}
            <span className="text-sm font-semibold text-flex-text-primary">{title}</span>
            {description && <span className="text-xs text-flex-text-muted max-w-sm">{description}</span>}
            {action && <div className="mt-1">{action}</div>}
        </div>
    );
}
