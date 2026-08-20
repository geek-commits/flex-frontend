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
import { useAgentAssistState } from './use-agent-assist-state';

export interface AgentAssistPanelProps {
    /** Whether the panel is open (sheet) / visible (docked aside). */
    open: boolean;
    /** Close the panel. Hides the panel only — no assist session exists to stop. */
    onClose: () => void;
}

/**
 * Honest Agent Assist companion panel.
 *
 * Docked right-side panel on desktop (left of the Call Manager), right-side
 * sheet below 1024px. Reflects only real runtime state — the calm Waiting /
 * Unavailable empty state, with no transcript, suggestions, or problem cards
 * the runtime cannot back (AGENT_ASSIST_PREFLIGHT.md). No pulsing status dot,
 * no glow, no invented timer.
 */
export function AgentAssistPanel({ open, onClose }: AgentAssistPanelProps) {
    const state = useAgentAssistState();
    const isDesktop = useIsDesktop();
    const headingId = useId();
    const meta = ASSIST_PANEL_META[state];

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
                className={cn(
                    'hidden h-full w-[360px] shrink-0 flex-col border-l border-flex-workspace-divider bg-flex-workspace-surface lg:flex',
                    !open && 'hidden',
                )}
            >
                {header}
                {body}
            </aside>
        );
    }

    return (
        <Sheet open={open} onOpenChange={(next) => !next && onClose()}>
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
