import React from 'react';
import { FlexIcon } from '@/components/flex/iconography';

export interface FlexErrorStateProps {
    title: string;
    description?: string;
    action?: React.ReactNode;
    className?: string;
}

/**
 * Shared FLEX error state — what failed, concise explanation, recovery action.
 */
export function FlexErrorState({ title, description, action, className }: FlexErrorStateProps) {
    return (
        <div className={`flex flex-col items-center justify-center gap-2 text-center py-10 px-4 ${className ?? ''}`}>
            <FlexIcon name="error" size="xl" className="text-flex-status-danger" />
            <span className="text-sm font-semibold text-flex-text-primary">{title}</span>
            {description && <span className="text-xs text-flex-text-muted max-w-sm">{description}</span>}
            {action && <div className="mt-1">{action}</div>}
        </div>
    );
}
