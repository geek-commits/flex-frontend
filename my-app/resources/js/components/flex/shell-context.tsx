import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

interface ShellContextValue {
    contextSidebarOpen: boolean;
    setContextSidebarOpen: (open: boolean) => void;
    toggleContextSidebar: () => void;
}

const ShellContext = createContext<ShellContextValue | null>(null);

const STORAGE_KEY = 'flex.shell.contextSidebarOpen';

export function ShellProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState<boolean>(() => {
        try {
            const v = localStorage.getItem(STORAGE_KEY);
            return v ? JSON.parse(v) : true;
        } catch {
            return true;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(open));
        } catch {
            // ignore
        }
    }, [open]);

    const toggle = useCallback(() => setOpen((v) => !v), []);

    return (
        <ShellContext.Provider value={{ contextSidebarOpen: open, setContextSidebarOpen: setOpen, toggleContextSidebar: toggle }}>
            {children}
        </ShellContext.Provider>
    );
}

export function useShell(): ShellContextValue {
    const ctx = useContext(ShellContext);
    if (!ctx) {
        // fallback to open when outside provider (e.g. tests)
        return { contextSidebarOpen: true, setContextSidebarOpen: () => {}, toggleContextSidebar: () => {} };
    }
    return ctx;
}
