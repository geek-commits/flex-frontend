import React, { useMemo } from 'react';
import type { ModuleEntry } from '@/domain/modules';
import { ConsoleModuleSection } from '@/features/management-console/console-module-section';

export interface ConsoleModuleDirectoryProps {
    modules: ModuleEntry[];
}

/**
 * Section-first administration directory. Groups modules by their canonical
 * category, preserves product order, and skips any group with no visible
 * modules. This component is the directory's presentational shell only —
 * permission filtering happens upstream before modules are passed in.
 */
export function ConsoleModuleDirectory({ modules }: ConsoleModuleDirectoryProps) {
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

    return (
        <div className="flex w-full flex-col gap-6">
            {sections.map(({ title, items }) => (
                <ConsoleModuleSection key={title} title={title} modules={items} />
            ))}
        </div>
    );
}