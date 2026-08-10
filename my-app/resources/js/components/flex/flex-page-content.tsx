import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Canonical FLEX page content frame — centralized page padding + vertical rhythm.
 * Operational screens keep wide content (no marketing max-width).
 */
export function FlexPageContent({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div
            className={cn(
                'px-[var(--flex-space-page-x)] py-[var(--flex-space-page-y)]',
                className
            )}
        >
            {children}
        </div>
    );
}
