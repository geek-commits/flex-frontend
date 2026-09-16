import { Kbd, KbdGroup } from '@/components/ui/kbd';
import { SidebarTrigger } from '@/components/ui/sidebar';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

/**
 * Sidebar toggle with a discoverable shortcut hint. Delay is owned by the
 * global TooltipProvider (app-providers); this trigger stays instant so
 * repeated toggles never feel queued.
 */
export function CustomSidebarTrigger() {
    return (
        <Tooltip>
            <TooltipTrigger render={<SidebarTrigger />} />
            <TooltipContent className="px-2 py-1" side="right">
                Toggle Sidebar{' '}
                <KbdGroup>
                    <Kbd>⌘</Kbd>
                    <Kbd>b</Kbd>
                </KbdGroup>
            </TooltipContent>
        </Tooltip>
    );
}
