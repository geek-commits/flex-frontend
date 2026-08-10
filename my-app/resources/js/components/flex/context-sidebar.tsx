import { Link, usePage } from '@inertiajs/react';
import { RiSearchLine } from '@remixicon/react';
import React, { useMemo, useState } from 'react';
import { useCapabilities  } from '@/auth/capabilities';
import type {Capability} from '@/auth/capabilities';
import { Input } from '@/components/ui/input';

export interface ContextSidebarItem {
    title: string;
    href: string;
    icon?: React.ComponentType<{ className?: string }>;
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
    const [search, setSearch] = useState('');

    const needle = search.trim().toLocaleLowerCase();

    const filteredGroups = useMemo(
        () =>
            groups
                .map((group) => ({
                    ...group,
                    items: group.items
                        .filter((item) => !item.capability || has(item.capability))
                        .filter((item) => !needle || item.title.toLocaleLowerCase().includes(needle)),
                }))
                .filter((group) => group.items.length > 0),
        [groups, has, needle]
    );

    return (
        <aside className="w-56 bg-card/60 border-r border-border h-screen sticky top-0 shrink-0 overflow-y-auto hidden md:flex flex-col py-4 px-3 select-none">
            <div className="mb-3 px-2">
                <h2 className="text-sm font-semibold tracking-tight text-foreground">{title}</h2>
                {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
            </div>

            <div className="relative mb-3 px-1">
                <RiSearchLine className="absolute left-3.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={`Search ${title.toLowerCase()}...`}
                    aria-label={`Search ${title}`}
                    className="pl-8 h-8 text-xs bg-card border-border"
                />
            </div>

            <nav className="flex flex-col gap-4" aria-label={title}>
                {filteredGroups.map((group, groupIdx) => (
                    <div key={groupIdx} className="flex flex-col gap-1">
                        {group.groupTitle && (
                            <h3 className="px-2 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase mb-1">
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
                                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                                        isActive
                                            ? 'bg-primary/10 text-primary font-semibold'
                                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                                    }`}
                                >
                                    <div className="flex items-center gap-2 truncate">
                                        {Icon && <Icon className="size-4 shrink-0" />}
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
                        {needle
                            ? `No ${title.toLowerCase()} match "${search}".`
                            : `No accessible ${title.toLowerCase()} options for your role.`}
                    </p>
                )}
            </nav>
        </aside>
    );
}
