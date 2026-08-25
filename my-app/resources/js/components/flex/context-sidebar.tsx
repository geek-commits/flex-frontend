import { Link, usePage } from '@inertiajs/react';
import { RiLayoutLeftLine } from '@remixicon/react';
import React, { useMemo } from 'react';
import { useCapabilities  } from '@/auth/capabilities';
import type { Capability } from '@/auth/capabilities';
import type { FlexIconName } from '@/components/flex/iconography';
import { FlexIcon } from '@/components/flex/iconography';
import { useShell } from '@/components/flex/shell-context';

export interface ContextSidebarItem {
    title: string;
    href: string;
    icon?: FlexIconName | React.ComponentType<{ className?: string }>;
    badge?: string | number;
    capability?: Capability;
}

export interface ContextSidebarGroup {
    groupTitle?: string;
    items: ContextSidebarItem[];
}

export interface ContextSidebarProps {
    title: string;
    subtitle?: string;
    groups: ContextSidebarGroup[];
}

export function ContextSidebar({ title, subtitle, groups }: ContextSidebarProps) {
    const { url } = usePage();
    const { has } = useCapabilities();
    const { toggleContextSidebar } = useShell();

    const filteredGroups = useMemo(
        () =>
            groups
                .map((group) => ({
                    ...group,
                    items: group.items.filter((item) => !item.capability || has(item.capability)),
                }))
                .filter((group) => group.items.length > 0),
        [groups, has]
    );

    return (
        <aside className="w-56 bg-card border-r border-border h-screen sticky top-0 shrink-0 overflow-y-auto hidden md:flex flex-col py-4 px-3 select-none">
            <div className="mb-3 px-2 flex items-start justify-between gap-2">
                <div className="min-w-0">
                    <h2 className="text-[13px] font-semibold tracking-tight text-flex-text-primary">{title}</h2>
                    {subtitle && <p className="text-xs text-flex-text-tertiary mt-0.5">{subtitle}</p>}
                </div>
                <button
                    type="button"
                    onClick={toggleContextSidebar}
                    aria-label="Hide sidebar"
                    title="Hide sidebar"
                    className="flex size-7 shrink-0 items-center justify-center rounded-md bg-transparent text-flex-text-tertiary transition-colors duration-[var(--flex-duration-fast)] hover:bg-flex-layer-hover hover:text-flex-text-primary flex-focus-visible"
                >
                    <RiLayoutLeftLine className="size-4" />
                </button>
            </div>

            <nav className="flex flex-col gap-4" aria-label={title}>
                {filteredGroups.map((group, groupIdx) => (
                    <div key={groupIdx} className="flex flex-col gap-1">
                        {group.groupTitle && (
                            <h3 className="px-2 text-[11px] font-semibold tracking-wider text-flex-text-tertiary uppercase mb-1">
                                {group.groupTitle}
                            </h3>
                        )}
                        {group.items.map((item) => {
                            const isActive = url.startsWith(item.href);
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center justify-between px-2.5 h-8 rounded-md text-[13px] font-medium transition-colors duration-[var(--flex-duration-fast)] flex-focus-visible ${
                                        isActive
                                            ? 'bg-flex-layer-selected border border-flex-workspace-divider-strong text-flex-text-primary'
                                            : 'text-flex-text-tertiary hover:text-flex-text-primary hover:bg-flex-layer-hover border border-transparent'
                                    }`}
                                >
                                    <div className="flex items-center gap-2 truncate">
                                        {typeof Icon === 'string' ? (
                                            <FlexIcon name={Icon} size="md" className="shrink-0" />
                                        ) : (
                                            Icon && <Icon className="size-4 shrink-0" />
                                        )}
                                        <span className="truncate">{item.title}</span>
                                    </div>
                                    {item.badge !== undefined && (
                                        <span className="ml-2 px-1.5 py-0.5 text-[10px] font-semibold rounded-full bg-muted text-muted-foreground">
                                            {item.badge}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                ))}

                {filteredGroups.length === 0 && (
                    <p className="px-2 py-4 text-xs text-muted-foreground">
                        {`No accessible ${title.toLowerCase()} options for your role.`}
                    </p>
                )}
            </nav>
        </aside>
    );
}
