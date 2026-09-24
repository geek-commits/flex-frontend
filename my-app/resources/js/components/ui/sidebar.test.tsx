import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SidebarProvider, SidebarTrigger, useSidebar } from './sidebar';

function SidebarState() {
    const { state } = useSidebar();

    return <output data-testid="sidebar-state">{state}</output>;
}

describe('fixed desktop sidebar', () => {
    beforeEach(() => {
        Object.defineProperty(window, 'matchMedia', {
            configurable: true,
            value: vi.fn().mockImplementation((media: string) => ({
                matches: false,
                media,
                addEventListener: vi.fn(),
                removeEventListener: vi.fn(),
            })),
        });
    });

    it('ignores an expanded default, trigger clicks, and the desktop shortcut', () => {
        render(
            <SidebarProvider defaultOpen desktopCollapsed>
                <SidebarState />
                <SidebarTrigger />
            </SidebarProvider>,
        );

        const state = screen.getByTestId('sidebar-state');
        expect(state).toHaveTextContent('collapsed');

        fireEvent.click(screen.getByRole('button', { name: 'Toggle Sidebar' }));
        expect(state).toHaveTextContent('collapsed');

        fireEvent.keyDown(window, { key: 'b', ctrlKey: true });
        expect(state).toHaveTextContent('collapsed');
    });
});
