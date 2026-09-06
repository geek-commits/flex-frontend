import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ShellProvider, useShell } from '@/components/flex/shell-context';

const STORAGE_KEY = 'flex.shell.contextSidebarOpen';

function createStorage() {
    const values = new Map<string, string>();

    return {
        clear: () => values.clear(),
        getItem: (key: string) => values.get(key) ?? null,
        key: (index: number) => [...values.keys()][index] ?? null,
        get length() {
            return values.size;
        },
        removeItem: (key: string) => values.delete(key),
        setItem: (key: string, value: string) => values.set(key, value),
    };
}

function ContextSidebarStateProbe() {
    const { contextSidebarOpen, toggleContextSidebar } = useShell();

    return (
        <button type="button" onClick={toggleContextSidebar}>
            {contextSidebarOpen ? 'open' : 'closed'}
        </button>
    );
}

describe('ShellProvider', () => {
    let storage: ReturnType<typeof createStorage>;

    beforeEach(() => {
        storage = createStorage();
        vi.stubGlobal('localStorage', storage);
    });

    afterEach(() => vi.unstubAllGlobals());

    it('defaults the contextual sidebar to open', () => {
        render(
            <ShellProvider>
                <ContextSidebarStateProbe />
            </ShellProvider>,
        );

        expect(screen.getByRole('button').textContent).toBe('open');
    });

    it('restores the saved contextual-sidebar state', () => {
        storage.setItem(STORAGE_KEY, 'false');

        render(
            <ShellProvider>
                <ContextSidebarStateProbe />
            </ShellProvider>,
        );

        expect(screen.getByRole('button').textContent).toBe('closed');
    });

    it('persists a toggled state', async () => {
        render(
            <ShellProvider>
                <ContextSidebarStateProbe />
            </ShellProvider>,
        );

        fireEvent.click(screen.getByRole('button'));

        await waitFor(() => {
            expect(storage.getItem(STORAGE_KEY)).toBe('false');
        });
    });
});
