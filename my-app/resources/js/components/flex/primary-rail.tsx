import { Link, usePage } from '@inertiajs/react';
import { RiMoonLine, RiSunLine } from '@remixicon/react';
import React from 'react';
import { NAVIGATION, useCapabilities } from '@/auth/capabilities';
import { FlexLogo } from '@/components/flex/flex-logo';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAppearance } from '@/hooks/use-appearance';
import type { User } from '@/types';

export interface PrimaryRailProps {
    currentPath?: string;
    activeWorkspace?: 'admin' | 'agent';
}

export function PrimaryRail({ currentPath, activeWorkspace = 'admin' }: PrimaryRailProps) {
    void currentPath;
    void activeWorkspace;
    const { url, props } = usePage();
    const user = props.auth?.user as User | undefined;
    const { appearance, updateAppearance } = useAppearance();
    const { has } = useCapabilities();

    const navItems = NAVIGATION.filter((entry) => has(entry.capability));

    const toggleTheme = () => {
        updateAppearance(appearance === 'dark' ? 'light' : 'dark');
    };

    return (
        <TooltipProvider delay={150}>
            <aside className="w-16 hidden md:flex flex-col items-center justify-between py-3 bg-card border-r border-border h-screen sticky top-0 shrink-0 z-30 select-none">
                {/* Top Section: Logo & primary navigation */}
                <div className="flex flex-col items-center gap-5 w-full">
                    <Link href="/dashboard" className="p-1 hover:opacity-90 transition-opacity" title="Flex Contact Center">
                        <FlexLogo size={24} showText={false} />
                    </Link>

                    <div className="w-8 h-px bg-border my-0.5" />

                    <nav className="flex flex-col items-center gap-1.5 w-full px-2">
                        {navItems.map((item) => {
                            const isActive = url.startsWith(item.href) || (item.href === '/dashboard' && url === '/');
                            const Icon = item.icon;

                            return (
                                <Tooltip key={item.href}>
                                    <TooltipTrigger
                                        render={
                                            <Link
                                                href={item.href}
                                                className={`relative flex items-center justify-center size-10 rounded-lg transition-all duration-flex-fast flex-focus-visible ${
                                                    isActive
                                                        ? 'bg-primary text-primary-foreground shadow-xs font-semibold'
                                                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/70'
                                                }`}
                                            >
                                                <Icon className="size-5" />
                                                {item.badge && (
                                                    <span className="absolute -top-1 -right-1 px-1 py-0.2 text-[9px] font-bold rounded-full bg-status-ready text-white">
                                                        {item.badge}
                                                    </span>
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

                {/* Bottom Section: Theme & User Avatar */}
                <div className="flex flex-col items-center gap-2 w-full px-2">
                    <Tooltip>
                        <TooltipTrigger
                            render={
                                <button
                                    onClick={toggleTheme}
                                    className="flex items-center justify-center size-10 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors duration-flex-fast flex-focus-visible"
                                >
                                    {appearance === 'dark' ? <RiSunLine className="size-5" /> : <RiMoonLine className="size-5" />}
                                </button>
                            }
                        />
                        <TooltipContent side="right" className="text-xs font-medium">
                            Toggle {appearance === 'dark' ? 'Light' : 'Dark'} Mode
                        </TooltipContent>
                    </Tooltip>

                    <div className="w-8 h-px bg-border my-0.5" />

                    <Tooltip>
                        <TooltipTrigger
                            render={
                                <Link
                                    href="/settings/profile"
                                    className="flex items-center justify-center size-9 rounded-full bg-primary/10 text-primary font-bold text-xs ring-2 ring-primary/20 hover:ring-primary/40 transition-all"
                                >
                                    {user?.name?.substring(0, 2).toUpperCase() || 'SA'}
                                </Link>
                            }
                        />
                        <TooltipContent side="right" className="text-xs font-medium">
                            <div>{user?.name || 'Super Administrator'}</div>
                            <div className="text-[10px] text-muted-foreground">{user?.email || 'admin@flex.com'}</div>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </aside>
        </TooltipProvider>
    );
}
