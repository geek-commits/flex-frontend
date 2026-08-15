import { Link } from '@inertiajs/react';
import React, { useState } from 'react';
import type { FlexIconName } from '@/components/flex/iconography';
import { FlexIcon } from '@/components/flex/iconography';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export interface ModuleItem {
    id: string;
    title: string;
    description?: string;
    href: string;
    icon: FlexIconName;
    category?: string;
    badge?: string;
}

export interface ModuleDirectoryProps {
    title: string;
    description?: string;
    modules: ModuleItem[];
}

export function ModuleDirectory({ title, description, modules }: ModuleDirectoryProps) {
    const [search, setSearch] = useState('');

    const filteredModules = modules.filter(
        (m) =>
            m.title.toLowerCase().includes(search.toLowerCase()) ||
            m.description?.toLowerCase().includes(search.toLowerCase()) ||
            m.category?.toLowerCase().includes(search.toLowerCase())
    );

    // Group by category if available
    const categories = Array.from(new Set(filteredModules.map((m) => m.category || 'General Modules')));

    return (
        <div className="flex flex-col gap-6 w-full">
            {/* Header + Search Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-foreground tracking-tight">{title}</h2>
                    {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
                </div>

                <div className="relative w-full sm:w-72">
                    <FlexIcon name="search" className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                        placeholder="Search modules..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 h-9 text-xs bg-card"
                    />
                </div>
            </div>

            {/* Grid of Categories & Modules */}
            {categories.map((category) => {
                const categoryModules = filteredModules.filter(
                    (m) => (m.category || 'General Modules') === category
                );

                return (
                    <div key={category} className="flex flex-col gap-3">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-0.5">
                            {category}
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {categoryModules.map((mod) => {
                                return (
                                    <Link key={mod.id} href={mod.href} className="group">
                                        <Card className="h-full bg-card border-border hover:border-primary/40 hover:shadow-xs transition-all">
                                            <CardContent className="p-4 flex items-start gap-3">
                                                <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
                                                    <FlexIcon name={mod.icon} className="size-5" />
                                                </div>
                                                <div className="flex flex-col min-w-0 flex-1">
                                                    <div className="flex items-center justify-between gap-1">
                                                        <span className="text-xs font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                                                            {mod.title}
                                                        </span>
                                                        {mod.badge && (
                                                            <span className="px-1.5 py-0.2 text-[9px] font-bold rounded-full bg-muted text-muted-foreground uppercase">
                                                                {mod.badge}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {mod.description && (
                                                        <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">
                                                            {mod.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                );
            })}

            {filteredModules.length === 0 && (
                <div className="p-8 text-center bg-card rounded-lg border border-border text-muted-foreground text-xs">
                    No modules match &quot;{search}&quot;.
                </div>
            )}
        </div>
    );
}
