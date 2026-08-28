import React from 'react';
import { Badge } from '@/components/ui/badge';
import { statusToneClasses } from '@/lib/status-styles';

export type FlexStatusTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

const TONE_TO_CLASSES: Record<FlexStatusTone, (typeof statusToneClasses)['live']> = {
    success: statusToneClasses.live,
    warning: statusToneClasses.stale,
    danger: statusToneClasses.disconnected,
    info: statusToneClasses.talking,
    neutral: statusToneClasses.neutral,
};

export interface FlexStatusProps {
    tone: FlexStatusTone;
    children: React.ReactNode;
    className?: string;
}

/**
 * Shared FLEX status primitive — semantic variants only.
 * Domain states map into these tones (never create AnsweredBadge-style clones).
 * Always renders a non-color dot alongside readable text.
 */
export function FlexStatus({ tone, children, className }: FlexStatusProps) {
    const classes = TONE_TO_CLASSES[tone];

    return (
        <Badge
            variant="outline"
            className={`inline-flex h-5 items-center gap-1.5 rounded-md border px-2 py-0 text-[12px] font-medium leading-none ${classes.bgClass} ${classes.textClass} ${classes.borderClass} ${className ?? ''}`}
        >
            <span className={`size-1.5 rounded-full ${classes.dotClass}`} aria-hidden="true" />
            {children}
        </Badge>
    );
}
