import { Link, usePage } from '@inertiajs/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useCapabilities } from '@/auth/capabilities';
import { deriveActiveDomain, FLEX_DOMAINS } from '@/auth/nav-domains';
import { FlexBrandMark } from '@/components/flex/brand';
import { FlexIcon } from '@/components/flex/iconography';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAppearance } from '@/hooks/use-appearance';

export interface PrimaryRailProps {
    currentPath?: string;
    activeWorkspace?: 'admin' | 'agent';
}

/**
 * Primary FLEX app rail — major product domains only (Agent / Supervision /
 * Administration / Platform), gated by existing capabilities. Route-level
 * navigation lives in the contextual sidebar, not here.
 */
export function PrimaryRail({ currentPath, activeWorkspace = 'admin' }: PrimaryRailProps) {
    void currentPath;
    void activeWorkspace;
    const { url } = usePage();
    const { appearance, updateAppearance } = useAppearance();
    const { has } = useCapabilities();
    const { t } = useTranslation('navigation');

    const domains = FLEX_DOMAINS.filter((domain) => has(domain.capability));
    const activeDomain = deriveActiveDomain(url);

    const toggleTheme = () => {
        updateAppearance(appearance === 'dark' ? 'light' : 'dark');
    };

    return (
        <TooltipProvider delay={150}>
            <aside className="w-14 hidden md:flex flex-col items-center justify-between py-3 bg-flex-workspace-surface border-r border-flex-workspace-divider h-screen sticky top-0 shrink-0 z-30 select-none">
                {/* Top Section: Brand anchor & primary domain navigation */}
                <div className="flex flex-col items-center gap-4 w-full">
                    <Link href="/dashboard" className="p-1 hover:opacity-90 transition-opacity" title="Flex Contact Center">
                        <FlexBrandMark size={24} standalone />
                    </Link>

                    <div className="w-8 h-px bg-flex-workspace-divider my-0.5" />

                    <nav className="flex flex-col items-center gap-1.5 w-full px-2" aria-label="FLEX product domains">
                        {domains.map((domain) => {
                            const isActive = activeDomain === domain.id;
                            const effectiveHref =
                                domain.groups
                                    .flatMap((group) => group.items)
                                    .find((item) => !item.capability || has(item.capability))?.href ??
                                domain.landingHref;

                            return (
                                <Tooltip key={domain.id}>
                                    <TooltipTrigger
                                        render={
                                            <Link
                                                href={effectiveHref}
                                                aria-label={t(domain.labelKey)}
                                                aria-current={isActive ? 'page' : undefined}
                                                className={`relative flex items-center justify-center size-8 rounded-md transition-colors duration-[var(--flex-duration-fast)] flex-focus-visible ${
                                                    isActive
                                                        ? 'bg-flex-layer-selected text-flex-text-primary'
                                                        : 'text-flex-text-tertiary hover:text-flex-text-primary hover:bg-flex-layer-hover'
                                                }`}
                                            >
                                                <FlexIcon name={domain.icon} className="size-4" />
                                            </Link>
                                        }
                                    />
                                    <TooltipContent side="right" className="font-medium text-xs">
                                        {t(domain.labelKey)}
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

                    <div className="w-8 h-px bg-flex-workspace-divider my-0.5" />
                </div>
            </aside>
        </TooltipProvider>
    );
}
