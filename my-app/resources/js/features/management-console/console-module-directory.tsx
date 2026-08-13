import React, { useMemo } from 'react';
import { FlexEmptyState } from '@/components/flex/flex-empty-state';
import type { ModuleEntry } from '@/domain/modules';
import { ConsoleModuleSection } from '@/features/management-console/console-module-section';

export interface ConsoleModuleDirectoryProps {
    modules: ModuleEntry[];
    query?: string;
}

/**
 * Section-first administration directory. Groups modules by their canonical
 * category, preserves product order, and skips any group with no visible
 * modules. This component is the directory's presentational shell only —
 * permission filtering happens upstream before modules are passed in.
 */
export function ConsoleModuleDirectory({ modules, query }: ConsoleModuleDirectoryProps) {
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
        return (
            <FlexEmptyState
                title={query?.trim() ? `No modules match "${query.trim()}".` : 'No administration modules are available for this account.'}
                description={
                    query?.trim()
                        ? 'Try another search term.'
                        : 'Your role does not grant access to any administration modules.'
                }
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