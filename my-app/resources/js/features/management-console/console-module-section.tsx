import React from 'react';
import type { ModuleEntry } from '@/domain/modules';
import { ConsoleModuleItem } from '@/features/management-console/console-module-item';

export interface ConsoleModuleSectionProps {
    title: string;
    modules: ModuleEntry[];
}

/**
 * One administration group. Renders only when it contains at least one
 * visible module — an empty section heading is never shown.
 */
export function ConsoleModuleSection({ title, modules }: ConsoleModuleSectionProps) {
    if (modules.length === 0) {
        return null;
    }

    return (
        <section className="flex flex-col gap-2" aria-labelledby={`console-section-${title.toLowerCase().replace(/\s+/g, '-')}`}>
            <h2 id={`console-section-${title.toLowerCase().replace(/\s+/g, '-')}`} className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {title}
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-2">
                {modules.map((module) => (
                    <ConsoleModuleItem key={module.id} module={module} />
                ))}
            </div>
        </section>
    );
}