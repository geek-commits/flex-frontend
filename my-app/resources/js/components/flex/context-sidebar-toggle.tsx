import React from 'react';
import { useShell } from '@/components/flex/shell-context';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { SidebarToggleIcon } from '@/components/unlumen-ui/sidebar-toggle-icon';
import { cn } from '@/lib/utils';

export interface ContextSidebarToggleProps {
    className?: string;
}

/** Shared desktop control for collapsing and restoring contextual navigation. */
export function ContextSidebarToggle({ className }: ContextSidebarToggleProps) {
    const { contextSidebarOpen, toggleContextSidebar } = useShell();
    const label = contextSidebarOpen
        ? 'Collapse contextual navigation'
        : 'Expand contextual navigation';

    return (
        <Tooltip>
            <TooltipTrigger
                render={
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label={label}
                        aria-controls="flex-context-sidebar"
                        aria-expanded={contextSidebarOpen}
                        onClick={toggleContextSidebar}
                        className={cn(
                            'flex-focus-visible text-flex-text-tertiary hover:bg-flex-layer-hover hover:text-flex-text-primary',
                            className,
                        )}
                    >
                        <SidebarToggleIcon
                            isOpen={contextSidebarOpen}
                            className="size-4"
                            aria-hidden="true"
                        />
                    </Button>
                }
            />
            <TooltipContent side="right">{label}</TooltipContent>
        </Tooltip>
    );
}
