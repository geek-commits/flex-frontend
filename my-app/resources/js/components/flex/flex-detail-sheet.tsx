import React from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';

export interface FlexDetailSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    meta?: React.ReactNode;
    children: React.ReactNode;
    footer?: React.ReactNode;
    widthClass?: string;
}

/**
 * Shared FLEX contextual detail sheet — reusable for any record inspection
 * (call, campaign, agent, audit log, etc.). Radix handles focus trap, Escape,
 * and focus return to the originating row.
 */
export function FlexDetailSheet({
    open,
    onOpenChange,
    title,
    meta,
    children,
    footer,
    widthClass = 'sm:max-w-lg',
}: FlexDetailSheetProps) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className={`w-full ${widthClass} overflow-y-auto`}>
                <SheetHeader className="border-b border-border pr-10">
                    <SheetTitle className="text-base font-semibold text-flex-text-primary">{title}</SheetTitle>
                    {meta && <SheetDescription className="text-xs text-flex-text-muted">{meta}</SheetDescription>}
                </SheetHeader>

                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5">{children}</div>

                {footer && (
                    <div className="border-t border-border p-4 flex items-center justify-end gap-2 flex-wrap">
                        {footer}
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}
