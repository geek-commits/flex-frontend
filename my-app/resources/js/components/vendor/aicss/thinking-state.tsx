import { RiLoader4Line } from '@remixicon/react';
import { cn } from '@/lib/utils';

interface ThinkingStateProps {
    label: string;
    className?: string;
}

/**
 * Vendor primitive — restrained thinking / loading indicator.
 * Small spinner + text in FLEX muted tones. No orb, no halo.
 */
export function ThinkingState({ label, className }: ThinkingStateProps) {
    return (
        <span className={cn('inline-flex items-center gap-1.5 text-xs text-flex-text-muted', className)} role="status" aria-live="polite">
            <RiLoader4Line className="size-3 animate-spin" aria-hidden />
            <span>{label}</span>
        </span>
    );
}
