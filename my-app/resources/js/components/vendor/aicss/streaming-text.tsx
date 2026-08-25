import { cn } from '@/lib/utils';

interface StreamingTextProps {
    text: string;
    interim?: boolean;
    className?: string;
}

/**
 * Vendor primitive — adapted streaming text.
 * Renders interim segments with muted weight; final is full.
 * No glow, no gradient, no pulsing — FLEX typography only.
 */
export function StreamingText({ text, interim, className }: StreamingTextProps) {
    return (
        <span
            className={cn(
                'text-[13px] leading-relaxed',
                interim ? 'italic text-flex-text-tertiary' : 'text-flex-text-primary',
                className,
            )}
        >
            {text}
            {interim && <span className="ml-1 inline-flex align-baseline text-[10px] text-flex-text-muted">…</span>}
        </span>
    );
}
