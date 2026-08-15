import React from 'react';
import { FlexIcon } from '@/components/flex/iconography';

export interface FlexEmptyStateProps {
    title: string;
    description?: string;
    action?: React.ReactNode;
    className?: string;
}

/**
 * Shared FLEX empty state — what is empty, why, and what to do next.
 */
export function FlexEmptyState({ title, description, action, className }: FlexEmptyStateProps) {
    return (
        <div className={`flex flex-col items-center justify-center gap-2 text-center py-10 px-4 ${className ?? ''}`}>
            <FlexIcon name="empty-inbox" size="xl" className="text-flex-text-disabled" />
            <span className="text-sm font-semibold text-flex-text-primary">{title}</span>
            {description && <span className="text-xs text-flex-text-muted max-w-sm">{description}</span>}
            {action && <div className="mt-1">{action}</div>}
        </div>
    );
}
