import { cn } from '@/lib/utils';

interface TextResponseProps {
    title?: string;
    body: string;
    sourceLabel?: string;
    className?: string;
}

/**
 * Vendor primitive — compact text response / suggestion card.
 * FLEX borders, radii, muted surface. No decorative pulsing.
 */
export function TextResponse({ title, body, sourceLabel, className }: TextResponseProps) {
    return (
        <div className={cn('rounded-md border border-flex-workspace-divider bg-card px-3 py-2.5', className)}>
            {title && <p className="text-xs font-semibold text-flex-text-primary">{title}</p>}
            <p className="mt-1 text-xs leading-relaxed text-flex-text-secondary">{body}</p>
            {sourceLabel && <p className="mt-2 text-[11px] text-flex-text-tertiary">{sourceLabel}</p>}
        </div>
    );
}
