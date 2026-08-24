import { Link, usePage } from '@inertiajs/react';
import React from 'react';
import { NAVIGATION, useCapabilities } from '@/auth/capabilities';
import { FlexBrandMark } from '@/components/flex/brand';
import { FlexIcon } from '@/components/flex/iconography';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAppearance } from '@/hooks/use-appearance';

export interface PrimaryRailProps {
    currentPath?: string;
    activeWorkspace?: 'admin' | 'agent';
}

export function PrimaryRail({ currentPath, activeWorkspace = 'admin' }: PrimaryRailProps) {
    void currentPath;
    void activeWorkspace;
    const { url } = usePage();
    const { appearance, updateAppearance } = useAppearance();
    const { has } = useCapabilities();

    const navItems = NAVIGATION.filter((entry) => has(entry.capability));

    const toggleTheme = () => {
        updateAppearance(appearance === 'dark' ? 'light' : 'dark');
    };

    return (
        <TooltipProvider delay={150}>
            <aside className="w-14 hidden md:flex flex-col items-center justify-between py-3 bg-flex-workspace-surface border-r border-flex-workspace-divider h-screen sticky top-0 shrink-0 z-30 select-none">
                {/* Top Section: Logo & primary navigation */}
                <div className="flex flex-col items-center gap-4 w-full">
                    <Link href="/dashboard" className="p-1 hover:opacity-90 transition-opacity" title="Flex Contact Center">
                        <FlexBrandMark size={24} standalone />
                    </Link>

                    <div className="w-8 h-px bg-flex-workspace-divider my-0.5" />

                    <nav className="flex flex-col items-center gap-1.5 w-full px-2">
                        {navItems.map((item) => {
                            const isActive = url.startsWith(item.href) || (item.href === '/dashboard' && url === '/');

                            return (
                                <Tooltip key={item.href}>
                                    <TooltipTrigger
                                        render={
                                            <Link
                                                href={item.href}
                                                aria-label={item.title}
                                                className={`relative flex items-center justify-center size-8 rounded-md transition-colors duration-[var(--flex-duration-fast)] flex-focus-visible ${
                                                    isActive
                                                        ? 'bg-flex-layer-selected border border-flex-workspace-divider-strong text-flex-text-primary shadow-none'
                                                        : 'text-flex-text-tertiary hover:text-flex-text-primary hover:bg-flex-layer-hover'
                                                }`}
                                            >
                                                <FlexIcon name={item.icon} className="size-4" />
                                                {item.badge && (
                                                    <span aria-hidden="true" className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-status-ready ring-2 ring-card" title={item.badge} />
                                                )}
                                            </Link>
                                        }
                                    />
                                    <TooltipContent side="right" className="font-medium text-xs">
                                        {item.title}
                                    </TooltipContent>
                                </Tooltip>
                            );
                        })}
                    </nav>
                </div>

                {/* Bottom Section: Theme */}
                <div className="flex flex-col items-center gap-2 w-full px-2">
                    <Tooltip>
                        <TooltipTrigger
                            render={
                                <button
                                    onClick={toggleTheme}
                                    aria-label={appearance === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                                    className="flex items-center justify-center size-8 rounded-md text-flex-text-tertiary hover:text-flex-text-primary hover:bg-flex-layer-hover transition-colors duration-[var(--flex-duration-fast)] flex-focus-visible"
                                >
                                    <FlexIcon name={appearance === 'dark' ? 'sun' : 'moon'} className="size-4" />
                                </button>
                            }
                        />
                        <TooltipContent side="right" className="text-xs font-medium">
                            Toggle {appearance === 'dark' ? 'Light' : 'Dark'} Mode
                        </TooltipContent>
                    </Tooltip>

                    <div className="w-8 h-px bg-border my-0.5" />
                </div>
            </aside>
        </TooltipProvider>
    );
}
