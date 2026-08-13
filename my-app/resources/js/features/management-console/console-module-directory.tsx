import React, { useMemo } from 'react';
import { FlexEmptyState } from '@/components/flex/flex-empty-state';
import type { ModuleEntry } from '@/domain/modules';
import { ConsoleModuleSection } from '@/features/management-console/console-module-section';

export interface ConsoleModuleDirectoryProps {
    modules: ModuleEntry[];
    query?: string;
    /** Whether the role can reach at least one module before search is applied. */
    hasPermittedModules?: boolean;
}

/**
 * Section-first administration directory. Groups modules by their canonical
 * category, preserves product order, and skips any group with no visible
 * modules. This component is the directory's presentational shell only —
 * permission filtering happens upstream before modules are passed in.
 *
 * Feedback precedence: permission-empty always outranks search-empty so a
 * role that can see nothing is never told its search simply had no hits.
 */
export function ConsoleModuleDirectory({ modules, query, hasPermittedModules = true }: ConsoleModuleDirectoryProps) {
    const sections = useMemo(() => {
        const groups = new Map<string, ModuleEntry[]>();

        for (const module of modules) {
            const category = module.category;

            if (!groups.has(category)) {
                groups.set(category, []);
            }

            groups.get(category)?.push(module);
        }

        return Array.from(groups.entries()).map(([title, items]) => ({ title, items }));
    }, [modules]);

    if (sections.length === 0) {
        if (!hasPermittedModules) {
            return (
                <FlexEmptyState
                    title="No administration modules are available for this account."
                    description="Your role does not grant access to any administration modules."
                />
            );
        }

        if (query?.trim()) {
            return (
                <FlexEmptyState
                    title={`No modules match "${query.trim()}".`}
                    description="Try another search term."
                />
            );
        }

        return (
            <FlexEmptyState
                title="No administration modules are available for this account."
                description="Your role does not grant access to any administration modules."
            />
        );
    }

    return (
        <div className="flex w-full flex-col gap-6">
            {sections.map(({ title, items }) => (
                <ConsoleModuleSection key={title} title={title} modules={items} />
            ))}
        </div>
    );
}