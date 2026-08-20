import { RiCloseLine, RiSparklingLine } from '@remixicon/react';
import React, { useId } from 'react';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { useIsDesktop } from '@/hooks/use-is-desktop';
import { cn } from '@/lib/utils';
import { ASSIST_PANEL_META } from './agent-assist-types';

export interface AgentAssistPanelProps {
    /** Close the panel. Only the panel closes — no assist session exists to stop. */
    onClose: () => void;
}

/**
 * Honest, call-scoped Agent Assist companion panel.
 *
 * Mounted only while an active call exists (see agent-workspace-page). Docked
 * left of the Call Manager on desktop (>=1024px), right-side sheet below. It
 * renders a single truthful state — Agent Assist is configuration-only in this
 * POC, with no transcript/session runtime (AGENT_ASSIST_RUNTIME_AUDIT.md). No
 * pulsing status dot, no glow, no invented timer or suggestions.
 */
export function AgentAssistPanel({ onClose }: AgentAssistPanelProps) {
    const isDesktop = useIsDesktop();
    const headingId = useId();
    const meta = ASSIST_PANEL_META.notModeled;

    const header = (
        <div
            className={cn(
                'flex items-center justify-between gap-2 border-b border-flex-workspace-divider px-4 py-3',
                // On the sheet variant the built-in close occupies the top-right.
                !isDesktop && 'pr-12',
            )}
        >
            <h2
                id={headingId}
                className="text-sm font-semibold text-flex-text-primary"
            >
                Agent Assist
            </h2>

            <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-medium text-flex-text-muted">
                    {meta.status}
                </span>
                {isDesktop && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={onClose}
                        aria-label="Close Agent Assist"
                    >
                        <RiCloseLine className="size-4" />
                    </Button>
                )}
            </div>
        </div>
    );

    const body = (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-10 text-center">
            <div className="flex size-10 items-center justify-center rounded-full bg-flex-workspace-surface-muted text-flex-text-muted">
                <RiSparklingLine className="size-5" />
            </div>
            <div className="space-y-1">
                <p className="text-sm font-medium text-flex-text-primary">
                    {meta.title}
                </p>
                <p className="text-xs text-flex-text-muted">
                    {meta.description}
                </p>
            </div>
        </div>
    );

    if (isDesktop) {
        return (
            <aside
                aria-labelledby={headingId}
                className="flex h-full w-[360px] shrink-0 flex-col border-l border-flex-workspace-divider bg-flex-workspace-surface lg:flex"
            >
                {header}
                {body}
            </aside>
        );
    }

    return (
        <Sheet open onOpenChange={(next) => !next && onClose()}>
            <SheetContent side="right" className="flex flex-col gap-0 p-0">
                <SheetHeader className="sr-only">
                    <SheetTitle>Agent Assist</SheetTitle>
                </SheetHeader>
                {header}
                {body}
            </SheetContent>
        </Sheet>
    );
}
