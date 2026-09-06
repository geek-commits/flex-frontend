import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ContextSidebarToggle } from '@/components/flex/context-sidebar-toggle';
import { ShellProvider } from '@/components/flex/shell-context';
import { TooltipProvider } from '@/components/ui/tooltip';

function createStorage() {
    const values = new Map<string, string>();

    return {
        getItem: (key: string) => values.get(key) ?? null,
        setItem: (key: string, value: string) => values.set(key, value),
    };
}

describe('ContextSidebarToggle', () => {
    beforeEach(() => vi.stubGlobal('localStorage', createStorage()));
    afterEach(() => vi.unstubAllGlobals());

    it('names and exposes the contextual-navigation state', () => {
        render(
            <TooltipProvider>
                <ShellProvider>
                    <ContextSidebarToggle />
                </ShellProvider>
            </TooltipProvider>,
        );

        const button = screen.getByRole('button', {
            name: 'Collapse contextual navigation',
        });

        expect(button.getAttribute('aria-controls')).toBe(
            'flex-context-sidebar',
        );
        expect(button.getAttribute('aria-expanded')).toBe('true');

        fireEvent.click(button);

        const expandedButton = screen.getByRole('button', {
            name: 'Expand contextual navigation',
        });

        expect(expandedButton.getAttribute('aria-expanded')).toBe('false');
    });
});
