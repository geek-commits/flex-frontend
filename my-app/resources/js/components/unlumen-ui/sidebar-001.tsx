import React from 'react';
import { cn } from '@/lib/utils';

/** FLEX adaptation of Unlumen Sidebar 001: static slots for a shadcn Sidebar shell. */
export function Sidebar001({ children, className }: { children: React.ReactNode; className?: string }) {
    return <div className={cn('flex h-full min-h-0 flex-col bg-sidebar text-sidebar-foreground', className)}>{children}</div>;
}

export function Sidebar001Header({ children, className, ...props }: React.ComponentProps<'div'>) {
    return <div className={cn('shrink-0 px-4 py-4', className)} {...props}>{children}</div>;
}

export function Sidebar001Content({ children, className, ...props }: React.ComponentProps<'div'>) {
    return <div className={cn('min-h-0 flex-1 overflow-y-auto', className)} {...props}>{children}</div>;
}

export function Sidebar001Footer({ children, className, ...props }: React.ComponentProps<'div'>) {
    return <div className={cn('shrink-0 border-t border-sidebar-border px-3 py-3', className)} {...props}>{children}</div>;
}

export function Sidebar001Separator({ className, ...props }: React.ComponentProps<'div'>) {
    return <div aria-hidden="true" className={cn('h-px bg-sidebar-border', className)} {...props} />;
}
